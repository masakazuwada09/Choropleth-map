import React, {  useRef, useState, useEffect, Fragment, forwardRef, useImperativeHandle, } from 'react'
import { Controller, useForm } from "react-hook-form";
import ReferToSPHModal from '../../../../components/modal/ReferToSPHModal';
import InServiceER from '../../../hims/his-er/InServiceER';
import AppointmentDetailsForNurse from '../../../appointments/components/AppointmentDetailsForNurse';
import PatientInfo from '../../../patients/components/PatientInfo';
import ActionBtn from '../../../../components/buttons/ActionBtn';
import { Fade } from 'react-reveal';
import { patientFullName, formatDateTime, patientRoomNumber } from '../../../../libs/helpers';
import InQueueRegular from '../../../hims/his-opd/components/InQueueRegular';
import InQueueForRelease from '../../../patient-queue/components/InQueueForRelease';
import AppLayout from '../../../../components/container/AppLayout';
import useNoBugUseEffect from '../../../../hooks/useNoBugUseEffect';
import useDoctorQueue from '../../../../hooks/useDoctorQueue';
import { useAuth } from '../../../../hooks/useAuth';
import useOPDQueue from '../../../../hooks/useOPDQueue.js';
import OPDAppointmentDetails from '../../../hims/his-opd/components/OPDAppointmentDetails';
import NurseAppointmentDetails from './NurseAppointmentDetails';
import FlatIcon from '../../../../components/FlatIcon';
import PendingOrdersModal from '../../../../components/PendingOrdersModal';
import useNurseQueue from './hooks/useNurseQueue';


const Status = ({ appointment }) => {
	const renderStatus = () => {
		if (appointment?.has_for_reading?.length > 0) {
			return (
				<span className="text-orange-500">
					Pending for Result Reading
				</span>
			);
		}
		if (appointment?.status == "pending" && appointment?.vital_id == null) {
			return (
				<span className="text-orange-500">
					Pending for patient vitals {appointment?.vital_id}
				</span>
			);
		}
		if (appointment?.status == "pending" && appointment?.vital_id != null) {
			return <span className="text-teal-600">For Laboratory/Imaging</span>;
		}
		if (
			appointment?.status == "pending-doctor-confirmation" &&
			appointment?.vital_id != null &&
			appointment?.referred_to != null
		) {
			return (
				<span className="text-orange-600">
					Pending for doctor&apos;s confirmation
				</span>
			);
		}
		if (
			appointment?.status == "pending-for-pharmacy-release" &&
			appointment?.prescribed_by == null
		) {
			return (
				<span className="text-orange-600">For Doctor Prescription</span>
			);
		}
		if (
			appointment?.status == "pending-for-pharmacy-release" &&
			appointment?.prescribed_by != null
		) {
			return (
				<span className="text-orange-600">For Medicine release</span>
			);
		}
		if (appointment?.status == "in-service-consultation") {
			return (
				<span className="text-orange-600">
					CONSULTATION WITH DOCTOR
				</span>
			);
		}
		if (appointment?.status == "in-service-surgery") {
			return (
				<span className="text-orange-600">
					For Surgery
				</span>
			);
		}
		return (
			<span className="text-red-600 uppercase">
				{String(appointment?.status).replaceAll("-", " ")}
			</span>
		);
	};
	return renderStatus();
};

const NurseQueue = ({
	children,
	onClick,
	referAction,
	number,
	selected,
	date,
	patientName,
}) => {
	const { user } = useAuth();
	const {
		pending: doctorsPending,
		nowServing: doctorsNowServing,
		mutatePending,
		mutatePendingForResultReading,
		mutateNowServing,
	} = useDoctorQueue();
	
	const { pending, nowServing } = useNurseQueue();
	// useImperativeHandle(ref, () => ({
	// 	show: show,
	// 	hide: hide,
	// }));
	// const show = (data) => {
	// 	setFull(false);
	// 	setShowData(data);
	// 	setPatient(data?.patient);
	// 	setModalOpen(true);
	// };
	// const hide = () => {
	// 	setModalOpen(false);
	// };
	const {
		
		pendingForRelease,
		mutatePendingForRelease,
		mutatePendingPatient,
		mutateNowServingPatient,
	} = useNurseQueue();
	
	const referToSphModalRef = useRef(null);
	const [appointment, setAppointment] = useState(null);
	const [showData, setShowData] = useState(null);
	const [loading, setLoading] = useState(false);
	const pendingOrdersRef = useRef(null);
	const [minWidth, maxWidth, defaultWidth] = [80, 810, 810];
	const [width, setWidth] = useState(defaultWidth);
	const isResized = useRef(false);
	useEffect(() => {
		window.addEventListener("mousemove", (e) => {
		if (!isResized.current) {
		return;
		}
		
		setWidth((previousWidth) => {
		const newWidth = previousWidth + e.movementX / 1;
		
		const isWidthInRange = newWidth >= minWidth && newWidth <= maxWidth;
		
		return isWidthInRange ? newWidth : previousWidth;
		});
		});
		
		window.addEventListener("mouseup", () => {
		isResized.current = false;
		});
		}, []);
		
	useNoBugUseEffect({
		functions: () => {},
	});

	const isDoctor = () => {
		return user?.type == "his-md" || user?.type == "HIS-MD";
	};

	const sortPendingList = (list) => {
		// Sort by priority: pending vitals first, then by id descending
		return (list || []).sort((a, b) => {
			if (a.status === "pending" && a.vital_id === null) return -1;
			if (b.status === "pending" && b.vital_id === null) return 1;
			return b.id - a.id;
		});
	};

	const listPending = () => {
		const pendingList = isDoctor() ? doctorsPending?.data : pending?.data;
		return sortPendingList(pendingList);
	};

	const sortedPendingForRelease = () => {
		return sortPendingList(pendingForRelease?.data);
	};

	const mutateAll = () => {
		mutatePending();
		mutatePendingForResultReading();
		mutateNowServing();
		mutatePendingForRelease();
		//mutatePendingPatient();
		//mutateNowServingPatient();
	};
	const handleDoubleClick = () => {
		setWidth((prevWidth) => (prevWidth === maxWidth ? minWidth : maxWidth));
	};
	const shouldHideContent = width <= minWidth;
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
	console.log("APPOINTMENTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", appointment);
	return (
		<AppLayout>
			<div className="flex ">
				<div style={{ width: `${width / 17}rem` }} className="bg-white">
				
					<div className="lg:col-span-4 overflow-y-scroll h-[860px]">
						<div className='flex flex-row justify-start px-2 items-center gap-6 mb-2 mt-4 ml-3'>
						{shouldHideContent ? (
								<FlatIcon icon="fi fi-rr-users-alt" className="text-gray-400 text-3xl " />
							) : (
								<div className='flex flex-row gap-3 items-center '>
									<FlatIcon icon="fi fi-rr-users-alt" className="text-teal-600 text-2xlml-7" />
								<h1 className="text-lg font-bold font-opensans text-teal-600 tracking-wider">
									Patient Queue
								</h1>
								</div>
								
							)}
							{!shouldHideContent && (
								<span className=" text-slate-700 text-sm font-md">
									Patients pending for service
								</span>
							)}

						</div>
						
						<div className="flex flex-col gap-y-1 py-1 mr-2 ml-2">
							{listPending()?.map((queue, index) => (
								<InQueueRegular
									date={formatDateTime(
									new Date(queue?.created_at)
									)}
									referAction={() => {
										referToSphModalRef.current.show(queue);
									}}
									onClick={() => {
										if (queue.status == "pending") {
											setAppointment(queue);
										} else {
											setAppointment(null);
										}
									}}
									selected={queue?.id == appointment?.id}
									key={`iq2-${queue.id}`}
									number={`${queue.id}`}
									patientName={patientFullName(queue?.patient)}
									
								>
									<div className="w-full items-center">
										<div className="flex flex-col items-center  text-slate-700 ">
											<span className="text-xs font-bold">Status:</span>
											<span className="font-bold text-xs">
												<Status appointment={queue} />
											</span>
										</div>
									</div>
								</InQueueRegular>
							))}

							{sortedPendingForRelease()?.map((queue, index) => (
								<InQueueForRelease
									date={formatDateTime(
									new Date(queue?.created_at)
									)}
									selected={queue?.id == appointment?.id}
									onClick={() => {
										setAppointment(queue);
									}}
									key={`iqr-${queue.id}`}
									number={`${queue.id}`}
									patientName={patientFullName(queue?.patient)}
									
								>
									<div className="w-full items-center">
										<div className="flex flex-col items-center  text-slate-700 ">
											<span className="text-xs font-bold">Status:</span>
											<span className={`font-bold text-xs text-red-600 ${
				selected
					? "!bg-green-50 !border-green-800 text-green-600 shadow-green-500 "
					: ""
			}`}>
												{"Pending for Billing"}
											</span>
										</div>
									</div>
								</InQueueForRelease>
							))}
							
						</div>
			
					</div>
					</div>

					{/* Handle */}
				<div
                    className="w-1 bg-gray-100 cursor-col-resize justify-center items-center flex text-gray-400"
                    onMouseDown={() => {
                        isResized.current = true;
                        document.body.classList.add('no-select');
                    }}
					onDoubleClick={handleDoubleClick}
                ><span className='bg-gray-200 rounded-sm h-12 flex justify-center items-center absolute mr-2 shadow-2xl border border-gray-300'>|</span>
				</div>

			<div className="p-2 h-full w-full">
				<div className="grid grid-cols-1 lg:grid-cols-1 gap-1 divide-x">
					
					
					<div className="lg:col-span-8 pl-2 ">
						<div className="flex items-center mb-1">
							<h1 className="text-lg font-md font-opensans text-gray-400 tracking-wider ">
								In Service
							</h1>
						</div>
						
						<div className=''>
							{appointment?.patient ? (	
								<Fade key={`order-${appointment?.id}`}>
									<div>
										<h4 className="border rounded-t-lg flex items-center text-base font-bold p-2 mb-0 border-indigo-100 lg:col-span-12 justify-between">
											<span>Patient Information</span>
											
											<button
												className="rounded-full "
												
												onClick={() => {
													setAppointment(null);
												}}
											>
												x
											</button>
											
						
											
										</h4>
										<div className="flex flex-col lg:flex-row gap-2 border-indigo-100 p-4 ">
									
											<PatientInfo 
											mutateAll={mutateAll}
											patient={appointment?.patient} 
											appointment={appointment}
											/>
											
												

										</div>
										
									</div>
								</Fade>

							) : (
								""
							)}
						</div>

						
							
						{appointment?.id ? (
							<Fade key={`order-${appointment?.id}`}>
								<>
									<NurseAppointmentDetails
									appointment={appointment} 
									patient={appointment?.patient}
									mutateAll={mutateAll}
								/>
							</>
							</Fade>
						) : (
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

								{doctorsNowServing?.data?.map((data) => (
									<InServiceER
										key={`PQInServiceItem-${data?.id}`}
										data={data}
									/>

								))}
								
							</div>
						)}
					
					</div>
				</div>
			</div>


				</div>
			
			<ReferToSPHModal ref={referToSphModalRef} />
			<PendingOrdersModal ref={pendingOrdersRef} />
		</AppLayout>
	);
};

export default NurseQueue;