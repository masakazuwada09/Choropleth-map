import React, { useEffect, useRef, useState } from "react";
import AppLayout from "../../../../components/container/AppLayout";
import useNoBugUseEffect from "../../../../hooks/useNoBugUseEffect";
import FlatIcon from "../../../../components/FlatIcon";
import InQueueRegular from "./InQueueRegular";
import InQueuePriority from "./InQueuePriority";
import {
	calculateAge,
	doctorName,
	doctorSpecialty,
	formatDate,
	patientFullName,
	formatDateTime
} from "../../../../libs/helpers";
import { useAuth } from "../../../../hooks/useAuth";
import useLabQueue from "../../../../hooks/useLabQueue";
import Img from "../../../../components/Img";
import LaboratoryOrders from "../../dc-doctor/components/LaboratoryOrders";
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
import CaseDetails from "../../dc-nurse/components/Forms/CaseDetails";
import { caseCodes } from "../../../../libs/caseCodes";
import { procedureRates } from "../../../../libs/procedureRates";


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
		pending,
		mutatePending,
		pendingMedsRelease,
		mutatePendingMedsRelease,
	} = usePharmaQueue();
	const [order, setOrder] = useState(null);
	const [stat, setStat] = useState(null);
	const [loading, setLoading] = useState(false);
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
	const approveRelease = () => {
		setLoading(true);
		Axios.post(`v1/clinic/tb-approve-release-medication/${order?.id}`, {
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
						<h1 className="text-xl font-bold font-opensans text-primary-dark tracking-wider -mb-1">
							Patient Queue
						</h1>
						<span className="noto-sans-thin text-slate-500 text-sm font-light">
							Patients pending for pharmacy release
						</span>
						<div className="flex flex-col gap-y-4 py-4">
							{/* <span className="font-medium text-md text-orange-500 -mb-2 ">
								Priority Lane
							</span> */}
							{/* <InQueuePriority
								number="3"
								patientName="Raelyn Cameron"
								priorityType="PWD"
							/>
							<InQueuePriority
								number="4"
								patientName="Kamdyn Castillo"
								priorityType="PWD"
							/> */}
							{/* <span className="border-b border-b-slate-100"></span> */}
							{/* <span className="font-medium text-md text-blue-500 -mb-2 ">
								Regular
							</span> */}
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
												selected={
													queue?.patient?.id ===
													order?.patient?.id
												}
												onClick={() => {
													setOrder(queue);
													setStat(
														`FOR APPROVE RELEASING MEDICINE`
													);
												}}
												key={`iqr-${queue.id}`}
												number={`${queue.id}`}
												patientName={patientFullName(
													queue?.patient
												)}
											>
												<div className="w-full flex flex-col lg:pl-16">
													<div className="flex items-start gap-2 mb-2">
														<span className="text-sm w-[46px]">
															Doctor:{" "}
														</span>
														<span className="flex flex-col font-bold">
															<span className="-mb-1">
																{doctorName(
																	queue?.doctor
																)}
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
									})}{" "}
									{pendingMedsRelease?.data?.map(
										(queue, index) => {
											return (
												<InQueuePriority
													date={formatDateTime(
													new Date(queue?.created_at)
													)}
													selected={
														queue?.patient?.id ===
														order?.patient?.id
													}
													onClick={() => {
														setOrder(queue);
														setStat(
															"FOR RELEASING MEDICINE"
														);
													}}
													priorityType={
														"MEDICINE RELEASE"
													}
													key={`iqr-${queue.id}`}
													number={`${queue.id}`}
													patientName={patientFullName(
														queue?.patient
													)}
												>
													<div className="w-full flex flex-col lg:pl-16">
														<div className="flex items-start gap-2 mb-2">
															<span className="text-sm w-[46px]">
																Doctor:{" "}
															</span>
															<span className="flex flex-col font-bold">
																<span className="-mb-1">
																	{doctorName(
																		queue?.doctor
																	)}
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
							{/* <InQueueRegular
								number="6"
								patientName="Mylo Daugherty"
							/>
							<InQueueRegular
								number="7"
								patientName="Emmeline Larson"
							/> */}
						</div>
					</div>
					<div className="lg:col-span-8 pl-4">
						<div className="flex items-center gap-4 pb-4">
							<h1 className="text-xl font-bold font-opensans text-success-dark tracking-wider -mb-1">
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
											/>
										</div>
										<AppointmentDetails
											appointment={order}
											customStatus={stat}
											serviceComponent={
												<>
													<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-5">
														<div className="flex flex-col">
														
															<InfoText
																className="w-full"
																title="Diagnosed By"
																value={doctorName(
																	order?.prescribedByDoctor
																)}
															/>
															<CaseDetails
																
																code={
																	order?.diagnosis_code
																}
																cases={
																	caseCodes ||
																	[]
																}
																title="Diagnosis Details"
																
															/>
															
														</div>


														<div>
													<ContentTitle title="Medicine To Be Released"></ContentTitle>

														<InfoText
															className="w-full"
															title="Prescribed By"
															value={doctorName(
																order?.prescribedByDoctor
															)}
														/>
														<div className="table w-full">
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
																			console.log("RESULT_READINGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG", item
																				);
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
																						{item?.quantity}
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
														<ActionBtn
															className="mt-4 ml-auto"
															type="success"
															loading={loading}
															onClick={approveRelease}
														>
															<FlatIcon icon="rr-memo-circle-check" />
															Approve for release
															medicine
														</ActionBtn>
														
													</div>
														
													</div>

													
													
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