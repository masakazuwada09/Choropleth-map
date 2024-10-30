/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState, useImperativeHandle, Fragment, forwardRef, } from "react";
import FlatIcon from "../../../../components/FlatIcon";
import ActionBtn from "../../../../components/buttons/ActionBtn";
import useNoBugUseEffect from "../../../../hooks/useNoBugUseEffect";

import { v4 as uuidv4 } from "uuid";
import Axios from "../../../../libs/axios";
import ReactSelectInputField from "../../../../components/inputs/ReactSelectInputField";
import TextInputField from "../../../../components/inputs/TextInputField";
import {
	dataURItoBlob,
	dateYYYYMMDD,
	doctorName,
	doctorSpecialty,
	getPhilHealth,
	roomCategory,
	patientFullName,
} from "../../../../libs/helpers";
import { toast } from "react-toastify";
import { useAuth } from "../../../../hooks/useAuth";
import { Controller, set, useForm } from "react-hook-form";
import ReactQuillField from "../../../../components/inputs/ReactQuillField";
import ImagePicker from "../../../../components/inputs/ImagePicker";
import ContentTitle from "../../../../components/buttons/ContentTitle";
import InfoText from "../../../../components/InfoText";
import ReleaseMedStep1 from "../../../appointments/components/ReleaseMedStep1";
import ReleaseMedStep2 from "../../../appointments/components/ReleaseMedStep2";
import ReleaseMedStep3 from "../../../appointments/components/ReleaseMedStep3";
import { mutate } from "swr";
import { geolocations, locations } from "../../../../libs/geolocations";
import { patientRooms } from "../../../../libs/patientRooms";
import Stepper from "../Stepper/components/Stepper";
import { UseContextProvider } from "../../../../components/StepperContext";
import Account from "../Stepper/components/steps/PrescriptionStep";
import Details from "../Stepper/components/steps/SatisfactionStep";
import Final from "../Stepper/components/steps/Final";
import Payment from "../Stepper/components/steps/CaptureStep";
import StepperControl from "../Stepper/components/StepperControl";
import PrescriptionStep from "../Stepper/components/steps/PrescriptionStep";
import SatisfactionStep from "../Stepper/components/steps/SatisfactionStep";
import CaptureStep from "../Stepper/components/steps/CaptureStep";



const roomOptions = Object.values(patientRooms).map((loc) => ({
	value: loc?.category_name,
	label: loc?.category_name,
	room_list: loc?.room_list,
}));

const uniq_id = uuidv4();

const OPDServices = (props, ref) => {
	const { onSuccess, specialties } = props;
	const { appointment, setAppointment, mutateAll } = props;
	const [currentStep, setCurrentStep] = useState(1);
	const [modalData, setModalData] = useState(null);
	const { user } = useAuth();
	const {
		register,
		getValues,
		watch,
		control,
		setValue,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {

			category_number: "",
			room_number: "",

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
	

	useNoBugUseEffect({
		functions: () => {
			getItems();
			getHUList("RHU");
		},
		params: [appointment?.id],
	});

	const steps = [
		"Prescriptions",
		"Satisfaction Rating",
		"Capture Photo",
		"Complete",
	  ];
	
	  const displayStep = (step) => {
		switch (step) {
		  case 1:
			return <PrescriptionStep
			loading={loading}
			setLoading={setLoading}
			appointment={appointment}
			releasePrescription={releasePrescription}
			/>;
		  case 2:
			return <SatisfactionStep
			loading={loading}
			setLoading={setLoading}
			appointment={appointment}
			satisfaction={satisfaction}
			setStatisfaction={setStatisfaction}
			submitSatisfaction={submitSatisfaction}/>;
		  case 3:
			return <CaptureStep
			imageCaptured={imageCaptured}
			setImageCaptured={setImageCaptured}
			loading={loading}
			setLoading={setLoading}
			appointment={appointment}
			submitSelfie={submitSelfie}/>;
		  case 4:
			return <Final 
			loading={loading}
			setLoading={setLoading}
			appointment={appointment}
			/>;
		  default:
		}
	  };
	
	  const handleClick = (direction) => {
		let newStep = currentStep;
	
		direction === "next" ? newStep++ : newStep--;
		// check if steps are within bounds
		newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
	  };

	const [step, setStep] = useState(1);
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [imageCaptured, setImageCaptured] = useState(null);
	const [isPositive, setIsPositive] = useState(false);
	const [isSelectorLoading, setIsSelectorLoading] = useState(false);
	const [items, setItems] = useState([]);
	const [itemUsed, setItemUsed] = useState(false);
	const [forConfirmation, setForConfirmation] = useState(false);
	const [doctorList, setDoctorList] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);
	const [satisfaction, setStatisfaction] = useState(null);
	const [provinceList, setProvinceList] = useState([]);
	const [roomList, setRoomList] = useState([]);
	const [healthUnits, setHealthUnits] = useState([null]);

	const getOptionsForCategory = (category) => {
		switch (category) {
		  case "SUITE":
			return [
			  { label: "Suite 1", value: "SUITE 1" },
			  { label: "Suite 2", value: "SUITE 2" },
			  { label: "Suite 3", value: "SUITE 3" },
			  { label: "Suite 4", value: "SUITE 4" },
			  { label: "Suite 5", value: "SUITE 5" },
			];
		  case "PRIVATE":
			return [
				{ label: "Private 1", value: "PRIVATE1" },
				{ label: "Private 2", value: "PRIVATE2" },
				{ label: "Private 3", value: "PRIVATE3" },
				{ label: "Private 4", value: "PRIVATE4" },
				{ label: "Private 5", value: "PRIVATE5" },
			  ];
		  case "NON-PRIVATE":
			return [
			  { label: "Non-Private 1", value: "NONPRIVATE1" },
			  { label: "Non-Private 2", value: "NONPRIVATE2" },
			  { label: "Non-Private 3", value: "NONPRIVATE3" },
			  { label: "Non-Private 4", value: "NONPRIVATE4" },
			  { label: "Non-Private 5", value: "NONPRIVATE5" },
			];
		  case "BED":
			return [
			  { label: "Bed 1", value: "BED1" },
			  { label: "Bed 2", value: "BED2" },
			  { label: "Bed 3", value: "BED3" },
			  { label: "Bed 4", value: "BED4" },
			  { label: "Bed 5", value: "BED5" },
			];

		  default:
			return [];
		}
	  };
	// useImperativeHandle(ref, () => ({
	// 	show: show,
	// 	hide: hide,
	// }));

	// const hide = () => {
	// 	setModalOpen(true);
	// };

	// const show = (showData = null) => {
	// 	setModalOpen(true);
	// 	setTimeout(() => {
	// 		setValue("status", "active");
	// 		if (showData?.id) {
	// 			setValue("name", showData?.name);

	// 			setValue("username", showData?.username);
	// 			setValue("email", showData?.email);
	// 			setValue("street", showData?.street);
	// 			setValue("region", showData?.region);
				
	// 			setTimeout(() => {
	// 				let selectedRegion = regionsOptions.find(
	// 					(x) => x?.value == showData?.region
	// 				);
	// 				setProvinceList(
	// 					Object.keys(selectedRegion?.province_list).map(
	// 						(key) => {
	// 							return {
	// 								name: key,
	// 								...selectedRegion?.province_list[key],
	// 							};
	// 						}
	// 					)
	// 				);
	// 				let regionProvinceList = Object.keys(
	// 					selectedRegion?.province_list
	// 				).map((key) => {
	// 					return {
	// 						name: key,
	// 						...selectedRegion?.province_list[key],
	// 					};
	// 				});
	// 				console.log("regionProvinceList", regionProvinceList);
	// 				setTimeout(() => {
	// 					console.log("regionProvinceList", regionProvinceList);
	// 					setValue("province", showData?.province);
	// 					let selectedProvince = regionProvinceList.find(
	// 						(x) => x?.name == showData?.province
	// 					);
	// 					console.log(
	// 						"regionProvinceList selectedProvince",
	// 						selectedProvince
	// 					);
	// 					let mun_list = Object.keys(
	// 						selectedProvince?.municipality_list
	// 					).map((key) => {
	// 						return {
	// 							name: key,
	// 							...selectedProvince?.municipality_list[key],
	// 						};
	// 					});
	// 					setMunicipalityList(mun_list);
	// 					let selectedMunicipality = mun_list.find(
	// 						(x) => x?.name == showData?.municipality
	// 					);

	// 					console.log(
	// 						"regionProvinceList selectedMunicipality",
	// 						selectedMunicipality
	// 					);
	// 					let brgs_list =
	// 						selectedMunicipality?.barangay_list?.map((key) => ({
	// 							value: key,
	// 							label: key,
	// 							name: key,
	// 						}));
	// 					setValue("municipality", showData?.municipality);
	// 					setBrgys(brgs_list);
	// 					setValue("barangay", showData?.barangay);
	// 				}, 200);
	// 			}, 200);


	// 			setValue("purok", showData?.purok);
	// 			setValue("type", showData?.type);
	// 			setValue("specialty_id", showData?.specialty_id);
	// 			setValue("name", showData?.name);
	// 			setValue("title", showData?.title);
	// 			setValue("gender", showData?.gender);
	// 			setValue("contact_number", showData?.contact_number);
	// 			setValue("status", showData?.status);
				
	// 		}
	// 	}, 300);
	// 	if (showData?.id) {
	// 		setPersonnel(showData);
	// 	} else {
	// 		setPersonnel(null);
	// 		reset({
	// 			name: "",
	// 			status: "active",
	// 		});
	// 	}
	// };


	useNoBugUseEffect({
		functions: () => {
			if (getValues("rhu_id")) {
				getDoctors();
			}
		},
		params: [watch("rhu_id")],
	});

	useNoBugUseEffect({
		functions: () => {
			if (user?.health_unit_id) {
				setValue("rhu_id", user?.health_unit_id);
			}
		},
		params: [user?.health_unit_id],
	});

	const getRoomList = () => {
		Axios.get(`/v1/health-unit/list?type=RHU`).then((res) => {
			setRoomList(res.data.data);
		});
	};
	
	useNoBugUseEffect({
		functions: () => {
			getRoomList();
		},
		params: [],
	});


	const getDoctors = () => {
		Axios.get(
			`v1/clinic/rhu-doctors?health_unit_id=${getValues(
				"rhu_id"
			)}`
		).then((res) => {
			
			setDoctorList(res.data.data);
		});
	};

	const getItems = () => {
		Axios.get(`v1/item-inventory?location_id=${user?.health_unit_id}`).then(
			(res) => {
				setItems(res.data.data);
			}
		);
	};


	const addNewSelectedItem = () => {
		setSelectedItems((prevItems) => [
			...prevItems,
			{
				id: uuidv4(),
				item: null,
				quantity: 0,
			},
		]);
	};
	const removeSelectedItem = (id) => {
		setSelectedItems((prevItems) =>
			prevItems.filter((item) => item.id != id)
		);
	};
	const updateItemInSelected = (id, itemData) => {
		setSelectedItems((items) =>
			items.map((item) => {
				if (item.id == id) {
					return {
						...item,
						item: itemData,
					};
				}
				return item;
			})
		);
	};
	const updateItemQty = (id, qty) => {
		setSelectedItems((items) =>
			items.map((item) => {
				if (item.id == id) {
					return {
						...item,
						quantity: qty,
					};
				}
				return item;
			})
		);
	};
	const useItems = () => {
		console.log("itemsssss", items);
		if (selectedItems?.length == 0) {
			toast.warning("Please select item(s) to continue...", {
				position: "bottom-right",
			});
			return;
		} else if (selectedItems[0]?.item == null) {
			toast.warning("Please select item(s) to continue...", {
				position: "bottom-center",
			});
			return;
		}

		// items.map()
		///v1/doctor/laboratory-order/store
		const formData = new FormData();
		formData.append("order_date", dateYYYYMMDD());
		formData.append("patient_id", appointment?.patient?.id);
		formData.append("appointment_id", appointment?.id);
		formData.append("health_unit_id", user?.health_unit_id);

		formData.append(
			"laboratory_test_type",
			String(appointment?.post_notes).toLowerCase()
		);
		formData.append("notes", String(appointment?.post_notes).toLowerCase());
		formData.append("_method", "PATCH");
		selectedItems.map((x) => {
			formData.append("inventory_id[]", x.id);
			formData.append("items[]", x.item?.item?.id);
			formData.append("quantity[]", x.quantity || 1);
		});
		Axios.post(`/v1/clinic/tb-lab-service/${appointment?.id}`, formData)
			.then((res) => {
				setItemUsed(true);
				toast.success("Success! item used successfully!");
				// setRefreshKey((x) => x + 1);
			})
			.catch(() => {
				toast.error("Something went wrong!");
			});
	};

	const sendToDoctor = (data) => {
		setLoading(true);
		let formdata = new FormData();
		formdata.append("rhu_id", data?.rhu_id);
		formdata.append("referred_to", data?.referred_to);
		formdata.append("room_number", data?.room_number);
		formdata.append("_method", "PATCH");

		Axios.post(`v1/clinic/tb-assign-to-doctor/${appointment?.id}`, formdata)
			.then((response) => {
				let data = response.data;
				console.log("DATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", data);
				setTimeout(() => {
					setAppointment(null);
				}, 100);
				setTimeout(() => {
					toast.success("Patient update success!");
					setLoading(false);
				}, 200);
			})
			
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};


	
	const hasError = (name) => {
		return errors[name]?.message;
	};
	const [HUList, setHUList] = useState([]);
	useNoBugUseEffect({
		functions: () => {
			setTimeout(() => {
				setValue("location_type", user?.healthUnit?.type);
				setValue("health_unit_id", user?.health_unit_id);
			}, 200);
		},
		params: [user?.id],
	});

	const getHUList = (type) => {
		Axios.get(`v1/health-unit/list?type=${type}`)
			.then((res) => {
				setHUList(res.data.data);
			})
			.finally(() => {
				setIsSelectorLoading(false);
			});
	};
	const releasePrescription = (data) => {
		// setLoading(true);
		// console.log("prescriptionItems", prescriptionItems);
		let formData = new FormData();
		// formData.append("appointment_id", appointment_id);
		formData.append("_method", "PATCH");
		appointment?.prescriptions.map((data) => {
			formData.append("inventory_id[]", data.inventory_id);
			formData.append("quantity[]", data.quantity);
			formData.append("items[]", data?.item?.id);
			formData.append("sig[]", data?.sig);
			formData.append("details[]", "medicine released");
		});
		Axios.post(
			`/v1/clinic/tb-released-medicine/${appointment?.id}`,
			formData
		)
			.then((res) => {
				setStep(2);
				toast.success("Prescription released!");
			})
			.finally(() => {
				setLoading(false);
			});
	};
	const submitSatisfaction = () => {
		const formData = new FormData();
		formData.append("_method", "PATCH");
		formData.append("satisfaction", satisfaction);
		Axios.post(
			`/v1/clinic/tb-satisfaction-rate/${appointment?.id}`,
			formData
		)
			.then((res) => {
				// addToList(data);
				// setTimeout(() => {
				// setLoading(false);
				setStep(3);
				toast.success("Satisfaction successfully submitted!");
				// }, 400);
			})
			.finally(() => {
				setLoading(false);
			});
	};
	const submitSelfie = () => {
		const config = {
			headers: {
				"content-type": "multipart/form-data",
			},
			// onUploadProgress: progressEvent => onProgress(progressEvent),
		};
		const formData = new FormData();
		const file = dataURItoBlob(imageCaptured);
		formData.append("_method", "PATCH");
		formData.append("selfie", file);
		Axios.post(
			`/v1/clinic/tb-selfie/${appointment?.id}`,
			formData,
			config
		).then((res) => {
			setTimeout(() => {
				setAppointment(null);
				if (mutateAll) mutateAll();
			}, 100);
			setTimeout(() => {
				toast.success("Selfie successfully submitted!");
				setStep(1);
				setAppointment(null);
			}, 300);
		});
	};



	







	return (
		<div className="flex flex-col items-start">
			{appointment?.status == "pending-for-his-release" ? (
				<>
					<div className="flex items-center w-full justify-center px-4 pb-4 gap-4">
						
					</div>
					<div className="p-5 mx-auto w-4/5 border rounded-xl">


	<div className="mx-auto rounded-2xl bg-white pb-2 shadow-xl w-full">
     
      <div className="horizontal container mt-5 ">
        <Stepper steps={steps} currentStep={currentStep} />

        <div className="my-10 p-10 ">
          <UseContextProvider>{displayStep(currentStep)}</UseContextProvider>
        </div>
      </div>

     
      {currentStep !== steps.length && (
        <StepperControl
			loading={loading}
			setLoading={setLoading}
			appointment={appointment}
			submitSelfie={submitSelfie}
			handleClick={handleClick}
			currentStep={currentStep}
			steps={steps}
        />
      )}
    </div>


					</div>
				</>


  

			) : (
				""
			)}






{appointment?.status == "pending" ? (
				<>
					<div className="flex flex-col w-full gap-4 pb-2">
					<div className="p-0 flex flex-col gap-y-4 relative w-full">
						<h4 className="text-md text-indigo-800 border-b border-b-indigo-600 pb-1 font-bold mb-0">
							Send patient to Medical Doctor
						</h4>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">



				
							
							<Controller
								name="referred_to"
								control={control}
								rules={{
									required: {
										value: true,
										message: "This field is required",
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
										isClearable={true}
										label="Select Medical Doctor"
										isLoading={isSelectorLoading}
										onChangeGetData={(data) => {}}
										inputClassName=" "
										ref={ref}
										value={value}
										onChange={onChange}
										onData
										onBlur={onBlur} // notify when input is touched
										error={error?.message}
										placeholder={`Medical Doctor`}
										options={doctorList?.map((doctor) => ({
											label: `${doctorName(doctor)}`,
											value: doctor?.id,
											descriptionClassName:
												" !opacity-100",
											description: (
												<div className="flex text-xs flex-col gap-1">
													<span>
														{doctorSpecialty(
															doctor
														)}
													</span>
													<span className="flex items-center gap-1">
														Status:
														<span className="text-green-900 drop-shadow-[0px_0px_1px_#ffffff] text-xs font-bold">
															ONLINE
														</span>
													</span>
												</div>
											),
										}))}
									/>
								)}
							/>

<Controller
  name="room_category"
  control={control}
  rules={{
    required: {
      value: true,
      message: "This field is required",
    },
  }}
  render={({ field }) => (
    <ReactSelectInputField
      isClearable={true}
      label="Room Category"
      inputClassName=""
      ref={field.ref}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={field.error?.message}
      placeholder="Select Room Category"
      options={[
        { label: "Suite", value: "SUITE" },
        { label: "Private", value: "PRIVATE" },
        { label: "Non Private", value: "NON-PRIVATE" },
        { label: "Bed", value: "BED" },
      ]}
    />
  )}
/>




{["SUITE", "PRIVATE", "NON-PRIVATE", "BED"].includes(watch("room_category")) && (
  <Controller
    name="room_number"
    control={control}
    rules={{
      required: {
        value: true,
        message: "This field is required",
      },
    }}
    render={({ field }) => (
      <ReactSelectInputField
        isClearable={true}
        label={watch("room_category") === "BED" ? "Bed Number" : "Room Number"}
        inputClassName=""
        ref={field.ref}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        error={field.error?.message}
        placeholder={watch("room_category") === "BED" ? "Select Bed Number" : "Select Room Number"}
        options={getOptionsForCategory(watch("room_category"))}
      />
    )}
  />
)}

							{/* <Controller
								name="room_category"
								control={control}
								rules={{
									required: {
										value: false,
										message: "This field is required",
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
										isClearable={true}
										label="Select Room Category"
										isLoading={isSelectorLoading}
										onChangeGetData={(data) => {}}
										inputClassName=" "
										ref={ref}
										value={value}
										onChange={onChange}
										onData
										onBlur={onBlur} // notify when input is touched
										error={error?.message}
										placeholder={`Room Category`}
										// options={roomList?.map((doctor) => ({
										// 	label: `${doctorName(doctor)}`,
										// 	value: doctor?.id,
										// }))}
										options={[
													// {
													// 	label: "Provincial Hospital (PH)",
													// 	value: "PH",
													// },
													{
														label: "Suite",
														value: "Suite",
													},
                                                    {
														label: "Private",
														value: "Private",
													},
                                                    {
														label: "Non Private",
														value: "Non Private",
													},
                                                    {
														label: "Bed",
														value: "Bed",
													},
                                                  
                                                    
													// {
													// 	label: "Barangay Health Station (BHS)",
													// 	value: "BHS",
													// },
												]}
									/>
								)}
							/> 





							{/* <Controller
								name="room_number"
								control={control}
								rules={{
									required: {
										value: true,
										message: "This field is required",
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
										isClearable={true}
										label="Select Room"
										isLoading={isSelectorLoading}
										onChangeGetData={(data) => {}}
										inputClassName=" "
										ref={ref}
										value={value}
										onChange={onChange}
										onData
										onBlur={onBlur} // notify when input is touched
										error={error?.message}
										placeholder={`Select Room`}
										// options={roomList?.map((doctor) => ({
										// 	label: `${doctorName(doctor)}`,
										// 	value: doctor?.id,
										// }))}
										options={[
													// {
													// 	label: "Provincial Hospital (PH)",
													// 	value: "PH",
													// },
													{
														label: "1",
														value: "1",
													},
                                                    {
														label: "2",
														value: "2",
													},
                                                    {
														label: "3",
														value: "3",
													},
                                                    {
														label: "4",
														value: "4",
													},
                                                    {
														label: "5",
														value: "5",
													},
                                                    {
														label: "6",
														value: "6",
													},
                                                    {
														label: "7",
														value: "7",
													},
                                                    {
														label: "8",
														value: "8",
													},
                                                    {
														label: "9",
														value: "9",
													},
                                                    {
														label: "10",
														value: "10",
													},
                                                    
													// {
													// 	label: "Barangay Health Station (BHS)",
													// 	value: "BHS",
													// },
												]}
									/>
								)}
							/> */}




							{/* <Controller
								name="surgery_date"
								control={control}
								rules={{
									required: {
										value: true,
										message: "This field is required",
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
									<TextInputField
											isLoading={isSelectorLoading}
											onChangeGetData={(data) => {}}
											inputClassName=" "
											ref={ref}
											value={value}
											onChange={onChange}
											onData
											onBlur={onBlur} // notify when input is touched
											error={error?.message}
											label="Select Date"
											type="date"
											className="focus:outline-none focus:border-blue-500"
											/>
								)}
							/> */}


							{/* <Controller
								name="surgery_time"
								control={control}
								rules={{
									required: {
										value: true,
										message: "This field is required",
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
										<TextInputField
											isLoading={isSelectorLoading}
											onChangeGetData={(data) => {}}
											inputClassName=" "
											ref={ref}
											value={value}
											onChange={onChange}
											onData
											onBlur={onBlur} // notify when input is touched
											error={error?.message}
											label="Time:"
											type="time"
											className="focus:outline-none focus:border-blue-500"
											/>
											
								)}
							/> */}

							

							
						</div>


						<ActionBtn
							className="px-4 !rounded-2xl w-full"
							type="success"
							size="lg"
							loading={loading}
							onClick={handleSubmit(sendToDoctor)}
							>
							<FlatIcon
								icon="rr-check"
								className="mr-2 text-xl"
							/>
							Send patient to Medical Doctor
						</ActionBtn>



					</div>
				</div>
				</>
			) : (
					""
			)}




		</div>
	);
};

export default OPDServices;
