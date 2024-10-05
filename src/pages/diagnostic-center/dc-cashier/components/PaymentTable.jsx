/* eslint-disable react/prop-types */
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FlatIcon from "../../../../components/FlatIcon";

const uniqID = uuidv4();
const TH = (props) => {
	const { col, onSort } = props;
	const [direction, setDirection] = useState(null);
	const triggerDirection = useCallback(() => {
		setDirection((prevDirection) =>
			prevDirection == null ? "desc" : direction == "desc" ? "asc" : null
		);
	}, [direction]);

	return (
		<th
			className={`${col?.className} ${
				col?.sortable ? "cursor-pointer" : ""
			}`}
			onClick={() => {
				if (col?.sortable) {
					triggerDirection();
					if (onSort) {
						onSort(col?.key, direction);
					}
				}
			}}
		>
			<div className="text-xs flex flex-col w-[125px]">
				{col?.header}
				{col?.sortable ? (
					<span className="flex flex-col absolute  top-[-2px] scale-125">
						<FlatIcon
							icon="sr-caret-up"
							className={`!-mt-0 ${
								!direction
									? "opacity-25"
									: direction == "desc"
									? "opacity-25"
									: "opacity-100"
							}`}
						/>
						<FlatIcon
							icon="sr-caret-down"
							className={`-mt-[10px] ${
								direction == null
									? "opacity-25"
									: direction == "desc"
									? "opacity-100"
									: "opacity-25"
							}`}
						/>
					</span>
				) : (
					""
				)}
			</div>
		</th>
	);
};
const PaymentTable = (props) => {
	const {
		loading = true,
		className = "",
		tableClassName = "",
		theadClassName = "",
		tbodyClassName = "",
		columns = [],
		data = [],
		onSort,
	} = props;
	return (
		<div className={`${className} ${tableClassName} ${theadClassName} ${tbodyClassName}`}>
			<table className=" min-h-[70px]">
				<thead className="">
					<tr>
						{columns?.map((col, index) => {
							return (
								<TH
									onSort={onSort}
									key={`${uniqID}-th-${index}`}
									col={col}
								/>
							);
						})}
					</tr>
				</thead>
				<tbody className="relative">
					{loading ? (
						<div className="flex items-center justify-center mt-1 absolute top-0 left-0 h-full w-[555px] bg-gray-200  text-slate-900 bg-opacity-70 animate-pulse backdrop-blur-sm">
							Loading Payment Details...
						</div>
					) : data?.length == 0 ? (
						<tr>
							<td colSpan={9999}>No data to display.</td>
						</tr>
					) : (
						data?.map((rowData, trIndex) => {
							return (
								<tr key={`${uniqID}-tr-${trIndex}`}>
									{columns?.map((col, tdIndex) => {
										return (
											<td
												key={`${uniqID}-td-${trIndex}-${tdIndex}`}
												className={` ${col?.tdClassName}`}
											>
												{col?.cell
													? col?.cell(rowData)
													: rowData[col?.key]}
											</td>
										);
									})}
                                   
								</tr>
                                
							);
						})
					)}
				</tbody>
			</table>
		</div>
	);
};

export default PaymentTable;
