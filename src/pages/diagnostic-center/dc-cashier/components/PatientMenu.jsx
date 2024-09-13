/* eslint-disable react/prop-types */
import { calculateAge, formatDate, patientFullName } from "../../../../libs/helpers";
import FlatIcon from "../../../../components/FlatIcon";
import Img from "../../../../components/Img";
import useDataTable from "../../../../hooks/useDataTable";

const PatientMenu = ( { patient, active = false, ...rest }, props) => {
	const {
		showTitle = true,
		appointment,
		laboratory_test_type,
		lab_rate,
		allowCreate = true,
		onUploadLabResultSuccess,
		order_id,
	} = props;

	const {
		page,
		setPage,
		meta,
		setMeta,
		loading,
		setLoading,
		paginate,
		setPaginate,
		data,
		setData,
		column,
		setColumn,
		direction,
		setDirection,
		filters,
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
					<span className="text-red-500 font-bold">{data?.type?.name}</span>
					
					</div>
					
				</div>
				
			</div>
		</div>
	);
};

export default PatientMenu;
