/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect, useImperativeHandle } from "react";
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
import { Controller, useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import PaymentTable from "./PaymentTable";
import TotalAmount from "./TotalAmount";
import { payment, delete_order } from "../../../../libs/laboratoryOptions";
import PendingOrdersModal from "./modal/PendingOrdersModal";
import Axios from "../../../../libs/axios";
import { caseCodes } from "../../../../libs/caseCodes";
import DeleteSingleOrderModal from "./modal/DeleteSingleOrderModal";
import DeleteAllOrderModal from "./modal/DeleteAllOrderModal";
import LaboratoryOrdersModal from "./modal/LaboratoryOrdersModal";

const LaboratoryOrders = (props, ref) => {
	const {
		appointment,
		patient,
		setPatient,
		laboratory_test_type,
		lab_rate,
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
	const deleteSingleOrderRef = useRef(null);
	const deleteAllOrderRef = useRef(null);
	const { mutateAll, pendingOrdersRef } = props;
	const [hasPayment, setHasPayment] = useState();
	const [deleteOrder, setdeleteOrder] = useState();
	const [modalData, setModalData] = useState(null);
	const [order, setOrder] = useState(null);
	const [isPrinting, setIsPrinting] = useState(false);
	const [isDeleteOrderChecked, setIsDeleteOrderChecked] = useState(false);
	const [showData, setShowData] = useState(null);
	const [loadingDone, setLoadingDone] = useState(false);

	const {
		loading,
		setLoading,
		data,
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
	const show = (data) => {
		setFull(false);
		setShowData(data);
		setPatient(data?.patient);
		setModalOpen(true);
	};
	const hide = () => {
		setModalOpen(false);
	};
	const handlePrint = useReactToPrint({
        // content: () => componentRef.current,
		content: () => {
			setIsPrinting(true); // Set printing state to true
			return componentRef.current;
		},
		onAfterPrint: () => setIsPrinting(true), // Reset printing state after printing
    });

	  const handleDelete = async (id) => {
		try {
			await deleteSingleOrderRef(id); // Your delete function
			// Call the function to refresh PaymentTable here
			refreshPaymentTable(); // Ensure this function is defined to refresh the table
		} catch (error) {
			console.error("Delete failed:", error);
		}
	};
	const refreshPaymentTable = () => {
        // Logic to refresh or re-fetch payment data
        reloadData(); // Assuming reloadData will fetch the latest data
    };
	const isXrayUser = () => {
		return user?.type === "DC-NURSE";
	};
	const onPaymentChecked = () => {
		setHasPayment(getValues(payment.map(b => b.name)).filter(x => x).length);
	  };

	// const onDeleteOrders = () => {
	// 	setdeleteOrder(getValues(delete_order.map(b => b.name)).filter(x => x).length);
	//   };
	const onDeleteOrders = () => {
		const checkedDeleteOrders = getValues(delete_order.map(b => b.name)).filter(x => x);
		setIsDeleteOrderChecked(checkedDeleteOrders.length > 0);
		setdeleteOrder(checkedDeleteOrders.length > 0);
	  };
	// const onDeleteOrders = () => {
	// 	// Get the checked delete_order checkboxes
	// 	const checkedDeleteOrders = getValues(delete_order.map(b => b.name)).filter(x => x);
	// 	// Set deleteOrder to true if there are any checked checkboxes, otherwise false
	// 	setdeleteOrder(checkedDeleteOrders.length > 0);
	//   };
	
	const testHeader = isXrayUser() ? "Imaging Test" : "Laboratory Test";
	
	
	
	console.log("DATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", lab_rate);
	
	// const sendPatientToLab = () => {
	// 	setLoading(true);
	// 	Axios.post(
	// 		`/v1/doctor/laboratory-order/send-patient-to-laboratory/${showData?.id}`,
	// 		{
	// 			_method: "PATCH",
	// 		}
	// 	).then((res) => {
	// 		if (res?.data?.pending_lab_orders?.length == 0) {
	// 			toast.error("Error! NO PENDING LABORATORY ORDER.");
	// 		} else {
	// 			toast.success(
	// 				"Success! Patient sent to Laboratory for test(s)."
	// 			);
	// 			setLoading(false);
	// 			mutateAll();
	// 			hide();
	// 		}
	// 	});
	// };
	const markAsDone = () => {
		setLoadingDone(true);
		Axios.post(`/v1/doctor/mark-as-done/${showData?.id}`, {
			_method: "PATCH",
		}).then((res) => {
			toast.success("Success! Patient marked as done.");
			setLoadingDone(false);
			mutateAll();
			hide();
		});
	};

	const sendPatientToLab = () => {
		
		setLoading(true);
		
		const paymentData = data.map(item => ({
			order_status: item.order_status,
			order_date: item.order_date,
			order_id: item.id, 
			notes: item.notes, 
			type: item.type,
			laboratory_test_type: item.laboratory_test_type,
			order_date: item.order_date, 
			lab_rate: item.lab_rate, 
		}));
		
		// Check if patient is not null before accessing patient.id
		if (patient) {
			Axios.patch(
				`/v1/doctor/laboratory-order/send-cashier-to-laboratory/${showData?.id}`,
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
		} else {
			console.error("Patient is null, cannot submit.");
			setLoading(false);
		}
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
			className="bg-gray-300 p-1 w-[8.3in] h-[7in] gap-y-2 mt- rounded-lg shadow-inner">
				<div className="flex flex-row mt-2 mb-2 px-2 justify-end gap-1">
					
									{payment?.map((data, index) => (
											<tr
											key={`${keyByValue(data.label)}`}
											onClick={() => setTimeout(onPaymentChecked, 50)}
											>
											<td className="!py-0 align-middle ">
												<label className="mb-0 p-2 flex items-center text-sm gap-1 text-gray-500 cursor-pointer  hover:!text-gray-300 ">
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

										{delete_order?.map((data, index) => (
											<tr
											key={`${keyByValue(data.label)}`}
											onClick={() => setTimeout(onDeleteOrders, 50)}
											>
											<td className="!py-0 align-middle ">
												<label className="mb-0 p-2 flex items-center text-sm gap-1 text-gray-500 cursor-pointer  hover:!text-gray-300 ">
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
										

										 {hasPayment && !isDeleteOrderChecked ? (
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
															loading={loading}
															size="lg"
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
																			data: showData,
																			fn: sendPatientToLab,
																		}
																	);
																	hide();
																}
															}}
															className="px-4"
														>
															<FlatIcon
																className="text-3xl mr-1	"
																icon="rr-right"
															/>
															<div className="flex flex-col text-left">
																<span className="font-bold -mb-1">
																	Send Order
																</span>
																<span className="text-[10px] font-light">
																	Patient
																	queue to
																	laboratory/imaging
																</span>
															</div>
														</ActionBtn>

													


													{/* <ActionBtn
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
													</ActionBtn> */}

													<ActionBtn
															loading={
																loadingDone
															}
															type="primary-dark"
															size="lg"
															onClick={() => {
																markAsDone();
															}}
															className="px-4"
														>
															<FlatIcon
																className="text-3xl mr-1	"
																icon="rr-right"
															/>
															<div className="flex flex-col text-left">
																<span className="font-bold -mb-1">
																	Done
																</span>
																<span className="text-[10px] font-light">
																	Patient Queue to Operation Screening
																</span>
															</div>
														</ActionBtn>
													
											</div>
														
													
														 ) : (
														<div className="flex flex-row gap-2">
												
															{/* <ActionBtn
														className="font-bold transition ease-in-out delay-30 hover:-translate-y-1 hover:scale-100 duration-300"
														onClick={handlePrint}
														type="success"
													>
														<FlatIcon icon="rr-print" className="text-sm mr-1	"/> Print
													</ActionBtn> */}

															{/* <ActionBtn
														className="font-bold transition ease-in-out delay-30 hover:-translate-y-1 hover:scale-100 duration-300"
														onClick={() => {
															deleteAllOrderRef.current.show(
																data
															);
														}}
														style={{ display: isPrinting ? 'none' : 'block' }} // Hide button when printing
														type="danger"
													>
														<FlatIcon icon="rr-print" className="text-sm mr-1	"/> Delete 
															</ActionBtn> */}
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
	

    <div className="flex flex-col px-1 -ml-1.5 mt-3 bg-white w-[7.9in] h-[3in]  border-gray-100 border-2 rounded-lg ">
		<div className="flex gap-4 ">
			<PaymentTable
				className={`pb-1 text-xs mt-2 `}
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
						key: "name",
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
					...(deleteOrder
						? [
							{
							  className: `text-center`,
							  tdClassName: `text-start`,
							  key: "delete",
							  cell: (data) => {
								return (
								  <div className="w-full flex items-center ">
									<ActionBtn
									  size="xs"
									  type="danger"
									  disabled={data?.order_status === ""}
									  className=""
									  onClick={() => {
										deleteSingleOrderRef.current.show(data, handleDelete);
									  }}
									  style={{ display: isPrinting ? 'none' : 'block' }}
									>
									  <FlatIcon icon="rr-trash" />
									</ActionBtn>
								  </div>
								);
							  },
							},
						  ]
						: []),
					]}
				
					data={data}
				  />
				  
			
				</div>
				<div className="flex flex-row bg-white border p-2 ml-[520px] -mt-[50px]">
				<TotalAmount
				amount={totalLabRate}
				className=""
				columns={[
					
					{
						header: "Total Summary: ",
						className: "text-center",
						tdClassName: "text-right",
						cell: (data) => { 
							return (
								<>
								{/* <div className="gap-2 flex justify-between">
									<span>{data?.type?.name}</span>
									<span>₱{data?.lab_rate}</span>
								</div> */}
									
								</>

							)  ;
							
						},
					},
					
				]}
				data={data}
			/>
				
					</div>
				{hasPayment ? (
			
			<span className=" absolute ml-[450px] mt-[140px] text-red-500 font-serif text-4xl -rotate-12 opacity-50 flex ">PAID</span>
		) : (
			""
		)}
				
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
										
										</div>
									
									
									</div>
									<div>
									</div>
									
									<DeleteSingleOrderModal
									onDelete={() => {
										refreshPaymentTable();
										reloadData(); // Refresh the data after deletion
									}}
									laboratory_test_type={
										2
									}
									patient={
										order?.relationships
											?.patient
									}
									appointment={
										appointment}
									ref={deleteSingleOrderRef}
									onSuccess={() => {
									reloadData();
									}}
									/>

									<DeleteAllOrderModal
									onDelete={() => {
										refreshPaymentTable();
										reloadData(); // Refresh the data after deletion
									}}
									laboratory_test_type={
										2
									}
									patient={
										order?.relationships
											?.patient
									}
									appointment={
										appointment}
									ref={deleteAllOrderRef}
									onSuccess={() => {
									reloadData();
									}}
									/>
									
									<PendingOrdersModal
											ref={pendingOrdersRef}
											patient={
												patient
											}
											laboratory_test_type={
												2
											}
											appointment={
												showData
											}
											allowCreate={
												false
											}
										 />
									</div>
									
		
	);
};

export default LaboratoryOrders;
