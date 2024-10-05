import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { viral_infectious } from "../../../libs/appointmentOptions";
import AppLayout from "../../../components/container/AppLayout";
import useNoBugUseEffect from "../../../hooks/useNoBugUseEffect";
import PatientInfo from "../../patients/components/PatientInfo";
import PageHeader from "../../../components/layout/PageHeader";
import InServiceItem from "../../patient-queue/components/InServiceItem";
import FlatIcon from "../../../components/FlatIcon";
import InQueueRegular from "../../patient-pharmacy-queue/components/InQueueRegular";
import useQueue from "../../../hooks/useQueue";
import {
	calculateAge,
	doctorName,
	doctorSpecialty,
	formatDate,
	patientFullName,
} from "../../../libs/helpers";
import ReferToSPHModal from "../../../components/modal/ReferToSPHModal";
import { useAuth } from "../../../hooks/useAuth";
import useDoctorQueue from "../../../hooks/useDoctorQueue";
import useLabQueue from "../../../hooks/useLabQueue";
import Img from "../../../components/Img";
import LaboratoryOrders from "../../diagnostic-center/dc-doctor/components/LaboratoryOrders";
import { Fade } from "react-reveal";
import UploadLabResultModal from "../../../components/patient-modules/modals/UploadLabResultModal";
import ActionBtn from "../../../components/buttons/ActionBtn";
import TabGroup from "../../../components/TabGroup";
import MenuTitle from "../../../components/buttons/MenuTitle";
import Chemistry from "../../../components/laboratory/Chemistry";
import Microscopy from "../../../components/laboratory/Microscopy";
import Hematology from "../../../components/laboratory/Hematology";
import Microbiology from "../../../components/laboratory/Microbiology";
import Serology from "../../../components/laboratory/Serology";
import Bloodtype from "../../../components/laboratory/Bloodtype";
import Crossmatching from "../../../components/laboratory/Crossmatching";
import Covid from "../../../components/laboratory/Covid";
import Miscellaneous from "../../../components/laboratory/Miscellaneous";
import ChemistryModal from "../../../components/modal/laboratory/ChemistryModal";
import PatientProfileDetails from "../../../components/PatientProfileDetails";
import PatientPrescriptions from "../../../components/PatientPrescriptions";
import PatientVitals from "../../../components/PatientVitals";
import InfectiousDetails from "../../hims/er-infectious/components/InfectiousDetails";
import SurgeryAssessment from "./SurgeryAssessment";


const AppointmentData = ({ mutateAll = null }) => {
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
			
		</div>
	);
};




const AppointmentDetailsForSurgery = (props) => {
	
	// const [patient, setPatient] = useState(null);
	const { patient, appointment } = props;
    const [showData, setShowData] = useState(null);
	const { user } = useAuth();
	const { pending, mutatePending, nowServing } = useLabQueue();
	const [order, setOrder] = useState(null);
	const referToSphModalRef = useRef(null);
	const uploadLabResultRef = useRef(null);
	const [selectedTab, setSelectedTab] = useState("");
	useNoBugUseEffect({
		functions: () => {},
	});

	const listPending = () => {
		return pending?.data || [];
		// return (isDoctor() ? doctorsPending?.data : pending?.data) || [];
	};
	const mutateAll = () => {
		mutatePending();
	};
	return (
		
			<div className=" h-full overflow-auto ">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-5 divide-x">
					
					<div className="lg:col-span-8 ">
						<div className="flex items-center gap-4">
							
						</div>
						<div>
							
								<Fade key={`order-${order?.id}`}>
									<div>
										
										<div className="">
                                        <div className="flex flex-col">
										<div className="flex flex-col lg:flex-row gap-4 items-center   border-b justify- md:justify-start bg-slate-50 p-1 h-full">
											
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
													""
												}
												contents={[
													{
														title: (
															<MenuTitle src="/profile.png">
																Profile
															</MenuTitle>
														),
														content: (
															<PatientProfileDetails patient={patient} 
															/>
														),
													},
											
													
													{
														
														title: (
															<MenuTitle src="/landing-page.png">
																Surgery Assessment
															</MenuTitle>
														),

														content: (
                                                            <SurgeryAssessment />
															// <AppointmentData
															// 	appointment={
															// 		showData
															// 	}
															// 	mutateAll={() => {
															// 		mutateAll();
															// 		hide();
															// 	}}
															// 	patient={
															// 		patient
															// 	}
															// />;
    
                                                            
														),
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
									</div>
								</Fade>
							
						</div>
					</div>
				</div>
			
			</div>
		
	);
};

export default AppointmentDetailsForSurgery;
