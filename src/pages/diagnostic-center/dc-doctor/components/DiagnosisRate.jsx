/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../../../hooks/useAuth";
import useDataTable from "../../../../hooks/useDataTable";
import AppLayout from "../../../../components/container/AppLayout";
import Table from "../../../../components/table/Table";
import ActionBtn from "../../../../components/buttons/ActionBtn";
import FlatIcon from "../../../../components/FlatIcon";
import Pagination from "../../../../components/table/Pagination";
import TextInput from "../../../../components/inputs/TextInput";
import PageTitle from "../../../../components/layout/PageTitle";
import Axios from "../../../../libs/axios";
import useNoBugUseEffect from "../../../../hooks/useNoBugUseEffect";
import LaboratoryTestFormModal from "../../../laboratory-tests/components/LaboratoryTestFormModal";
import DiagnosisFormModal from "./modal/DiagnosisFormModal";
const uniq_id = uuidv4();
const DiagnosisRate = (props) => {
	const { patient } = props;
	const { user } = useAuth();
	const laboratoryTestFormRef = useRef(null);
	const deactivateRoomFormRef = useRef(null);
	const activateRoomFormRef = useRef(null);
	const [healthUnits, setHealthUnits] = useState([null]);
	const {
		page,
		reloadData,
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
		url: `v1/doctor/diagnosis/list`,
		defaultFilters: {
			key: uniq_id,
		},
	});

	const getHealthUnits = () => {
		Axios.get(`/v1/health-unit/list?type=RHU`).then((res) => {
			setHealthUnits(res.data.data);
		});
	};

	useNoBugUseEffect({
		functions: () => {
			getHealthUnits();
		},
		params: [],
	});

	return (
		<AppLayout>
			{/* <PageHeader
				title="Patients"
				subtitle={`View patients`}
				icon="rr-users"
			/> */}
			<div className="p-0 h-full ">
				<div className="sticky top-0 z-10 shadow py-4 px-5 flex items-center w-full bg-slate-100">
					<PageTitle
						icon={"rr-microscope"}
						title={"Diagnosis"}
						subtitle={"Add, edit and view all diagnosis."}
					/>
					<ActionBtn
						type="success"
						className="ml-auto h-11"
						onClick={() => {
							laboratoryTestFormRef.current.show();
						}}
					>
						<FlatIcon icon="rr-layer-plus" className="mr-2" />
						<span className="text-xs font-medium">Add</span>
					</ActionBtn>
					<div className="ml-5 lg:w-[256px]">
						<TextInput
							iconLeft={"rr-search"}
							placeholder="Search..."
							onChange={(e) => {
								setFilters((prevFilters) => ({
									...prevFilters,
									keyword: e.target.value,
								}));
							}}
						/>
					</div>
				</div>
				<div className="px-5 py-5">
					<Table
						className={`pb-2`}
						onSort={(column, direction) => {
							setFilters((prevFilters) => ({
								...prevFilters,
								key: uuidv4(),
								column: column,
								direction: direction,
							}));
						}}
						loading={loading}
						columns={[
							{
								header: "Code",
								className: "text-left",
								tdClassName: "text-left",
								sortable: true,
								key: "case_code",
								cell: (data) => {
									return data?.case_code;
								},
							},
							{
								header: "Case Description",
								className: "text-left",
								tdClassName: "text-left",
								sortable: true,
								key: "case_description",
								cell: (data) => {
									return data?.case_description;
								},
							},
							{
								header: "Type",
								className: "text-left",
								tdClassName: "text-left",
								sortable: true,
								key: "case_type",
								cell: (data) => {
									return data?.case_type;
								},
							},
							{
								header: "Price Rate",
								className: "text-left",
								tdClassName: "text-left",
								sortable: true,
								key: "case_rate",
								cell: (data) => {
									return data?.case_rate;
								},
							},
							{
								header: "Professional Fee",
								className: "text-left",
								tdClassName: "text-left",
								sortable: true,
								key: "professional_fee",
								cell: (data) => {
									return data?.professional_fee;
								},
							},
							{
								header: "Clinic Share",
								className: "text-left",
								tdClassName: "text-left",
								sortable: true,
								key: "clinic_share",
								cell: (data) => {
									return data?.clinic_share;
								},
							},
							{
								header: "Case Rate Code",
								className: "text-left",
								tdClassName: "text-left",
								sortable: true,
								key: "case_rate_code",
								cell: (data) => {
									return data?.case_rate_code;
								},
							},
							{
								header: "Action",
								className: `w-[150px]`,
								tdClassName: `text-center`,
								key: "action",
								cell: (data) => {
									return (
										<div className="flex items-center justify-center flex-wrap gap-2">
											<ActionBtn
												size="sm"
												type="primary"
												onClick={() => {
													laboratoryTestFormRef.current.show(
														data
													);
												}}
											>
												<FlatIcon
													icon="rr-edit"
													className="mr-2"
												/>
												Edit
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
				</div>
			</div>
			<DiagnosisFormModal
				ref={laboratoryTestFormRef}
				onSuccess={() => {
					reloadData();
				}}
				healthUnits={healthUnits}
			/>

			{/* <RoomFormModal
				ref={laboratoryTestFormRef}
				onSuccess={() => {
					reloadData();
				}}
				healthUnits={healthUnits}
			/>
			<ActivateRoomModal
				ref={activateRoomFormRef}
				onSuccess={() => {
					reloadData();
				}}
			/>
			<DeActivateRoomModal
				ref={deactivateRoomFormRef}
				onSuccess={() => {
					reloadData();
				}}
			/> */}
		</AppLayout>
	);
};

export default DiagnosisRate;
