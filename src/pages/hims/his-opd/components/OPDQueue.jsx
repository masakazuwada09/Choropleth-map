import  { React, useRef, useState } from 'react'
import { Controller, useForm } from "react-hook-form";
import ReferToSPHModal from '../../../../components/modal/ReferToSPHModal';
import InServiceER from '../../his-er/InServiceER';
import AppointmentDetailsForNurse from '../../../appointments/components/AppointmentDetailsForNurse';
import PatientInfo from '../../../patients/components/PatientInfo';
import ActionBtn from '../../../../components/buttons/ActionBtn';
import { Fade } from 'react-reveal';
import { patientFullName, formatDateTime, patientRoomNumber } from '../../../../libs/helpers';
import InQueueRegular from './InQueueRegular';
import InQueueForRelease from '../../../patient-queue/components/InQueueForRelease';
import AppLayout from '../../../../components/container/AppLayout';
import useNoBugUseEffect from '../../../../hooks/useNoBugUseEffect';
import useDoctorQueue from '../../../../hooks/useDoctorQueue';
import { useAuth } from '../../../../hooks/useAuth';
import useOPDQueue from '../../../../hooks/useOPDQueue.js';
import OPDAppointmentDetails from './OPDAppointmentDetails';






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
			return <span className="text-orange-600">Pending for service</span>;
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

const OPDQueue = ({
	children,
	onClick,
	referAction,
	number,
	selected,
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


	const {
		pending,
		pendingForRelease,
		mutatePendingForRelease,
		mutatePendingPatient,
		mutateNowServingPatient,
	} = useOPDQueue();
	
	const referToSphModalRef = useRef(null);
	const [appointment, setAppointment] = useState(null);
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

	return (
		<AppLayout>
			<div className="p-4 h-full overflow-auto">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-5 divide-x">
					<div className="lg:col-span-4">
						<h1 className="text-xl font-bold font-opensans text-primary-dark tracking-wider -mb-1">
							Patient Queue
						</h1>
						<span className="noto-sans-thin text-slate-500 text-sm font-light">
							Patients pending for service
						</span>
						<div className="flex flex-col gap-y-4 py-4">
							{listPending()?.map((queue, index) => (
								<InQueueRegular
									date={formatDateTime(
									new Date(queue?.created_at)
									)}
									referAction={() => {
										referToSphModalRef.current.show(queue);
									}}
									onClick={() => {
										if (queue.status != "pending-doctor-consultation") {
											setAppointment(queue);
											
										} if (queue.status != "pending-surgery") {
											setAppointment(queue);
										}
										
										else {
											setAppointment(null);
										}
									}}
									selected={queue?.id == appointment?.id}
									key={`iq2-${queue.id}`}
									number={`${queue.id}`}
									patientName={patientFullName(queue?.patient)}
									
								>
									<div className="w-full flex flex-col pl-16">
										<div className="flex items-center text-slate-700 gap-2 mb-2">
											<span className="text-sm">Status:</span>
											<span className="font-bold text-sm">
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
									<div className="w-full flex flex-col pl-16">
										<div className="flex items-center text-slate-700 gap-2 mb-2">
											<span className="text-sm">Status:</span>
											<span className={`font-bold text-sm text-orange-600 ${
				selected
					? "!bg-green-50 !border-green-800 text-green-600 shadow-green-500 "
					: ""
			}`}>
												{"PENDING FOR RELEASE"}
											</span>
										</div>
									</div>
								</InQueueForRelease>
							))}
							
						</div>
					</div>
					<div className="lg:col-span-8 pl-4">
						<div className="flex items-center">
							<h1 className="text-xl font-bold font-opensans text-success-dark tracking-wider -mb-1">
								In Service...
							</h1>
						</div>
						<span className="mb-3 noto-sans-thin text-slate-500 text-sm font-light">
							&nbsp;
						</span>
						<div>
							{appointment?.patient ? (
								
								<Fade key={`order-${appointment?.id}`}>
									<div>
										<h4 className="border flex items-center text-base font-bold p-2 mb-0 border-indigo-100 lg:col-span-12">
											<span>Patient Information</span>
											<ActionBtn
												className="ml-auto"
												type="danger"
												onClick={() => {
													setAppointment(null);
												}}
											>
												Close
											</ActionBtn>
										</h4>
										<div className="flex flex-col lg:flex-row gap-2 border-x border-indigo-100 p-4">
											<PatientInfo 
											mutateAll={mutateAll}
											patient={appointment?.patient} 
											appointment={appointment}
											/>
										</div>
										<div className="pb-4">

										<OPDAppointmentDetails
												appointment={appointment}
												mutateAll={mutateAll}
												
												setOrder={(data) => {
													if (data == null) {
														// mutateAll();
													}
													setAppointment(data);
												}}
											/>
												
											
											

						{appointment?.id ? (
							<div className="grid grid-cols-1 lg:grid-cols-1 gap-4">

							{doctorsNowServing?.data?.slice(0, 1).map((data) => (
								<OPDAppointmentDetails
								data={data}
								patient={appointment?.patient} 
								appointment={appointment}
								mutateAll={mutateAll}
								setOrder={(data) => {
									if (data == null) {
										// mutateAll();
									}
									setAppointment(data);
								}}
							/>

							))}
							
						</div>
						
						) : (
							""
						)}
											
										</div>
									</div>
								</Fade>
							) : (
								""
							)}
						</div>

						
						{appointment?.id ? (
							""
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
			<ReferToSPHModal ref={referToSphModalRef} />
		</AppLayout>
	);
};

export default OPDQueue;
