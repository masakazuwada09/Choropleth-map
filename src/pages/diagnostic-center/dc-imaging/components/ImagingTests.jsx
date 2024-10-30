/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
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
import LaboratoryTestFormModal from "../../dc-laboratory/modal/LaboratoryTestFormModal";
import ImagingTestFormModal from "../modal/ImagingTestFormModal";
const uniq_id = uuidv4();
const ImagingTests = (props) => {
	const { patient } = props;
	const { user } = useAuth();
	const imagingTestFormRef = useRef(null);
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
		test,
		setPaginate,
		data,
		setData,
		column,
		setColumn,
		laboratoryResult,
		direction,
		setDirection,
		filters,
		setFilters,
	} = useDataTable({
		url: `v1/laboratory/imaging/list`,
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
						title={"Imaging Tests"}
						subtitle={"Add, edit and view all tests."}
					/>
					<ActionBtn
						type="success"
						className="ml-auto h-11"
						onClick={() => {
							imagingTestFormRef.current.show();
						}}
					>
						<FlatIcon icon="rr-layer-plus" className="mr-2" />
						<span className="text-xs font-medium">Add</span>
					</ActionBtn>
					<div className="ml-5 ">
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
			<div className="px-2 py-2 flex gap-2">
				<div className="w-[100vh] border">
					<div className="flex flex-col text-left">
							<span className="font-bold -mb-1">
								Send Order
							</span>
							<span className="text-[10px] font-light">
							Patient
						queue to
						laboratory/imaging
						</span>
					</div>

					</div>
					<div className="w-full">
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
								header: "Name",
								className: "text-left",
								tdClassName: "text-left",
								sortable: true,
								key: "name",
								cell: (data) => {
									return data?.name;
								},
							},
							{
								header: "Type",
								className: "text-left",
								tdClassName: "text-left",
								sortable: true,
								key: "type",
								cell: (data) => {
									return data?.type;
								},
							},
							{
								header: "Price Rate",
								className: "text-left",
								tdClassName: "text-left",
								sortable: true,
								key: "img_rate",
								cell: (data) => {
									return data?.img_rate;
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
													imagingTestFormRef.current.show(
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
			</div>

			<ImagingTestFormModal
				ref={imagingTestFormRef}
				onSuccess={() => {
					reloadData();
				}}
				healthUnits={healthUnits}
			/>

			{/* <RoomFormModal
				ref={imagingTestFormRef}
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

export default ImagingTests;
