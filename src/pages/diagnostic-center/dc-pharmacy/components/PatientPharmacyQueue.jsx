import React, { useEffect, useRef, useState } from "react";
import AppLayout from "../../../../components/container/AppLayout";
import useNoBugUseEffect from "../../../../hooks/useNoBugUseEffect";
import FlatIcon from "../../../../components/FlatIcon";
import InQueueRegular from "../../../patient-pharmacy-queue/components/InQueueRegular";
import InQueuePriority from "../../../patient-pharmacy-queue/components/InQueuePriority";
import {
	calculateAge,
	doctorName,
	doctorSpecialty,
	formatDate,
	patientFullName,
} from "../../../../libs/helpers";
import { useAuth } from "../../../../hooks/useAuth";
import useLabQueue from "../../../../hooks/useLabQueue";
import Img from "../../../../components/Img";
import LaboratoryOrders from "../../../../components/patient-modules/LaboratoryOrders";
import { Fade } from "react-reveal";
import PatientInfo from "../../../patients/components/PatientInfo";
import ContentTitle from "../../../../components/buttons/ContentTitle";
import AppointmentDetails from "../../../appointments/components/AppointmentDetails";
import usePharmaQueue from "../../../../hooks/usePharmaQueue";
import ActionBtn from "../../../../components/buttons/ActionBtn";
import Axios from "../../../../libs/axios";
import { toast } from "react-toastify";
import TextInfo from "../../../../components/TextInfo";
import InfoText from "../../../../components/InfoText";
import CaseDetails from "../../../department/his-md/components/CaseDetails";
import { caseCodes } from "../../../../libs/caseCodes";
import { procedureRates } from "../../../../libs/procedureRates";
import TextInput from "../../../../components/inputs/TextInput";
import Pagination from "../../../../components/table/Pagination";
import useDataTable from "../../../../hooks/useDataTable";
import LoadingScreen from "../../../../components/loading-screens/LoadingScreen";

const PatientProfile = ({ patient }) => {
	return (
		<div className="flex flex-col lg:flex-row gap-4 items-center px-4 pt-4 border-b justify- md:justify-start bg-slate-50 p-4 h-full">
			<div className="group relative h-[108px] w-[108px] min-h-[108px] min-w-[108px] rounded-full aspect-square bg-background">
				<Img
					type="user"
					name={patientFullName(patient)}
					src={patient?.avatar || ""}
					className="min-h-[108px] min-w-[108px] aspect-square object-cover rounded-full"
					alt=""
					id="user-image-sample"
					key={`key-${patient?.id}-${patient?.avatar}`}
				/>
			</div>
			<div className="flex flex-col pl-4">
				<h6
					className={`text-left text-2xl mb-1 font-semibold flex items-center ${
						String(patient?.gender).toLowerCase() == "male"
							? "text-blue-800"
							: "text-pink-800"
					} mb-0`}
				>
					{patientFullName(patient)}
				</h6>
				<div className="flex gap-6 mb-2">
					<div className="flex items-center gap-2 text-base">
						<FlatIcon
							icon="rr-calendar-clock"
							className="text-base"
						/>
						<span>{calculateAge(patient?.birthday)} yrs. old</span>
					</div>
					<div className="flex items-center gap-2 text-base">
						<FlatIcon icon="rr-calendar" className="text-base" />
						<span>{formatDate(patient?.birthday)}</span>
					</div>
				</div>
				<div className="flex gap-4 mb-2">
					<div className="flex items-center gap-2 text-base">
						<FlatIcon icon="rr-venus-mars" className="text-base" />
						{String(patient?.gender).toLowerCase() == "male" ? (
							<span className="text-blue-700">Male</span>
						) : (
							<span className="text-pink-700">Female</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
const PatientPharmacyQueue = () => {
	const { user } = useAuth();
	const {
		data: patients,
		setData: setPatients,
		selected,
		page,
		setPage,
		meta,
		filters,
		paginate,
		setPaginate,
		setFilters,
	  } = useDataTable({
		url: `/v1/patients`,
	  });
	const {
		pending: doctorsPending,
		mutatePending,

		mutatePendingMedsRelease,
	} = usePharmaQueue();
	const { pending, pendingMedsRelease } = usePharmaQueue();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(false);
	const [filteredPatients, setFilteredPatients] = useState([]);
	const [stat, setStat] = useState(null);
	const [appointment, setAppointment] = useState(null);
	const [patient, setPatient] = useState(null);
	const referToSphModalRef = useRef(null);
	const uploadLabResultRef = useRef(null);

	useNoBugUseEffect({
		functions: () => {},
	});

	const listPending = () => {
		return pending?.data || [];
		// return (isDoctor() ? doctorsPending?.data : pending?.data) || [];
	};
	const mutateAll = () => {
		mutatePending();
		mutatePendingMedsRelease();
	};
	// const approveRelease = () => {
	// 	setLoading(true);
	// 	Axios.post(`v1/clinic/tb-approve-release-medication/${order?.id}`, {
	// 		_method: "PATCH",
	// 	}).then((res) => {
	// 		toast.success(
	// 			"Patient prescription successfully approved for release!"
	// 		);
	// 		setLoading(false);
	// 		mutateAll();
	// 		setOrder(null);
	// 	});
	// };

	const approveRelease = () => {
		setLoading(true);
		Axios.post(`v1/clinic/send-from-pharmacy-to-nurse-for-release/${order?.id}`, {
			_method: "PATCH",
		}).then((res) => {
			toast.success(
				"Patient prescription successfully approved for release!"
			);
			setLoading(false);
			mutateAll();
			setOrder(null);
		});
	};


	
	useEffect(() => {
		// When the component mounts or pending data changes, set filtered patients
		setFilteredPatients(listPending());
	  }, [pending]);
	
	  const handlePatientClick = (queue) => {
		setOrder(queue);
		setPatient(queue?.relationships?.patient);
	  };
	
	  const handleSearch = (e) => {
		const keyword = e.target.value.toLowerCase();
		setFilters((prevFilters) => ({
		  ...prevFilters,
		  keyword: keyword,
		}));
	
		const filtered = listPending().filter((queue) => {
		  const patientName = patientFullName(queue?.relationships?.patient).toLowerCase();
		  return patientName.includes(keyword);
		});
	
		setFilteredPatients(filtered);
	
		if (filtered.length === 1) {
		  const singleQueue = filtered[0];
		  setOrder(singleQueue);
		  setPatient(singleQueue?.relationships?.patient);
		} else if (filtered.length === 0) {
		  setOrder(null);
		  setPatient(null);
		}
	  };

	return (
		<AppLayout>
			{/* <PageHeader
				title="Patient Queue"
				subtitle={"View patients in queue"}
				icon="rr-clipboard-list-check"
			/> */}
			<div className="p-4 h-full overflow-auto ">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-5 divide-x">
					<div className="lg:col-span-4">
						<h1 className="text-xl font-bold font-opensans text-gray-500 tracking-wider -mb-1">
							Patient Queue
						</h1>
						<span className="noto-sans-thin text-slate-500 text-sm font-light">
							Patients pending for pharmacy release
						</span>
						<div className="pr-5 py-3">
              <TextInput
                iconLeft={"rr-search"}
                placeholder="Search patient..."
                onChange={handleSearch}
              />
            </div>
			<div className="flex flex-col gap-y-4 relative">
							{loading && <LoadingScreen />}
			
              
              <div className="flex flex-col gap-y-2 max-h-[calc(100vh-312px)] overflow-auto pr-5">
			  {listPending()?.length == 0 &&
							pendingMedsRelease?.data?.length == 0 ? (
								<span className="text-center py-20 font-bold text-slate-400">
									No patients in queue.
								</span>
							) : (
								<>
									{listPending()?.map((queue, index) => {
										return (
											<InQueueRegular
												key={index}
												selected={
													queue?.patient?.id ===
													order?.patient?.id
												}
												onClick={() => {
													handlePatientClick(queue)
													setOrder(queue);
													setStat(
														`FOR APPROVE RELEASING MEDICINE`
													);
												}}
												
												number={`${queue.id}`}
												patientName={patientFullName(
													queue?.patient
												)}
											>
												<div className="w-full flex flex-col lg:pl-16">
													<div className="flex items-start gap-2 mb-2">
														<span className="text-sm w-[46px] ">
															Doctor:{" "}
														</span>
														<span className="flex flex-col font-bold ">
															<span className="-mb-1 ">
															{doctorName(data?.referredToDoctor)}
															</span>
															<span className="font-light text-sm">
																{doctorSpecialty(
																	queue?.doctor
																)}
															</span>
														</span>
													</div>
													<div className="flex items-center gap-2 mb-2">
														<span className="text-sm w-[46px]">
															Status:
														</span>
														<span className="font-medium text-orange-500">
															FOR APPROVE
															RELEASING MEDICINE
														</span>
													</div>
													{queue?.healthUnit ? (
														<div className="flex items-center gap-2 mb-2">
															<span className="text-sm w-[88px]">
																{
																	queue
																		?.healthUnit
																		?.type
																}
																:
															</span>
															<span className="font-medium ">
																{" "}
																{
																	queue
																		?.healthUnit
																		?.name
																}
															</span>
														</div>
													) : (
														""
													)}
												</div>
											</InQueueRegular>
										);
									})}
									{" "}
									
									
									
									{pendingMedsRelease?.data?.map(
										(queue, data, index) => {
											return (
												<InQueuePriority
													selected={
														queue?.patient?.id ===
														order?.patient?.id
													}
													onClick={() => {
														setOrder(queue);
														handlePatientClick(queue)
														setStat(
															"FOR RELEASING MEDICINE"
														);
													}}
													priorityType={
														"MEDICINE RELEASE"
													}
													key={index}
													number={`${queue.id}`}
													patientName={patientFullName(
														queue?.patient
													)}
													active={queue?.id === patient?.id}
												>
													<div className="w-full flex flex-col lg:pl-16">
														<div className="flex items-start gap-2 mb-2 text-yellow-950">
															<span className="text-sm w-[46px] ">
																Doctor:{" "}
															</span>
															<span className="flex flex-col font-bold">
																<span className="-mb-1">

																{doctorName(
															queue?.referredToDoctor
														)}
																</span>
																<span className="font-light text-sm">
																	{doctorSpecialty(
																		data?.doctor
																	)}
																</span>
															</span>
														</div>
														<div className="flex items-center gap-2 mb-2">
															<span className="text-sm w-[46px]">
																Status:
															</span>
															<span className="font-medium text-orange-500">
																FOR RELEASING
																MEDICINE
															</span>
														</div>
														{queue?.healthUnit ? (
															<div className="flex items-center gap-2 mb-2">
																<span className="text-sm w-[88px]">
																	{
																		queue
																			?.healthUnit
																			?.type
																	}
																	:
																</span>
																<span className="font-medium ">
																	{" "}
																	{
																		queue
																			?.healthUnit
																			?.name
																	}
																</span>
															</div>
														) : (
															""
														)}
													</div>
												</InQueuePriority>
											);
										}
									)}
								</>
							)}
              </div>
              <Pagination
                setPageSize={setPaginate}
                page={page}
                setPage={setPage}
                pageCount={meta?.last_page}
              />
            </div>

							
							{/* <InQueueRegular
								number="6"
								patientName="Mylo Daugherty"
							/>
							<InQueueRegular
								number="7"
								patientName="Emmeline Larson"
							/> */}
						
					</div>
					<div className="lg:col-span-8 pl-4">
						<div className="flex items-center gap-4 pb-4">
							<h1 className="text-xl font-bold font-opensans text-gray-500 tracking-wider -mb-1">
								In Service...
							</h1>
						</div>
						<div>
							{order?.patient ? (
								<Fade key={`order-${order?.id}`}>
									<div className="pb-4">
										<h4 className="border flex items-center text-base font-bold p-2 mb-0 border-indigo-100 lg:col-span-12">
											<span>Patient Information</span>
										</h4>
										<div className="flex flex-col lg:flex-row gap-2 border-x border-indigo-100 p-4">
											<PatientInfo
												patient={order?.patient}
												mutateAll={mutateAll}
												 
												appointment={appointment}
											
											
											/>
										</div>
										<AppointmentDetails
											appointment={order}
											customStatus={stat}
											serviceComponent={
												<>
													<div className="grid grid-cols-1 lg:grid-cols-2 gap-2 pb-2 mt-2 text-slate-700">
														<div className="flex flex-col px-5 py-5 bg-[linear-gradient(to_right,_var(--tw-gradient-stops))] rounded-xl border border-yellow-400">
															<div className="flex flex-row justify-between">
															<span className="font-bold bg-teal-800 text-transparent bg-clip-text text-2xl">Diagnosis</span >
															<InfoText
																className=""
																title="Diagnosed By"
																value={doctorName(
																	order?.prescribedByDoctor
																)}
															/>
															</div>
															<div>
															<CaseDetails
																code={
																	order?.diagnosis_code
																}
																title="Diagnosis Details"
																
																cases={
																	caseCodes ||
																	[]
																}
															/>
															</div>
															
															
														</div>
														
														<div className="px-5 border border-yellow-400 rounded-xl bg-yellow-50">
													<div className="flex flex-row justify-start px-2 py-5 gap-2">
													<FlatIcon
										
										
										icon ="fi fi-sr-medicine"
										className="text-md text-slate-900"
									/>
													<span icon="fi fi-rs-cursor-finger" className="text-md font-bold  text-teal-800  text-xl ">Medicine to Released</span>

													<InfoText
														className=" text-slate-900"
														
														title="Prescribed By"
														value={doctorName(
															order?.prescribedByDoctor
														)}
													/>
													</div>

														<div className="table w-full px-1 mt-2 ">
														<table>
															<thead>
																<tr>
																	<th>
																		Item
																		Code
																	</th>
																	<th>
																		Item
																		Information
																	</th>
																	<th className="text-center">
																		Qty
																	</th>
																</tr>
															</thead>
															<tbody>
																{order?.prescriptions?.map(
																	(item) => {
																		return (
																			<>
																				<tr
																					key={`opri-${item?.id}`}
																				>
																					<td>
																						{
																							item
																								?.item
																								?.code
																						}
																					</td>
																					<td>
																						{
																							item
																								?.item
																								?.name
																						}
																					</td>
																					<td className="text-center">
																						{
																							item?.quantity
																						}
																					</td>
																				</tr>
																				<tr>
																					<td
																						colSpan={
																							3
																						}
																					>
																						<div className="flex gap-4">
																							<span className="font-bold">
																								{" "}
																								Sig.:
																							</span>
																							<div
																								className="bg-yellow-100 px-4"
																								dangerouslySetInnerHTML={{
																									__html: item?.details,
																								}}
																							></div>
																						</div>
																					</td>
																				</tr>
																			</>
																		);
																	}
																)}
															</tbody>
														</table>
													</div>
													</div>


													</div>

													
													
													
													<ActionBtn
														className="mt-4 ml-auto transition ease-in-out delay-30 hover:-translate-y-1 hover:scale-100 duration-100"
														type="teal"
														loading={loading}
														onClick={approveRelease}
													>
														<FlatIcon icon="rr-memo-circle-check" />
														Approve for release
														medicine
													</ActionBtn>
												</>
											}
										/>
									</div>
								</Fade>
							) : (
								<span className="w-full font-medium text-lg text-center py-20 text-slate-300">
									No patient selected
								</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	);
};

export default PatientPharmacyQueue;
