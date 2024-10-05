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
		<div className=" w-full border p-1">
			<b className="text-sm text-gray-700 justify-center flex border-b">{title}</b>
			<div className="text-xs ">
				<tbody className="flex gap-2 p-1">
					<tr className="flex flex-col items-center w-full">
						<td className="font-bold">CODE</td>
						<td className="font-mono">{selectedCase?.CASE_CODE}</td>
					</tr>
					<tr className="flex flex-col items-center w-full">
						<td className="font-bold">DESCRIPTION</td>
						<td className="font-mono">{selectedCase?.CASE_DESCRIPTION}</td>
					</tr>
					<tr className="flex flex-col items-center w-full">
						<td className="font-bold">TYPE</td>
						<td className="font-mono">{selectedCase?.CASE_TYPE}</td>
					</tr>
					<tr className="flex flex-col items-center w-full">
						<td className="font-bold">RATE</td>
						<td className="font-mono">{selectedCase?.CASE_RATE}</td>
					</tr>
					<tr className="flex flex-col items-center w-full">
						<td className="font-bold">
							FEE SHARE
						</td>
						<td className="font-mono">
							{selectedCase?.PROFESSIONAL_FEE_PF_SHARE
								? `₱ ${formatCurrency(
										selectedCase?.PROFESSIONAL_FEE_PF_SHARE
								  )}`
								: ""}
						</td>
					</tr>
					{/* <tr>
						<td className="font-bold">HOSPITAL SHARE</td>
						<td>{selectedCase?.HOSPITAL_SHARE}</td>
					</tr> */}
					<tr className="flex flex-col items-center w-full">
						<td className="font-bold">RATE CODE</td>
						<td className="font-mono">{selectedCase?.CASE_RATE_CODE}</td>
					</tr>
				</tbody>
			</div>
		</div>
	);
};

export default CaseDetails;
