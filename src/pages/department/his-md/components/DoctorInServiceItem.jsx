import FlatIcon from "../../../../components/FlatIcon";
import ActionBtn from "../../../../components/buttons/ActionBtn";
import { patientFullName, patientRoomNumber } from "../../../../libs/helpers";
import InfoTextForPrint from "../../../../components/InfoTextForPrint";

/* eslint-disable react/prop-types */
const DoctorInServiceItem = ({
	room = "1",
	data,
	openProfileAction,
	labOrdersStr = "",
	patientQueueName = "#1 - John Doe",
	doctor = {
		title: "Dr.",
		name: "Tanya White",
		specialty: "Cardiologists",
	},
}) => {
	const isForResultReading = () => {
		return (
			data?.status == "in-service-result-reading" ||
			data?.has_for_reading?.length
		);
	};
	return (
		<div
			className={`flex flex-col border  p-4 rounded-xl ${
				isForResultReading()
					? " bg-orange-50 border-orange-100 "
					: " bg-gray-50 border-gray-300 "
			}`}
		>
			{isForResultReading() ? (
				<span className=" text-orange-500 mb-4 text-center italic rounded-xl px-3 text-xs">
					Pending{" "}
					<span className="text-orange-500 font-medium ">
						for
						{labOrdersStr.includes(`"type":"imaging"`) &&
						labOrdersStr.includes(`"type":"laboratory-test"`)
							? " IMAGING and LABORATORY "
							: labOrdersStr.includes(`"type":"imaging"`)
							? " IMAGING "
							: " LABORATORY "}
						result reading
					</span>
				</span>
			) : (
				""
			)}
			<div className="grid grid-cols-1 lg:grid-cols-1 divide-x">
				<div className="flex flex-col justify-center items-center">
					
					
					<h2
						className={`text-3xl font-bold ${
							isForResultReading()
								? "text-teal-600"
								: "text-teal-700"
						} -mb-1`}
					>
						
						{/* {` ${patientRoomNumber(data?.room?.name)}`} */}
						{data?.room_number}

					</h2>
				</div>{" "}
				<div className="flex flex-col justify-center items-center">
					<span className="font-light text-sm text-slate-600 mb-1">
						Patient
					</span>
					<h2
						className={`text-3xl tracking-tight text-center font-bold ${
							isForResultReading()
								? "text-teal-600"
								: "text-teal-600 dark:!text-blue-500"
						} -mb-1`}
					>
						{`#${data?.id} - ${patientFullName(data?.patient)}`}
					</h2>
				</div>
			</div>

			<span className="border-b  pb-4 mb-4 "></span>

			<span className="font-light mb-1 text-center text-xs text-slate-500">
				Patient Profiles
			</span>
			<ActionBtn
				// size="sm"
				type={
					data?.status == "in-service-result-reading"
						? "secondary"
						: "teal"
				}
				className="px-12 ml-36 py-2 font-medium bg-teal-700 dark:!bg-blue-500 text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
				onClick={openProfileAction}
			>
				<FlatIcon icon="rr-clipboard-user" className="text-" />
				Click to open Patient Profile
			</ActionBtn>
		</div>
	);
};

export default DoctorInServiceItem;
