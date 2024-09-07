import { useEffect, useRef, useState } from "react";
import AppLayout from "../../components/container/AppLayout";
import PageHeader from "../../components/layout/PageHeader";
import TextInput from "../../components/inputs/TextInput";
import PatientMenu from "../../components/buttons/PatientMenu";
import Pagination from "../../components/table/Pagination";
import LoadingScreen from "../../components/loading-screens/LoadingScreen";
import useDataTable from "../../hooks/useDataTable";
import { Fade } from "react-reveal";
import PatientProfile from "./PatientProfile";
import ActionBtn from "../../components/buttons/ActionBtn";
import FlatIcon from "../../components/FlatIcon";
import Tippy from "@tippyjs/react";
import useNoBugUseEffect from "../../hooks/useNoBugUseEffect";
import PrivacyPolicyModal from "../../components/modal/PrivacyPolicyModal";
import NewPatientFormModal from "../../components/modal/NewPatientFormModal";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../hooks/useAuth";

const Patients = () => {
	const {
		data: patients,
		setData: setPatients,
		loading,
		page,
		setPage,
		meta,
		filters,
		paginate,
		setPaginate,
		setFilters,
	} = useDataTable({
		url: `/v1/patients`,
	});
	const { checkUserType } = useAuth();
	const [patient, setPatient] = useState(null);
	const [patientSelfie, setPatientSelfie] = useState(null);
	const privacyRef = useRef(null);
	const newPatientFormRef = useRef(null);

	useNoBugUseEffect({
		functions: () => {
			setPaginate(10);
		},
	});
	const refreshList = () => {
		setPage(1);
		setFilters((prevFilters) => ({
			...prevFilters,
			key: uuidv4(),
		}));
	};
	return (
		<AppLayout>
			{/* <PageHeader
				title="Patients"
				subtitle={`View patients`}
				icon="rr-users"
			/> */}
			<div className="p-4 h-full ">
				<div className="grid grid-cols-1 lg:grid-cols-12">
					<div className=" lg:col-span-4 xl:col-span-3 flex flex-col gap-y-4">
						<div className="flex items-center pr-4">
							<div>
								<h1 className="text-xl font-bold font-opensans text-primary-dark tracking-wider -mb-1 ">
									Patients Lists
								</h1>
								<span className="noto-sans-thin text-slate-500 text-sm font-light">
									Search and view patient data.
								</span>
							</div>
							{checkUserType("NURSE") || checkUserType("ER") ? (
								<ActionBtn
								className="text-base gap-2 ml-2 mb-2 items-center transition ease-in-out delay-30 hover:-translate-y-1 hover:scale-100 duration-100 "
								onClick={() => {
									newPatientFormRef.current.show();
								}}
								title="Add new patient"
								type="foreground-dark"
							>
								<FlatIcon icon="fi fi-ss-clipboard-user" /> Add new patient
							</ActionBtn>
								
							) : (
								""
							)}
						</div>
						<div className="pr-5">
							<TextInput
								iconLeft={"rr-search"}
								placeholder="Search patient..."
								onChange={(e) => {
									setFilters((prevFilters) => ({
										...prevFilters,
										keyword: e.target.value,
									}));
								}}
							/>
						</div>
						<div className="flex flex-col gap-y-4 relative">
							{loading ? <LoadingScreen /> : ""}
							<div className="flex flex-col gap-y-2 max-h-[calc(100vh-312px)] overflow-auto pr-5">
								{patients?.map((patientData) => {
									return (
										<PatientMenu
											onClick={() => {
												console.log(
													"setPatient",
													patientData
												);
												setPatient(patientData);
											}}
											patient={patientData}
											active={
												patientData?.id == patient?.id
											}
											key={`patient-${patientData?.id}`}
										/>
									);
								})}
							</div>
							<Pagination
								
								setPageSize={setPaginate}
								page={page}
								setPage={setPage}
								pageCount={meta?.last_page}
							/>
						</div>
					</div>
					<div className=" lg:col-span-8 xl:col-span-9">
						{patient ? (
							<Fade 
								key={`patient-profile-${patient?.id}`}>
								<PatientProfile patient={patient} />
							</Fade>
						) : (
							""
						)}
					</div>
				</div>
			</div>
			<NewPatientFormModal
				ref={newPatientFormRef}
				patientSelfie={patientSelfie}
			/>
			<PrivacyPolicyModal
				ref={privacyRef}
				onSuccess={(data) => {
					newPatientFormRef.current.show(null);
				}}
				patientSelfie={patientSelfie}
				setPatientSelfie={setPatientSelfie}
			/>
		</AppLayout>
	);
};

export default Patients;
