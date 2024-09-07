import { useEffect, useState } from "react";
import AppLayout from "../../../../components/container/AppLayout";
import useNoBugUseEffect from "../../../../hooks/useNoBugUseEffect";
import TextInput from "../../../../components/inputs/TextInput";
import Pagination from "../../../../components/table/Pagination";
import LoadingScreen from "../../../../components/loading-screens/LoadingScreen";
import PatientMenu from "./PatientMenu";
import ImagingOrders from "./ImagingOrders";
import PatientProfile from "../../dc-laboratory/components/PatientProfile";
import { useAuth } from "../../../../hooks/useAuth";
import useLabQueue from "../../../../hooks/useLabQueue";
import useDataTable from "../../../../hooks/useDataTable";
import { Fade } from "react-reveal";
import { patientFullName } from "../../../../libs/helpers";

const PatientImaging = () => {
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
  const [patient, setPatient] = useState(null);
  const [order, setOrder] = useState(null);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const { pending, mutatePending } = useLabQueue();

  // List pending patients
  const listPending = () => {
    return pending?.data || [];
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

  return (
    <AppLayout>
      <div className="p-4 h-full overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 divide-x">
          <div className="lg:col-span-4">
            <h1 className="text-xl font-bold font-opensans text-primary-dark tracking-wider -mb-1">
              Patient Queue
            </h1>
            <span className="noto-sans-thin text-slate-500 text-sm font-light">
              Patients pending for imaging services
            </span>
            <div className="pr-5 py-3">
              <TextInput
                iconLeft={"rr-search"}
                placeholder="Search patient..."
                onChange={handleSearch}
              />
            </div>
            <div className="flex flex-col gap-y-4 relative">
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
                      />
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
          <div className="lg:col-span-8 pl-4">
            <div className="flex items-center gap-4 pb-4">
              <h1 className="text-xl font-bold font-opensans text-success-dark tracking-wider -mb-1">
                In Service...
              </h1>
            </div>
            <div>
              {order?.relationships?.patient ? (
                <Fade key={`order-${order?.id}`}>
                  <div>
                    <PatientProfile patient={order?.relationships?.patient} />
                    <div className="py-4">
                      <ImagingOrders
                        patient={order?.relationships?.patient}
                        order_id={order?.id}
                        onUploadLabResultSuccess={() => {
                          mutatePending();
                          setOrder(null); // Clear the current order on success
                        }}
                      />
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

export default PatientImaging;
