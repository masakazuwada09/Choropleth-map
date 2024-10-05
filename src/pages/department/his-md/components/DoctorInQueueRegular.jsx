import FlatIcon from "../../../../components/FlatIcon";
import ActionBtn from "../../../../components/buttons/ActionBtn";

const DoctorInQueueRegular = ({
	acceptAction,
	onClick,
	className = "",
	number,
	data,
	patientName,
	roomNumber,
	date,
}) => {
	return (
		<div
			className={`p-3 gap-5 relative rounded-[20px] border border-gray-300 bg-gray-100 flex items-center justify-start ${className}`}
			onClick={onClick}
			>
			<span className="flex items-center justify-center bg-blue-50 border border-teal-700 dark:!text-blue-500 dark:!border-blue-500 text-teal-700 tracking-tight rounded-full font-bold w-12 aspect-square">
				#{number}
			</span>

			<div>
				{date ? (
					<div className="flex items-center gap-2 text-sm text-gray-600 -ml-3 -mt-3 font-bold">
						<FlatIcon icon="rr-calendar" />
						{date}
					</div>
				) : (
					""
				)}

				<span className="tracking-tight font-bold text-gray-700 text-lg select-none">
					{patientName}
					
				</span>
			
				
				
			</div>
			
			
			
			{/* <span className="font-light text-xs text-slate-600 ml-auto">
				Regular
				<FlatIcon icon="rr-bars-sort" className="text-blue-600 ml-2" />
			</span> */}
			{acceptAction ? (
				
				<ActionBtn
					type={
						data?.status == "in-service-result-reading"
							? "secondary"
							: "teal"
					}
					className="absolute right-4 !rounded-3xl bg-teal-700 dark:!bg-blue-500"
					onClick={acceptAction}
				>
					<FlatIcon icon="rr-user" className=" font-bold"  /> View
				</ActionBtn>
				
			) : (
				""
			)}
		</div>

		
		
	);
};

export default DoctorInQueueRegular;
