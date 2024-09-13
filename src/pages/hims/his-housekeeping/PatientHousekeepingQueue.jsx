import React, { useState, useRef } from 'react'
import { useAuth } from '../../../hooks/useAuth';
import useHousekeepingQueue from '../../../hooks/useHousekeepingQueue';
import useNoBugUseEffect from '../../../hooks/useNoBugUseEffect';
import { procedureRates } from '../../../libs/procedureRates';
import CaseDetails from '../../department/his-md/components/CaseDetails';
import { doctorName, patientFullName } from '../../../libs/helpers';
import InfoText from '../../../components/InfoText';
import ContentTitle from '../../../components/buttons/ContentTitle';
import { caseCodes } from '../../../libs/caseCodes';
import AppointmentDetailsForNurse from '../../appointments/components/AppointmentDetailsForNurse';
import PatientInfo from '../../patients/components/PatientInfo';
import ActionBtn from '../../../components/buttons/ActionBtn';
import { Fade } from 'react-reveal';
import InQueueForRelease from '../../patient-queue/components/InQueueForRelease';
import AppLayout from '../../../components/container/AppLayout';
import AppointmentDetailsForHousekeeping from './components/AppointmentDetailsForHousekeeping';
import ReferToSPHModal from '../../../components/modal/ReferToSPHModal';

const PatientHousekeepingQueue = () => {
  const { user } = useAuth();
	const { pending, mutatePending } = useHousekeepingQueue();
	const referToSphModalRef = useRef(null);
	const [appointment, setAppointment] = useState(null);

	useNoBugUseEffect({
		functions: () => {},
	});
	const mutateAll = () => {
		mutatePending();
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
							Patients pending for Housekeeping approval
						</span>
						<div className="flex flex-col gap-y-4 py-4">
							{pending?.data?.map((queue, index) => {
								return (
									<InQueueForRelease
										selected={queue?.id == appointment?.id}
										onClick={() => {
											setAppointment(queue);
										}}
										
										key={`iqr-${queue.id}`}
										number={`${queue.id}`}
										patientName={patientFullName(
											queue?.patient
										)}
									>
										<div className="w-full flex flex-col pl-16">
											<div className="flex items-center text-slate-700 gap-2 mb-2">
												<span className="text-sm">
													Status:
												</span>
												<span className="font-bold text-sm text-red-600">
													FOR HOUSEKEEPING APPROVAL
												</span>
											</div>
										</div>
										<div className="w-full flex flex-col pl-16">
											<div className="flex items-center text-slate-700 gap-2 mb-2">
												<span className="text-sm">
													{/* Room:<span className='font-bold text-red-600'>{appointment.room_number}</span>  */}
												</span>
												<span className="font-bold text-sm text-red-600">
													
												</span>
											</div>
										</div>
									</InQueueForRelease>
								);
							})}
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
												
												patient={appointment?.patient}
												
											/>
										</div>
										<div className="pb-4">

											<AppointmentDetailsForHousekeeping
												forHousekeeping={true}
												mutateAll={mutateAll}
												hideServices={false}
												appointment={appointment}
												setOrder={(data) => {
													if (data == null) {
														// mutateAll();
													}
													setAppointment(data);
												}}
												
												
												
												// serviceComponent={() => {
												// 	return (
												// 		<>
												// 			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-5">
												// 				<div className="flex flex-col">
												// 					<ContentTitle title="Diagnosis"></ContentTitle>
												// 					<InfoText
												// 						className="w-full"
												// 						title="Diagnosed By"
												// 						value={doctorName(
												// 							appointment?.prescribedByDoctor
												// 						)}
												// 					/>
												// 					<CaseDetails
												// 						code={
												// 							appointment?.diagnosis_code
												// 						}
												// 						title="Diagnosis Details"
												// 						cases={
												// 							caseCodes ||
												// 							[]
												// 						}
												// 					/>
												// 				</div>
												// 				<div className="flex flex-col">
												// 					<ContentTitle title="Procedure Rendered"></ContentTitle>

												// 					<InfoText
												// 						className="w-full"
												// 						title="Doctor"
												// 						value={doctorName(
												// 							appointment?.prescribedByDoctor
												// 						)}
												// 					/>

												// 					<CaseDetails
												// 						code={
												// 							appointment?.procedure_code
												// 						}
												// 						title="Procedure Details"
												// 						cases={
												// 							procedureRates ||
												// 							[]
												// 						}
												// 					/>
												// 				</div>
												// 			</div>
												// 		</>
												// 	);
												// }}
											/>
										</div>
									</div>
								</Fade>
							) : (
								""
							)}
						</div>
					</div>
				</div>
			</div>
			<ReferToSPHModal ref={referToSphModalRef} />
		</AppLayout>
  )
}

export default PatientHousekeepingQueue
