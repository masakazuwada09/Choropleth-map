import React from "react";
import FlatIcon from "../../../components/FlatIcon";
import ActionBtn from "../../../components/buttons/ActionBtn";

const InQueueRegular = ({
	children,
	roomNumber,
	onClick,
	referAction,
	number,
	selected,
	patientName,
}) => {
	return (
		<div
			className={`p-3 gap-3 relative rounded-[20px] border border-blue-300 bg-blue-50  cursor-pointer hover:bg-green-100 hover:border-green-500 duration-200 ${
				selected
					? "!bg-green-100 !border-indigo-800 shadow-sm shadow-green-500"
					: ""
			}`}
			onClick={onClick}
		>
			<div className="flex items-center gap-4">
				<span className="flex items-center justify-center bg-blue-100 text-blue-500 tracking-tight rounded-[18px] font-bold w-12 aspect-square">
					#{number}
				</span>
				<span className="tracking-tight font-bold text-lg">
					{patientName}
				</span>

				
					
			</div>
			{children}
				<div className="flex items-center gap-2 text-sm -mt-0 ">
						<FlatIcon icon="fi fi-rr-bed" />
						{roomNumber}
					</div>
			</div>

	);
};

export default InQueueRegular;
