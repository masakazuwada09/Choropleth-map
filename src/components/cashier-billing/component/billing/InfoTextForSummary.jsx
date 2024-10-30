import FlatIcon from "../../../FlatIcon";

const InfoTextForSummary = ({
	className = "",
	labelClassName = "",
	contentClassName = "",
	icon,
	title,
	value,
	data,
	...rest
}) => {
	return (
		<div
			className={`flex flex-row  capitalize font-mono  w-full   ${className}`}
			{...rest}
		>
			<div
				contentEditable
				className={`text-darker  rounded-xl w-full text-xs font-semibold capitalize flex justify-center   ${contentClassName}`}
			>
				{value || "0.00 "
                
                }
				{/* {value || (
					<>
						<span className="text-gray-200 font-normal text-xs italic">
							blank
						</span>{" "}
						&nbsp;
					</>
				)} */}
			</div>
		</div>
	);
};

export default InfoTextForSummary;
