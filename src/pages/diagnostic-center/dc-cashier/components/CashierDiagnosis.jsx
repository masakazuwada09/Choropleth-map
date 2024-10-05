/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
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
import { payment} from "../../../../libs/laboratoryOptions";
import PendingOrdersModal from "./modal/PendingOrdersModal";
import Axios from "../../../../libs/axios";
import { caseCodes } from "../../../../libs/caseCodes";
import Table from "../../../../components/table/Table";


const CashierDiagnosis = (props) => {
	const {
		appointment,
		patient,
		laboratory_test_type,
		lab_rate,
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
	const deleteLabOrderRef = useRef(null);
	const pendingOrdersRef = useRef(null);
	const [hasHematology, setHasHematology] = useState(0);
	const [hasPayment, setHasPayment] = useState();
	const [filterOrder, setfilterOrder] = useState();
	const [modalData, setModalData] = useState(null);
	const [showData, setShowData] = useState(null);
	
	const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

	const isXrayUser = () => {
		return user?.type === "DC-NURSE";
	};
	const onPaymentChecked = () => {
		setHasPayment(getValues(payment.map(b => b.name)).filter(x => x).length);
	  };

	  const onfilterOrder = () => {
		setfilterOrder(getValues(payment.map(b => b.name)).filter(x => x).length);
	  };
	const testHeader = isXrayUser() ? "Imaging Test" : "Laboratory Test";

	const {
		setFilters,
		reloadData,
	} = useDataTable
	
	({
		url: patient?.id ? `/v1/doctor/laboratory-order/patient/${patient?.id}` : null, 
		defaultFilters: {
			...(order_id 
				? { order_id: order_id } 
				: {}),
			...(laboratory_test_type
				? { laboratory_test_type: laboratory_test_type }
				: {}),
			...(lab_rate
				? { lab_rate: lab_rate }
				: {}),
			...(appointment?.id > 0 
				? { appointment_id: appointment?.id } 
				: {}),
		},
	});
	console.log("DATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", lab_rate);


	const submit = () => {
		setLoading(true);
		
		const paymentData = data.map(item => ({
			order_id: item.id, 
			type: item.type,
			order_date: item.order_date, 
			lab_rate: item.lab_rate, 
		}));


		Axios.patch(
			`/v1/doctor/laboratory-order/send-patient-to-laboratory/${patient?.id}`,
			{
				_method: "PATCH",
				payments: paymentData,
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
	
	useNoBugUseEffect({
		functions: () => {
			setFilters((prevFilters) => ({
				...prevFilters,
				
				order_id: order_id,
				lab_rate: lab_rate
			}));
		},
	});

	useEffect(() => {
	const fetchData = async () => {
		try {
			const response = await fetch(`/v1/phic-summary-items`);
			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}
			const data = await response.json();
			setSummaryData(data);
		} catch (error) {
			console.error("Error fetching summary data:", error);
		}
	};

	fetchData();
	}, []);

		let diagnosis = caseCodes?.find(
			(x) => x.CASE_CODE == appointment?.diagnosis_code
		);

		const totalLabRate = data?.reduce((total, item) => {
			// Convert lab_rate to a number, or default to 0 if not a valid number
			const labRate = parseFloat(item.lab_rate) || 0;
			return total + labRate;
		  }, 0);

	return (
		<div
			className="bg-gray-100 p-1 w-[8.3in] h-[7in] gap-y-6 mt- rounded-lg ">
				<div className="flex flex-row mt-2 mb-2 px-2 justify-between gap-2">
									{payment?.map((data, index) => (
											<tr
											key={`${keyByValue(data.label)}`}
											onClick={() => setTimeout(onPaymentChecked, 50)}
											>
											<td className="!py-0 align-middle ">
												<label className="mb-0 p-2 flex items-center text-sm gap-2 text-gray-500 cursor-pointer  hover:!text-gray-300 ">
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
														onClick={handleSubmit(submit)}
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

			<div className="bg-white flex flex-col w-[8in] h-[1.2in] 
			 border-gray-200 border-2 mt-3 rounded-xl mx-auto px-2 py-2" 
				id="phic-form-printable" 
				ref={componentRef}>
												<div className="flex flex-row justify-between w-full pb-1">
												
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
	


    <div className="flex flex-col px-12  -ml-2.5 mt-3 bg-white w-[8in] h-[3in]  border-gray-100 border-2 rounded-lg">
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
						className: "text-center font-mono ",
						tdClassName: "text-center font-bold",
						key: "lab_rate",
								cell: (data) => { 
							return `₱ ${data?.lab_rate}` ;
						},
					},
				]}

				appointment={appointment}
				data={data}
			/>

			<Table
				className={`pb-2`}
				loading={loading}
				columns={[
					{
						header: "Order Date",
						className: "text-left",
						tdClassName: "text-left",
						key: "date",
						cell: (data) => {
							return formatDateMMDDYYYY(
								new Date(data?.order_date)
							);
						},
					},
					{
						header: testHeader,
						className: "text-left",
						tdClassName: "text-left",
						key: "type",
						cell: (data) => {
							return data?.type?.name;
						},
					},
					{
						header: "Status",
						className: "text-center ",
						tdClassName: "text-center",
						key: "order_status",
						cell: (data) => {
							return <Status status={data?.order_status} />;
						},
					},
				]}
				data={data}
			/>
				</div>
				
				{hasPayment ? (
			
			<span className="text-red-500 font-serif text-4xl -rotate-12  opacity-50">PAID</span>
		) : (
			""
		)}
				
				<div className="flex flex-row border p-2 mt-4 justify-start ml-[440px] w-[240px]  mb-5">
					
				<TotalAmount
				amount={totalLabRate}
				className=""
				loading={loading}
				columns={[
					
					{
						header: "Total Summary: ",
						className: "text-right",
						tdClassName: "text-right",
						cell: (data) => { 
							return `₱ ${data?.lab_rate}` ;
						},
					},
					
				]}
				data={data}
			/>
				</div>
					</div>
				
				
								
									
										<div className=" py-5 font-mono justify-start items-center bg-white mt-1 w-[8in] h-[3in] -ml-[10px]  border-gray-100 border-2 rounded-lg">
										
										

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

export default CashierDiagnosis;
