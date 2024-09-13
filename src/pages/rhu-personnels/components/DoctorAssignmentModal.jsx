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
import ActionBtn from "../../../components/buttons/ActionBtn";
import TextInputField from "../../../components/inputs/TextInputField";
import ReactSelectInputField from "../../../components/inputs/ReactSelectInputField";
import Axios from "../../../libs/axios";
import FlatIcon from "../../../components/FlatIcon";

const DoctorAssignmentModal = (props, ref) => {
	const { onSuccess, rhuList } = props;
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
	const [showData, setShowData] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [rooms, setRooms] = useState([]);

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

	const show = (propShowData = null) => {
		setModalOpen(true);
		setTimeout(() => {
			setValue("status", "active");
			let hu_selected = rhuList?.find(
				(x) => x?.id == propShowData?.health_unit_id
			);
			if (showData?.id) {
				setValue("health_unit_id", propShowData?.health_unit_id);
				setRooms(hu_selected?.rooms);
			}
			setTimeout(() => {
				setValue("status", "active");
				if (showData?.id) {
					setValue("room_id", propShowData?.room_id);
				}
			}, 300);
		}, 300);
		if (propShowData?.id) {
			setShowData(propShowData);
		} else {
			setShowData(null);
			reset({
				name: "",
				status: "active",
			});
		}
	};
	const hide = () => {
		setModalOpen(false);
		reset({
			health_unit_id: "",
			room_id: "",
		});
	};
	const nohide = () => {};

	const submit = (data) => {
		let formData = new FormData();

		formData.append("health_unit_id", data?.health_unit_id);
		formData.append("room_id", data?.room_id);
		let url = `v1/health-unit-personnels/assignment/${showData?.id}`;
		formData.append("_method", "PATCH");
		Axios.post(url, formData).then((res) => {
			setTimeout(() => {
				toast.success("Doctor assignement updated!");
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
										{String(showData?.type || "")
											.toLowerCase()
											.includes("doctor")
											? "Doctor"
											: "Personnel"}{" "}
										Assignment
									</span>
									<span className="text-sm font-light text-blue-900 ">
										Select RHU{" "}
										{String(showData?.type || "")
											.toLowerCase()
											.includes("doctor")
											? "and Room"
											: ""}{" "}
										assignment
									</span>
								</Dialog.Title>
								<div className="px-6 pt-5 pb-7 grid grid-cols-1 gap-5 relative">
									<div
										className={`flex flex-col py-4 ${
											String(showData?.type || "")
												.toLowerCase()
												.includes("doctor")
												? "bg-yellow-100"
												: "bg-blue-50"
										}`}
									>
										<h4 className="text-lg text-center  font-bold text-black -mb-1">
											{`${showData?.title} ${showData?.name}`}
										</h4>

										<span className=" text-center font-light text-sm text-slate-700">
											{String(showData?.type || "")
												.toLowerCase()
												.includes("doctor")
												? showData?.specialty?.name
														?.length
													? showData?.specialty?.name
													: "General Practitioner"
												: showData?.type}
										</span>
									</div>
									
									<Controller
										name="health_unit_id"
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
												label={<>Select RHU</>}
												onChangeGetData={(data) => {
													setRooms(data?.rooms);
												}}
												inputClassName=" "
												ref={ref}
												value={value}
												onChange={onChange}
												onData
												onBlur={onBlur} // notify when input is touched
												error={error?.message}
												placeholder="Assign to RHU"
												options={rhuList?.map(
													(unit) => ({
														label: unit?.name,
														value: unit?.id,
														rooms: unit?.rooms,
													})
												)}
											/>
										)}
									/>


									{String(showData?.type || "")
										.toLowerCase()
										.includes("doctor") ? (
										<Controller
											name="room_id"
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
													label={<>Select Room</>}
													inputClassName=" "
													ref={ref}
													value={value}
													onChange={onChange}
													onData
													onBlur={onBlur} // notify when input is touched
													error={error?.message}
													placeholder="Select Room"
													options={rooms?.map(
														(room) => ({
															label: (
																<>
																	<b>
																		{
																			room?.name
																		}
																	</b>
																</>
															),
															value: room?.id,
															description: (
																<span className="flex items-center gap-2">
																	<span>
																		Capacity:{" "}
																		<b>
																			{
																				room?.capacity
																			}
																		</b>
																	</span>
																</span>
															),
														})
													)}
												/>
											)}
										/>
									) : (
										""
									)}
								</div>

								<div className="px-4 py-4 flex items-center justify-end bg-slate- border-t">
									<ActionBtn
										type="success"
										className="ml-4"
										onClick={handleSubmit(submit)}
									>
										<FlatIcon icon="rr-disk" />
										SAVE
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

export default forwardRef(DoctorAssignmentModal);
