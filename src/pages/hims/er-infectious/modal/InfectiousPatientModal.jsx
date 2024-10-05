/* eslint-disable react/prop-types */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react-refresh/only-export-components */
import React, {
	Fragment,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import { Dialog, Transition } from "@headlessui/react";

import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ActionBtn from "../../../../components/buttons/ActionBtn";
import { calculateAge, formatDate, patientFullName } from "../../../../libs/helpers";
import Axios from "../../../../libs/axios";
import PatientProfileContent from "../../../../pages/patients/components/PatientProfileContent";
import PatientProfile from "../../../../pages/patients/PatientProfile";
import TabGroup from "../../../../components/TabGroup";
import MenuTitle from "../../../../components/buttons/MenuTitle";
import PatientProfileDetails from "../../../../components/PatientProfileDetails";
import PatientAppointments from "../../../../components/PatientAppointments";
import FlatIcon from "../../../../components/FlatIcon";
import Img from "../../../../components/Img";
import PatientPrescriptions from "../../../../components/PatientPrescriptions";
import LaboratoryOrders from "../../../diagnostic-center/dc-doctor/components/LaboratoryOrders";
import AddPrescription from "../../../department/his-md/components/AddPrescription";
import TBConfirmation from "../../../department/his-md/components/TBConfirmation";
import AppointmentDetails from "../../../../pages/appointments/components/AppointmentDetails";
import InfectiousDetails from "../components/InfectiousDetails";
import PatientInfo from "../../../../pages/patients/components/PatientInfo";
import useNoBugUseEffect from "../../../../hooks/useNoBugUseEffect";
import PatientVitals from "../../../../components/PatientVitals";
import InfectiousAssessment from "../components/InfectiousAssessment";


const AppointmentData = ({ mutateAll, appointment = null }) => {
	const {
		register,
		setValue,
		handleSubmit,
		reset,
		trigger,
		control,
		watch,
		formState: { errors },
	} = useForm();
	const [selectedItems, setSelectedItems] = useState([]);
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const [diagnosis, setDiagnosis] = useState(null);
	const [procedure, setProcedure] = useState(null);

	useNoBugUseEffect({
		functions: () => {
			getItems();
		},
		params: [],
	});

	const submitPositive = (data) => {
		setLoading(true);
		Axios.post(`/v1/clinic/tb-positive/${appointment?.id}`, {
			_method: "PATCH",
		}).then((res) => {
			setTimeout(() => {
				setLoading(false);
				toast.success("Success Patient is marked as TB Positive!");
				mutateAll();
			}, 1500);
		});
	};
	const submitNegative = (data) => {
		setLoading(true);
		Axios.post(`/v1/clinic/tb-negative/${appointment?.id}`, {
			_method: "PATCH",
		}).then((res) => {
			setTimeout(() => {
				setLoading(false);
				toast.success("Patient is TB Negative! Closing form.");
				// mutateAll();
			}, 1500);
		});
	};

	const getItems = () => {
		let health_unit_id =
			appointment?.bhs_id > 0 ? appointment?.bhs_id : appointment?.rhu_id;
		Axios.get(`v1/item-inventory?location_id=${health_unit_id}`).then(
			(res) => {
				setItems(res.data.data);
			}
		);
	};
	const prescribeItems = () => {
		setLoading(true);
		const formData = new FormData();
		if (appointment?.bhs_id > 0) {
			formData.append("type", "bhs");
		}
		if (appointment?.rhu_id > 0) {
			formData.append("type", "rhu");
		}
		formData.append("appointment_id", appointment?.id);
		formData.append("_method", "PATCH");
		if (diagnosis) formData.append("diagnosis_code", diagnosis);
		if (procedure) formData.append("procedure_code", procedure);
		selectedItems.map((data) => {
			console.log("selectedItemsselectedItems", data);
			formData.append("inventory_id[]", data?.item?.inventory?.id);
			formData.append("quantity[]", data.quantity);
			formData.append("items[]", data?.item?.id);
			formData.append("sig[]", data?.notes || " ");
		});
		// return;
		Axios.post(`/v1/clinic/tb-prescribe/${appointment?.id}`, formData)
			.then((res) => {
				// addToList(data);
				setTimeout(() => {
					setLoading(false);
					toast.success("Prescription added successfully!");
					mutateAll();
				}, 400);
			})
			.finally(() => {
				setLoading(false);
			});
		console.log("SUBMIT PRESCRIPTION");
	};
	return (
		<div>
			<div className="pb-4">
				<InfectiousDetails
					appointment={appointment}
					showService
					serviceComponent={
						<>
							{(appointment?.status ==
								"pending-for-pharmacy-release" &&
								appointment?.prescribed_by == null) ||
							appointment?.has_for_reading?.length > 0 ? (
								<AddPrescription
									diagnosis={diagnosis}
									setDiagnosis={setDiagnosis}
									procedure={procedure}
									setProcedure={setProcedure}
									items={items}
									setItems={setItems}
									selectedItems={selectedItems}
									setSelectedItems={setSelectedItems}
									prescribeItems={prescribeItems}
									loading={loading}
								/>
							) : appointment?.status ==
									"pending-doctor-confirmation" &&
							  appointment?.vital_id != null &&
							  appointment?.referred_to != null ? (
								<TBConfirmation
									appointment={appointment}
									register={register}
									setValue={setValue}
									handleSubmit={handleSubmit}
									reset={reset}
									trigger={trigger}
									control={control}
									watch={watch}
									errors={errors}
									submitPositive={submitPositive}
									submitNegative={submitNegative}
								/>
							) : (
								""
							)}
						</>
					}
				/>

			</div>
		</div>
	);
};

const InfectiousPatientModal = (props, ref) => {
	const { mutateAll, pendingOrdersRef } = props;
	const [patient, setPatient] = useState(null);
	const [showData, setShowData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [loadingDone, setLoadingDone] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [prescribed, setPrescribed] = useState(false);
	const [full, setFull] = useState(false);

	useImperativeHandle(ref, () => ({
		show: show,
		hide: hide,
	}));

	const show = (data) => {
		setFull(false);
		setShowData(data);
		setPatient(data?.patient);
		setModalOpen(true);
	};
	const hide = () => {
		setModalOpen(false);
	};
	const noHide = () => {};
	const markAsDone = () => {
		setLoadingDone(true);
		Axios.post(`/v1/doctor/mark-as-done/${showData?.id}`, {
			_method: "PATCH",
		}).then((res) => {
			toast.success("Success! Patient marked as done.");
			setLoadingDone(false);
			mutateAll();
			hide();
		});
	};
	const sendPatientToLab = () => {
		setLoading(true);
		Axios.post(
			`/v1/doctor/laboratory-order/send-patient-to-laboratory/${showData?.id}`,
			{
				_method: "PATCH",
			}
		).then((res) => {
			if (res?.data?.pending_lab_orders?.length == 0) {
				toast.error("Error! NO PENDING LABORATORY ORDER.");
			} else {
				toast.success(
					"Success! Patient sent to Laboratory for test(s)."
				);
				setLoading(false);
				mutateAll();
				hide();
			}
		});
	};
	return (
		<Transition appear show={modalOpen} as={Fragment}>
			<Dialog as="div" className="" onClose={noHide}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur z-20" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto !z-[100]">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel
								className={`w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all ${
									full
										? " lg:max-w-[99vw]"
										: " lg:max-w-[60vw]"
								} `}
							>
								<Dialog.Title
									as="div"
									className=" p-4 font-medium leading-6 flex relative flex-col items-start text-gray-900 bg-slate-50 border-b"
								>
									<span className="text-xl text-left font-bold  text-blue-900">
										Patient Profile
									</span>
									{full ? (
										""
									) : (
										<ActionBtn
											type="foreground"
											size="sm"
											className="absolute top-4 right-24 "
											onClick={() => {
												setFull((prevVal) => !prevVal);
											}}
										>
											<FlatIcon icon="br-expand-arrows-alt" />{" "}
											Fullscreen
										</ActionBtn>
									)}
									<ActionBtn
										type="danger"
										size="sm"
										className="absolute top-4 right-4 "
										onClick={hide}
									>
										<FlatIcon icon="br-cross-small" /> Close
									</ActionBtn>
								</Dialog.Title>
								<div className="flex flex-col gap-y-4 relative min-h-[calc(100dvh-152px)]">
									<div className="flex flex-col">
										<div className="flex flex-col lg:flex-row gap-4 items-center px-4 pt-4 border-b justify- md:justify-start bg-slate-50 p-4 h-full">
											<PatientInfo patient={patient} />
											<div className="flex items-center justify-end  w-1/2 flex-wrap gap-3 ml-auto">
												{showData?.status ==
												"in-service-consultation" ? (
													<>
														<ActionBtn
															type="secondary"
															loading={loading}
															size="lg"
															onClick={() => {
																if (
																	pendingOrdersRef
																) {
																	console.log(
																		"pendingOrdersRef",
																		pendingOrdersRef
																	);
																	pendingOrdersRef?.current.show(
																		{
																			data: showData,
																			fn: sendPatientToLab,
																		}
																	);
																	hide();
																}
															}}
															className="px-4"
														>
															<FlatIcon
																className="text-3xl mr-1	"
																icon="rr-right"
															/>
															<div className="flex flex-col text-left">
																<span className="font-bold -mb-1">
																	Send Order
																</span>
																<span className="text-[10px] font-light max-w-[256px]">
																	Patient
																	queue to
																	laboratory/imaging
																</span>
															</div>
														</ActionBtn>
													</>
												) : (
													""
												)}

												{/* 
												<ActionBtn
															loading={
																loadingDone
															}
															type="primary-dark"
															size="lg"
															onClick={() => {
																markAsDone();
															}}
															className="px-4"
														>
															<FlatIcon
																className="text-3xl mr-1	"
																icon="rr-right"
															/>
															<div className="flex flex-col text-left">
																<span className="font-bold text-xs -mb-1">
																	Send to
																	Pharmacy
																</span>
																<span className="text-[12px] font-light">
																	for
																	prescription
																	release
																</span>
															</div>
														</ActionBtn>

														<ActionBtn
															loading={
																loadingDone
															}
															type="success"
															size="lg"
															onClick={() => {
																markAsDone();
															}}
															className="px-4"
														>
															<FlatIcon
																className="text-3xl mr-1	"
																icon="rr-badge-check"
															/>
															<div className="flex flex-col text-left">
																<span className="font-bold -mb-1">
																	Consultation
																	Done
																</span>
																<span className="text-[10px] font-light">
																	Patient is
																	free to go
																</span>
															</div>
														</ActionBtn> */}
											</div>
										</div>
										<div>
											<TabGroup
												tabClassName={`py-3 bg-slate-100 border-b`}
												contentClassName={
													"max-h-[unset]"
												}
												contents={[
													{
														title: (
															<MenuTitle src="/landing-page.png">
																Infectious Data
															</MenuTitle>
														),

														content: (
															<AppointmentData
																appointment={
																	showData
																}
																mutateAll={() => {
																	mutateAll();
																	hide();
																}}
																patient={
																	patient
																}
															/>
														),
													},
													{
														title: (
															<MenuTitle src="/profile.png">
																Profile
															</MenuTitle>
														),

														content: (
															<PatientProfileDetails
																patient={
																	patient
																}
															/>
														),
													},

													{
														title: (
															<MenuTitle src="/vitals/notes.png">
																Assessment
															</MenuTitle>
														),
														content: <InfectiousAssessment patient={patient} />,
													},

													{
														title: (
															<MenuTitle src="/patient.png">
																Past
																Appointments
															</MenuTitle>
														),
														content: (
															<PatientPrescriptions
																patient={
																	patient
																}
															/>
														),
													},
													{
														title: (
															<MenuTitle src="/vitals/vitals.png">
																Vital Signs
															</MenuTitle>
														),

														content: (
															<PatientVitals
																patient={
																	patient
																}
															/>
														),
													},
													// {
													// 	title: (
													// 		<MenuTitle src="/healthcare.png">
													// 			Releasing
													// 		</MenuTitle>
													// 	),
													// 	content: (
													// 		<RhuReleasing
													// 			patient={patient}
													// 			setPatient={setPatient}
													// 		/>
													// 	),
													// },

													{
														title: (
															<MenuTitle src="/vitals/laboratory.png">
																Laboratory Order
																{JSON.stringify(
																	showData?.lab_orders ||
																		{}
																).includes(
																	`"type":"laboratory-test"`
																) ? (
																	<>
																		<span className="text-white bg-red-600 absolute top-1 right-1 rounded-full w-3 h-3 flex items-center justify-center animate-ping"></span>
																		<span className="text-white bg-red-600 absolute top-1 right-1 rounded-full w-3 h-3 flex items-center justify-center animate-"></span>
																		<span className="absolute top-0 rounded-xl left-0 h-full w-full border border-red-500 animate-pulse"></span>
																	</>
																) : (
																	""
																)}
															</MenuTitle>
														),
														content: (
															<LaboratoryOrders
																patient={
																	patient
																}
																laboratory_test_type={
																	2
																}
																appointment={
																	showData
																}
																allowCreate={
																	true
																}
															/>
														),
													},
													{
														title: (
															<MenuTitle src="/vitals/laboratory.png">
																Imaging
																{JSON.stringify(
																	showData?.lab_orders ||
																		{}
																).includes(
																	`"type":"imaging"`
																) ? (
																	<>
																		<span className="text-white bg-red-600 absolute top-1 right-1 rounded-full w-3 h-3 flex items-center justify-center animate-ping"></span>
																		<span className="text-white bg-red-600 absolute top-1 right-1 rounded-full w-3 h-3 flex items-center justify-center animate-"></span>
																		<span className="absolute top-0 rounded-xl left-0 h-full w-full border border-red-500 animate-pulse"></span>
																	</>
																) : (
																	""
																)}
															</MenuTitle>
														),
														content: (
															<LaboratoryOrders
																appointment={
																	showData
																}
																laboratory_test_type={
																	1
																}
																patient={
																	patient
																}
																allowCreate={
																	true
																}
															/>
														),
													},

													{
														title: (
															<MenuTitle src="/healthcare.png">
																Prescriptions
															</MenuTitle>
														),
														content: (
															<PatientPrescriptions
																patient={
																	patient
																}
															/>
														),
													},
													
													// {
													// 	title: (
													// 		<MenuTitle src="/landing-page.png">
													// 			Imaging
													// 		</MenuTitle>
													// 	),
													// 	// content: <CisPatientImaging />,
													// },
													// {
													// 	title: (
													// 		<MenuTitle src="/vitals/prescription.png">
													// 			Prescription
													// 		</MenuTitle>
													// 	),
													// 	// content: ({ setSelectedIndex }) => (
													// 	// 	<div className="px-3 pt-2">
													// 	// 		<PrescriptionMainTab
													// 	// 			patient={patient}
													// 	// 		/>
													// 	// 	</div>
													// 	// ),
													// },
													
													// {
													// 	title: (
													// 		<MenuTitle src="/vitals/treatment.png">
													// 			Treatment Plan
													// 		</MenuTitle>
													// 	),
													// 	// content: (
													// 	// 	<CisTreatmentPlan
													// 	// 		patient={patient}
													// 	// 	/>
													// 	// ),
													// },
													// {
													// 	title: (
													// 		<MenuTitle src="/vitals/certification.png">
													// 			Med Cert
													// 		</MenuTitle>
													// 	),
													// 	// content: (
													// 	// 	<MedicalCertificateList
													// 	// 		patient={patient}
													// 	// 	/>
													// 	// ),
													// },
													// {
													// 	title: (
													// 		<MenuTitle src="/vitals/form.png">
													// 			Profile form
													// 		</MenuTitle>
													// 	),
													// 	// content: (
													// 	// 	<CisPatientsForm
													// 	// 		patient={patient}
													// 	// 	/>
													// 	// ),
													// },
													// {
													// 	title: (
													// 		<MenuTitle src="/vitals/consulting.png">
													// 			Consultations
													// 		</MenuTitle>
													// 	),
													// 	content: ({ setSelectedIndex }) => (
													// 		<div className="px-3 pt-2">
													// 			{/* <ProfileConsultations
													// 				setSelectedIndex={
													// 					setSelectedIndex
													// 				}
													// 				patient={patient}
													// 			/> */}
													// 		</div>
													// 	),
													// },
												]}
											/>
										</div>
									</div>
								</div>

								<div className="px-4 py-3 border-t flex items-center justify-end bg-slate-">
									<ActionBtn type="danger" className="px-5">
										CLOSE
									</ActionBtn>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default forwardRef(InfectiousPatientModal);
