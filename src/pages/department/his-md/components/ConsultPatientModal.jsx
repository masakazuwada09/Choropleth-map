/* eslint-disable react/prop-types */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react-refresh/only-export-components */
import { Fragment, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ActionBtn from "../../../../components/buttons/ActionBtn";
import Axios from "../../../../libs/axios";
import PatientInfo from "../../../patients/components/PatientInfo";
import AppointmentDetails from "../../../diagnostic-center/dc-doctor/components/AppointmentDetails";
import FlatIcon from "../../../../components/FlatIcon";
import useDataTable from "../../../../hooks/useDataTable";
import Draggable from "react-draggable";

const ConsultPatientModal = forwardRef((props, ref) => {
	const { appointment, mutateAll, laboratory_test_type, lab_rate, order_id } = props;
	const { data, setFilters } = useDataTable({
		url: props?.patient?.id ? `/v1/doctor/laboratory-order/patient/${props?.patient?.id}` : null,
		defaultFilters: {
			...(order_id ? { order_id: order_id } : {}),
			...(laboratory_test_type ? { laboratory_test_type: laboratory_test_type } : {}),
			...(lab_rate ? { lab_rate: lab_rate } : {}),
			...(appointment?.id > 0 ? { appointment_id: appointment?.id } : {}),
		},
	});

	const [isOpen, setIsOpen] = useState(false);
	const [patientData, setPatientData] = useState(null);
	const { register, handleSubmit, reset } = useForm();
	const [isMinimized, setIsMinimized] = useState(true);
	const [position, setPosition] = useState({ x: 5, y: 0 });
	const [dragging, setDragging] = useState(false);
	const [isButtonDisabled, setButtonDisabled] = useState(true);

	// Make modal methods accessible to parent via ref
	useImperativeHandle(ref, () => ({
		show: (data) => {
			setPatientData(data);
			setIsOpen(true);
		},
		hide: () => setIsOpen(false),
	}));

	// Submit the form
	const submit = (data) => {
		if (!isButtonDisabled) {
			let formData = new FormData();
			formData.append("_method", "PATCH");
			Axios.post(`v1/clinic/doctor-accept-patient/${patientData?.id}`, formData).then(() => {
				reset();
				mutateAll();
				toast.success("Patient accepted successfully!");
				setIsOpen(false); // Close modal after success
			});
		}
	};

	// Handle Draggable stop
	const handleStop = (e, data) => {
		setPosition({ x: data.x, y: data.y });
		setDragging(false);
	};

	const handleStart = () => {
		setDragging(true);
	};

	// Close modal if not dragging
	const handleBackgroundClick = (e) => {
		if (!dragging) setIsOpen(false);
	};

	// Check if all orders have status 'for-result-reading'
	useEffect(() => {
		if (data) {
			const allForResultReading = data.every((order) => order.order_status === "for-result-reading");
			setButtonDisabled(!allForResultReading); // Disable button if not all orders are 'for-result-reading'
		}
	}, [data]);
	const handleMinimizeClick = () => {
        if (isMinimized) {
            // Logic to set the appointment or perform any action
            // You can also toggle the isMinimized state here if you want to open it
            setIsMinimized(false);
        }
    };

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="fixed inset-0 z-10" onClose={() => setIsOpen(false)}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="inset-0 bg-black bg-opacity-75" />
				</Transition.Child>

				<Draggable axis="both" onStart={handleStart} onStop={handleStop} position={position}>
					<div className="fixed inset-0 flex items-center justify-center w-full h-full">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-[680px] transform overflow-hidden rounded-2xl bg-gray-100 text-left shadow-xl transition-all">
								<div>
									<div  className="flex justify-between px-2 border-b bg-slate-300 items-center">
										<h4 className="text-base font-bold p-2 text-gray-700">
											<span>Diagnosis Information</span>
										</h4>
										<div className="flex items-center gap-2">
											<button
												className="text-xs text-gray-400 bg-gray-200 rounded-full px-3"
												onClick={() => setIsMinimized(!isMinimized)}
											>
												{isMinimized ? '▲' : '▼'}
											</button>
											<button className="text-lg text-red-500" onClick={() => setIsOpen(false)}>
												<FlatIcon className="text-lg" icon="fi fi-sr-circle-xmark" />
											</button>
										</div>
									</div>

									<div className="flex flex-col lg:flex-row gap-2 p-2">
									
										<PatientInfo patient={patientData?.patient} appointment={appointment}>
										
											<div className="ml-auto ">
												<div className="flex ">
													<ActionBtn
														type="teal"
														size="lg"
														onClick={isButtonDisabled ? undefined : handleSubmit(submit)}
														className={`p-1 w-[190px] border mb-1  flex   
															${isButtonDisabled ? 'opacity-10 cursor-not-allowed' : ''}`}
														disabled={isButtonDisabled}
													>
														<FlatIcon className="text-2xl mr-2 border-r border-spacing-9" icon="fi fi-rr-time-check" />
														<div className="flex flex-col text-right items-end">
															<span className="font-bold">Diagnose</span>
															<span className="text-[10px] font-light">
																Check if patient has pending
															</span>
														</div>
													</ActionBtn>
												</div>
											</div>
											
										</PatientInfo>
										
									</div>
									{!isMinimized && (		
									<AppointmentDetails patient={patientData?.patient} forResult appointment={appointment} />
								)}
									</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Draggable>
			</Dialog>
		</Transition>
	);
});

export default ConsultPatientModal;
