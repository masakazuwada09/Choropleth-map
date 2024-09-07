/* eslint-disable react/prop-types */
import { calculateAge, formatDate, patientFullName } from "../../../../libs/helpers";
import FlatIcon from "../../../../components/FlatIcon";
import Img from "../../../../components/Img";

const PatientMenu = ({ patient, active = false, ...rest }) => {
	return (
		<div
			className={`outline-none rounded-xl p-3 flex items-center gap-3 hover:bg-white cursor-pointer duration-300 border border-blue-300 hover:border-blue-500 hover:shadow-lg ${
				active ? "bg-white !border-blue-500 shadow-lg " : ""
			}`}
			{...rest}
		>
			<Img
				src={patient?.avatar || ""}
				type="user"
				name={patientFullName(patient)}
				className="h-14 w-14 rounded-full object-contain bg-slate-400"
			/>
			<div className="flex flex-col">
				<span className="text-base text-slate-800 font-semibold">
					{patientFullName(patient)}
				</span>
				<div className="flex lg:gap-4">
					<div className="flex gap-4 text-sm text-slate-500 mb-1">
						<div className="flex items-center gap-2 text-sm">
							<FlatIcon
								icon="rr-venus-mars"
								className="text-sm"
							/>
							{String(patient?.gender).toLowerCase() == "male" ? (
								<span className="text-blue-700">Male</span>
							) : (
								<span className="text-pink-700">Female</span>
							)}
						</div>
					</div>
					<div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
						<FlatIcon
							icon="rr-calendar-clock"
							className="text-sm"
						/>
						<span>{calculateAge(patient?.birthday)} yrs old</span>
					</div>
				</div>
				<div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
					<FlatIcon icon="rr-calendar" className="text-sm" />
					<span>{formatDate(patient?.birthday)}</span>
				</div>
				<div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
					<FlatIcon icon="fi fi-rr-money-bill-wave" className="text-sm text-red-400" /> 
					<div className="flex flex-col">
					<span className="text-red-500 font-bold">For initial Payment</span>
					
					</div>
					
				</div>
			</div>
		</div>
	);
};

export default PatientMenu;
