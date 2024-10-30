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
	keyByValue,
    doctorName
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
import InfoText from "../../../../../components/InfoText";
import CaseDetails from "./CaseDetails";
import { caseCodes } from "../../../../../libs/caseCodes";
import AppointmentDetails from "../../../../appointments/components/AppointmentDetails";

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

	

const Diagnosis = (props, ref) => {
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
	const [loading, setLoading] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const componentRef = React.useRef(null);
	const [image, setImage] = useState(null);
	const [tests, setTests] = useState([]);
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [hasChemistry, setHasChemistry] = useState(0);
	const [hasHematology, setHasHematology] = useState(0);
	const [isMinimized, setIsMinimized] = useState(true);
	const [stat, setStat] = useState(null);
	
	
	useEffect(() => {
        const fetchCaseCodes = async () => {
            try {
                const response = await Axios.get("/v1/doctor/diagnosis/list");
                setCaseCodes(response.data.data); // Assuming the API response is in the format { data: [...] }
                setFilteredTests(response.data.data);
            } catch (error) {
                console.error("Error fetching case codes", error);
            }
        };

        fetchCaseCodes();
    }, []);
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
        setImage(reader.result);
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

const approveRelease = () => {
    setLoading(true);
    Axios.post(`v1/clinic/send-from-pharmacy-to-nurse-for-release/${order?.id}`, {
        _method: "PATCH",
    }).then((res) => {
        toast.success(
            "Patient prescription successfully approved for release!"
        );
        setLoading(false);
        mutateAll();
        setOrder(null);
    });
};
console.log("CASEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE", caseCodes
);
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
		<div className="bg-white flex flex-col w-[9.1in] min-h-[11in]  border-gray-100 border-2 rounded-xl px-1 py-1">
		<div className="flex flex-row justify-between w-full pb-1">
		<div>
          <Img src="/laboratory.png" className="mx-auto h-16 w-16 text-gray-300"  />
		</div>
		
		<div className="absolute ml-[90px]">
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
					

					<div className="px-2 flex flex-row justify-end items-start  gap-2">
						<div className="mt-1 flex flex-row gap-2">
						<div className="flex-row">
							<div className="font-semibold text-sm  text-gray-800 justify-end flex">
								{patientFullName(patient)}
							</div>
							
							<div className="text-xs font-mono justify-end flex">
								{patientAddress(patient)}
							</div>

							<div className="text-xs justify-end flex">
								{patient?.gender}
							</div>

							<div className="text-xs font-mono justify-end flex">
								Diagnosis Date: {dateMMDDYYYY()}
							</div>
							
						</div>
										<QRCode
											value={`user-${appointment?.scheduledBy?.username}`}
											className=""
											level="H"
											size={40}
										/>
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
                    <div className="">
					</div>
                                </div>
	  		
									</div>
									
									</div>
                                    <div className="flex flex-row justify-center mt-5">
                                    <h4 className="font-bold text-2xl text-gray-600">
				                        Diagnosis
			                        </h4>
                                   
                                    </div>

										<div className="px-5  font-mono justify-center items-center">
                                        <>
													<div className="grid grid-cols-1 lg:grid-cols-2 gap-2 pb-2 mt-2 text-slate-700">
														<div className="flex flex-col px-5 py-5 bg-[linear-gradient(to_right,_var(--tw-gradient-stops))] rounded-xl  ">
															<div className="flex flex-row justify-between">
															</div>
													
															<CaseDetails
																code={
																	appointment?.diagnosis_code
																}
																cases={
																	caseCodes ||
																	[]
																}
																title="Diagnosis Details"
															/>

																		<InfoText
																			className=""
																			title="Diagnosed By"
																			value={doctorName(appointment?.prescribedByDoctor)}
																		/>
															
													
														</div>	

							<div className=" border border-gray-200 rounded-xl bg-gray-50">
								<div className="flex flex-row justify-start px-3 py-5 gap-2">
													<span icon="fi fi-rs-cursor-finger" className="text-md font-bold  text-md text-gray-800">Medicine to Released</span>

													<InfoText
														className=" text-slate-900"
														
														title="Prescribed By"
														value={doctorName(
															appointment?.prescribedByDoctor
														)}
													/>
													</div>

														<div className="table w-full px-3 mt-2">
														<table>
															<thead>
																<tr>
																	<th>
																		Item
																		Code
																	</th>
																	<th>
																		Item
																		Information
																	</th>
																	<th className="text-center">
																		Qty
																	</th>
																</tr>
															</thead>
															<tbody>
																{appointment?.prescriptions?.map(
																	(item) => {
																		return (
																			<>
																				<tr
																					key={`opri-${item?.id}`}
																				>
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
																					<td className="text-center">
																						{
																							item?.quantity
																						}
																					</td>
																				</tr>
																				<tr>
																					<td
																						colSpan={
																							3
																						}
																					>
																						<div className="flex gap-4">
																							<span className="font-bold">
																								{" "}
																								Sig.:
																							</span>
																							<div
																								className="bg-yellow-100 px-4"
																								dangerouslySetInnerHTML={{
																									__html: item?.details,
																								}}
																							></div>
																						</div>
																					</td>
																				</tr>
																			</>
																		);
																	}
																)}
															</tbody>
														</table>
													</div>
													</div>

													</div>

							
												</>


						

										<div className="flex flex-col border-b-2 p-2 text-sm relative">
											
										
											
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

export default forwardRef(Diagnosis);
