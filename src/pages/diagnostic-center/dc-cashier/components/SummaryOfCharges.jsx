import useDataTable from "../../../../hooks/useDataTable";
import Table from "../../../../components/table/Table";
import { v4 as uuidv4 } from "uuid";
import InfoTextForSummary from "../../../../components/cashier-billing/component/billing/InfoTextForSummary";
import PaymentTable from "../../../../pages/diagnostic-center/dc-cashier/components/PaymentTable";
import { formatDateMMDDYYYY } from "../../../../libs/helpers";

/* eslint-disable react/prop-types */
const uniq_id = uuidv4();
const SummaryOfCharges = (props) => {
	const { patient, 
			appointment, 
			order_id, 
			laboratory_test_type,
			lab_rate, 
			} = props;
	const {

		loading
		,
		setLoading
		,
		data,
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
		<>
			<div className="text-center font-mono text-xs ">
			<h5 className="text-xs py-2 font-md font-mono text-center text-slate-800 border-b border-gray-400">
					LABORATORY/IMAGING TESTS
				</h5>

			<div className="bg-gray-00  grid grid-cols-6 divide-x text-sm font-semibold text-center font-mono">
						<div className="col-span-1">DATE</div>
						<div className="col-span-1">DESCRIPTION</div>
						<div className="col-span-1">DEBIT</div>
						<div className="col-span-1">DISCOUNT</div>
						<div className="col-span-1">BALANCE</div>
						
					</div>							
			<PaymentTable
				className={`pb-1 text-xs ml-[25px]`}
				loading={loading}
				columns={[
					{
						className: "text-center font-mono",
						tdClassName: "text-center ",
						key: "date",
						cell: (data) => {
							return formatDateMMDDYYYY(
								new Date(data?.order_date)
							);
						},
					},
					{
						
						className: "text-center font-mono",
						tdClassName: "text-center",
						key: "name",
						cell: (data) => {
							return data?.type?.name;
						},
					},
					{
						className: "text-center font-mono ",
						tdClassName: "text-center font-bold",
						key: "lab_rate",
								cell: (data) => { 
							return `₱ ${data?.lab_rate}` ;
						},
					},
					
					]}
					data={data}
				  />
				<h5 className="text-xs py-2 font-md font-mono text-center text-slate-800 border-b border-gray-400">
					SUMMARY OF CHARGES
				</h5>
				<div className="px-3 py-2 ">
					<div className="bg-gray-00  grid grid-cols-6 divide-x text-sm font-semibold text-center font-mono">
						<div className="col-span-2">PARTICULARS</div>
						<div className="col-span-1">DESCRIPTION</div>
						<div className="col-span-1">DISCOUNT</div>
						<div className="col-span-1">CREDIT</div>
						<div className="col-span-1">BALANCE</div>
					</div>
					<div className="grid grid-cols-6 divide-x text-xs font-light text-center mt-2 font-mono">
						<div className="col-span-2 text-left ml-2">
							Drugs and Medicines (GF)
						</div>
						<div className="col-span-1 ">
						{appointment?.prescriptions?.map(
							(item) => {
								return (
									<>
										<tr
											key={`opri-${item?.id}`}
										>
																					
							<span
                                className="text-xs w-full flex "
								value={
									item
										?.item
										?.code
								}
                            >{
								item
									?.item
									?.code
							}</span>
							</tr>
										<tr>
											<td
												colSpan={
													3
												}
											>
												
											</td>
										</tr>
									</>
								);
							}
						)}
						</div>
						<div className="col-span-1">
							<InfoTextForSummary
                                contentClassName="text-sm"
                            />
						</div>
						<div className="col-span-1">
							<InfoTextForSummary
                                contentClassName="text-sm"
                            />
						</div>
						<div className="col-span-1">
							<InfoTextForSummary
                                contentClassName="text-sm"
                            />
						</div>
					</div>
					<div className="grid grid-cols-6 divide-x text-xs font-light text-center mt-2 font-mono">
						<div className="col-span-2 text-left ml-2">
							NonDrugs / Supplies
						</div>
						<div className="col-span-1">
							<InfoTextForSummary
                                contentClassName="text-sm"
                            />
						</div>
						<div className="col-span-1">
							<InfoTextForSummary
                                contentClassName="text-sm"
                            />
						</div>
						<div className="col-span-1">
							<InfoTextForSummary
                                contentClassName="text-sm"
                            />
						</div>
						<div className="col-span-1">
							<InfoTextForSummary
                                contentClassName="text-sm"
                            />
						</div>
					</div>
				
					
					<div className="grid grid-cols-6 divide-x text-xs font-light text-center mt-2 font-mono">
						<div className="col-span-2 text-left ml-2">
							Miscellaneous
						</div>
						<div className="col-span-1">
							{/* Code For Debit Database */}
							<InfoTextForSummary
                                contentClassName="text-sm"
                            />
						</div>
						<div className="col-span-1">
							<InfoTextForSummary
                                contentClassName="text-sm"
                            />
						</div>
						<div className="col-span-1">
							<InfoTextForSummary
                                contentClassName="text-sm"
                            />
						</div>
						<div className="col-span-1">
							<InfoTextForSummary
                                contentClassName="text-sm"
                            />
						</div>
					</div>
					<div className="grid grid-cols-6 divide-x text-xs font-light text-center mt-2 font-mono">
						<div className="col-span-2 text-left ml-2">PHIC</div>
						<div className="col-span-1">
							<InfoTextForSummary
                                contentClassName="text-sm"
                            />
						</div>
						<div className="col-span-1">
							<InfoTextForSummary
                                contentClassName="text-sm"
                            />
						</div>
						<div className="col-span-1">
							<InfoTextForSummary
                                contentClassName="text-sm"
                            />
						</div>
						<div className="col-span-1">
							<InfoTextForSummary
                                contentClassName="text-sm"
                            />
						</div>

					</div>
					<div className="grid grid-cols-6 border-t divide-x text-sm font-semibold text-center mt-2 font-mono">
						<div className="col-span-2 mr-1">Total:</div>
						<div className="col-span-1">
							{/* add a code for Debit database */}
							<InfoTextForSummary
                                contentClassName="text-sm"
                            />
						</div>
						<div className="col-span-1">
							<InfoTextForSummary
                                contentClassName="text-sm"
                            />
						</div>
						<div className="col-span-1">
							<InfoTextForSummary
                                contentClassName="text-sm"
                            />
						</div>
						<div className="col-span-1">
							<InfoTextForSummary
                                contentClassName="text-sm"
                            />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default SummaryOfCharges;
