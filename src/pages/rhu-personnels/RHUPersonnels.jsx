/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Tippy from "@tippyjs/react";
import { useAuth } from "../../hooks/useAuth";
import useDataTable from "../../hooks/useDataTable";
import AppLayout from "../../components/container/AppLayout";
import Table from "../../components/table/Table";
import { formatDateMMDDYYYYHHIIA } from "../../libs/helpers";
import ActionBtn from "../../components/buttons/ActionBtn";
import FlatIcon from "../../components/FlatIcon";
import Pagination from "../../components/table/Pagination";
import TextInputField from "../../components/inputs/TextInputField";
import TextInput from "../../components/inputs/TextInput";
import PageTitle from "../../components/layout/PageTitle";
import PersonnelFormModal from "./components/PersonnelFormModal";
import DoctorAssignmentModal from "./components/DoctorAssignmentModal";
import useNoBugUseEffect from "../../hooks/useNoBugUseEffect";
import Axios from "../../libs/axios";
import ActivatePersonnelModal from "./components/ActivatePersonnelModal";
import DeactivatePersonnelModal from "./components/DeactivatePersonnelModal";
const uniq_id = uuidv4();
const RHUPersonnels = (props) => {
	const { patient } = props;
	const { user } = useAuth();
	const personnelFormRef = useRef(null);
	const activatePersonnelFormRef = useRef(null);
	const deactivatePersonnelFormRef = useRef(null);
	const doctorAssignmentRef = useRef(null);
	const [rhuList, setRhuList] = useState([]);
	const [specialties, setSpecialties] = useState([]);
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
		url: `v1/health-unit-personnels/list`,
		defaultFilters: {
			type: [
				"RHU-NURSE",
				"RHU-DOCTOR",
				"HIS-DOCTOR",
				
				"RHU-LAB",
				"RHU-XRAY",
				"RHU-PHAR",
			],
			key: uniq_id,
		},
	});

	
	useNoBugUseEffect({
		functions: () => {
			getRhuList();
			getSpecialties();
		},
		params: [1],
	});


	const getRhuList = () => {
		Axios.get(`v1/health-unit/list?type=RHU`).then((res) => {
			setRhuList(res.data.data);
		});
	};
	const getSpecialties = () => {
		Axios.get(`v1/specialties/list`).then((res) => {
			setSpecialties(res.data.data);
		});
	};


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
						icon={"rr-users"}
						title={"RHU Personnels"}
						subtitle={
							"Add, edit, deactivate and view RHU personnels."
						}
					/>
					<ActionBtn
						type="success"
						className="ml-auto h-11"
						onClick={() => {
							personnelFormRef.current.show();
						}}
					>
						<FlatIcon icon="rr-layer-plus" className="mr-2" />
						<span className="text-xs font-medium">
							Add Personnel
						</span>
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
						loading={loading}
						columns={[
							{
								header: "Name",
								className: "text-left",
								tdClassName: "text-left",
								key: "name",
								cell: (data) => {
									return `${
										data?.title?.length > 0
											? data?.title
											: ""
									} ${data?.name}`;
								},
							},
							{
								header: "Username",
								className: "text-left",
								tdClassName: "text-left",
								key: "username",
							},
							{
								header: "User Type",
								className: "text-left",
								tdClassName: "text-left",
								key: "type",
								cell: (data) => {
									return data?.type;
								},
							},
							{
								header: "Assignment",
								className: "text-left",
								tdClassName: "text-left",
								key: "type",
								cell: (data) => {
									return (
										<div className="flex flex-col">
											<span className="flex items-center gap-2">
												<span>
													RHU:{" "}
													<span className="font-bold">
														{data?.healthUnit
															?.name || (
															<i className="text-slate-400 font-light">
																unassigned
															</i>
														)}
													</span>
												</span>
											</span>
											{data?.room?.name ? (
												<span className="flex items-center gap-2">
													<span>
														ROOM:
														<span className="font-bold">
															{data?.room?.name}
														</span>
													</span>
												</span>
											) : (
												""
											)}
										</div>
									);
								},
							},
							{
								header: "Status",
								className: "text-center w-[128px]",
								tdClassName: "text-center w-[128px]",
								key: "status",
								cell: (data) => {
									return data?.status == 1 ||
										data?.status == "active" ? (
										<p className="text-green-600 lowercase">
											ACTIVE
										</p>
									) : (
										<p className="text-red-600 lowercase">
											INACTIVE
										</p>
									);
								},
							},
							{
								header: "Action",
								className: `w-[328px]`,
								tdClassName: `text-center`,
								key: "action",
								cell: (data) => {
									return (
										<div className="flex items-center justify-center flex-wrap gap-2">
											{String(data?.type || "")
												.toLowerCase()
												.includes("doctor") ? (
												<ActionBtn
													size="sm"
													type="teal"
													onClick={() => {
														doctorAssignmentRef.current.show(
															data
														);
													}}
												>
													<FlatIcon icon="rr-clipboard-list-check" />
													Assignment
												</ActionBtn>
											) : (
												<ActionBtn
													size="sm"
													type="secondary"
													onClick={() => {
														doctorAssignmentRef.current.show(
															data
														);
													}}
												>
													<FlatIcon icon="rr-clipboard-list-check" />
													Assign to RHU
												</ActionBtn>
											)}

											<ActionBtn
												size="sm"
												type="primary"
												onClick={() => {
													personnelFormRef.current.show(
														data
													);
												}}
											>
												<FlatIcon icon="rr-edit" />
												Edit
											</ActionBtn>
											{data?.status == 1 ||
											data?.status == "active" ? (
												<ActionBtn
													size="sm"
													type="danger"
													onClick={() => {
														deactivatePersonnelFormRef.current.show(
															data
														);
													}}
												>
													<FlatIcon
														icon="rr-trash"
														className="mr-1"
													/>
													Deactivate
												</ActionBtn>
											) : (
												<ActionBtn
													size="sm"
													type="success"
													onClick={() => {
														activatePersonnelFormRef.current.show(
															data
														);
													}}
												>
													<FlatIcon
														icon="rr-check"
														className="mr-1"
													/>
													Activate
												</ActionBtn>
											)}
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
			<PersonnelFormModal
				ref={personnelFormRef}
				specialties={specialties}
				onSuccess={() => {
					reloadData();
				}}
			/>
			<DoctorAssignmentModal
				ref={doctorAssignmentRef}
				rhuList={rhuList}
				onSuccess={() => {
					reloadData();
				}}
			/>
			<ActivatePersonnelModal
				ref={activatePersonnelFormRef}
				onSuccess={() => {
					reloadData();
				}}
			/>
			<DeactivatePersonnelModal
				ref={deactivatePersonnelFormRef}
				onSuccess={() => {
					reloadData();
				}}
			/>
		</AppLayout>
	);
};

export default RHUPersonnels;
