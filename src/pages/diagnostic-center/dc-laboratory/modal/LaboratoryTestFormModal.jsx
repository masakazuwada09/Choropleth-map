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
import TextInputField from "../../../../components/inputs/TextInputField";
import ReactSelectInputField from "../../../../components/inputs/ReactSelectInputField";
import Axios from "../../../../libs/axios";

const LaboratoryTestFormModal = (props, ref) => {
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
	const [test, setTest] = useState(null);
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
				setValue("name", showData?.name);
				setValue("description", showData?.name);
				setValue("type", showData?.type);
				setValue("lab_rate", showData?.lab_rate);
			}
		}, 300);
		if (showData?.id) {
			setTest(showData);
		} else {
			setTest(null);
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

		formData.append("name", data?.name);
		formData.append("description", data?.description);
		formData.append("lab_rate", data?.lab_rate);
		formData.append("type", data?.type);

		let url = `v1/laboratory/tests/store`;
		if (test?.id) {
			url = `v1/laboratory/tests/update/${test?.id}`;
			formData.append("_method", "PATCH");
		}
		Axios.post(url, formData).then((res) => {
			setTimeout(() => {
				if (test?.id) {
					toast.success("Tests updated successfully!");
				} else {
					toast.success("Tests created successfully!");
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
										{test?.id ? "Update " : "Create "}{" "}
										Laboratory Test
									</span>
									<span className="text-sm font-light text-blue-900 ">
										Complete form to{" "}
										{test?.id ? "update " : "create new "}{" "}
										laboratory test
									</span>
								</Dialog.Title>
								<div className="px-6 pt-5 pb-7 grid grid-cols-1 gap-5 relative">
									<TextInputField
										label="Name"
										error={errors?.name?.message}
										placeholder="Enter name"
										{...register("name", {
											required: {
												value: true,
												message:
													"This field is required",
											},
										})}
									/>
									<TextInputField
										label="Rate"
										error={errors?.name?.message}
										placeholder="Enter Rate"
										{...register("lab_rate", {
											required: {
												value: true,
												message:
													"This field is required",
											},
										})}
									/>
									<TextInputField
										label="Description"
										error={errors?.name?.message}
										placeholder="Enter description"
										{...register("description", {
											required: {
												value: true,
												message:
													"This field is required",
											},
										})}
									/>
									<Controller
										name="type"
										control={control}
										rules={{
											required: {
												value: true,
												message:
													"This field is required",
											},
										}}
										render={({
											field: {
												onChange,
												onBlur,
												value,
												name,
												ref,
											},
											fieldState: {
												invalid,
												isTouched,
												isDirty,
												error,
											},
										}) => (
											<ReactSelectInputField
												isClearable={false}
												label={<>Type</>}
												inputClassName=" "
												ref={ref}
												value={value}
												onChange={onChange}
												onBlur={onBlur} // notify when input is touched
												error={error?.message}
												placeholder="Select laboratory test type"
												options={[
													{
														label: "Laboratory Test",
														value: "laboratory-test",
													},
													{
														label: "Imaging",
														value: "imaging",
													},
												]}
											/>
										)}
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

export default forwardRef(LaboratoryTestFormModal);
