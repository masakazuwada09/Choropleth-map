/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import useDataTable from "../../../../hooks/useDataTable";
import Img from "../../../../components/Img";
import {
	formatDateMMDDYYYY,
	patientFullName,
	patientAddress,
	keyByValue,
	dateMMDDYYYY
} from "../../../../libs/helpers";
import FlatIcon from "../../../../components/FlatIcon";
import ActionBtn from "../../../../components/buttons/ActionBtn";
import QRCode from "qrcode.react";
import { useAuth } from "../../../../hooks/useAuth";
import useNoBugUseEffect from "../../../../hooks/useNoBugUseEffect";
import DeleteOrderModal from "../../../../components/patient-modules/modals/DeleteOrderModal";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import PaymentTable from "./PaymentTable";
import TotalAmount from "./TotalAmount";
import { payment } from "../../../../libs/laboratoryOptions";
import PendingOrdersModal from "./modal/PendingOrdersModal";
import Axios from "../../../../libs/axios";

const Status = ({ status }) => {
	const color = () => {
		switch (status) {
			case "pending":
				return " text-red-700";
			case "for-result-reading":
				return " text-blue-700";
			default:
				return " text-white";
		}
	};
	return (
		<span
			className={`${color()} px-2 italic text-center rounded-2xl text-xs py-[2px]`}
		>
			{status}
		</span>
	);
};

const LaboratoryOrders = (props) => {
	const {
		showTitle = true,
		appointment,
		patient,
		laboratory_test_type,
		allowCreate = true,
		onUploadLabResultSuccess,
		order_id,
	} = props;
	const {
		register,
		getValues,
		setValue,
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const { user } = useAuth();

	const componentRef = React.useRef(null);
	const [image, setImage] = useState(null);
	
	const pendingOrdersRef = useRef(null);
	const [order, setOrder] = useState(null);
	const [hasHematology, setHasHematology] = useState(0);
	const [hasPayment, setHasPayment] = useState();
	const [modalData, setModalData] = useState(null);
	const [showData, setShowData] = useState(null);
	
	const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

	const isLaboratoryUser = () => {
		return user?.type == "RHU-XRAY" || user?.type == "DC-CASHIER";
	};
	const isXrayUser = () => {
		return user?.type === "DC-NURSE";
	};
	const onPaymentChecked = () => {
		setHasPayment(getValues(payment.map(b => b.name)).filter(x => x).length);
	  };
	const testHeader = isXrayUser() ? "Imaging Test" : "Laboratory Test";
	const {
		page,
		setPage,
		meta,
		setMeta,
		loading,
		setLoading,
		paginate,
		setPaginate,
		data,
		setData,
		column,
		setColumn,
		direction,
		setDirection,
		filters,
		setFilters,
		reloadData,
	} = useDataTable
	({
		url: patient?.id ? `/v1/doctor/laboratory-order/patient/${patient?.id}` : null, 
		defaultFilters: {
			...(order_id ? { order_id: order_id } : {}),
			...(laboratory_test_type
				? { laboratory_test_type: laboratory_test_type }
				: {}),
			...(appointment?.id > 0 ? { appointment_id: appointment?.id } : {}),
		},
	});
	const sendPatientToLab = () => {
		setLoading(true);
		Axios.post(
			`/v1/doctor/laboratory-order/send-patient-to-laboratory/${modalData?.id}`,
			{
				_method: "PATCH",
			}
		).then((res) => {
			if (res?.data?.pending_lab_orders?.length == 0) {
				toast.error("Error! NO PENDING LABORATORY ORDER.");
			} else {
				toast.success(
					"Success! Patient sent to Laboratory for test(s)."
				);
				setLoading(false);
				mutateAll();
				hide();
			}
		});
	};
	const show = (data) => {
		setFull(false);
		setShowData(data);
		setPatient(data?.patient);
		setModalOpen(true);
	};

	
	useNoBugUseEffect({
		functions: () => {
			setFilters((prevFilters) => ({
				...prevFilters,

				order_id: order_id,
			}));
		},
	});
	


	const deleteLabOrderRef = useRef(null);
	const isDoctor = () => {
		return String(user?.type || "")
			.toLowerCase()
			.includes("doctor");
	};

	const renderResultCell = (data) => {
    if (data?.order_status === "pending") {
        if (isLaboratoryUser()) {
            const labModalRefs = {
				//Chemistry
                "FBS": uploadFBSRef,
                "RBS": uploadRBSRef,
                "Creatinine": uploadCreatinineRef,
                "Uric Acid": uploadUricAcidRef,
                "SGOT": uploadSGOTRef,
                "SGPT": uploadSGPTRef,
                "Alkaline Phos": uploadAlkalinePhosRef,
                "LDH": uploadLDHRef,
                "GGT": uploadGGTRef,
                "Magnesium": uploadMagnesiumRef,
                "Phophorus": uploadPhophorusRef,
                "Amylase": uploadAmylaseRef,
				"Culture and Sensitivity Initial Result": uploadcultureInitialRef,
                "Lipid Profile": uploadLipidProfileRef,
                "Electrolytes": uploadElectrolytesRef,
                "Bilirubin": uploadBilirubinRef,
                "Total Protein": uploadTotalProteinRef,
                "Urea": uploadUreaRef,
                "Oral Glucose Tolerance Test": uploadOralGlucoseRef,
                "24 Hours Urine Creatinine Clearance": uploadUrineCreatinineRef,
				//Hematology
				"CBC": uploadCBCResultRef,
                "Cuagulation Studies": uploadCuagulationStudiesRef,
                "Differential Count": uploadDifferentialCountRef,
                "Erythrocyte": uploadErythrocyteRef,
                "Platelet Count": uploadPlateletCountRef,
                "Red Cell Indices": uploadRedcellInficesRef,
				"Rerticulocyte Count": uploadReticulocyteRef,
				//Microbiology
				"AFB Stain": uploadAFBStainRef,
                "Culture Sensitivity Final Result": uploadCultureSensitivityFinalRef,
                "Gram Stain": uploadGramStainRef,
				"KOH": uploadKOHRef,
				//Microscopy
					//fecalysis
					"Ascaris Lumbricoides Ova": uploadAscarisRef,
					"Entamoeba Coli Cyst ": uploadEntomoebaCystRef,
					"Entamoeba Coli Trophozoite": uploadEntomoebaTrophozoiteRef,
					"Entamoeba Histolytica Cyst": uploadEntamoebaHistolyticaCystRef,
					"Entamoeba Histolytica Trophozoite": uploadEntamoebaHistolyticaTrophozoiteRef,
					"Fecal Occult Blood": uploadFecalOccultRef,
					"Giardia Lamblia Cyst": uploadGiardiaCystRef,
					"Giardia Lamblia Trophozoite": uploadGiardiaTrophozoiteRef,
					"Hookworm Ova": uploadHookwormRef,
					"Fecalysis Macroscopic Examination": uploadMacroscopicFecalysisRef,
					"Fecalysis Microscopic Examination": uploadMicroscopicFecalysisRef,
					"Trichiuris trichiura Ova": uploadTrichiurisRef,
					//Urine
					"Casts": uploadCastsRef,
					"Chemical Examination": uploadChemicalRef,
					"Crystal": uploadCrystalRef,
					"Urine Macroscopic Examination": uploadMacroscopicUrineRef,
					"Urine Microscopic Examination": uploadMicroscopicUrineRef,
					"Pregnancy Test": uploadPregnancyTestRef,
				//Serology
				"HBsAg (Hepatitis B Surface Antigen)": uploadHBsAGRef,
				"Anti - HBS": uploadAntiHBSRef,
				"Anti - HCV": uploadAntiHCVRef,
				"Syphilis (Rapid Test)": uploadSyphilisRef,
				"ASO (Antistreptolysin O Titer)": uploadASORef,
				"RA/RF (Rheumatoid Factor)": uploadRheumatoidRef,
				"CRP (C-Reactive Protein)": uploadCRPRef,
				"Troponin - I": uploadTroponinRef,
				"Dengue Duo": uploadDengueDuoRef,
				"Typhoid Test": uploadTyphoidRef,
				"Widal Test": uploadWidalTestRef,
				"CK - MB": uploadCKMBRef,

				"Blood Typing": uploadBloodTypeRef,
				"Covid-19 Rapid Test": uploadCovidTestRef,
				"Cross Matching": uploadCrossMatchingRef,
				"Miscellaneous Form": uploadMiscellaneousRef,
				
			};

    const modalRef = labModalRefs[data?.type?.name] || uploadLabResultRef;
            return (
                <span
                    className="text-blue-700 flex items-center justify-center cursor-pointer hover:bg-slate-200 py-2 rounded-3xl gap-1"
                    onClick={() => modalRef.current.show(data)}
                >
                    <FlatIcon icon="rr-upload" />
                    {data?.type?.name === "CBC" || data?.type?.name === "RBS" || data?.type?.name === "FBS" ? "Add Result" : "Upload"}
					
                </span>
            );
        } else {
            return (
				<span
					className="text-blue-700 flex items-center justify-center cursor-pointer hover:bg-slate-200 py-2 rounded-3xl gap-1"
					onClick={() => printLabReceiptRef.current.show({...data, appointment})}
				>
					<FlatIcon icon="rs-document" />
					Print Result
				</span>
			);
        }
    } else if (data?.order_status === "pending") {
        return (
            <span
                className="text-blue-700 flex items-center justify-center cursor-pointer hover:bg-slate-200 py-2 rounded-3xl gap-1"
                onClick={() => printLabResultRef.current.show({...data, appointment})}
            >
                <FlatIcon icon="rs-document" />
                View Result
            </span>
        );
    } else {
        return null;
    }
};
	return (
		<div
			className="bg-gray-900 p-1 w-[8.3in] h-[7in] gap-y-6 mt- rounded-lg ">
				<div className="flex flex-row mt-2 mb-2 px-2 justify-between gap-2">
									{payment?.map((data, index) => (
											<tr
											key={`${keyByValue(data.label)}`}
											onClick={() => setTimeout(onPaymentChecked, 50)}
											>
											<td className="!py-0 align-middle ">
												<label className="mb-0 p-2 flex items-center text-sm gap-2 text-gray-100 cursor-pointer  hover:!text-gray-300 ">
												<input
													type="checkbox"
													className=""
													{...register(data.name, {})}
												/>
												<span>{data.label}</span>
												</label>
											</td>
											<td className="p-1">
												
											</td>
											</tr>
										))}

										 {hasPayment ? (
											<div className="flex flex-row gap-2 ">
													<ActionBtn
														className="font-bold transition ease-in-out delay-30 hover:-translate-y-1 hover:scale-100 duration-300"
														onClick={handlePrint}
														type="success"
													>
														<FlatIcon icon="rr-print" className="text-sm mr-1	"/> Print
													</ActionBtn>
													

													<ActionBtn
														type="secondary"
														
														size=""
														onClick={() => {
															if (
																pendingOrdersRef
															) {
																console.log(
																	"pendingOrdersRef",
																	pendingOrdersRef
																);
																pendingOrdersRef?.current.show(
																	{
																		data: modalData,
																		fn: sendPatientToLab,
																	}
																);
																
															}
														}}
														className="items-center transition ease-in-out delay-30 hover:-translate-y-1 hover:scale-100 duration-300"
													>
														<FlatIcon
															className="text-sm mr-1	"
															icon="rr-right"
														/>
														<div className="flex flex-col text-left ">
															<span className="font-bold text-sm  ">
																Send Order
															</span>
														
														</div>
													</ActionBtn>
													
											</div>
														
													
														 ) : (
															<div className="flex flex-row gap-2">
													
															<span
															  
															  size="sm"
															  loading={loading}
															  className="gap-4 px-6 py-2 bg-gray-800 rounded-md text-sm text-gray-400 "
															  // onClick={handleSubmit(sendToInfectious)}
															>
															  
															  Check Payment
															</span>
															<ActionBtn
														className="font-bold transition ease-in-out delay-30 hover:-translate-y-1 hover:scale-100 duration-300"
														onClick={handlePrint}
														type="success"
													>
														<FlatIcon icon="rr-print" className="text-sm mr-1	"/> Print
													</ActionBtn>
															<ActionBtn
														className="font-bold transition ease-in-out delay-30 hover:-translate-y-1 hover:scale-100 duration-300"
														onClick={() => {
															deleteLabOrderRef.current.show(
																data
															);
														}}
														type="danger"
													>
														<FlatIcon icon="rr-print" className="text-sm mr-1	"/> Delete
															</ActionBtn>
															</div>
															
														  )}
						
									</div>
	<div className="bg-white flex flex-col w-[8in] h-[1.2in]  border-gray-200 border-2 mt-3 rounded-xl mx-auto px-2 py-2" id="phic-form-printable" ref={componentRef}>
		<div className="flex flex-row justify-between w-full pb-1">
		{hasPayment ? (
			
		<span className="text-red-500 font-serif text-4xl -rotate-12 absolute mt-[280px] ml-[600px] opacity-50">PAID</span>
	) : (
		""
	)}
	<div className="gap-2 flex">
	<div>
		
	<Img src="/laboratory.png" className="mx-auto h-10 w-10 text-gray-300 filter grayscale" aria-hidden="true" />

	  

	  </div>
	  
	  <div className=" ">
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

	</div>
		
					

					<div className="px-2 flex flex-row justify-end items-start  gap-2">
										
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
								Admission Date: {dateMMDDYYYY()}
							</div>
							<h4 className="font-bold text-md font-mono text-gray-900 flex justify-end">
								LABORATORY INVOICE
							</h4>
						</div>
						<div className="mt-1">
										<QRCode
											value={`user-${appointment?.scheduledBy?.username}`}
											className=""
											level="H"
											size={40}
										/>
						</div>			
                    </div>
				</div>
	


    <div className="flex flex-col px-12  -ml-2.5 mt-3 bg-white w-[8in] h-[3in]  border-gray-200 border-2 rounded-lg">
		<div>
			<PaymentTable
				className={`pb-1 text-xs mt-6`}
				loading={loading}
				columns={[
					{
						header: "Order Date",
						className: "text-center font-mono",
						tdClassName: "text-center ",
						key: "date",
						cell: (data) => {
							return formatDateMMDDYYYY(
								new Date(data?.order_date)
							);
						},
					},
					{
						header: testHeader,
						className: "text-center font-mono",
						tdClassName: "text-center",
						key: "type",
						cell: (data) => {
							return data?.type?.name;
						},
					},
					{
						header: "Laboratory Rate",
						className: "text-center font-mono",
						tdClassName: "text-center",
						key: "",
						cell: (data) => {patient?.room_credit}
					},
					
				]}
				data={data}
			/>
				</div>
				
				
				<div className="flex flex-row justify-start ml-[430px] w-[200px] mt-20 mb-5">
				<TotalAmount
				className={``}
				loading={loading}
				columns={[
					
					{
						header: "TOTAL: ",
						className: "text-left",
						tdClassName: "text-left",
						// cell: (data) => {
						// 	return formatDateMMDDYYYY(
						// 		new Date(data?.order_date)
						// 	);
						// },
					},
					
					
					
				]}
				data={data}
			/>
				</div>
					</div>
				
				
								
									
										<div className=" py-5 font-mono justify-start items-center bg-white mt-1 w-[8in] h-[3in] -ml-[10px]  border-gray-200 border-2 rounded-lg">
										
										

										<div className="flex flex-col border-b-2 p-2 text-xs relative text-gray-500  bg-white">
											<b>Terms and Conditions:</b>
											<div className="absolute">
												
											</div>
											<p className="text-xs ">
											<b>1. Payment:</b> Payment is due at the time of service unless prior arrangements are made.
											</p>
											<p className="text-xs">
											<b>2. Results:</b> Test results will be provided as specified, typically within [X] days.
											</p>
											<p className="text-xs">
											<b>3. Accuracy:</b> We ensure the accuracy of tests; however, results should be interpreted by a healthcare provider.
											</p>
											<p className="text-xs">
											<b>4. Confidentiality:</b> All patient information is kept confidential according to HIPAA regulations.
											</p>
											<p className="text-xs">
											<b>5. Re-tests:</b> Additional tests may be required if initial results are inconclusive.
											</p>
											<p className="text-xs">
											<b>6. Cancellation:</b> Appointments must be canceled at least [X] hours in advance.
											</p>
											<p className="text-xs">
											<b>7. Liability:</b> The lab is not responsible for any delays caused by external factors.
											</p>
											
											
										</div>
										<div className="flex flex-row items-end justify-end">
										
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
									<div>
									</div>
									
									<DeleteOrderModal
									ref={deleteLabOrderRef}
									onSuccess={() => {
									reloadData();
									}}
									/>

									<PendingOrdersModal
											
											pendingOrdersRef={pendingOrdersRef}
											patient={
												patient
											}
											laboratory_test_type={
												2
											}
											appointment={
												modalData
											}
											allowCreate={
												false
											}
											ref={pendingOrdersRef} />
											
									</div>
									
		
	);
};

export default LaboratoryOrders;
