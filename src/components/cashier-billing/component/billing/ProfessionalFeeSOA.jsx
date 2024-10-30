import useDataTable from "../../../../hooks/useDataTable";
import { doctorName } from "../../../../libs/helpers";
import Table from "../../../table/Table";
import { v4 as uuidv4 } from "uuid";
/* eslint-disable react/prop-types */
const uniq_id = uuidv4();
const ProfessionalFeeSOA = (props) => {
	const { appointment, patient } = props;
	const { loading, data } = useDataTable({
		url: `/v1/professional-fee`,
		// url of API for patient that has a pending that need performed
	});
	return (
		<>
			<div className=" mt-5 py-2">
				<h5 className="text-xs font-md text-center py-2 font-mono text-slate-700 border-b border-gray-400">
					PROFESSIONAL FEE
				</h5>

				<div className="px-4">
					<div className="border rounded-sm grid grid-cols-6 divide-x text-xs font-semibold text-center font-mono items-center px-">
						<div className="col-span-2">PARTICULARS</div>
						<div className="col-span-1">ACTUAL CHARGES</div>
						<div className="col-span-1">
							SENIOR CITIZEN / PWD DISCOUNT
						</div>
						<div className="col-span-1">PHIC</div>
						<div className="col-span-1">BALANCE</div>
					</div>
					<div className="grid grid-cols-6 divide-x text-xs font-light text-center mt-2 font-mono">
						<div className="col-span-2 text-left ml-2">
							{doctorName(appointment?.doctor)}
							
						</div>
						<div className="col-span-1">
							{/* add a code for Debit database */}
							500.00
						</div>
						<div className="col-span-1"></div>
						<div className="col-span-1"></div>
						<div className="col-span-1">500.00</div>
					</div>

					<div className="grid grid-cols-6 border-t divide-x text-sm font-semibold text-center mt-2 font-mono">
						<div className="col-span-2 text-right mr-1">Total:</div>
						<div className="col-span-1">
							{/* add a code for Debit database */}
							500.00
						</div>
						<div className="col-span-1">
							{patient?.total_senior_pwd}
						</div>
						<div className="col-span-1">{patient?.total_phic}</div>
						<div className="col-span-1">500.00</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProfessionalFeeSOA;
