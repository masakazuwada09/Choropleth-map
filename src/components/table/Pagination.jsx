import React from 'react';
import FlatIcon from "../FlatIcon";
import ActionBtn from "../buttons/ActionBtn";
import SelectInput from "../inputs/SelectInput";
import TextInput from "../inputs/TextInput";

const Pagination = ({
	page,
	setPage,
	pageCount,
	pageSize,
	setPageSize,
	show = [1, 5, 10, 25, 50, 100, 500],  // Ensure this list is included
	paginationClassName = "",
}) => {
	// Ensure page is a valid number
	const handlePageChange = (e) => {
		const newPage = parseInt(e.target.value, 500);
		if (!isNaN(newPage) && newPage >= 1 && newPage <= pageCount) {
			setPage(newPage);
		}
	};

	return (
		<div
			className={`flex flex-col-reverse lg:flex-row flex-wrap items-start lg:items-center gap-2 pt-1 ${paginationClassName}`}
		>
			<div className="flex flex-row justify-between w-full">
				<div className="flex items-center text-dark text-sm w-full mr-2 ">
					<label className="mb-0 text-xs">Show:</label>
					<SelectInput
						value={pageSize}
						onChange={(e) => setPageSize(Number(e.target.value))}
						options={show.map((x) => ({
							label: x,
							value: x,
						}))}
						className="ml-2 w-8 m-0"
						inputClassName="!px-0 !py-1 h-8 !text-center"
					/>
				</div>
				<div className="flex items-center text-dark text-sm w-full">
					<label className="mb-0 text-xs">Go to page:</label>
					<TextInput
						value={page}
						onChange={handlePageChange}
						className="ml-2 w-12 m-0"
						inputClassName="!p-2 !py-1 h-8 !text-center"
					/>
				</div>
			</div>

			<div className="flex gap-1">
				<ActionBtn
					type="foreground"
					size="sm"
					disabled={page <= 1}
					onClick={() => setPage(1)}
				>
					<FlatIcon icon="rs-angle-double-left" />
				</ActionBtn>
				<ActionBtn
					type="foreground"
					size="sm"
					disabled={page <= 1}
					onClick={() => setPage(page - 1)}
				>
					<FlatIcon icon="rs-angle-left" />
				</ActionBtn>
				<div className="flex items-center gap-2 mx-2 text-xs lg:text-sm">
					Page <b>{page}</b> of <b>{pageCount}</b>
				</div>
				<ActionBtn
					type="foreground"
					size="sm"
					className="h-8"
					disabled={page >= pageCount}
					onClick={() => setPage(page + 1)}
				>
					<FlatIcon icon="rs-angle-right" />
				</ActionBtn>
				<ActionBtn
					type="foreground"
					size="sm"
					className="h-8"
					disabled={page >= pageCount}
					onClick={() => setPage(pageCount)}
				>
					<FlatIcon icon="rs-angle-double-right" />
				</ActionBtn>
			</div>
		</div>
	);
};

export default Pagination;
