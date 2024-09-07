/* eslint-disable react/prop-types */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react-refresh/only-export-components */
import {
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
import Axios from "../../../../libs/axios";
import { patientFullName } from "../../../../libs/helpers";
import PatientInfo from "../../../patients/components/PatientInfo";
import AppointmentDetails from "../../../diagnostic-center/dc-doctor/components/AppointmentDetails";
import FlatIcon from "../../../../components/FlatIcon";
import useDoctorQueue from "../../../../hooks/useDoctorQueue";
import Draggable from "react-draggable";


const ConsultPatientModal = (props, ref) => {
	const { mutateAll } = props;
	const {
		register,
		getValues,
		watch,
		control,
		setValue,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const {
		pending: doctorsPending,
		nowServing: doctorsNowServing,
		mutatePending,
		mutatePendingForResultReading,
		mutateNowServing,
	} = useDoctorQueue();

	const isDoctor = () => {
		return user?.type == "dc-doctor" || user?.type == "dc-doctor";
	};



	const [showData, setShowData] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [appointment, setAppointment] = useState(null);
	const [isMinimized, setIsMinimized] = useState(true);
	const [position, setPosition] = useState({ x: 5, y: 0 });
	const [dragging, setDragging] = useState(false);
	const { patient } = props;

	useImperativeHandle(ref, () => ({
		show: show,
		hide: hide,
	}));

	const show = (data) => {
		setShowData(data);
		setModalOpen(true);
	};
	const hide = () => {
		setModalOpen(false);
	};
	const noHide = () => {};
	const submit = (data) => {
		let formData = new FormData();
		formData.append("_method", "PATCH");
		Axios.post(
			`v1/clinic/doctor-accept-patient/${showData?.id}`,
			formData
		).then((res) => {
			reset();
			mutateAll();
			toast.success("Patient accepted successfully!");
			hide();
		});
	};

	const handleStop = (e, data) => {
		setPosition({ x: data.x, y: data.y });
		setDragging(false); // Reset dragging state
	};
	
	  const handleStart = () => {
		setDragging(true); // Set dragging state to true when dragging starts
	  };

	const handleBackgroundClick = (e) => {
		if (!dragging) {
			noHide();
		}
	};
	  
	return (

		
		<Transition appear show={modalOpen} as={Fragment}>
			<Dialog as="div" className="fixed inset-0 z-10" onClose={handleBackgroundClick}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="inset-0 bg-opacity-75  " />
				</Transition.Child>

		<Draggable  
		 	axis="both"
		  position={isMinimized ? position : { x: 1070, y: 320 }}
          onStart={handleStart}
          onStop={handleStop}
          disabled={!isMinimized} // Disable dragging when not minimized
							>
				<div className={`fixed inset-0 overflow-y-auto w-[820px] ${dragging ? 'draggable-cursor' : ''}`}>
					<div className="flex min-h-full items-center justify-center text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-[780px]  transform overflow-hidden rounded-2xl bg-gray-100 text-left absolute  mb-[220px] shadow-xl transition-all">
								{/* <Dialog.Title
									as="div"
									className=" p-4 font-medium leading-6 flex flex-col items-start text-gray-900 bg-slate-50 border-b"
								>
									
								</Dialog.Title> */}
								
								<div>
									<div className="flex flex-row justify-between px-3 border-b-slate-300 border-b bg-slate-300 items-center">
									<h4 className="flex items-center text-base font-bold p-2 mb-0 text-gray-700 border-indigo-100">
										<span>Diagnosis Information</span>
									</h4>
									<FlatIcon className="text-sm items-center mr-28 text-gray-400" icon="fi fi-ss-menu-burger" />
									<div className="flex items-center gap-2">
										
										<button
										className=" text-xs text-gray-400 bg-gray-200 rounded-full px-3"
										onClick={() => setIsMinimized(!isMinimized)}
										>
										{isMinimized ? '▲' : '▼'}
										</button>
										<button className="text-lg mt-1 text-red-500 items-center rounded-full " 
										type="danger" 
										icon="fi fi-sr-circle-xmark"  
										onClick={hide}>
										<FlatIcon className="text-lg" icon="fi fi-sr-circle-xmark" />
										</button>
									</div>
									</div>
									
									<div className="flex flex-col lg:flex-row gap-2 border-x border-indigo-100 p-2">
										<PatientInfo
											patient={showData?.patient}
											appointment={appointment}
										>
											<div className="ml-auto pt-6">

												<ActionBtn
													type="teal"
													// loading={loading}
													size="lg"
													onClick={handleSubmit(
														submit
													)}
													className="px-4 w-[200px] h-10 gap-2"
												>
													<FlatIcon
														className="text-2xl mr-2 "
														icon="fi fi-rr-time-check"
													/>
													<div className="flex flex-col text-left">
														<span className="font-bold -mb-1">
															Diagnose
														</span>
														<span className="text-[10px] font-light max-w-full">
															Patient will be on
															Diagnose
														</span>
													</div>
												</ActionBtn>
											</div>
										</PatientInfo>
									</div>
									
						{!isMinimized && (
							<AppointmentDetails
								forResult={true}
								appointment={showData}
								showService
								serviceComponent={
						<>
							{(appointment?.status ==
								"pending" &&
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
									"pending" &&
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
							
						)}
							
									
								</div>
								
								
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
				</Draggable>
			</Dialog>
		</Transition>
		
	);
};

export default forwardRef(ConsultPatientModal);
