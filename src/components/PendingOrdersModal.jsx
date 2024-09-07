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
import LaboratoryOrders from "./patient-modules/LaboratoryOrders";
import ActionBtn from "./buttons/ActionBtn";

const PendingOrdersModal = (props, ref) => {
// 	appointment: propAppointment,
// 	forCashier = false,
// 	forBilling = false,
// 	forHousekeeping = false,
// 	setOrder,
// 	hideServices = false,
// 	mutateAll,
// 	data,
// }, ref,
	const {
		register,
		getValues,
		setValue,
		control,
		reset,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm();
	
	const [mount, setMount] = useState(0);
	// const [appointment, setAppointment] = useState(propAppointment);
	const [modalData, setModalData] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	useEffect(() => {
		let t = setTimeout(() => {
			setMount(1);
		}, 400);
		return () => {
			clearTimeout(t);
		};
	}, []);

	useImperativeHandle(ref, () => ({
		show: show,
		hide: hide,
	}));

	const show = (showData = null) => {
		setModalOpen(true);
		if (showData) {
			setModalData(showData);
		}
	};
	const hide = () => {
		setModalOpen(false);
	};
	const nohide = () => {};

	const submit = (data) => {
		let formData = new FormData();
		if (modalData.fn) {
			modalData.fn();
			hide();
		}
	};

	return (
		<Transition appear show={modalOpen} as={Fragment}>
			<Dialog as="div" className="" onClose={hide}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur z-20" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto !z-[1000]">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full lg:max-w-3xl transform overflow-visible rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="div"
									className="py-3 px-4 flex flex-col border-b "
								>
									<span className="text-xl font-bold  text-blue-900">
										Send Patient to Laboratory/Imaging
									</span>
									<span className="text-sm font-light text-blue-900 ">
										List of pending orders...
									</span>
								</Dialog.Title>
								<div className=" pt-5 grid grid-cols-1 gap-5 relative">
									{console.log(
										" ",
										modalData?.data
									)}
									<LaboratoryOrders
										
										showTitle={false}
										patient={modalData?.data?.patient}
										laboratory_test_type={"all"}
										appointment={modalData?.data}
										allowCreate={false}
									/>
								</div>

								<div className="px-4 py-4 flex items-center justify-end bg-slate- border-t">
									<ActionBtn
										type="teal"
										className="ml-4 !px-10 !rounded-xl"
										size="xl"
										onClick={handleSubmit(submit)}
									>
										SEND ORDER
									</ActionBtn>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default forwardRef(PendingOrdersModal);
