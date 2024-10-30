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
import ActionBtn from "../buttons/ActionBtn";
import FlatIcon from "../FlatIcon";
import useClinic from "../../hooks/useClinic";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Img from "../Img";

import image4 from "../../assets/images/img4.jpg";
import image5 from "../../assets/images/img5.jpg";
import image6 from "../../assets/images/img6.jpg";
import image7 from "../../assets/images/img7.jpg";
import PromotionCarousels from "../carousels/PromotionCarousels";
import PromotionCard from "../cards/promotions/PromotionCard";
const PromotionsModal = (props, ref) => {
	const { logout } = props;
	const {
		register,
		getValues,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [mount, setMount] = useState(0);
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

	const show = (data) => {
		setModalOpen(true);
	};
	const hide = () => {
		setModalOpen(false);
	};

	const submit = (data) => {
		// let formData = new FormData();
		// formData.append("doctor_id", data?.doctor_id);
		// formData.append("patient_id", patient?.id);
		// formData.append("date", data?.date);
		// formData.append("slot_id", data?.slot_id);
		// formData.append("notes", data?.notes);
		// Axios.post(`v1/telemedicine/booked`, formData).then((res) => {
		// 	toast.success("New appointment created successfully!");
		// });
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
					<div className="fixed inset-0  z-20" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto !z-[100]">
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
							<Dialog.Panel className="w-full lg:max-w-xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="div"
									className=" p-4 font-medium leading-6 flex items-center text-gray-900 bg-slate-100 border-b"
								>
									<span className="text-md font-montserrat text-blue-600">
										Global Telemedicine Corp.
									</span>
								</Dialog.Title>
								<div className="pb-4 flex flex-col gap-y-4 text-center relative max-h-[80dvh] lg:max-h-[unset] overflow-auto">
									
									<div className="flex flex-col gap-3 px-4">
										<PromotionCard
											src={image4}
											title="Health"
											content="COVID Vaccines Compared"
										/>
										<PromotionCard
											src={image5}
											title="Health"
											content="Humans Harness AI To Speed Drug Development"
										/>
										<PromotionCard
											src={image6}
											title="Health"
											content="How a racing heart may alter decision-making brain circuits
                                            "
										/>
										<PromotionCard
											src={image7}
											title="Health"
											content="Get Your Blood Checked"
										/>
									</div>
								</div>

								<div className="px-4 py-2 flex items-center justify-end bg-slate-100 border-t">
									<ActionBtn
										type="foreground-dark"
										className="ml-auto uppercase"
										onClick={hide}
									>
										Read more...
									</ActionBtn>
									<ActionBtn
										// type="danger"
										className="ml-4"
										onClick={hide}
									>
										OK
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

export default forwardRef(PromotionsModal);
