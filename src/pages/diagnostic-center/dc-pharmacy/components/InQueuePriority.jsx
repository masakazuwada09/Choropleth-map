/* eslint-disable react/prop-types */
import React from "react";
import FlatIcon from "../../../../components/FlatIcon";
import { doctorName } from "../../../../libs/helpers";

const InQueuePriority = ({
	date,
	data,
	number = "1",
	patientName = "",
	onClick,
	selected = false,
	children,
	priorityType = "Senior Citizen", //senior citizen, emergency, PWD
}) => {
	return (
		<div
			className={`p-3 gap-3 rounded-[20px] border border-yellow-300 bg-yellow-50 flex flex-col hover:bg-yellow-100 duration-200 cursor-pointer ${
				selected ? "!bg-yellow-100" : ""
			}`}
			onClick={onClick}
		>
			<span className="text-sm flex border-b border-yellow-400">
				{date}
				</span>
			<div className="flex items-center gap-4">
				<span className="flex items-center justify-center bg-orange-100 text-orange-500 tracking-tight rounded-[18px] font-bold w-12 aspect-square">
					#{number}
				</span>
				<span className="tracking-tight font-bold text-lg">
					{patientName}
				</span>
				<span className="font-light flex items-center text-xs text-slate-600 ml-auto">
					{/* {priorityType} */}
					<FlatIcon
						icon="rr-hand-holding-seeding"
						className="text-red-600 text-lg ml-2 mt-1"
					/>
				</span>
			</div>
			
			{children}
		</div>
	);
};

export default InQueuePriority;
