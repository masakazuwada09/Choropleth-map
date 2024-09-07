import { useState } from "react";
import { formatCurrency } from "../../../../libs/helpers";
import useNoBugUseEffect from "../../../../hooks/useNoBugUseEffect";

/* eslint-disable react/prop-types */
const CaseDetails = (props) => {
	const {
		code = 0,
		cases,
		selectedCase: propSelectedCase,
		title = "Details",
		className =""
	} = props;
	const [selectedCase, setSelectedCase] = useState(propSelectedCase);
	useNoBugUseEffect({
		functions: () => {
			if (code && cases?.length > 0) {
				let found = cases.find((x) => {
					if (
						String(x.CASE_CODE).toLowerCase() ==
						String(code).toLowerCase()
					) {
						return x;
					}
				});
				if (found) {
					setSelectedCase(found);
				}
			}
		},
		params: [code],
	});
	return (
		<div className="  ">
			<b className="text-yellow-900 flex justify-end border-b border-yellow-400 mb-3 ">{title}</b>
			<table className="text-xs text-slate-900 mt-2">
				<tbody className="">
					<tr className="text-yellow-950 flex flex-row justify-between">
						<td className="font-bold flex  ">CASE CODE</td>
						<td className="ml-[330px]">{selectedCase?.CASE_CODE}</td>
					</tr>
					<tr className="text-yellow-950 flex flex-row justify-between">
						<td className="font-bold flex  justify-between">CASE DESCRIPTION</td>
						<td className=" ">{selectedCase?.CASE_DESCRIPTION}</td>
					</tr>
					<tr className="text-yellow-950 flex flex-row justify-between">
						<td className="font-bold flex  justify-between">CASE TYPE</td>
						<td className=" ">{selectedCase?.CASE_TYPE}</td>
					</tr>
					<tr className="text-yellow-950 flex flex-row justify-between">
						<td className="font-bold flex  justify-between">CASE RATE</td>
						<td className=" ">{selectedCase?.CASE_RATE}</td>
					</tr>
					<tr className="text-yellow-950 flex flex-row justify-between">
						<td className="font-bold flex  justify-between">
							PROFESSIONAL FEE(PF) SHARE
						</td>
						<td className=" ">
							{selectedCase?.PROFESSIONAL_FEE_PF_SHARE
								? `₱ ${formatCurrency(
										selectedCase?.PROFESSIONAL_FEE_PF_SHARE
								  )}`
								: ""}
						</td>
					</tr>
					{/* <tr>
						<td className="font-medium">HOSPITAL SHARE</td>
						<td>{selectedCase?.HOSPITAL_SHARE}</td>
					</tr> */}
					<tr className="text-yellow-950 flex flex-row justify-between">
						<td className="font-bold flex  justify-between">CASE RATE CODE</td>
						<td className=" ">{selectedCase?.CASE_RATE_CODE}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default CaseDetails;
