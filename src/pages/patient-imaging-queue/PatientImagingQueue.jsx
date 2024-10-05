/* eslint-disable react/prop-types */
import React, { useRef, useState } from 'react'
import { Fade } from 'react-reveal';
import { calculateAge, doctorName, doctorSpecialty, formatDate, patientFullName } from '../../libs/helpers';
import InQueueRegular from '../patient-lab-queue/components/InQueueRegular';
import useNoBugUseEffect from '../../hooks/useNoBugUseEffect';
import useLabQueue from '../../hooks/useLabQueue';
import { useAuth } from '../../hooks/useAuth';
import FlatIcon from '../../components/FlatIcon';
import Img from '../../components/Img';
import AppLayout from '../../components/container/AppLayout';
import LaboratoryOrders from '../diagnostic-center/dc-doctor/components/LaboratoryOrders';
import LaboratoryFinalReport from '../patient-lab-queue/components/LaboratoryFinalReport';
import ImagingFinalReport from './ImagingFinalReport';
import TextInput from '../../components/inputs/TextInput';
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
const PatientImagingQueue = () => {
    const { user } = useAuth();
	const { pending, mutatePending, nowServing } = useLabQueue();
	const [order, setOrder] = useState(null);
	const referToSphModalRef = useRef(null);
	const uploadLabResultRef = useRef(null);
	const [appointment, setAppointment] = useState(null);
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
							Patients pending for laboratory services
						</span>
						<div className="pr-5">
							<TextInput
								iconLeft={"rr-search"}
								placeholder="Search patient..."
								onChange={(e) => {
									setFilters((prevFilters) => ({
										...prevFilters,
										keyword: e.target.value,
									}));
								}}
							/>
						</div>
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
							{listPending()?.length == 0 ? (
								<span className="text-center py-20 font-bold text-slate-400">
									No patients in queue.
								</span>
							) : (
								listPending()?.map((queue, patient, index) => {
									return (
										<InQueueRegular
										onClick={() => {
											setOrder(queue);
										}}
										patient={
										order?.relationships
											?.patient
										}
										active={
											queue?.id == patient?.id
										}
										patientName={patientFullName(queue?.relationships?.patient)}
										>
											
										</InQueueRegular>
									);
								})
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
							{order?.relationships?.patient ? (
								<Fade key={`order-${order?.id}`}>
									<div>
										<ImagingFinalReport
										
										appointment={appointment}
										mutateAll={mutateAll}
										setAppointment={setOrder}
										patient={order?.relationships?.patient}
										order_id={order?.id}
										onUploadLabResultSuccess={() => {
											console.log("onUploadLabResultSuccess");
											mutatePending();
											setOrder(null);
										}}
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
  )
}

export default PatientImagingQueue
