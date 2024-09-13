import { useEffect, useRef, useState } from "react";
import Axios from "../../../../libs/axios";
import AppLayout from "../../../../components/container/AppLayout";
import useNoBugUseEffect from "../../../../hooks/useNoBugUseEffect";
import PageHeader from "../../../../components/layout/PageHeader";
import InServiceItem from "../../../patient-lab-queue/components/InServiceItem";
import FlatIcon from "../../../../components/FlatIcon";
import InQueueRegular from "../../../patient-queue/components/InQueueRegular";
import useQueue from "../../../../hooks/useQueue";
import {
	calculateAge,
	doctorName,
	doctorSpecialty,
	formatDate,
	patientFullName,
} from "../../../../libs/helpers";
import ReferToSPHModal from "../../../../components/modal/ReferToSPHModal";
import { useAuth } from "../../../../hooks/useAuth";
import useDoctorQueue from "../../../../hooks/useDoctorQueue";
import useLabQueue from "../../../../hooks/useLabQueue";
import Img from "../../../../components/Img";
import { Fade } from "react-reveal";
import UploadLabResultModal from "../../../../components/patient-modules/modals/UploadLabResultModal";
import ActionBtn from "../../../../components/buttons/ActionBtn";
import TabGroup from "../../../../components/TabGroup";
import MenuTitle from "../../../../components/buttons/MenuTitle";
import Chemistry from "../../../../components/laboratory/Chemistry";
import Microscopy from "../../../../components/laboratory/Microscopy";
import Hematology from "../../../../components/laboratory/Hematology";
import Microbiology from "../../../../components/laboratory/Microbiology";
import Serology from "../../../../components/laboratory/Serology";
import Bloodtype from "../../../../components/laboratory/Bloodtype";
import Crossmatching from "../../../../components/laboratory/Crossmatching";
import Covid from "../../../../components/laboratory/Covid";
import Miscellaneous from "../../../../components/laboratory/Miscellaneous";
import ChemistryModal from "../../../../components/modal/laboratory/ChemistryModal";
import PatientInfo from "../../../patients/components/PatientInfo";
import CashierAppointmentDetails from "./CashierAppointmentDetails";
import PatientProfile from "./PatientProfile";
import PendingOrdersModal from "./modal/PendingOrdersModal";
import useMDQueue from "../../../../hooks/useMDQueue";
import useCashierQueue from "../../../../hooks/useCashierQueue";
import TextInput from "../../../../components/inputs/TextInput";
import Pagination from "../../../../components/table/Pagination";
import useDataTable from "../../../../hooks/useDataTable";
import LoadingScreen from "../../../../components/loading-screens/LoadingScreen";
import PatientMenu from "./PatientMenu";
import LaboratoryOrders from "./LaboratoryOrders";
import BillingStatement from "./BillingStatement";




const PatientCashierLab = () => {
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
	  
	const { user } = useAuth();
	const {
		pending: doctorsPending,
		nowServing: doctorsNowServing,
		pendingForResultReading,
		mutatePending,
		mutatePendingForResultReading,
		mutateNowServing,
	} = useCashierQueue();//cashier to pendingorder to laboratory to doctor
	const { pending, nowServing } = useCashierQueue();
	const patientProfileRef = useRef(null);
	const pendingOrdersRef = useRef(null);
	const [order, setOrder] = useState(null);
	const [filteredPatients, setFilteredPatients] = useState([]);
	const [appointment, setAppointment] = useState(null);
	const [patient, setPatient] = useState(null);
	const [loadingDone, setLoadingDone] = useState(false);
	const [showData, setShowData] = useState(null);
	const referToSphModalRef = useRef(null);
	const uploadLabResultRef = useRef(null);
	const [selectedTab, setSelectedTab] = useState("");
	const billingStatus = patient?.billing_status || "pending";
	
	

	const listPending = () => {
		return pending?.data || [];
		// return (isDoctor() ? doctorsPending?.data : pending?.data) || [];
	};
	useEffect(() => {
		// When the component mounts or pending data changes, set filtered patients
		setFilteredPatients(listPending());
	  }, [pending]);
	
	  const handlePatientClick = (queue) => {
		setOrder(queue);
		setPatient(queue?.relationships?.patient);
	  };
	
	  const handleSearch = (e) => {
		const keyword = e.target.value.toLowerCase();
		setFilters((prevFilters) => ({
		  ...prevFilters,
		  keyword: keyword,
		}));
	
		const filtered = listPending().filter((queue) => {
		  const patientName = patientFullName(queue?.relationships?.patient).toLowerCase();
		  return patientName.includes(keyword);
		});
	
		setFilteredPatients(filtered);
	
		if (filtered.length === 1) {
		  const singleQueue = filtered[0];
		  setOrder(singleQueue);
		  setPatient(singleQueue?.relationships?.patient);
		} else if (filtered.length === 0) {
		  setOrder(null);
		  setPatient(null);
		}
	  };
	  const mutateAll = () => {
		mutatePending();
		mutatePendingForResultReading();
		mutateNowServing();
	};

	return (
		<AppLayout>
			{/* <PageHeader
				title="Patient Queue"
				subtitle={"View patients in queue"}
				icon="rr-clipboard-list-check"
			/> */}
			<div className="p-4  ">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-5 divide-x ">
					<div className="lg:col-span-4 ">
						<h1 className="text-lg font-semibold font-opensans text-gray-400 tracking-wider -mb-1">
							Patient Queue
						</h1>
						<span className="noto-sans-thin text-slate-500 text-sm font-light">
							Patients pending for laboratory services
						</span>
			<div className="pr-5 py-3 ">
              <TextInput
                iconLeft={"rr-search"}
                placeholder="Search patient..."
                onChange={handleSearch}
              />
            </div>
			<div className="flex flex-col gap-y-4 relative  overflow-auto ">
              {loading && <LoadingScreen />}
              <div className="flex flex-col gap-y-2 max-h-[calc(100vh-312px)] overflow-auto pr-5">
                {filteredPatients.length === 0 ? (
                  <span className="text-center py-20 font-bold text-slate-400">
                    No patients in queue.
                  </span>
                ) : (
                  filteredPatients.map((queue, index) => {
                    const patientData = queue?.relationships?.patient;
                    return (
                      <PatientMenu
                        key={index}
                        onClick={() => handlePatientClick(queue)}
                        patient={patientData}
                        active={queue?.id === patient?.id}
                        patientName={patientFullName(patientData)}
                      >
					  </PatientMenu>
                    );
                  })
                )}
              </div>
              <Pagination
                setPageSize={setPaginate}
                page={page}
                setPage={setPage}
                pageCount={meta?.last_page}
              />
            </div>
					</div>
					<div className="lg:col-span-8 pl-4  ">
						<div className="flex items-center gap-4 pb-4 ">
							<h1 className="text-lg font-semibold font-opensans text-gray-400 mb-1 ">
								In Service...
							</h1>
						</div>
						<div className="">
						{order?.relationships?.patient ? (
								<Fade key={`order-${order?.id}`}>
									<div className="flex flex-col items-center justify-center gap-2">
										<div className="w-[840px] rounded-lg shadow-lg p-2">
										<PatientInfo
											patient={
												order?.relationships?.patient
											}
											
										/>
										</div>
										
										<div className="py-2 overflow-auto ">
										{billingStatus === "pending" ? (
											<div className="">
											<LaboratoryOrders
												pendingOrdersRef={pendingOrdersRef}
												patient={
													order?.relationships
														?.patient
												}
												mutateAll={mutateAll}
											/>

											<BillingStatement
											loading={loading}
											// onSave={cashierApproval}
											appointment={appointment}
											patient={patient}
											/>

											
											</div>
                            
						
                        ) : (
                            			<BillingStatement
											loading={loading}
											// onSave={cashierApproval}
											appointment={appointment}
											patient={patient}
										/>
                        )}
											

										
							
										</div>
									</div>
									
								</Fade>
							) : (
								<span className="w-full font-medium text-lg text-center py-20 text-slate-300">
									No patient selected
								</span>
							)}
							
						</div>
					</div>
				</div>
				
			</div>
		</AppLayout>
	);
};

export default PatientCashierLab;
