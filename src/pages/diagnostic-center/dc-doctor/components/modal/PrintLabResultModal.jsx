/* eslint-disable react/prop-types */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react-refresh/only-export-components */

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
import {
	dataURItoBlob,
	formatDateMMDDYYYY,
	formatDateYYYYMMDD,
	dateMMDDYYYY,
	patientFullName,
	patientAddress,
	dateMM,
	dateDD,
	dateYYYY,
	timeHH,
	timeII,
	calculateHemoglobin,
	calculateBMI, calculateBPMeasurement
} from "../../../../../libs/helpers";
import ActionBtn from "../../../../../components/buttons/ActionBtn";
import Axios from "../../../../../libs/axios";
import TextInputField from "../../../../../components/inputs/TextInputField";
import ReactSelectInputField from "../../../../../components/inputs/ReactSelectInputField";
import useNoBugUseEffect from "../../../../../hooks/useNoBugUseEffect";
import ReactQuillField from "../../../../../components/inputs/ReactQuillField";
import ImagePicker from "../../../../../components/inputs/ImagePicker";
import InfoText from "../../../../../components/InfoText";
import InfoTextForBilling from "../../../../../components/cashier-billing/component/billing/InfoTextForBilling";
import InfoTextForPrint from "../../../../../components/InfoTextForPrint";
import { useReactToPrint } from "react-to-print";
import FlatIcon from "../../../../../components/FlatIcon";
import QRCode from "qrcode.react";
import CollapseDiv from "../../../../../components/CollapseDiv";

const FormHeading = ({ title }) => {
	return (
		
		<div className="flex items-center h-12">
		<div className="flex items-center">
		  
		</div>
		<div className="flex-grow slanted bg-blue-500 flex items-center justify-start pl-1">
		  <span className="text-white">www.laboratory.com</span>
		</div>
		<div className="flex-grow slanted-reverse bg-blue-700 flex items-center justify-start pl-1">
		<span className="text-blue-700" value="">.</span>
		</div>
		
		  <div className="slanted bg-blue-500 flex items-center justify-start pl-4"></div>
		
		  
	  </div>
	);
};

const InputFields = [
	{
		label: "Blood Pressure (SYSTOLIC)",
		name: "blood_systolic",
		placeholder: "SYSTOLIC",
		className: "lg:col-span-4",
		type: "text",
		required: {
			value: true,
			message: "This field is required.",
		},
	},

	{
		label: "BP Measurement",
		name: "bp_measurement",
		placeholder: "BP Measurement",
		className: "lg:col-span-4",
		type: "text",
	},
]

const FormBody = ({ className = "", children }) => {
	return (
		<div className={`flex flex-col border-b-2 p-1 text-sm ${className}`}>
			{children}
		</div>
	);
};
const BoxInput = () => {
	return (
		<>
			<label className="flex items-center border-l last:border-r border-y  border-black">
				<input
					type="text"
					className="w-4 py-[2px] px-0 leading-none text-center border-0 !text-xs"
					maxLength={1}
				/>
			</label>
		</>
	);
};
const BoxInputGroup = ({
	children,
	label = "",
	className = "",
	labelClassName = "",
}) => {
	return (
		<div className={`flex flex-col items-center relative ${className}`}>
			<div className="flex items-center">{children}</div>
			{label && (
				<label
					className={` absolute !text-[10px] -bottom-4 ${labelClassName}`}
					
				>
					{label}
				</label>
			)}
		</div>
	);
};

const UnderscoreGroup = ({ children, label }) => {
	return (
		<div className="flex flex-col items-center justify-center relative">
			{children}
			{label && (
				<label className="text-[8px] fixed mt-7">{label}</label>
			)}
		</div>
	);
};

const Underscore = ({ count = 1 }) => {
	let arr = Array.from({ length: count });
	return (
		<div className="flex items-end pt-0">
			{arr.map((x, index) => {
				return (
					<span
						className="border-b-2 h-4 border-l-2 last:border-r-2 w-5 text-center text-xs"
						contentEditable
					></span>
				);
			})}
		</div>
	);
};

const Underscoredate = ({ count, value, }) => (
	<span className="underscore">
	  {value ? value.padStart(count, "_") : "_".repeat(count)}
	</span>
  );


const CheckBox = ({ label, className = "", inputClassName = "" }) => {
	return (
		<label
			className={`flex items-center text-xs gap-2 font-normal ${className}`}
		>
			<input type="checkbox" className={inputClassName} />
			{label}
		</label>
	);
};
const UnderlineInput = ({ label, className = "", inputClassName = "" }) => {
	return (
		<div className={`flex flex-col text-center text-xs ${className}`}>
			<span
				className={`border-b w-full h-5 p-0 text-xs flex items-end justify-center ${inputClassName}`}
				contentEditable={true}
			></span>
			{label ? <span className="text-[10px]">{label}</span> : ""}
		</div>
	);
};
const InlineInput = ({ label, className = "", inputClassName = "" }) => {
	return (
		<div
			className={`flex text-center items-center text-xs gap-2 ${className}`}
		>
			{label && <span className="whitespace-pre">{label}</span>}
			<span
				className={`border-b w-full h-4 p-0 text-xs flex items-end justify-center ${inputClassName}`}
				contentEditable={true}
			></span>
		</div>
	);
};

const PrintLabResultModal = (props, ref) => {
	const { loading: btnLoading, appointment, onSave} = props;
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
	const [modalOpen, setModalOpen] = useState(false);
	const componentRef = React.useRef(null);
	const [tests, setTests] = useState([]);
	useNoBugUseEffect({
		functions: () => {},
	});
	useImperativeHandle(ref, () => ({
		show: show,
		hide: hide,
	}));

	const show = (data) => {
		setShowData(data);
		setModalOpen(true);
	};
	const hide = () => {
		setModalOpen(false);
	};
	const submit = (data) => {
		let formData = new FormData();
		let config = {
			headers: {
				"content-type": "multipart/form-data",
			},
		};
		formData.append("_method", "PATCH");
		formData.append("lab_result_notes", data?.lab_result_notes);

		if (data?.attachment) {
			formData.append("attachment", dataURItoBlob(data?.attachment));
		}
		Axios.post(
			`v1/laboratory/upload-lab-result/${showData?.id}`,
			formData,
			config
		).then((res) => {
			reset();
			toast.success("Laboratory result uploaded successfully!");
			onSuccess();
			hide();
		});
	};
	const hasError = (name) => {
		return errors[name]?.message;
	};
	const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
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
					<div className="fixed inset-0 bg-blue-200 bg-opacity-75 backdrop-blur z-[300] " />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto !z-[350]">
					<div className="flex min-h-full w-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-[1100px] transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all overflow-hidden h-[900px]">
								<Dialog.Title
									as="div"
									className=" p-4 font-medium leading-6 flex flex-col items-start text-gray-900 bg-slate-50 border-b"
								>
									<span className="text-xl text-center font-bold  text-blue-900">
										Print Laboratory Result
									</span>
								</Dialog.Title>
								<div className="p-6 flex flex-col gap-y-4 relative">
								<div className="bg-gray-600 p-11 min-h-[14in]  overflow-auto phic-forms">

<ActionBtn
	className="text-base gap-2 ml-2 mb-2"
	onClick={handlePrint}
	type="success"
>
	<FlatIcon icon="rr-print" /> Print
</ActionBtn>

<div
className="bg-white p-[0.5in] w-[9.5in] gap-y-6 mx-auto overflow-y-scroll h-[900px]"
id="phic-form-printable" ref={componentRef}
>
<div className="bg-white flex flex-col w-[8.5in] min-h-[13in]  border-gray-200 border-2 rounded-2xl px-4 py-4 ">
	<div className="flex flex-row">
		<div>
			<img
			className="w-[100px] left-4 object-contain"
			src="/caduceus.png"
			/>
		</div>
		<div>
			<p className="text-sm">
				<i>Republic of the Philippines</i>
			</p>
			<h4 className="font-bold text-xl">
				LABORATORY REPORT
			</h4>
			<p className="text-sm">
				Citystate Centre 709 Street, Address City
			</p>
			<p className="text-sm">
				Call Center (02) 441-7442 l Trunkline (02)
				441-7444
			</p>
			<p className="text-sm">www.laboratory.gov.ph</p>
			<p className="text-sm">
				{" "}
				email: laboratory.gov.ph
			</p>
		</div>

		<div className="flex ml-[25px] items-start gap-2">
			
		{showData?.type?.name == "CBC" ? (
		<div className="flex flex-col text-sm items-end ml-12">
		  <h1 className="text-4xl font-bold mb-0 ">CBC</h1>
		  <h3 className="text-lg font-bold mb-0">
			  (Complete Blood Count)
		  </h3>
		  <p className="text-sm">Revised September 2018</p>
		</div>
		) : showData?.type?.name == "FBS" ? (
				<div className="flex flex-col text-sm items-end ml-12">
				  <h1 className="text-4xl font-bold mb-0 ">FBS</h1>
				  <h3 className="text-lg font-bold mb-0">
					  (Fast Blood Sugar )
				  </h3>
				  <p className="text-sm">Revised September 2018</p>
				</div>
		) : showData?.type?.name == "RBS" ? (
			<div className="flex flex-col text-sm items-end ml-12">
			  <h1 className="text-4xl font-bold mb-0 ">RBS</h1>
			  <h3 className="text-lg font-bold mb-0">
				  (Random blood Sugar )
			  </h3>
			  <p className="text-sm">Revised September 2018</p>
			</div>
	) : ( ""
		)}

					<QRCode
						value={`user-${showData?.receivedBy?.username}`}
						level="H"
						size={100}
					/>
		</div>
		

	</div>
	
<FormHeading title="" />
  <div className="flex items-center relative justify-center border-b-2  px-2 pt-2 pb-1">
	  
	  <div className="flex flex-col text-start w-full mx-auto">
	  <div className="flex flex-row justify-between gap-5">
                    <div className="border rounded-sm w-[350px] border-gray-200">
					    {/* <div className=" bg-blue-600 text-white rounded-sm grid grid-cols-6 text-sm font-semibold text-center font-mono">
						        <div className="col-span-3">
                                ADMISSION DATE
                                </div>
						         <div className="col-span-3">
                                DISCHARGE DATE
                                </div>
                            
                                
					    </div>
                
					    <div className="grid grid-cols-2 text-sm font-light font-mono shadow">
							
					

						<div className="">
		
                        <InfoTextForBilling
                            value={dateMMDDYYYY()}/>
						</div>

						<div className="">
                        <InfoTextForBilling
                                />
                        </div>
                        
                        </div> */}


						<div className="px-3 py-2 flex flex-col w-full justify-start">
							
						<div className="font-bold">
							{patientFullName(patient)}
						</div>
						
						<div className="text-sm">
							{patientAddress(patient)}
						</div>

						<div className="text-sm">
							{patient?.gender}
						</div>

						{/* <div className="text-sm">
							Admission Date: {dateMMDDYYYY()}
						</div> */}
						
                        </div>

						
                       
					</div>


                    <div className="items-center">
					<div className="flex flex-col border-b-2 p-2 text-sm relative ">
						<b>IMPORTANT REMINDERS:</b>
						<div className="absolute top-2 right-2 ">
							<div className="flex items-center gap-2 ml-auto ">
								
								
							</div>
						</div>
						<p className="text-xs ">
							PLEASE WRITE IN CAPITAL <b>LETTERS</b> AND{" "}
							<b>CHECK</b> THE APPROPRIATE BOXES.
						</p>
						<p className="text-xs">
							All information, fields and trick boxes required in
							this form are necessary. Claim forms with incomplete
							information shall not be processed.
						</p>{" "}
						<b className="text-xs">
							FALSE/INCORRECT INFORMATION OR MISREPRESENTATION
							SHALL BE SUBJECT TO CRIMINAL, CIVIL OR
							ADMINISTRATIVE LIABILITIES.
						</b>
					</div>

		
                    </div>
                    
                </div>
	  		
	  </div>
	 
	 
  </div>

 

  							{showData?.type?.name == "CBC" ? (
										<div className="px-5 py-5 font-mono justify-center items-center">

											<h1 className="flex justify-center font-bold text-lg border-b border-t mb-2">Complete Blood Count (CBC)</h1>
											<table className="flex flex-col gap-4">
												
										
												<thead>
													<tr className="flex flex-row justify-between gap-12 border-b shadow-xl ">
														<th>Investigation</th>
														<th>Result</th>
														<th>Normal Range Value</th>
														<th>Unit</th>
														
													</tr>
												</thead>
												<tbody>
													<tr className="flex flex-row justify-between gap-12 border-b border-dashed border-b-black">
														<th className="capitalize">
															hemoglobin
														</th>
														<td className="absolute ml-[260px]">
														
															{
																showData
																	?.appointment
																	?.hemoglobin
															}
														</td>
														
														<td className=" ml-[200px] flex flex-row">
															
										{/* {InputFields?.map((data) => {
											if (

												data?.name == "bp_measurement"
											) {
												
												let bp_measurement =
													// watch("blood_systolic")
													// 	?.length &&
													watch("blood_systolic")
														// ?.length
														? calculateBPMeasurement(
																watch(
																	"blood_systolic"
																)
																// ,
																// watch(
																// 	"blood_diastolic"
																// )
														  )
														: {};

												console.log(
													"bp_measurement",
													bp_measurement
												);
												
												return (
													<TextInputField
														type={"text"}
														inputClassName={`${bp_measurement?.color}`}
														className={`${data?.className} lg:!w-full ${bp_measurement?.color}`}
														label={
															<>BP Measurement</>
														}
														value={`${
															bp_measurement?.result ||
															""
														}`}
														placeholder={
															data?.placeholder
														}
														error={
															errors[data?.name]
																?.message
														}
														helperText={""}
														{...register(
															"bp_measurement",
															{
																// required: true,
															}
														)}
													/>
												);
											}
											
										
											return (
												<TextInputField
													type={data?.type}
													className={`${data?.className} lg:!w-full`}
													label={
														<>
															{data?.label}:{""}
														</>
													}
													placeholder={
														data?.placeholder
													}
													options={data?.options}
													error={
														errors[data?.name]
															?.message
													}
													helperText={""}
													{...register(data?.name, {
														required: data?.required
															? data?.required
															: false,
													})}
												/>
											);
										})} */}

													
															13.0 - 17.0
														</td>
														<td>
															
															g/L
														</td>

													</tr>
													<tr className="flex flex-row justify-between gap-12 border-b border-dashed border-b-black">
														<th className="capitalize">
															hematocrit
														</th>
															<td className="absolute ml-[260px]">
															{
																showData
																	?.appointment
																	?.hematocrit
															}{" "}
															</td>
															
															<td className="absolute ml-[460px]">
															40% - 50%
															</td>
															<td>
																
															L/L
															</td>
														
													</tr>
													<tr className="flex flex-row justify-between gap-12 border-b border-dashed border-b-black">
														<th className="uppercase">
															rcbc
														</th>
														<td className="absolute ml-[240px]">
															{
																showData
																	?.appointment
																	?.rcbc
															}{" "}
															
														</td>
														<td className="absolute ml-[460px]">
															4.5 - 5.5
															
														</td>
														<td>
															x10¹²/L
														</td>
													</tr>
													<tr className="flex flex-row justify-between gap-12 border-b border-dashed ">
														<th className="uppercase">
															wbc
														</th>
														<td className="absolute ml-[260px]">
															{
																showData
																	?.appointment
																	?.wbc
															}{" "}
															
														</td>
														<td className="absolute ml-[450px]">
															4000 - 11000
															
														</td>
														<td>
															x10⁹/L
														</td>

													</tr>
												</tbody>
											</table>
										</div>
										
									) : showData?.type?.name == "FBS" ? (
										<div className="px-5 py-5 font-mono justify-center items-center">

											<h1 className="flex justify-center font-bold text-lg border-b border-t mb-2">Fast Blood Sugar (FBS)</h1>
											<table className="flex flex-col gap-4">
												
										
												<thead>
													<tr className="flex flex-row justify-between gap-12 border-b shadow-xl ">
														<th>Investigation</th>
														<th>Result</th>
														<th>Normal Range Value</th>
														<th>Unit</th>
														
													</tr>
												</thead>
												<tbody>
													<tr className="flex flex-row justify-between gap-12 border-b border-dashed border-b-black">
														<th className="capitalize">
															GLUCOSE, FASTING, PLASMA
														</th>
														<td className="absolute ml-[285px]">
														
															{
																showData
																	?.appointment
																	?.fbs
															}{" "}
														</td>
														<td className=" ml-[80px] flex flex-row">
													
															70.00 - 100.00
														</td>
														<td>
															
															mg/dL
														</td>

													</tr>
													
													
													
												</tbody>
											</table>
										</div>
										
										) : showData?.type?.name == "RBS" ? (
											<div className="px-5 py-5 font-mono justify-center items-center">
	
												<h1 className="flex justify-center font-bold text-lg border-b border-t mb-2">Random blood sugar (RBS)</h1>
												<table className="flex flex-col gap-4">
													
											
													<thead>
														<tr className="flex flex-row justify-between gap-12 border-b shadow-xl ">
															<th>Investigation</th>
															<th>Result</th>
															<th>Normal Range Value</th>
															<th>Unit</th>
															
														</tr>
													</thead>
													<tbody>
														<tr className="flex flex-row justify-between gap-12 border-b border-dashed border-b-black">
															<th className="capitalize">
																GLUCOSE, FASTING, PLASMA
															</th>
															<td className="absolute ml-[285px]">
															
																{
																	showData
																		?.appointment
																		?.rbs
																}
															</td>
															<td className=" ml-[90px] flex flex-row">
														
																75.00 - 100.00
															</td>
															<td>
																
																mg/dL
															</td>
	
														</tr>
														
														
														
													</tbody>
												</table>
											</div>
											
											) : (
										<>
											<div>
                        {/* <CollapseDiv
							defaultOpen={
								appointment?.status == "pending" &&
								appointment?.hematocrit == null
							}
							withCaret={true}
							title="Patient Vitals"
							headerClassName="bg-blue-50"
							bodyClassName="p-0"
						>
							""
							
						</CollapseDiv> */}
												
												
											</div>
											<div className="flex flex-col">
												
												
											</div>
										</>
									)}
  
</div>


</div>

</div>
									

									{/* <div className="flex flex-col mt-0">
										<ReactQuillField
											label="Doctors remarks"
											placeholder="Enter doctor's remarks here..."
										/>
									</div> */}
								</div>

								<div className="px-4 py-4 border-t flex items-center justify-end bg-slate-">
									<ActionBtn
										// size="lg"
										type="foreground"
										className="px-5"
										onClick={hide}
									>
										CLOSE
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

export default forwardRef(PrintLabResultModal);
