/* eslint-disable react/prop-types */
import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const uniqID = uuidv4();

const TH = (props) => {
	const { col, onSort } = props;
	const [direction, setDirection] = useState(null);

	// Toggle sorting direction between asc, desc, and null
	const triggerDirection = useCallback(() => {
		setDirection((prevDirection) => 
			prevDirection == null ? "asc" : prevDirection === "asc" ? "desc" : null
		);
	}, []);

	return (
		<th
			className={`${col?.className} ${col?.sortable ? "cursor-pointer" : ""}`}
			onClick={() => {
				if (col?.sortable) {
					const newDirection = direction === "asc" ? "desc" : "asc";
					triggerDirection();
					if (onSort) {
						onSort(col?.key, newDirection);
					}
				}
			}}
		>
			<div className="relative text-xs">
				{col?.header}
				{col?.sortable && (
					<span className="ml-2 text-sm">
						{/* Display the sorting direction */}
						{direction === "asc" ? "▲" : direction === "desc" ? "▼" : ""}
					</span>
				)}
			</div>
		</th>
	);
};

const TotalAmount = (props) => {
	const {
		loading = false,
		amount = 0,
		className = "",
		tableClassName = "",
		theadClassName = "",
		tbodyClassName = "",
		columns = [],
		data = [],
		onSort,
	} = props;
	const formattedAmount = isNaN(amount) ? 0 : parseFloat(amount).toFixed(2);
	return (
		<div className={`w-[220px] ${className}`}>
			{loading && (
				<div className="flex items-center justify-start py-3 px-2 text-xs w-[200px] top-0 left-0 h-full bg-gray-200 rounded-xl text-slate-900 bg-opacity-70 animate-pulse backdrop-blur-sm">
					Loading Total Amount...
				</div>
			)}
			{!loading && data.length === 0 && (
				<div className="text-center py-4">No data to display.</div>
			)}
			{!loading && data.length > 0 && (
				<table className={`w-full ${tableClassName}`}>
					<thead className={theadClassName}>
						<tr>
							{columns.map((col, index) => (
								<TH key={`${uniqID}-th-${index}`} col={col} onSort={onSort} />
							))}
						</tr>
					</thead>
					<tbody className={tbodyClassName}>
						{data.map((rowData, trIndex) => (
							<tr key={`${uniqID}-tr-${trIndex}`}>
								{columns.map((col, tdIndex) => (
									<td
										key={`${uniqID}-td-${trIndex}-${tdIndex}`}
										className={`w-[150px] ${col?.tdClassName}`}
									>
										{col?.cell ? col.cell(rowData) : rowData[col?.key]}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			)}
			{/* Display the total amount */}
			<div className="text-right font-bold text-lg mt-1">
			Total Amount: ₱ {formattedAmount}
			</div>
		</div>
	);
};

export default TotalAmount;
