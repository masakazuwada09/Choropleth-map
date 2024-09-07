import React from "react";
import { useForm } from "react-hook-form";
import CollapseDiv from "../../../../components/CollapseDiv";
import FlatIcon from "../../../../components/FlatIcon";
import PatientVitals from "../../../../components/PatientVitals";
import {
	generalHistories,
	medicalSurgicalHistories,
	symptoms,
} from "../../../../libs/appointmentOptions";
import {
	doctorName,
	doctorSpecialty,
	formatDateMMDDYYYYHHIIA,
	keyByValue,
} from "../../../../libs/helpers";
import useNoBugUseEffect from "../../../../hooks/useNoBugUseEffect";
import TextInputField from "../../../../components/inputs/TextInputField";
import { react, useEffect, useState } from "react";
import AppointmentStatus from "../../../../components/AppointmentStatus";
import PaymentTable from "../../dc-cashier/components/PaymentTable";
import useDataTable from "../../../../hooks/useDataTable";
import TotalAmount from "../../dc-cashier/components/TotalAmount";
import { useAuth } from "../../../../hooks/useAuth";


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
const AppointmentDetails = ({
	data,
	showService = true,
	appointment,
	serviceComponent,
	medicalcertificateComponent,
	forResult = false,
	customStatus = null,
}) => {
	const {
		register,
		getValues,
		setValue,
		control,
		reset,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const {
		page,
		setPage,
		meta,
		setMeta,
		loading,
		setLoading,
		paginate,
		setPaginate,
		
		setData,
		column,
		setColumn,
		direction,
		setDirection,
		filters,
		setFilters,
		reloadData,
	} = useDataTable
	const isXrayUser = () => {
		return user?.type === "DC-NURSE";
	};
	const { user } = useAuth();
	const testHeader = isXrayUser() ? "Imaging Test" : "Laboratory Test";
	useNoBugUseEffect({
		functions: () => {
			setTimeout(() => {
				if (appointment?.social_history) {
					Object.keys(appointment?.social_history).map((key) => {
						setValue(key, appointment?.social_history[key]);
					});
				}
				// if (appointment?.general_history) {
				// 	Object.keys(appointment?.general_history).map((key) => {
				// 		setValue(key, appointment?.general_history[key]);
				// 	});
				// }

				// if (appointment?.surgical_history) {
				// 	Object.keys(appointment?.surgical_history).map((key) => {
				// 		setValue(key, appointment?.surgical_history[key]);
				// 	});
				// }
				// if (appointment?.environmental_history) {
				// 	Object.keys(appointment?.environmental_history).map(
				// 		(key) => {
				// 			setValue(
				// 				key,
				// 				appointment?.environmental_history[key]
				// 			);
				// 		}
				// 	);
				// }
			}, 1000);
		},
		params: [appointment?.id],
	});

	return (
		<div className="flex flex-col ">
			<h4 className="border-b flex items-center text-base font-bold p-2 mb-0 bg-white border-indigo-100 lg:col-span-12">
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
					<div className="flex flex-col gap-y-4 px-4 border-x border-b rounded-b-xl shadow-lg bg-white pt-5 pb-4">
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
					</div>
				</>
			) : (
				""
			)}
		</div>
	);
};

export default AppointmentDetails;
