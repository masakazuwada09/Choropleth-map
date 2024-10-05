import { useState } from "react";
import { formatCurrency } from "../../../../../libs/helpers";
import useNoBugUseEffect from "../../../../../hooks/useNoBugUseEffect";

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
		<div className="table table-bordered">
			<b>{title}</b>
			<table className="text-xs">
				<tbody>
					<tr>
						<td className="font-medium">CASE CODE</td>
						<td>{selectedCase?.CASE_CODE}</td>
					</tr>
					<tr>
						<td className="font-medium">CASE DESCRIPTION</td>
						<td>{selectedCase?.CASE_DESCRIPTION}</td>
					</tr>
					<tr>
						<td className="font-medium">CASE TYPE</td>
						<td>{selectedCase?.CASE_TYPE}</td>
					</tr>
					<tr>
						<td className="font-medium">CASE RATE</td>
						<td>{selectedCase?.CASE_RATE}</td>
					</tr>
					<tr>
						<td className="font-medium">
							PROFESSIONAL FEE(PF) SHARE
						</td>
						<td>
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
					<tr>
						<td className="font-medium">CASE RATE CODE</td>
						<td>{selectedCase?.CASE_RATE_CODE}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default CaseDetails;
