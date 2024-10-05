import FlatIcon from "../../../../../components/FlatIcon";
import ActionBtn from "../../../../../components/buttons/ActionBtn";

const DoctorInQueuePriority = ({
	queue,
	data,
	labOrdersStr = "",
	acceptAction,
	roomNumber,
	number,
	date,
	patientName,
}) => {
	return (
		<div className="p-3 gap-3 relative rounded-[20px] border border-yellow-300 bg-yellow-100 flex items-center justify-start pt-10">
			<span className="absolute top-2 left-4  flex items-center  gap-2 text-[12px] text-red-500 font-medium">
				<FlatIcon
					icon="sr-diamond-exclamation"
					className="text-red-700 text-xl"
				/>

				<span className="text-red-500 font-medium ">
					For
					{labOrdersStr.includes(`"type":"imaging"`) &&
					labOrdersStr.includes(`"type":"laboratory-test"`)
						? " IMAGING and LABORATORY "
						: labOrdersStr.includes(`"type":"imaging"`)
						? " IMAGING "
						: " LABORATORY "}
					result reading
				</span>
			</span>

			<span className="flex items-center justify-center bg-red-50 border border-red-700 text-red-800 tracking-tight rounded-full font-bold w-12 aspect-square">
				#{number}
			</span>
			<div>
				{date ? (
					<div className="flex items-center gap-2 text-sm -mt-4 -ml-3">
						<FlatIcon icon="rr-calendar" />
						{date}
					</div>
				) : (
					""
				)}
				<span className="tracking-tight font-bold text-lg">
					{patientName}
				</span>
				<div className="flex items-center gap-2 text-sm -ml-3 -mt-0">
						{/* <FlatIcon icon="fi fi-rr-bed" /> */}
						{data?.room_number}
					</div>
			</div>
			
			{/* <span className="font-light text-xs text-slate-600 ml-auto">
				Regular
				<FlatIcon icon="rr-bars-sort" className="text-blue-600 ml-2" />
			</span> */}
			<ActionBtn
				type="success"
				className="absolute right-4 !rounded-3xl"
				onClick={acceptAction}
			>
				<FlatIcon icon="rr-check" className=" font-bold" /> Accept
			</ActionBtn>
		</div>
	);
};

export default DoctorInQueuePriority;
