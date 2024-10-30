import React, {
	Fragment,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import LaboratoryOrders from "../../../dc-doctor/components/LaboratoryOrders";
import ActionBtn from "../../../../../components/buttons/ActionBtn";
import Axios from "../../../../../libs/axios";
import useDataTable from "../../../../../hooks/useDataTable";
import LaboratoryOrdersModal from "./LaboratoryOrdersModal";

const PendingOrdersModal = (props, ref) => {
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

	const {
		showTitle = true,
		patient,
		appointment,
		laboratory_test_type,
		allowCreate = true,
		onUploadLabResultSuccess,
		order_id,
	} = props;

	const {
		page,
		setPage,
		meta,
		setMeta,
		loading,
		setLoading,
		paginate,
		setPaginate,
		setData,
		column,
		setColumn,
		direction,
		setDirection,
		filters,
		setFilters,
		reloadData,
	} = useDataTable({
		url: `/v1/doctor/laboratory-order/patient/${patient?.id}`, 
		defaultFilters: {
			...(order_id ? { order_id: order_id } : {}),
			...(laboratory_test_type ? { laboratory_test_type: laboratory_test_type } : {}),
			...(appointment?.id > 0 ? { appointment_id: appointment?.id } : {}),
		},
	});
	const [mount, setMount] = useState(0);
	const [showData, setShowData] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalData, setModalData] = useState(null);
	
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

	const show = (data) => {
		setModalOpen(true);
		if (data) {
			setModalData(data);
			setShowData(data); // Use setShowData to update the state
			console.log("PENDING DATA TO SEND ORDER SERVICE", data); // Log the data only if it's not null
		} else {
			console.warn("No data provided to show function");
		}
	};

	const hide = () => {
		setModalOpen(false);
	};

	const submit = () => {
		let modalDataForm = new FormData();
		if (modalData?.fn) {
			modalData.fn(); // Call the function if it exists
			hide();
		}
	};

	return (
		<Transition appear show={modalOpen} as={Fragment}>
			<Dialog as="div" onClose={hide}>
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
									<span className="text-xl font-bold text-blue-900">
										Send Patient to Laboratory/Imaging
									</span>
									<span className="text-sm font-light text-blue-900">
										List of pending orders...
									</span>
								</Dialog.Title>
								<div className="pt-5 grid grid-cols-1 gap-5 relative">
									{console.log("PENDING DATA TO SEND ORDER SERVICE", modalData)} {/* Log the modalData */}
									<LaboratoryOrdersModal
										showTitle={false}
										patient={patient}
										laboratory_test_type={"all"}
										appointment={modalData?.data}
										allowCreate={false}
									/>
								</div>

								<div className="px-4 py-4 flex items-center justify-end bg-slate- border-t">
									<ActionBtn
										type="secondary"
										className="ml-4 !px-5 !rounded-md"
										size="md"
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