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
	calculateBMI, calculateBPMeasurement,
	keyByValue
} from "../../../../../libs/helpers";
import { chemistry, hematology } from "../../../../../libs/laboratoryOptions";
import ActionBtn from "../../../../../components/buttons/ActionBtn";
import Axios from "../../../../../libs/axios";
import useNoBugUseEffect from "../../../../../hooks/useNoBugUseEffect";
import { useReactToPrint } from "react-to-print";
import FlatIcon from "../../../../../components/FlatIcon";
import QRCode from "qrcode.react";
import Barcode from "react-barcode";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Img from "../../../../../components/Img";
import Draggable from "react-draggable";
import ReactQuillField from "../../../../../components/inputs/ReactQuillField";
import DOMPurify from "dompurify";

const laboratory_tests = chemistry?.map((data) => data?.name);

const FormHeading = ({ title }) => {
	return (
		
		<div className="flex items-center">
		<div className="flex items-center">
		  
		</div>
		<div className="flex-grow flex items-center justify-center ">
		  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		</div>
	
		
		  <div className="slanted bg-gray-500 flex items-end justify-end "></div>
		
		  
	  </div>
	);
};

	

const Prescription = (props, ref) => {
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
	const [order, setOrder] = useState(null);
	const [fitToWork, setFitToWork] = useState("");
	const componentRef = React.useRef(null);
	const [image, setImage] = useState(null);
	const [tests, setTests] = useState([]);
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [hasChemistry, setHasChemistry] = useState(0);
	const [hasHematology, setHasHematology] = useState(0);
	const [isMinimized, setIsMinimized] = useState(true);
	const [recommendation, setRecommendation] = useState(""); 
	const [imageSrc, setImageSrc] = useState(null);
    const onSubmit = (data) => {
        // Update recommendation state
        setRecommendation(data.recommendation);
        // Handle form submission
    };

	const handleToggleAdvanced = () => {
	  setShowAdvanced(!showAdvanced);
	};

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
	const handleDownload = () => {
		const data = () => componentRef.current;
		const url = window.URL.createObjectURL(data);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'example.txt'); // or any other extension
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImageSrc(reader.result);
          };
          reader.readAsDataURL(file);
        }
      };

  const onChemistryChecked = (name) => {
	console.log("onChemistryChecked");
	setHasChemistry(
		getValues(laboratory_tests).filter((x) => x == true).length
	);
};
const onHematologyChecked = (name) => {
	console.log("onHematologyChecked");
	setHasHematology(
		getValues(laboratory_tests).filter((x) => x == true).length
	);
};
	
	return (
		<>
             <div className=" flex flex-row gap-y-4 relative gap-5">
			 <div className="bg-gray-600 p-3 min-h-[14in]  overflow-auto phic-forms">
								
							 <div className="flex flex-row justify-end">
									<ActionBtn
											className="text-base gap-2 ml-2 mb-2"
											onClick={handlePrint}
											type="secondary"
										>
											<FlatIcon icon="rr-print" /> Print
										</ActionBtn>
										<ActionBtn
											className="text-base gap-2 ml-2 mb-2"
											onClick={handleDownload}
											type="teal"
										>
											<FlatIcon icon="fi fi-bs-disk" /> Download
										</ActionBtn>
								</div>
									

											
		<div
		className="bg-white p-2 w-[9.3in] gap-y-6 "
		id="phic-form-printable" ref={componentRef}
		>
		<div className="bg-white flex flex-col w-[9.1in] min-h-[11in]  border-blue-100 border-2 rounded-xl px-1 py-1">
		<div className="flex flex-row justify-between w-full pb-1">
		<div>
		
        <div className="">
			<p className="text-xs font-mono font-bold text-gray-900">
				<i>GTC Diagnostic Center</i>
			</p>
			
			<p className="text-xs font-mono font-bold text-gray-900">
				<i>Republic of the Philippines</i>
			</p>
			
			<p className="text-xs font-mono text-gray-500">
				Citystate Centre 709 Street, Address City
			</p>
			<p className="text-xs font-mono text-gray-500">
				Call Center (02) 441-7442 l Trunkline (02)
				441-7444
			</p>
			<p className="text-xs font-mono text-gray-500">www.laboratory.gov.ph</p>
				
		</div>
		<div className="flex mt-5 ml-[80px] gap-5">
		<Img src="/prescriptionlogo.png" className="mx-auto h-20 w-20 text-gray-300"  />
		<div className="flex-row">
							<div className="font-semibold text-sm  text-gray-800  flex">
								{patientFullName(patient)}
							</div>
							
							<div className="text-xs font-mono  flex">
								{patientAddress(patient)}
							</div>

							<div className="text-xs  flex">
								{patient?.gender}
							</div>

							<div className="text-xs font-mono  flex">
								Diagnosis Date: {dateMMDDYYYY()}
							</div>
							
						</div>
		</div>
        
		
		</div>
		
		
					

					<div className="px-2 flex flex-row justify-end items-start  gap-2">
										
					
					<div className="px-2 flex flex-row justify-end items-start  gap-2">
						<div className="mt-1 flex flex-row gap-2">
						
										<QRCode
											value={`user-${appointment?.scheduledBy?.username}`}
											className=""
											level="H"
											size={40}
										/>
						</div>
										
                    </div>
										
                    </div>
					
					
								
		{/* {showData?.type?.name == "CBC" ? (
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
		)} */}

	</div>
	

  <div className="flex items-center relative justify-center  px-2 pt-2">
  <div className="flex flex-wrap ">
   
    </div>
	  <div className="flex flex-col text-start w-full mx-auto">
	  <div className="flex flex-row justify-between ">

                                </div>
	  		
									</div>
									
									</div>
                                    <div className="flex flex-row justify-center mt-5 border-b-slate-400 border-b border-spacing-10">
										<div className="flex flex-row "></div>
                                   
                                   
                                    </div>

									<div className="px-5  font-mono justify-center items-center">
										<div className="flex flex-row items-end justify-start mt-5 ml-[10px] text-gray-700 w-full">
											
										<tbody>
											<h1>
												(Prescription)
											</h1>
										
																	{appointment?.prescriptions?.map(
																		(item) => {
																			console.log("RESULT_READINGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG", item
																				);
																			return (
																				<>
																					<tr
																						key={`opri-${item?.id}`}
																						className="text-sm font-bold text-gray-800 gap-12 flex ml-5 divide-x-2 space-x-28 justify-items-end"
																					>

																						<td>
																						{item
																						?.quantity}
																						</td>
																						<td>
																							{
																								item
																									?.item
																									?.unit_measurement
																							}
																						</td>
																						<td>
																							{
																								item
																									?.item
																									?.code
																							}
																						</td>
																						
																						<td>
																							{
																								item
																									?.item
																									?.name
																							}
																						</td>
																						
																					</tr>
																					<span className="py-5">
																									{" "}
																									Sign:
																								</span>
																								<div
																									className="bg-gray-100 px-2"
																									dangerouslySetInnerHTML={{
																										__html: item?.details,
																									}}
																								></div>
																					<tr>
																						<td
																							colSpan={
																								3
																							}
																						>
																							<div className="flex gap-12">
																								
																							</div>
																						</td>
																					</tr>
																				</>
																			);
																		}
																	)}
																</tbody>
						                     </div>

											 <div className="flex flex-col items-start ml-[50px] mt-12 text-gray-700">
											 <h1>
												(Subscription)
											</h1>
                                                        <div
                                                            className="flex-1 text-justify text-md font-medium ml-5 text-gray-800" 
                                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(recommendation) }} 
                                                        />
                                                    </div>
											
											
													<div className="flex flex-col items-center mt-[300px]  ">
                                                {imageSrc && (
                                                    <div className="  flex flex-col justify-end items-center">
                                                    <img
                                                        src={imageSrc}
                                                        alt="Uploaded Signature"
                                                        className="max-w-xs w-40 h-24"
                                                    />
                                                        
                                                    </div>
                                                )}
                                                <span className="border-t-gray-500 border-t px-9">Prescribed by: </span>
                                                </div>


														

											<div className="ml-[650px] flex flex-col">
												<span className="flex w-full">
													℞ Number:<span className="underline" 
													dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(recommendation) }} 
													/>
												</span>

												<span className="flex w-full">
													S/N:<span className="underline" 
													dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(recommendation) }} 
													/>
												</span>

												<span className="flex w-full">
													Exp. Date:<span className="underline" 
													dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(recommendation) }} 
													/>
												</span>
												
												
											</div>
											

										</div>
										
									
									

								{hasHematology ? (
										<div className="px-5 py-5 font-mono justify-center items-center">

										<h1 className="flex justify-center font-bold text-lg border-b border-t mb-2">Hematology</h1>
											<table className="flex flex-col gap-4">
												
										
												<thead>
													<tr className="flex flex-row justify-between gap-12 border-b ">
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
															}
														</td>
														<td className=" ml-[100px] flex flex-row">
													
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
														<tr className="flex flex-row justify-between gap-12 border-b ">
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
										""
									)}
									
  			
  
									</div>


									</div>



									</div>

	<Draggable>
      <div className={`bg-gray-300 w-[3.5in] gap-y-2 border rounded-md py-2 px-2 shadow-2xl ml-[10px] mt-[10px] absolute ${isMinimized ? 'minimized' : ''}`}>
        <div className="flex justify-between">
          <h2 className="block text-sm font-xs leading-6 text-gray-800 font-semibold">
            Edit Prescription
          </h2>
          <div className="flex items-center">
            <FlatIcon className="text-md" icon="fi fi-ss-menu-burger" />
            <button
              className="ml-2 text-xs text-gray-600"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? '▲' : '▼'}
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
			<div className="border mt-7 rounded-lg px-2 shadow-lg py-2">
              <div className="flex flex-row gap-2 items-center">
                <FlatIcon icon="fi fi-rr-edit" className="block text-xs font-sm leading-6 text-gray-900" />
                <span className="text-xs">Doctor's Prescription</span>
              </div>
              <div className="flex flex-col mt-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name="recommendation"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name } }) => (
                      <ReactQuillField
                        name={name}
                        value={value}
                        onChange={onChange} // Ensure this updates the state
                        placeholder="Enter Prescription here..."
                      />
                    )}
                  />
                  <div className="flex justify-end">
                    <button className="text-xs bg-gray-200 hover:bg-gray-400 rounded-lg px-4 py-1 mt-2 text-teal-700 hover:text-teal-50 transition-colors duration-300" type="submit">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="border mt-7 rounded-lg px-2 shadow-lg py-2">
              <div className="flex flex-row gap-2 items-center border-b mb-3">
                <FlatIcon icon="fi fi-rr-edit" className="block text-xs font-sm leading-6 text-gray-900" />
                <span className="text-xs">Prescribed Medicine</span>
              </div>
              <div className="flex flex-row gap-x-4">
				GET MEDICINE DATA
                {/* <div className="flex items-center">
                  <input
                    id="fitToWork"
                    type="checkbox"
                    checked={fitToWork === "Fit to Work"}
                    onChange={() => setFitToWork("Fit to Work")}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="fitToWork" className="ml-2 text-xs font-medium text-gray-700">
                    Fit to Work
                  </label>
                </div> */}
                {/* <div className="flex items-center">
                  <input
                    id="notFitToWork"
                    type="checkbox"
                    checked={fitToWork === "Not Fit to Work"}
                    onChange={() => setFitToWork("Not Fit to Work")}
                    className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="notFitToWork" className="ml-2 text-xs font-medium text-gray-900">
                    Not Fit to Work
                  </label>
                </div> */}
                {/* <div className="flex items-center">
                  <input
                    id="none"
                    type="checkbox"
                    checked={fitToWork === ""}
                    onChange={() => setFitToWork("")}
                    className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="none" className="ml-2 text-xs font-medium text-gray-900">
                    None
                  </label>
                </div> */}
              </div>
            </div>

            

            <div className="mt-7 flex justify-center rounded-lg border border-dashed border-gray-900/25">
              <div className="text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                <div className="flex text-sm leading-b text-gray-600">
                  <label
                    htmlFor="file-input"
                    className="relative cursor-pointer rounded-md  font-semibold text-teal-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2 hover:text-teal-500"
                  >
                    Upload Signature
                    <input
                      type="file"
                      id="file-input"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <p className="text-xs leading-5 text-gray-600">PNG, JPG, Bitmap</p>
              </div>
            </div>
          </>
        )}
      </div>
    </Draggable>
									
									

									{/* <div className="flex flex-col mt-0">
										<ReactQuillField
											label="Doctors remarks"
											placeholder="Enter doctor's remarks here..."
										/>
									</div> */}
								</div>

								<div className="px-4 py-4 border-t flex items-center justify-end bg-slate-">
									
								</div>
        
        </>
						
							
	);
};

export default forwardRef(Prescription);
