import FlatIcon from "../../../components/FlatIcon";
import ActionBtn from "../../../components/buttons/ActionBtn";

const InQueueForRelease = ({
	children,
	onClick,
	referAction,
	number,
	selected,
	patientName,
	date,
	width, // add the current width as a prop
	minWidth, // add minWidth as a prop
	}) => {
	const shouldHideContent = width <= minWidth; // condition to hide content
	
	return (
		<div
			className={`outline-none rounded-xl  flex gap-1 cursor-pointer duration-300 border border-blue-300 hover:border-blue-500 hover:shadow-lg ${
				selected
					? "!bg-green-50 !border-green-800 shadow-sm shadow-green-500"
					: ""
			}`}
			onClick={onClick}
			style={{ height: shouldHideContent ? '2px' : '70px' }}
		>
			<div className="flex flex-row items-center overflow-hidden">
				
				<span
					className={`flex items-center justify-center p-0.5 bg-gray-200 text-white  rounded-l-xl rounded-r-xl font-bold text-lg w-[80px] h-full ${
						selected
							? "!bg-green-50 !border-green-800 !text-green-700 shadow-sm "
							: ""
					}`}
					style={{ width: shouldHideContent ? '90px' : '100px' }}
				>
					#{number}
				</span>
				
				{!shouldHideContent && (
					<div className="flex flex-row  w-full gap-3 justify-center">
					<div className="flex flex-col justify-center  border-gray-400 ">
						<div className={`flex gap-1 text-sm font-bold font-mono items-center text-gray-300 ${
						selected
							? "!bg-green-50  text-green-600 "
							: ""
					}`}>
							<FlatIcon icon="rr-calendar" className={`${
						selected
							? "!bg-green-50  text-green-600 "
							: ""
					}`} />
							{date}
						</div>
						<span className={`tracking-tight font-bold text-md text-gray-300 ${
						selected
							? "!bg-green-50  text-green-700 text-xl duration-200"
							: ""
					}`}>
							{patientName}
						</span>
						
					</div>
					<span className="flex items-center">{children}</span>
					
					</div>
				)}
			</div>
		</div>
	);
};

export default InQueueForRelease;
