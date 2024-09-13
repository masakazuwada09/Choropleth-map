
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
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CollapseDiv from "../CollapseDiv";
import TextInputField from "../inputs/TextInputField";
import ReactSelectInputField from "../inputs/ReactSelectInputField";

import { v4 as uuidv4 } from "uuid";
import {
	relationshipOptions,
	civilStatusOptions,
	indirectOptions,
	directOptions,
} from "../../libs/patientFormOptions";
import { geolocations, locations } from "../../libs/geolocations";
import RadioInput from "../inputs/RadioInput";
import { dataURItoBlob, formatDateYYYYMMDD } from "../../libs/helpers";
import Axios from "../../libs/axios";
import PickMapLocation from "../PickMapLocation";
import Patients from "../../pages/patients/Patients";

const NewPatientFormModal = (props, ref) => {
	const { logout, patientSelfie, noRedirect, onSuccess, patient } = props;
	const {
		register,
		getValues,
		setValue,
		watch,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [modalOpen, setModalOpen] = useState(false);
	const [mount, setMount] = useState(0);
	const [displayDelayed, setDisplayDelayed] = useState(false);
	const [loading, setLoading] = useState(false);
	const [provinceList, setProvinceList] = useState([]);
	const [municipalityList, setMunicipalityList] = useState([]);
	const [brgys, setBrgys] = useState([]);
	const [puroks, setPuroks] = useState([]);

	const [position, setPosition] = useState({
		lat: 6.0498006,
		lng: 125.15,
	});

	const [dependents, setDependents] = useState([
		{
			id: uuidv4(),
			lastname: "",
			firstname: "",
			middle_name: "",
			suffix: "",
			relationship: "",
		},
	]);
	const updateItem = (id, field, value) => {
		setDependents((prevData) => {
			return prevData.map((data) => {
				let dep = data;
				if (data?.id == id) {
					dep[field] = value;
					return dep;
				}
				return data;
			});
		});
	};
	const removeItem = (id) => {
		setDependents((prevData) => prevData.filter((x) => x.id !== id));
	};

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
		setTimeout(() => {
			setDisplayDelayed(true);
		}, 1000);
		setModalOpen(true);
	};
	const hide = () => {
		setModalOpen(false);
	};

	const submitForm = (data) => {
		setLoading(true);
		console.log("submitform", dependents, data);
		let formdata = new FormData();
		// const file = dataURItoBlob(patientSelfie);
		// formdata.append("avatar", file);
		formdata.append("prefix", data?.prefix || " ");
		formdata.append("suffix", data?.suffix || " ");
		formdata.append("firstname", data?.firstname || " ");
		formdata.append("lastname", data?.lastname || " ");
		formdata.append("middlename", data?.middlename || " ");
		formdata.append("gender", data?.gender || " ");
		formdata.append(
			"birthdate",
			// data?.birthday
			formatDateYYYYMMDD(new Date(data?.birthdate))
		);
		formdata.append("birthplace", data?.birthplace || " ");
		formdata.append("barangay", data?.barangay || " ");
		formdata.append("city", data?.municipality || " ");
		formdata.append("civil_status", data?.civil_status || " ");
		formdata.append("philhealth", data?.philhealth || " ");
		formdata.append("religion", data?.religion || " ");
		formdata.append("mother_firstname", data?.mother_firstname || " ");
		formdata.append("mother_lastname", data?.mother_lastname || " ");
		formdata.append("mother_middlename", data?.mother_middlename || " ");
		formdata.append("country", "PH");
		// formdata.append("region", "SOCSKSARGEN Region");
		formdata.append("province", data?.province || " ");
		formdata.append("municipality", data?.municipality || " ");
		formdata.append("zip_code", data?.zip_code || "");
		formdata.append("street", data?.street || " ");
		formdata.append("floor", data?.floor || " ");
		formdata.append("subdivision", data?.subdivision || " ");
		formdata.append("house_number", data?.house_number || " ");
		formdata.append("purok", data?.purok || " ");
		formdata.append("mobile", data?.mobile || " ");
		formdata.append("lat", data?.lat || " ");
		formdata.append("lng", data?.lng || " ");
		formdata.append("tin", data?.tin || " ");
		formdata.append("region", data?.region || " ");
		formdata.append("unit", data?.unit || " ");
		formdata.append("profession", data?.profession || " ");
		formdata.append("salary", data?.salary || " ");
		formdata.append("direct_contributor", data?.direct_contributor || " ");
		formdata.append(
			"indirect_contributor",
			data?.indirect_contributor || " "
		);

		dependents.map((dependent, index) => {
			// if (dependent?.firstname?.length > 0) {
			formdata.append(
				`patientDependents[${index}][firstname]`,
				dependent?.firstname || " "
			);
			formdata.append(
				`patientDependents[${index}][lastname]`,
				dependent?.lastname || " "
			);

			formdata.append(
				`patientDependents[${index}][middle_name]`,
				dependent?.middle_name || " "
			);
			formdata.append(
				`patientDependents[${index}][suffix]`,
				dependent?.suffix || " "
			);
			formdata.append(
				`patientDependents[${index}][relationship]`,
				dependent?.relationship || " "
			);
			// formdata.append(`patientDependents[]`, JSON.stringify(dependent));
			// formdata.append(`patientDependents[${index}]`, dependent);
			// }
		});
		
		Axios.post(`v1/pho/patients`, formdata, {})
			.then((res) => {
				// return resolve(res.data);
				setTimeout(() => {
					toast.success("Patient added successfully!");
					hide();
				}, 400);
				if (!noRedirect) {
					history.push(
						`/sph/app/bhs/patients/${res?.data?.data?.id}?new_appointment=true`
					);
				}
				if (onSuccess) {
					onSuccess();
				}

				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				if (err?.response?.data?.message === "The birthdate must be a date before today.") {
					toast.error("The birthdate must be a date before today.");
				  }
				setLoading(false);
				// return reject(err);
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
							<Dialog.Panel className="w-full lg:max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
								<div className="flex flex-col gap-y-4 relative">
									<div className="flex flex-col p-4 border-b">
										<span className="text-xl font-bold  text-blue-900">
										{Patients?.id
											? "Update "
											: "Create New "}{" "}
											patient form
										</span>
										<span className="text-sm font-light text-blue-900 ">
											Complete form to create new patient
										</span>
									</div>
									<div className="px-4 pb-4">
										<div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
											<div className="col-span-12 flex items-center justify-center">
												<div className="bg-slate-200 rounded relative w-1/3 aspect-square overflow-hidden">
													<img
														src={patientSelfie}
														alt=""
														className="absolute top-0 left-0 w-full h-full"
													/>
												</div>
											</div>
											<div className="flex flex-col lg:col-span-12 gap-6">
												<CollapseDiv
													defaultOpen={true}
													title="I. PERSONAL DETAILS"
												>
													<div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
														<TextInputField
															label={
																<>
																	Members Pin
																	<span className="text-danger ml-1">
																		*
																	</span>
																</>
															}
															placeholder="Members Pin"
															className="lg:col-span-6"
															error={
																errors
																	?.philhealth
																	?.message
															}
															{...register(
																"philhealth",
																{
																	required:
																		"This field is required",
																}
															)}
														/>
														<TextInputField
															label={
																<>
																	TIN
																	<span className="text-danger ml-1">
																		*
																	</span>
																</>
															}
															placeholder="TIN"
															className="lg:col-span-6"
															error={
																errors?.tin
																	?.message
															}
															{...register(
																"tin",
																{
																	required:
																		"This field is required",
																}
															)}
														/>
														<TextInputField
															label={
																<>
																	Lastname
																	<span className="text-danger ml-1">
																		*
																	</span>
																</>
															}
															placeholder="Lastname"
															className="lg:col-span-4"
															error={
																errors?.lastname
																	?.message
															}
															{...register(
																"lastname",
																{
																	required:
																		"This field is required",
																}
															)}
														/>
														<TextInputField
															label={
																<>
																	Firstname
																	<span className="text-danger ml-1">
																		*
																	</span>
																</>
															}
															placeholder="Firstname"
															className="lg:col-span-4"
														
															error={
																errors
																	?.firstname
																	?.message
															}
															{...register(
																"firstname",
																{
																	required:
																		"This field is required",
																}
															)}
														/>
														<TextInputField
															label="Middle Initial"
															placeholder="M.I."
															className="lg:col-span-2"
															{...register(
																"middlename",
																{
																	required: false,
																}
															)}
														/>
														<TextInputField
															label="Suffix"
															placeholder="Suffix"
															className="lg:col-span-2"
															{...register(
																"suffix",
																{
																	required: false,
																}
															)}
														/>

														<TextInputField
															label={
																<>
																	Place of
																	birth
																	<span className="text-danger ml-1">
																		*
																	</span>
																</>
															}
															placeholder="Place of birth"
															className="lg:col-span-6"
															error={
																errors
																	?.birthplace
																	?.message
															}
															{...register(
																"birthplace",
																{
																	required:
																		"This field is required",
																}
															)}
														/>
														<TextInputField
															label={
																<>
																	Birthdate
																	<span className="text-danger ml-1">
																		*
																	</span>
																</>
															}
															placeholder="Birthdate"
															className="lg:col-span-6"
															type="date"
															error={
																errors
																	?.birthdate
																	?.message
															}
															{...register(
																"birthdate",
																{
																	required:
																		"This field is required",
																}
															)}
														/>
														<div className="lg:col-span-4">
															<RadioInput
																error={
																	errors?.gender
																}
																label="Gender"
															>
																{[
																	{
																		label: "Male",
																		value: "Male",
																	},
																	{
																		label: "Female",
																		value: "Female",
																	},
																]?.map(
																	(
																		option,
																		indx
																	) => {
																		return (
																			<label
																				className="flex items-center gap-1 font-light text-sm"
																				key={`rdio-${option?.value}`}
																			>
																				<input
																					type="radio"
																					value={
																						option?.value
																					}
																					id={`irdio-${option?.value}`}
																					{...register(
																						"gender",
																						{
																							required:
																								{
																									value: true,
																									message:
																										"This field is required.",
																								},
																						}
																					)}
																				/>
																				{
																					option?.label
																				}
																			</label>
																		);
																	}
																)}
															</RadioInput>
														</div>
														<div className="lg:col-span-8">
															<RadioInput
																label="Civil Status"
																error={
																	errors
																		?.civil_status
																		?.message
																}
															>
																{civilStatusOptions?.map(
																	(
																		option,
																		indx
																	) => {
																		return (
																			<label
																				className="flex items-center gap-1 font-light text-sm"
																				key={`rdio-${option?.value}`}
																			>
																				<input
																					type="radio"
																					value={
																						option?.value
																					}
																					id={`irdio-${option?.value}`}
																					{...register(
																						"civil_status",
																						{
																							required:
																								{
																									value: true,
																									message:
																										"This field is required.",
																								},
																						}
																					)}
																				/>
																				{
																					option?.label
																				}
																			</label>
																		);
																	}
																)}
															</RadioInput>
														</div>
														<div className="grid grid-cols-1 border p-2 rounded-md bg-slate-50 lg:grid-cols-12 gap-2 col-span-12">
															<div className="col-span-12 text-md font-bold -mb-2 text-black">
																MOTHER'S MAIDEN
																NAME
															</div>
															<TextInputField
																inputClassName="bg-white"
																label={
																	<>
																		Lastname
																		<span className="text-danger ml-1">
																			*
																		</span>
																	</>
																}
																placeholder="Lastname"
																className="lg:col-span-4"
																error={
																	errors
																		?.mother_lastname
																		?.message
																}
																{...register(
																	"mother_lastname",
																	{
																		required:
																			"This field is required",
																	}
																)}
															/>
															<TextInputField
																inputClassName="bg-white"
																label={
																	<>
																		Firstname
																		<span className="text-danger ml-1">
																			*
																		</span>
																	</>
																}
																placeholder="Firstname"
																className="lg:col-span-4"
																error={
																	errors
																		?.mother_firstname
																		?.message
																}
																{...register(
																	"mother_firstname",
																	{
																		required:
																			"This field is required",
																	}
																)}
															/>
															<TextInputField
																inputClassName="bg-white"
																label="Middlename"
																placeholder="Middlename"
																className="lg:col-span-4"
																{...register(
																	"mother_middlename",
																	{
																		required: false,
																	}
																)}
															/>
														</div>
													</div>
												</CollapseDiv>
												<CollapseDiv
													defaultOpen={true}
													title="II. ADDRESS and CONTACT DETAIlS"
												>
													<div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
														<div className="lg:col-span-12">
															{displayDelayed ? (
																<PickMapLocation
																	position={
																		position
																	}
																	setPosition={(
																		pos
																	) => {
																		setPosition(
																			{
																				lat: pos.lat,
																				lng: pos.lng,
																			}
																		);
																		setValue(
																			"lat",
																			pos?.lat
																		);
																		setValue(
																			"lng",
																			pos?.lng
																		);
																	}}
																/>
															) : (
																""
															)}
														</div>
														<TextInputField
															label={
																<>
																	Latitude
																	<span className="text-danger ml-1">
																		*
																	</span>
																</>
															}
															placeholder="Latitude"
															className="lg:col-span-6"
															error={
																errors?.latitude
																	?.message
															}
															{...register(
																"lat",
																{
																	required:
																		"This field is required",
																}
															)}
														/>
														<TextInputField
															label={
																<>
																	Longitude
																	<span className="text-danger ml-1">
																		*
																	</span>
																</>
															}
															placeholder="Longitude"
															className="lg:col-span-6"
															error={
																errors
																	?.longitude
																	?.message
															}
															{...register(
																"lng",
																{
																	required:
																		"This field is required",
																}
															)}
														/>

														<div className="lg:col-span-4">
															<Controller
																name="region"
																control={
																	control
																}
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
																	fieldState:
																		{
																			invalid,
																			isTouched,
																			isDirty,
																			error,
																		},
																}) => (
																	<ReactSelectInputField
																		isClearable={
																			false
																		}
																		label={
																			<>
																				Select
																				Region
																				<span className="text-danger ml-1">
																					*
																				</span>
																			</>
																		}
																		inputClassName=" "
																		ref={
																			ref
																		}
																		value={
																			value
																		}
																		onChange={
																			onChange
																		}
																		onChangeGetData={(
																			data
																		) => {
																			setProvinceList(
																				Object.keys(
																					data.province_list
																				).map(
																					(
																						key
																					) => {
																						return {
																							name: key,
																							...data
																								.province_list[
																								key
																							],
																						};
																					}
																				)
																			);
																		}} // send value to hook form
																		onBlur={
																			onBlur
																		} // notify when input is touched
																		error={
																			error?.message
																		}
																		placeholder="Select Province"
																		options={Object.values(
																			geolocations
																		).map(
																			(
																				loc
																			) => ({
																				value: loc?.region_name,
																				label: loc?.region_name,
																				province_list:
																					loc?.province_list,
																			})
																		)}
																	/>
																)}
															/>
														</div>
														<div className="lg:col-span-4">
															<Controller
																name="province"
																control={
																	control
																}
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
																	fieldState:
																		{
																			invalid,
																			isTouched,
																			isDirty,
																			error,
																		},
																}) => (
																	<ReactSelectInputField
																		isClearable={
																			false
																		}
																		label={
																			<>
																				Select
																				Province
																				<span className="text-danger ml-1">
																					*
																				</span>
																			</>
																		}
																		inputClassName=" "
																		ref={
																			ref
																		}
																		value={
																			value
																		}
																		onChange={
																			onChange
																		} // send value to hook form
																		onChangeGetData={(
																			data
																		) => {
																			setMunicipalityList(
																				Object.keys(
																					data.municipality_list
																				).map(
																					(
																						key
																					) => {
																						return {
																							name: key,
																							...data
																								.municipality_list[
																								key
																							],
																						};
																					}
																				)
																			);
																		}}
																		onBlur={
																			onBlur
																		} // notify when input is touched
																		error={
																			error?.message
																		}
																		placeholder="Select Province"
																		options={provinceList.map(
																			(
																				province
																			) => ({
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
														<div className="lg:col-span-4">
															<Controller
																name="municipality"
																control={
																	control
																}
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
																	fieldState:
																		{
																			invalid,
																			isTouched,
																			isDirty,
																			error,
																		},
																}) => (
																	<ReactSelectInputField
																		isClearable={
																			false
																		}
																		label={
																			<>
																				Select
																				Municipality
																				<span className="text-danger ml-1">
																					*
																				</span>
																			</>
																		}
																		placeholder="Select Municipality"
																		inputClassName="normal-case"
																		ref={
																			ref
																		}
																		value={
																			value
																		}
																		onChange={(
																			data
																		) => {
																			let selected_ =
																				locations?.find(
																					(
																						x
																					) =>
																						String(
																							x.name
																						).toLowerCase() ==
																						String(
																							data
																						).toLowerCase()
																				);
																			console.log(
																				"selected_selected_",
																				String(
																					data
																				).toLowerCase(),
																				selected_
																			);
																			// setBrgys(
																			// 	selected_?.barangays
																			// );
																			setValue(
																				"zip_code",
																				selected_?.zipcode ||
																					""
																			);
																			onChange(
																				data
																			);
																		}} // send value to hook form
																		onChangeGetData={(
																			data
																		) => {
																			setBrgys(
																				data.barangay_list.map(
																					(
																						key
																					) => {
																						return {
																							name: key,
																						};
																					}
																				)
																			);
																		}}
																		onBlur={
																			onBlur
																		} // notify when input is touched
																		error={
																			error?.message
																		}
																		options={municipalityList.map(
																			(
																				municipality
																			) => ({
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
														<div className="lg:col-span-4">
															<Controller
																name="barangay"
																control={
																	control
																}
																rules={{
																	required: {
																		value: true,
																		message:
																			"This field is required",
																	},
																}}
																onChange={(
																	data
																) => {}}
																render={({
																	field: {
																		onChange,
																		onBlur,
																		value,
																		name,
																		ref,
																	},
																	fieldState:
																		{
																			invalid,
																			isTouched,
																			isDirty,
																			error,
																		},
																}) => (
																	<ReactSelectInputField
																		isClearable={
																			false
																		}
																		label={
																			<>
																				Select
																				Barangay
																				<span className="text-danger ml-1">
																					*
																				</span>
																			</>
																		}
																		inputClassName=" "
																		ref={
																			ref
																		}
																		value={
																			value
																		}
																		onChange={(
																			data
																		) => {
																			let selected_ =
																				brgys?.find(
																					(
																						x
																					) =>
																						x.name ==
																						data
																				);
																			setPuroks(
																				selected_?.puroks
																			);
																			onChange(
																				data
																			);
																		}} // send value to hook form
																		onBlur={
																			onBlur
																		} // notify when input is touched
																		error={
																			error?.message
																		}
																		placeholder="Select Barangay"
																		options={brgys.map(
																			(
																				data
																			) => ({
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
															className="lg:col-span-4"
															error={
																errors?.zip_code
																	?.message
															}
															{...register(
																"purok",
																{
																	required:
																		"This field is required",
																}
															)}
														/>
														<TextInputField
															label={<>ZIPCODE</>}
															placeholder="ZIPCODE"
															className="lg:col-span-4"
															error={
																errors?.zip_code
																	?.message
															}
															{...register(
																"zip_code",
																{
																	required:
																		"This field is required",
																}
															)}
														/>
														<TextInputField
															label={
																<>
																	UNIT/Room
																	No./Floor
																</>
															}
															placeholder="UNIT/Room No./Floor"
															className="lg:col-span-6"
															error={
																errors?.unit
																	?.message
															}
															{...register(
																"unit",
																{
																	required:
																		"This field is required",
																}
															)}
														/>
														<TextInputField
															label={
																<>
																	Lot/Blk/phase/House
																	No.
																</>
															}
															placeholder="Lot/Blk/phase/House No."
															className="lg:col-span-6"
															error={
																errors
																	?.house_number
																	?.message
															}
															{...register(
																"house_number",
																{
																	required:
																		"This field is required",
																}
															)}
														/>

														<TextInputField
															label={<>Street</>}
															placeholder="Street"
															className="lg:col-span-6"
															error={
																errors?.street
																	?.message
															}
															{...register(
																"street",
																{
																	required:
																		"This field is required",
																}
															)}
														/>

														<TextInputField
															label={
																<>Subdivision</>
															}
															placeholder="Subdivision"
															className="lg:col-span-6"
															error={
																errors
																	?.subdivision
																	?.message
															}
															{...register(
																"subdivision",
																{
																	required:
																		"This field is required",
																}
															)}
														/>

														<TextInputField
															label={
																<>
																	State in /
																	Country (if
																	abroad)
																</>
															}
															placeholder="State in / Country"
															className="lg:col-span-6"
															defaultValue={
																"Philippines"
															}
															error={
																errors?.country
																	?.message
															}
															{...register(
																"country",
																{
																	required:
																		"This field is required",
																}
															)}
														/>
													</div>
												</CollapseDiv>
												<CollapseDiv
													defaultOpen={true}
													title="III. DECLARATION OF DEPENDENTS"
												>
													<div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
														{dependents?.map(
															(data, i) => {
																return (
																	<div
																		className="col-span-12 border rounded-md p-3 gap-4 grid grid-cols-1 lg:grid-cols-12 relative"
																		key={`dpdnts-${i}`}
																	>
																		<div
																			className="bg-red-500 text-white py-1 px-2 rounded absolute top-0 right-0 text-xs cursor-pointer"
																			onClick={() => {
																				removeItem(
																					data?.id
																				);
																			}}
																		>
																			Remove
																		</div>
																		<TextInputField
																			label={
																				<>
																					Lastname
																					<span className="text-danger ml-1">
																						*
																					</span>
																				</>
																			}
																			placeholder="Lastname"
																			className="lg:col-span-4"
																			onChange={(
																				e
																			) => {
																				updateItem(
																					data?.id,
																					"lastname",
																					e
																						.target
																						.value
																				);
																			}}
																		/>
																		<TextInputField
																			label={
																				<>
																					Firstname
																					<span className="text-danger ml-1">
																						*
																					</span>
																				</>
																			}
																			placeholder="Firstname"
																			className="lg:col-span-4"
																			onChange={(
																				e
																			) => {
																				updateItem(
																					data?.id,
																					"firstname",
																					e
																						.target
																						.value
																				);
																			}}
																		/>
																		<TextInputField
																			label="Middle Initial"
																			placeholder="M.I."
																			className="lg:col-span-2"
																			onChange={(
																				e
																			) => {
																				updateItem(
																					data?.id,
																					"middle_name",
																					e
																						.target
																						.value
																				);
																			}}
																		/>
																		<TextInputField
																			label="Suffix"
																			placeholder="Suffix"
																			className="lg:col-span-2"
																			onChange={(
																				e
																			) => {
																				updateItem(
																					data?.id,
																					"suffix",
																					e
																						.target
																						.value
																				);
																			}}
																		/>
																		<div className="lg:col-span-4">
																			<ReactSelectInputField
																				isClearable={
																					false
																				}
																				label={
																					<>
																						Relationship
																					</>
																				}
																				inputClassName=" "
																				onChange={(
																					valData
																				) => {
																					console.log(
																						"onChangeonChange",
																						valData
																					);
																					updateItem(
																						data?.id,
																						"relationship",
																						valData
																					);
																				}} // send value to hook form
																				value={
																					data?.relationship
																				}
																				placeholder="Select..."
																				options={relationshipOptions.map(
																					(
																						data
																					) => ({
																						label: data?.label,
																						value: data?.value,
																					})
																				)}
																			/>
																		</div>
																	</div>
																);
															}
														)}
														<div className="lg:col-span-12 flex items-center justify-center">
															<ActionBtn
																type="accent"
																onClick={() => {
																	setDependents(
																		(
																			prevDependents
																		) => [
																			...prevDependents,
																			{
																				id: uuidv4(),
																				lastname:
																					"",
																				firstname:
																					"",
																				middlename:
																					"",
																				suffix: "",
																				relationship:
																					"",
																			},
																		]
																	);
																}}
															>
																Add dependents
															</ActionBtn>
														</div>
													</div>
												</CollapseDiv>

												<CollapseDiv
													defaultOpen={true}
													title="IV. MEMBER TYPE"
												>
													<div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
														<div className="lg:col-span-6">
															<Controller
																name="direct_contributor"
																control={
																	control
																}
																rules={{
																	required: {
																		value: true,
																		message:
																			"This field is required",
																	},
																}}
																onChange={(
																	data
																) => {}}
																render={({
																	field: {
																		onChange,
																		onBlur,
																		value,
																		name,
																		ref,
																	},
																	fieldState:
																		{
																			invalid,
																			isTouched,
																			isDirty,
																			error,
																		},
																}) => (
																	<ReactSelectInputField
																		isClearable={
																			false
																		}
																		label={
																			<>
																				Direct
																				Contributor
																				<span className="text-danger ml-1">
																					*
																				</span>
																			</>
																		}
																		inputClassName=" "
																		ref={
																			ref
																		}
																		value={
																			value
																		}
																		onChange={(
																			data
																		) => {
																			let selected_ =
																				brgys?.find(
																					(
																						x
																					) =>
																						x.name ==
																						data
																				);
																			setPuroks(
																				selected_?.puroks
																			);
																			onChange(
																				data
																			);
																		}} // send value to hook form
																		onBlur={
																			onBlur
																		} // notify when input is touched
																		error={
																			error?.message
																		}
																		placeholder="Select"
																		options={directOptions?.map(
																			(
																				data
																			) => ({
																				label: data?.label,
																				value: data?.value,
																			})
																		)}
																	/>
																)}
															/>
														</div>
														<div className="lg:col-span-6">
															<Controller
																name="indirect_contributor"
																control={
																	control
																}
																rules={{
																	required: {
																		value: true,
																		message:
																			"This field is required",
																	},
																}}
																onChange={(
																	data
																) => {}}
																render={({
																	field: {
																		onChange,
																		onBlur,
																		value,
																		name,
																		ref,
																	},
																	fieldState:
																		{
																			invalid,
																			isTouched,
																			isDirty,
																			error,
																		},
																}) => (
																	<ReactSelectInputField
																		isClearable={
																			false
																		}
																		label={
																			<>
																				Indirect
																				Contributor
																				<span className="text-danger ml-1">
																					*
																				</span>
																			</>
																		}
																		inputClassName=" "
																		ref={
																			ref
																		}
																		value={
																			value
																		}
																		onChange={(
																			data
																		) => {
																			let selected_ =
																				brgys?.find(
																					(
																						x
																					) =>
																						x.name ==
																						data
																				);
																			setPuroks(
																				selected_?.puroks
																			);
																			onChange(
																				data
																			);
																		}} // send value to hook form
																		onBlur={
																			onBlur
																		} // notify when input is touched
																		error={
																			error?.message
																		}
																		placeholder="Select"
																		options={indirectOptions?.map(
																			(
																				data
																			) => ({
																				label: data?.label,
																				value: data?.value,
																			})
																		)}
																	/>
																)}
															/>
														</div>
														<TextInputField
															label={
																<>
																	Profession
																	<span className="text-danger ml-1">
																		*
																	</span>
																</>
															}
															placeholder="Profession"
															className="lg:col-span-6"
															error={
																errors
																	?.profession
																	?.message
															}
															{...register(
																"profession",
																{
																	required:
																		"This field is required",
																}
															)}
														/>

														<TextInputField
															label={
																<>
																	Monthly
																	income
																	<span className="text-danger ml-1">
																		*
																	</span>
																</>
															}
															placeholder="Monthly income"
															className="lg:col-span-6"
															error={
																errors?.salary
																	?.message
															}
															{...register(
																"salary",
																{
																	required:
																		"This field is required",
																}
															)}
														/>
													</div>
												</CollapseDiv>
											</div>
										</div>
									</div>
								</div>

								<div className="px-4 py-2 flex items-center justify-end bg-slate-100 border-t">
									{/* <ActionBtn
										type="foreground-dark"
										className="ml-auto uppercase"
										onClick={hide}
									>
										Read more...
									</ActionBtn> */}
									<ActionBtn
										// type="danger"
										className="ml-4"
										onClick={handleSubmit(submitForm)}
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

export default forwardRef(NewPatientFormModal);
