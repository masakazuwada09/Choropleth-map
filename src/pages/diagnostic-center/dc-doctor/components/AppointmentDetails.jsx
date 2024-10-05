import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { formatDateMMDDYYYY } from "../../../../libs/helpers";
import FlatIcon from "../../../../components/FlatIcon";
import useNoBugUseEffect from "../../../../hooks/useNoBugUseEffect";
import AppointmentStatus from "../../../../components/AppointmentStatus";
import PaymentTable from "../../dc-cashier/components/PaymentTable";
import useDataTable from "../../../../hooks/useDataTable";
import { useAuth } from "../../../../hooks/useAuth";
import ActionBtn from "../../../../components/buttons/ActionBtn";

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
/* eslint-disable react/prop-types */
const InfoText = ({
	className = "",
	valueClassName = "",
	label,
	icon,
	value,
}) => {
	return (
		<div className={`flex flex-col ${className}`}>
			{label ? (
				<span className="text-slate-800 text-xs capitalize mb-1">
					{label}
				</span>
			) : (
				""
			)}
			<div className="flex items-center mb-0 gap-2">
				<span className="flex items-center justify-center">
					<FlatIcon
						icon={icon || "bs-arrow-turn-down-right"}
						className="text-[10px] text-slate-600 ml-1"
					/>
				</span>
				<span
					className={`capitalize gap-1 text-slate-900 flex text-base flex-wrap ${valueClassName} `}
				>
					{value} &nbsp;
				</span>
			</div>
		</div>
	);
};
const AppointmentDetails = (props) => {
	const {
		forResult = false,
		customStatus = null,
		appointment,
		patient,
		laboratory_test_type,
		lab_rate,
		order_id,
		setButtonDisabled,
	} = props;
	

	const {
		loading,
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
	const isXrayUser = () => {
		return user?.type === "DC-NURSE";
	};
	const { user } = useAuth();
	const testHeader = isXrayUser() ? "Imaging Test" : "Laboratory Test";
	const [isFilterModalOpen, setFilterModalOpen] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
	
	const submit = (data) => {
		let formData = new FormData();
		formData.append("_method", "PATCH");
		Axios.post(
			`v1/clinic/doctor-accept-patient/${patientData?.id}`,
			formData
		).then((res) => {
			reset();
			mutateAll();
			toast.success("Patient accepted successfully!");
			setIsOpen(false); // Close modal after success
		});
	};

	// useNoBugUseEffect({
	// 	functions: () => {
	// 		const allForResultReading = data?.every((order) => order.order_status === "for-result-reading");
	// 		setButtonDisabled(!allForResultReading);  
		
	// 	deps: [data], 
	// 		setFilters((prevFilters) => ({
	// 			...prevFilters,
				
	// 			order_id: order_id,
	// 			lab_rate: lab_rate
	// 		}));
	// 	},
	// });
	const onSubmitFilters = (filterData) => {
		setFilters((prevFilters) => ({
			...prevFilters,
			order_status: filterData.order_status,
			type: filterData.type,
		}));
		setFilterModalOpen(false);
	};
	useEffect(() => {
		if (data) {
			const allForResultReading = data.every((order) => order.order_status === "for-result-reading");
			const hasPendingOrders = data.some((order) => order.order_status === "pending");
			setButtonDisabled(!allForResultReading || hasPendingOrders); // Disable button if not all orders are 'for-result-reading' or if there are pending orders
		}
	}, [data, setButtonDisabled]);
	return (
		<div className="flex flex-col ">
			<h4 className=" border-b flex items-center text-base font-bold p-2 bg-white border-indigo-100 lg:col-span-12">
				<span>Patient Information</span>
				<span className="ml-auto">
					Status:{" "}
					<b className="uppercase font-normal">
						<AppointmentStatus
							customStatus={customStatus}
							forResult={forResult}
							appointment={appointment}
						/>
						
					</b>
				</span>
			</h4>
			{appointment?.id ? (
				<>
					<div className="flex flex-col gap-y-1 py-1 px-1 border-x border-b rounded-b-xl shadow-lg bg-white ">
							
											
					<div className="flex flex-col px-1 py-1  bg-white w-[6.98in] h-[2in]  border-gray-200 border-2 rounded-lg">
						{/* Filter Button */}
                        {/* <div className="flex justify-end px-2">
                            <button
                                onClick={() => setFilterModalOpen(true)}
                                className="bg-blue-500 text-white px-3 py-1 rounded-md"
                            >
                                <FlatIcon icon="fi fi-rr-filter" className="mr-2" />
                                Filter
                            </button>
                        </div> */}
		<div>
		<PaymentTable
				className={`pb-1 text-xs flex py-2   w-[730px] h-[100px] overflow-y-scroll `}
				loading={loading}
				columns={[
					{
						header: "Order Date",
						className: "text-center ",
						tdClassName: "text-center ",
						key: "date",
						cell: (data) => {
							return formatDateMMDDYYYY(
								new Date(data?.order_date)
							);
						},
					},
					{
						header: "Type",
						className: "text-center ",
						tdClassName: "text-center",
						key: "type",
						cell: (data) => {
							return data?.type?.name;
						},
					},
					
					{
						header: "Notes",
						className: "text-left",
						tdClassName: "text-left",
						key: "notes",
					},
					{
						header: testHeader,
						className: "text-center ",
						tdClassName: "text-center ",
						key: "order_status",
						cell: (data) => {
							// Define the checkmark symbol
							const checkMark = "✔️";
							const xMark = "❌"
					
							// Render the Status component along with the checkmark conditionally
							return (
								<div className="flex justify-center  items-center">
									
									{/* Display checkmark only for certain statuses */}
									{data?.order_status === "for-result-reading" && (
										<span className="ml-2 text-green-500">{checkMark}</span>
									)}
									{data?.order_status === "pending" && (
										<span className="ml-2 text-green-500">{xMark}</span>
									)}
									
								</div>
							);
						},
					}
				]}

				appointment={appointment}
				data={data}
				
			/>
				</div>
				
				 {isFilterModalOpen && (
                            <Modal onClose={() => setFilterModalOpen(false)} title="Filter Orders">
                                <form onSubmit={handleSubmit(onSubmitFilters)} className="flex flex-col gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm">Order Status</label>
                                        <select {...register("order_status")} className="border p-2">
                                            <option value="">All</option>
                                            <option value="pending">Pending</option>
                                            <option value="for-result-reading">For Result Reading</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm">Type</label>
                                        <input type="text" {...register("type")} className="border p-2" />
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFilterModalOpen(false)}
                                            className="px-3 py-1 border rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
                                            Apply Filters
                                        </button>
                                    </div>
                                </form>
                            </Modal>
                        )}
												
					</div>
					
										
					</div>
				</>
			) : (
				""
			)}
		</div>
	);
};

export default AppointmentDetails;
