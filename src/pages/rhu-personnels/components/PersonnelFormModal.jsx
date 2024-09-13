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
import { geolocations, locations } from "../../../libs/geolocations";
import ImagePicker from "../../../components/inputs/ImagePicker";
import Img from "../../../components/Img";
import { dataURItoBlob } from "../../../libs/helpers";

const regionsOptions = Object.values(geolocations).map((loc) => ({
	value: loc?.region_name,
	label: loc?.region_name,
	province_list: loc?.province_list,
}));

const PersonnelFormModal = (props, ref) => {
	const { onSuccess, specialties } = props;
	const {
		register,
		getValues,
		setValue,
		control,
		reset,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			username: "",
			email: "",
			password: "",
			street: "",
			region: "",
			province: "",
			municipality: "",
			barangay: "",
			purok: "",
			type: "",
			name: "",
			title: "",
			gender: "",
			contact_number: "",
			status: "",
			specialty_id: "",
		},
	});
	const [mount, setMount] = useState(0);
	const [personnel, setPersonnel] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [image, setImage] = useState(null);

	const [provinceList, setProvinceList] = useState([]);
	const [municipalityList, setMunicipalityList] = useState([]);
	const [brgys, setBrgys] = useState([]);
	const [puroks, setPuroks] = useState([]);

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

				setValue("username", showData?.username);
				setValue("email", showData?.email);
				setValue("street", showData?.street);
				setValue("region", showData?.region);
				
				setTimeout(() => {
					let selectedRegion = regionsOptions.find(
						(x) => x?.value == showData?.region
					);
					setProvinceList(
						Object.keys(selectedRegion?.province_list).map(
							(key) => {
								return {
									name: key,
									...selectedRegion?.province_list[key],
								};
							}
						)
					);
					let regionProvinceList = Object.keys(
						selectedRegion?.province_list
					).map((key) => {
						return {
							name: key,
							...selectedRegion?.province_list[key],
						};
					});
					console.log("regionProvinceList", regionProvinceList);
					setTimeout(() => {
						console.log("regionProvinceList", regionProvinceList);
						setValue("province", showData?.province);
						let selectedProvince = regionProvinceList.find(
							(x) => x?.name == showData?.province
						);
						console.log(
							"regionProvinceList selectedProvince",
							selectedProvince
						);
						let mun_list = Object.keys(
							selectedProvince?.municipality_list
						).map((key) => {
							return {
								name: key,
								...selectedProvince?.municipality_list[key],
							};
						});
						setMunicipalityList(mun_list);
						let selectedMunicipality = mun_list.find(
							(x) => x?.name == showData?.municipality
						);

						console.log(
							"regionProvinceList selectedMunicipality",
							selectedMunicipality
						);
						let brgs_list =
							selectedMunicipality?.barangay_list?.map((key) => ({
								value: key,
								label: key,
								name: key,
							}));
						setValue("municipality", showData?.municipality);
						setBrgys(brgs_list);
						setValue("barangay", showData?.barangay);
					}, 200);
				}, 200);


				setValue("purok", showData?.purok);
				setValue("type", showData?.type);
				setValue("specialty_id", showData?.specialty_id);
				setValue("name", showData?.name);
				setValue("title", showData?.title);
				setValue("gender", showData?.gender);
				setValue("contact_number", showData?.contact_number);
				setValue("status", showData?.status);
				
			}
		}, 300);
		if (showData?.id) {
			setPersonnel(showData);
		} else {
			setPersonnel(null);
			reset({
				name: "",
				status: "active",
			});
		}
	};


	const hide = () => {
		setModalOpen(false);
	};
	const nohide = () => {};

	const submit = (data) => {
		console.log("submitsubmitsubmit", data);
		let formData = new FormData();
		let config = {
			headers: {
				"content-type": "multipart/form-data",
			},
		};
		formData.append("username", data?.username);
		formData.append("email", data?.email);
		if (data?.password) formData.append("password", data?.password);
		formData.append("street", data?.street);
		formData.append("region", data?.region);
		formData.append("province", data?.province);
		formData.append("municipality", data?.municipality);
		formData.append("barangay", data?.barangay);
		formData.append("purok", data?.purok);
		formData.append("type", data?.type);
		formData.append("name", data?.name);
		formData.append("title", data?.title);
		formData.append("gender", data?.gender);
		formData.append("contact_number", data?.contact_number);
		formData.append("status", data?.status);
		formData.append("specialty_id", data?.specialty_id);

		if (image) {
			formData.append("avatar", dataURItoBlob(image));
		}
		let url = `v1/health-unit-personnels/store`;
		if (personnel?.id) {
			url = `v1/health-unit-personnels/update/${personnel?.id}`;
			formData.append("_method", "PATCH");
		}
		// return;
		Axios.post(url, formData, config).then((res) => {
			setTimeout(() => {
				if (personnel?.id) {
					toast.success("Personnel updated successfully!");
				} else {
					toast.success("Personnel created successfully!");
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
							<Dialog.Panel className="w-full lg:max-w-2xl transform overflow-visible rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="div"
									className="py-3 px-4 flex flex-col border-b "
								>
									<span className="text-xl font-bold  text-blue-900">
										{personnel?.id
											? "Update "
											: "Create New "}{" "}
										Personnel
									</span>
									<span className="text-sm font-light text-blue-900 ">
										Complete form to{" "}
										{personnel?.id
											? "update "
											: "create new "}{" "}
										specialty
									</span>
								</Dialog.Title>
								<div className="px-6 pt-5 pb-7 grid grid-cols-1 lg:grid-cols-2 gap-5 relative">
									<div className="lg:col-span-2">
										<h6 className="text-blue-700 text-sm font-bold mt- pb-2 border-b">
											User Personal Information and
											Credentials{" "}
										</h6>
									</div>
									<div className="lg:col-span-2 flex items-center justify-center">
										<ImagePicker
											defaultImg={image}
											onChange={(src) => {
												setImage(src);
											}}
										>
											{({ imagePreview }) => {
												return (
													<div className="rounded-lg overflow-hidden h-[188px] w-[188px] bg-slate-200 flex items-center justify-center">
														<Img
															className={`w-[188px] h-[188px] object-contain p-4`}
															src={imagePreview}
															type={"user"}
															name={
																watch("name") ||
																"U"
															}
														/>
													</div>
												);
											}}
										</ImagePicker>
									</div>
									<TextInputField
										label="Name"
										error={errors?.name?.message}
										placeholder="Enter personnel name"
										{...register("name", {
											required: {
												value: true,
												message:
													"This field is required",
											},
										})}
									/>
									<TextInputField
										label="Title"
										error={errors?.title?.message}
										placeholder="Enter personnel title"
										{...register("title", {})}
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
												label={<>User Type</>}
												inputClassName=" "
												ref={ref}
												value={value}
												onChange={onChange}
												onBlur={onBlur} // notify when input is touched
												error={error?.message}
												placeholder="Select User Type"
												options={[
													{
														label: "RHU Doctor",
														value: "RHU-DOCTOR",
													},
													{
														label: "RHU Nurse",
														value: "RHU-NURSE",
													},
													{
														label: "RHU Laboratory",
														value: "RHU-LABO",
													},
													{
														label: "RHU Imaging",
														value: "RHU-XRAY",
													},
													{
														label: "RHU Pharmacist",
														value: "RHU-PHARMACY",
													},
													{
														label: "RHU Cashier",
														value: "RHU-CASHIER",
													},
												]}
											/>
										)}
									/>

									{watch("type") == "RHU-DOCTOR" ? (
										<Controller
											name="specialty_id"
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
													label={
														<>Doctor Specialty</>
													}
													inputClassName=" "
													ref={ref}
													value={value}
													onChange={onChange}
													onBlur={onBlur} // notify when input is touched
													error={error?.message}
													placeholder="Select Doctor Specialty"
													options={specialties?.map(
														(specialty) => ({
															label: specialty?.name,
															value: specialty?.id,
														})
													)}
												/>
											)}
										/>
									) : (
										""
									)}


									<TextInputField
										label="Username"
										error={errors?.username?.message}
										placeholder="Enter username"
										{...register("username", {
											required: {
												value: true,
												message:
													"This field is required",
											},
										})}
									/>


									<TextInputField
										label="Email"
										type="email"
										error={errors?.email?.message}
										placeholder="Enter email"
										{...register("email", {
											required: {
												value: true,
												message:
													"This field is required",
											},
										})}
									/>

									<Controller
										name="gender"
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
												label={<>Gender</>}
												inputClassName=" "
												ref={ref}
												value={value}
												onChange={onChange}
												onBlur={onBlur} // notify when input is touched
												error={error?.message}
												placeholder="Select Gender"
												options={[
													{
														label: "Male",
														value: "male",
													},
													{
														label: "Female",
														value: "female",
													},
												]}
											/>
										)}
									/>
									<TextInputField
										type="password"
										label="Password"
										error={errors?.password?.message}
										placeholder="Enter personnel password"
										{...register("password", {
											required: {
												value: personnel?.id
													? false
													: true,
												message:
													"This field is required",
											},
										})}
									/>
									<TextInputField
										type="password"
										label="Confirm Password"
										error={
											errors?.password_confirmation
												?.message
										}
										placeholder="Enter confirm password"
										{...register("password_confirmation", {
											required: {
												value:
													watch("password")?.length >
													0
														? true
														: false,
												message:
													"This field is required",
											},
											validate: (val) => {
												if (watch("password") != val) {
													return "Passwords does not match";
												}
											},
										})}
									/>
									<Controller
										name="status"
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
												label={<>Status</>}
												inputClassName=" "
												ref={ref}
												value={value}
												onChange={onChange}
												onBlur={onBlur} // notify when input is touched
												error={error?.message}
												placeholder="Select Status"
												options={[
													{
														label: "Active",
														value: 1,
													},
													{
														label: "Inactive",
														value: 0,
													},
												]}
											/>
										)}
									/>
									<div className="lg:col-span-2">
										<h6 className="text-blue-700 text-sm font-bold mt-4 pb-2 border-b">
											User Address Information{" "}
										</h6>
									</div>
									<div className="">
										<Controller
											name="region"
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
													label={
														<>
															Select Region
															<span className="text-danger ml-1">
																*
															</span>
														</>
													}
													inputClassName=" "
													ref={ref}
													value={value}
													onChange={onChange}
													onChangeGetData={(data) => {
														setProvinceList(
															Object.keys(
																data.province_list
															).map((key) => {
																return {
																	name: key,
																	...data
																		.province_list[
																		key
																	],
																};
															})
														);
													}} // send value to hook form
													onBlur={onBlur} // notify when input is touched
													error={error?.message}
													placeholder="Select Province"
													options={regionsOptions}
												/>
											)}
										/>
									</div>
									<div className="">
										<Controller
											name="province"
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
													label={
														<>
															Select Province
															<span className="text-danger ml-1">
																*
															</span>
														</>
													}
													inputClassName=" "
													ref={ref}
													value={value}
													onChange={onChange} // send value to hook form
													onChangeGetData={(data) => {
														setMunicipalityList(
															Object.keys(
																data.municipality_list
															).map((key) => {
																return {
																	name: key,
																	...data
																		.municipality_list[
																		key
																	],
																};
															})
														);
													}}
													onBlur={onBlur} // notify when input is touched
													error={error?.message}
													placeholder="Select Province"
													options={provinceList.map(
														(province) => ({
															label: province?.name,
															value: province?.name,
															municipality_list:
																province?.municipality_list,
														})
													)}
												/>
											)}
										/>
									</div>
									<div className="">
										<Controller
											name="municipality"
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
													label={
														<>
															Select Municipality
															<span className="text-danger ml-1">
																*
															</span>
														</>
													}
													placeholder="Select Municipality"
													inputClassName="normal-case"
													ref={ref}
													value={value}
													onChange={(data) => {
														onChange(data);
													}} // send value to hook form
													onChangeGetData={(data) => {
														setBrgys(
															data.barangay_list.map(
																(key) => {
																	return {
																		name: key,
																	};
																}
															)
														);
													}}
													onBlur={onBlur} // notify when input is touched
													error={error?.message}
													options={municipalityList.map(
														(municipality) => ({
															label: municipality?.name,
															value: municipality?.name,
															barangay_list:
																municipality?.barangay_list,
														})
													)}
												/>
											)}
										/>
									</div>
									<div className="">
										<Controller
											name="barangay"
											control={control}
											rules={{
												required: {
													value: true,
													message:
														"This field is required",
												},
											}}
											onChange={(data) => {}}
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
													label={
														<>
															Select Barangay
															<span className="text-danger ml-1">
																*
															</span>
														</>
													}
													inputClassName=" "
													ref={ref}
													value={value}
													onChange={(data) => {
														let selected_ =
															brgys?.find(
																(x) =>
																	x.name ==
																	data
															);
														setPuroks(
															selected_?.puroks
														);
														onChange(data);
													}} // send value to hook form
													onBlur={onBlur} // notify when input is touched
													error={error?.message}
													placeholder="Select Barangay"
													options={brgys.map(
														(data) => ({
															label: data?.name,
															value: data?.name,
														})
													)}
												/>
											)}
										/>
									</div>

									<TextInputField
										label={<>Purok</>}
										placeholder="Enter Purok"
										className=""
										error={errors?.zip_code?.message}
										{...register("purok", {
											required: "This field is required",
										})}
									/>
									<TextInputField
										label={<>Street</>}
										placeholder="Enter street"
										className=""
										error={errors?.street?.message}
										{...register("street", {
											required: "This field is required",
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

export default forwardRef(PersonnelFormModal);
