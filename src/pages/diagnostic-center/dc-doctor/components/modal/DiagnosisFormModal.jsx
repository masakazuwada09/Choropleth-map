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
import ActionBtn from "../../../../../components/buttons/ActionBtn";
import ReactSelectInputField from "../../../../../components/inputs/ReactSelectInputField";
import Axios from "../../../../../libs/axios";
import TextInputField from "../../../../../components/inputs/TextInputField";

const DiagnosisFormModal = (props, ref) => {
	const { onSuccess, healthUnits = [] } = props;
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
	const [item, setItem] = useState(null);
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
		setTimeout(() => {
			setValue("status", "active");
			if (showData?.id) {
				setValue("updated_at", showData?.updated_at);
				setValue("created_at", showData?.created_at);
				setValue("case_code", showData?.case_code);
				setValue("case_description", showData?.case_description);
				setValue("case_rate", showData?.case_rate);
				setValue("case_type", showData?.case_type);
				setValue("clinic_share", showData?.clinic_share);
				setValue("case_rate_code", showData?.case_rate_code);
				setValue("professional_fee", showData?.professional_fee);
				
			}
		}, 300);

		if (showData?.id) {
			setItem(showData);
		} else {
			setItem(null);
			reset({
				name: "",
				status: "active",
			});
		}
	};
	const hide = () => {
		setModalOpen(false);
	};

	const submit = (data) => {
		let formData = new FormData();

		formData.append("case_code", data?.case_code);
		formData.append("case_description", data?.case_description);
		formData.append("case_rate", data?.case_rate);
		formData.append("case_type", data?.case_type);
        formData.append("clinic_share", data?.clinic_share);
		formData.append("case_rate_code", data?.case_rate_code);
        formData.append("professional_fee", data?.professional_fee);

		let url = `v1/doctor/diagnosis/store`;
		if (item?.id) {
			url = `v1/doctor/diagnosis/store`;
			formData.append("_method", "PATCH");
		}
		Axios.post(url, formData).then((res) => {
			setTimeout(() => {
				if (item?.id) {
					toast.success("Item updated successfully!");
				} else {
					toast.success("Item created successfully!");
				}
				if (onSuccess) {
					onSuccess();
				}
			}, 200);
			reset({
				name: "",
				status: "active",
			});
			hide();
		});
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
							<Dialog.Panel className="w-full lg:max-w-sm transform overflow-visible rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="div"
									className="py-3 px-4 flex flex-col border-b "
								>
									<span className="text-xl font-bold  text-blue-900">
										{item?.id ? "Update " : "Create "}{" "}
										Diagnosis
									</span>
									<span className="text-sm font-light text-blue-900 ">
										Complete form to{" "}
										{item?.id ? "update " : "create new "}{" "}
										laboratory test
									</span>
								</Dialog.Title>
								<div className="px-6 pt-5 pb-7 grid grid-cols-1 gap-5 relative">
								<TextInputField
										label="Code"
										error={errors?.name?.message}
										placeholder="Enter code"
										{...register("case_code", {
											required: {
												value: true,
												message:
													"This field is required",
											},
										})}
									/>
									
								
                                    <TextInputField
										label="Case Description"
										error={errors?.name?.message}
										placeholder="Enter name"
										{...register("case_description", {
											required: {
												value: true,
												message:
													"This field is required",
											},
										})}
									/>

									<TextInputField
										label="Case Type"
										error={errors?.name?.message}
										placeholder="Enter type"
										{...register("case_type", {
											required: {
												value: true,
												message:
													"This field is required",
											},
										})}
									/>
									<TextInputField
										label="Case Rate"
										error={errors?.name?.message}
										placeholder="Enter Rate"
										{...register("case_rate", {
											required: {
												value: true,
												message:
													"This field is required",
											},
										})}
									/>
									<TextInputField
										label="Case Rate Code"
										error={errors?.name?.message}
										placeholder="Enter Rate Code"
										{...register("case_rate_code", {
											required: {
												value: true,
												message:
													"This field is required",
											},
										})}
									/>
                                    <TextInputField
										label="Clinic Share"
										error={errors?.name?.message}
										placeholder="Enter Share"
										{...register("clinic_share", {
											required: {
												value: true,
												message:
													"This field is required",
											},
										})}
									/>
									<TextInputField
										label="Professional Fee"
										error={errors?.name?.message}
										placeholder="Enter Professional Fee"
										{...register("professional_fee", {
											required: {
												value: true,
												message:
													"This field is required",
											},
										})}
									/>
                        
									
								</div>

								<div className="px-4 py-4 flex items-center justify-end bg-slate- border-t">
									<ActionBtn
										type="success"
										className="ml-4"
										onClick={handleSubmit(submit)}
									>
										SUBMIT
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

export default forwardRef(DiagnosisFormModal);
