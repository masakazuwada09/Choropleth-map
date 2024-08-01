import React, { Fragment, forwardRef, useImperativeHandle, useState } from 'react'
import { useForm } from 'react-hook-form';
import useNoBugUseEffect from '../../../../../hooks/useNoBugUseEffect';
import Axios from '../../../../../libs/axios';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
import TextInputField from '../../../../inputs/TextInputField';
import TextAreaField from '../../../../inputs/TextAreaField';
import ActionBtn from '../../../../buttons/ActionBtn';

const UploadCompleteBloodCountModal = (props, ref) => {
    const { patient, onSuccess } = props;
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
    const [showData, setShowData] = useState(null);
	const [saving, setSaving] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
    useNoBugUseEffect({
		functions: () => {},
	});
	useImperativeHandle(ref, () => ({
		show: show,
		hide: hide,
	}));

	const show = (data) => {
		console.log("patient", patient?.id);
		console.log("/v1/laboratory/tests/list");
		setShowData(data);
		setModalOpen(true);
	};
	const hide = () => {
		setModalOpen(false);
	};
	const submit = (data) => {
		setSaving(true);

		let formdata = new FormData();

		formdata.append("_method", "PATCH");
		formdata.append("hemoglobin", data?.hemoglobin);
		formdata.append("hematocrit", data?.hematocrit);
		formdata.append("rcbc", data?.rcbc);
		formdata.append("wbc", data?.wbc);
		Axios.post(`v1/clinic/tb-lab-result/${showData?.id}`, formdata)
			.then((res) => {
				reset();
				toast.success("Laboratory result submitted successfully!");
				onSuccess();
				hide();
			})
			.finally(() => {
				setTimeout(() => {
					setSaving(false);
				}, 1000);
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
					<div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur z-[300]" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto !z-[350]">
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
									className=" p-4 font-medium leading-6 flex flex-col items-start text-gray-900 bg-slate-50 border-b"
								>
									<span className="text-xl text-center font-bold  text-blue-900">
										Hematology Examination Result
									</span>
                                    <span className="text-sm text-center font-bold  text-blue-600 mt-2">
										Complete Blood Count - (CBC) Test Result
									</span>
								</Dialog.Title>
								<div className="p-6 flex flex-col gap-y-4 relative">
									<TextInputField
										label="Hemoglobin"
										placeholder="g/L"
										{...register("hemoglobin", {
											required:
												"The hemoglobin is required.",
										})}
										errors={errors?.hemoglobin?.message}
									/>
									<TextInputField
										label="Hematocrit"
										placeholder="L/L"
										{...register("hematocrit", {
											required:
												"The hematocrit is required.",
										})}
										errors={errors?.hematocrit?.message}
									/>
									<TextInputField
										label="RBC Count"
										placeholder="x10¹²/L"
										{...register("rcbc", {
											required: "The rcbc is required.",
										})}
										errors={errors?.rcbc?.message}
									/>
									<TextInputField
										label="WBC Count"
										placeholder="x10⁹/L"
										{...register("wbc", {
											required: "The wbc is required.",
										})}
										errors={errors?.wbc?.message}
									/>
									{/* <TextAreaField
										label="Remarks"
										placeholder=""
                                        rows={3}
										{...register("rcbc", {
											required: "The rcbc is required.",
										})}
										errors={errors?.rcbc?.message}
									/> */}
								</div>

								<div className="px-4 py-4 border-t flex items-center justify-end bg-slate-">
									<ActionBtn
										// size="lg"
										type="success"
										loading={saving}
										className="px-5"
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
  )
}

export default forwardRef(UploadCompleteBloodCountModal)
