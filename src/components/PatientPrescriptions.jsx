/* eslint-disable react/prop-types */
import React, { useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import useDataTable from "../hooks/useDataTable";
import { formatDateMMDDYYYYHHIIA } from "../libs/helpers";
import FlatIcon from "./FlatIcon";
import ActionBtn from "./buttons/ActionBtn";
import ContentTitle from "./buttons/ContentTitle";
import Pagination from "./table/Pagination";
import Table from "./table/Table";
import CreatePrescriptionModal from "./patient-modules/modals/CreatePrescriptionModal";
import SelectItemModal from "./modal/SelectItemModal";

const PatientPrescriptions = (props) => {
	const { patient, allowCreate } = props;
	const { user } = useAuth();
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
	} = useDataTable({
		url: `/v1/clinic/patient-prescription/${patient?.id}`,
	});
	const createPrescriptionRef = useRef(null);
	const selecItemRef = useRef(null);

	return (
		<div className="flex flex-col items-start px-2 py-2">
			
			<Table
				className={`pb-2`}
				loading={loading}
				columns={[
					{
						header: "Date and time",
						className: "text-left",
						tdClassName: "text-left",
						key: "date",
						cell: (data) => {
							return formatDateMMDDYYYYHHIIA(
								new Date(data?.created_at)
							);
						},
					},
					{
						header: "Doctor",
						className: "text-left",
						tdClassName: "text-left",
						key: "doctor",
						cell: (data) => {
							return data?.doctor?.name;
						},
					},
					{
						header: "Status",
						className: "text-left",
						tdClassName: "text-left",
						key: "status",
					},
					{
						header: "Action",
						className: "",
						tdClassName: "text-center flex items-center",
						key: "action",
						cell: (data) => {
							return (
								<div className="w-full flex items-center">
									<ActionBtn className="!w-11 mx-auto">
										<FlatIcon icon="rr-eye" />
									</ActionBtn>
								</div>
							);
						},
					},
				]}
				data={data}
			/>
			<Pagination
				page={page}
				setPage={setPage}
				pageCount={meta?.last_page}
				pageSize={paginate}
				setPageSize={setPaginate}
			/>
			<CreatePrescriptionModal
				ref={createPrescriptionRef}
				selecItemRef={selecItemRef}
			/>
			<SelectItemModal ref={selecItemRef} />
		</div>
	);
};

export default PatientPrescriptions;
