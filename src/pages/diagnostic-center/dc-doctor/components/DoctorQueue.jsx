import React, { useEffect, useRef, useState } from "react";
import AppLayout from "../../../../components/container/AppLayout";
import useNoBugUseEffect from "../../../../hooks/useNoBugUseEffect";
import PageHeader from "../../../../components/layout/PageHeader";
import FlatIcon from "../../../../components/FlatIcon";
import DoctorInQueueRegular from "../../../department/his-md/components/DoctorInQueueRegular";
import useQueue from "../../../../hooks/useQueue";
import {
	formatDate,
	formatDateTime,
	patientRoomNumber,
	patientFullName,
} from "../../../../libs/helpers";
import ReferToSPHModal from "../../../../components/modal/ReferToSPHModal";
import { useAuth } from "../../../../hooks/useAuth";
import ConsultPatientModal from "../../../department/his-md/components/ConsultPatientModal";
import DoctorInServiceItem from "../../../department/his-md/components/DoctorInServiceItem";
import PatientProfileModal from "./modal/PatientProfileModal";
import DoctorInQueuePriority from "../../../department/his-md/components/DoctorInQueuePriority";
import PendingOrdersModal from "../../../../components/PendingOrdersModal";
import useERQueue from "../../../../hooks/useERQueue";
import useMDQueue from "../../../../hooks/useMDQueue";
import useDoctorQueue from "./hooks/useDoctorQueue";
import useCashierQueue from "../../../../hooks/useCashierQueueOLD";
import useLabQueue from "../../../../hooks/useLabQueue";
import usePharmaQueue from "../../../../hooks/usePharmaQueue";
import useNurseQueue from "../../dc-nurse/components/hooks/useNurseQueue";


const DoctorQueue = () => {
	const { user } = useAuth();
	const referToSphModalRef = useRef(null);
	const patientProfileRef = useRef(null);
	const acceptPatientRef = useRef(null);
	const pendingOrdersRef = useRef(null);
	const { pending, nowServing } = useERQueue();

	const {
		pending: doctorsPending,
		nowServing: doctorsNowServing,
		pendingForResultReading,
		mutatePending,
		mutatePendingForResultReading,
		mutateNowServing,
	} = useDoctorQueue();

	const [appointment, setAppointment] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useNoBugUseEffect({
		functions: () => {},
	});

	const isDoctor = () => {
		return user?.type == "dc-doctor";
	};

	const listPending = () => {
		return (isDoctor() ? doctorsPending?.data : pending?.data) || [];
	};

	const mutateAll = () => {
		mutatePending();
		mutatePendingForResultReading();
		mutateNowServing();
	};

	const handleAcceptAction = (queue) => {
		if (isModalOpen) {
			// Optionally, you can also disable the button or show a loading indicator
			return;
		}
		acceptPatientRef.current.show(queue);
	};

	const handleModalOpen = () => setIsModalOpen(true);
	const handleModalClose = () => setIsModalOpen(false);

	return (
		<AppLayout >
			<div className="p-4 h-full overflow-auto ">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-5 divide-x">
					<div className="lg:col-span-4">
						<h1 className="text-xl font-bold font-opensans text-gray-400 tracking-wider -mb-1">
							In Queue
						</h1>
						<span className="noto-sans-thin text-slate-500 text-sm font-light">
							Patients pending for doctor acceptance
						</span>
						<div className="flex flex-col gap-y-4 py-4">
							{listPending()?.length == 0 &&
							pendingForResultReading?.data?.length == 0 ? (
								<div className="text-slate-300 py-20 text-center">
									No patient in queue.{" "}
								</div>
							) : (
								""
							)}
							{pendingForResultReading?.data?.map((queue, data) => {
								if (
									queue.status != "in-service-result-reading"
								) {
									return (
										<DoctorInQueuePriority
											labOrdersStr={JSON.stringify(
												data?.lab_orders
											)}
											date={formatDate(
												new Date(queue?.created_at)
											)}
											acceptAction={() => handleAcceptAction(queue)}
											key={`iqr-prio-${queue.id}`}
											number={`${queue.id}`}
											patientName={patientFullName(
												queue?.patient
											)}
											data={data}
										/>
									);
								}
							})}
							
							{listPending()?.map((queue, data) => {
								return (
									<DoctorInQueueRegular
										data={data}
										date={formatDateTime(
											new Date(queue?.created_at)
										)}
										onClick={() => {
											setAppointment(queue);
										}}
										acceptAction={() => handleAcceptAction(queue)}
										key={`iqr-prio-${queue.id}`}
										number={`${queue.id}`}
										patientName={patientFullName(
											queue?.patient
										)}
									/>
								);
							})}
						</div>
					</div>
					<div className="lg:col-span-8 pl-4">
						<h1 className="text-xl font-bold font-opensans text-gray-400 tracking-wider -mb-1">
							In Service...
						</h1>
						<span className="mb-3 noto-sans-thin text-slate-500 text-sm font-light">
							&nbsp;
						</span>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

							{doctorsNowServing?.data?.map((data) => {
								return (
									<DoctorInServiceItem
										data={data}
										labOrdersStr={JSON.stringify(
											data?.lab_orders
										)}
										pendingOrdersRef={pendingOrdersRef}
										key={`DoctorInServiceItem-${data?.id}`}
										openProfileAction={() => {
											patientProfileRef.current.show(
												data
											);
										}}
										
									/>
								);
							})}

							{doctorsNowServing?.data?.length == 0 ? (
								<span className="py-20 text-center lg:col-span-2 text-slate-300 text-lg font-bold">
									No data available.
								</span>
							) : (
								""
							)}

						</div>
					</div>
				</div>
			</div>
			
			<ReferToSPHModal ref={referToSphModalRef} mutateAll={mutateAll} />

			<ConsultPatientModal 
				appointment={appointment}
				ref={acceptPatientRef} 
				mutateAll={mutateAll}
				onOpen={() => handleModalOpen()}
				onClose={() => handleModalClose()}
			/>
			
			<PatientProfileModal
				pendingOrdersRef={pendingOrdersRef}
				ref={patientProfileRef}
				mutateAll={mutateAll}
			/>

			<PendingOrdersModal ref={pendingOrdersRef} />
		</AppLayout>
	);
};

export default DoctorQueue;
