import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import Login from "./pages/auth/login.jsx";
import Patients from "./pages/patients/Patients.jsx";
import axios from "./libs/axios.js";
import { getStorage } from "./libs/storage";
import { toast } from "react-toastify";
import PatientConsultation from "./pages/consultation/PatientConsultation.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Appointments from "./pages/appointments/Appointments.jsx";
import MyAccount from "./pages/my-account/MyAccount.jsx";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import PatientQueue from "./pages/patient-queue/PatientQueue.jsx";
import Root from "./Root.jsx";
import AppRoutes from "./AppRoutes.jsx";
import RHULists from "./pages/rhu-lists/RHULists.jsx";
import DoctorSpecialties from "./pages/doctor-specialties/DoctorSpecialties.jsx";
import RHUPersonnels from "./pages/rhu-personnels/RHUPersonnels.jsx";
import RHURooms from "./pages/rhu-rooms/RHURooms.jsx";
import LaboratoryTests from "./pages/laboratory-tests/LaboratoryTests.jsx";
import DoctorPatientQueue from "./pages/department/his-md/components/DoctorPatientQueue.jsx";
import PatientLabQueue from "./pages/patient-lab-queue/PatientLabQueue.jsx";
import Error404 from "./Error404.jsx";
import Consignments from "./pages/consignments/Consignments.jsx";
import Inventories from "./pages/inventories/Inventories.jsx";
import DoctorPatientReferrals from "./pages/department/his-md/components/DoctorPatientReferrals.jsx";
import PatientCashierQueue from "./pages/patient-queue/PatientCashierQueue.jsx";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import PatientAnestesiaQueue from "./pages/department/his-anesthesia/PatientAnestesiaQueue.jsx";
import Inventory from "./pages/department/his-nurse/Inventory.jsx";
import PatientMonitoring from "./pages/department/his-anesthesia/PatientMonitoring.jsx";
import PatientERQueue from "./pages/hims/his-er/PatientERQueue.jsx";
import PatientBillingQueue from "./pages/hims/his-billing/PatientBillingQueue.jsx";
import PatientHousekeepingQueue from "./pages/hims/his-housekeeping/PatientHousekeepingQueue.jsx";
import InfectiousERQueue from "./pages/hims/er-infectious/InfectiousERQueue.jsx";
import SurgeryQueue from "./pages/department/his-surgical/SurgeryQueue.jsx";
import InServiceSurgery from "./pages/department/his-surgical/InServiceSurgery.jsx";
import AppointmentDetailsForSurgery from "./pages/department/his-surgical/AppointmentDetailsForSurgery.jsx";
import PACUQueue from "./pages/hims/his-pacu/PACUQueue.jsx";
import OPDQueue from "./pages/hims/his-opd/components/OPDQueue.jsx";
import PatientImagingQueue from "./pages/patient-imaging-queue/PatientImagingQueue.jsx";
import FrontDeskQueue from "./pages/diagnostic-center/dc-frontdesk/components/FrontDeskQueue.jsx";
import NurseQueue from "./pages/diagnostic-center/dc-nurse/components/NurseQueue.jsx";
import PatientLaboratory from "./pages/diagnostic-center/dc-laboratory/components/PatientLaboratory.jsx";
import PatientCashierLab from "./pages/diagnostic-center/dc-cashier/components/PatientCashierLab.jsx";
import DoctorQueue from "./pages/diagnostic-center/dc-doctor/components/DoctorQueue.jsx";
import PatientPharmacyQueue from "./pages/diagnostic-center/dc-pharmacy/components/PatientPharmacyQueue.jsx";
import PatientImaging from "./pages/diagnostic-center/dc-imaging/components/PatientImaging.jsx";
import LaboratoryTestsRate from "./pages/diagnostic-center/dc-cashier/components/LaboratoryTestsRate.jsx";
import Discounts from "./pages/diagnostic-center/dc-cashier/components/Discounts.jsx";





window.Pusher = Pusher;
 
axios.interceptors.request.use(
	async function (config) {
		const token = await getStorage("token");
		console.log("axios.interceptors.request");
		if (token) {
			config.headers["Authorization"] = "Bearer " + token;
		}
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);
const removeSession = () => {
	if (!window.location.pathname.includes("login")) {
		setTimeout(() => {
			toast.error(
				"Session expired! Login to your credentails to continue."
			);
		}, 500);
		window.localStorage.clear();
		window.location.pathname = "/login";
	}
};
axios.interceptors.response.use(
	(response) => {
		if (response.status === 500) {
			toast.error("Unable to connect to server!");
			return Promise.reject({ response });
		}

		return response;
	},
	(error) => {
		if (error.response) {
			const code = error.response.status;

			switch (parseInt(code)) {
				case 401:
				case 403:
					removeSession();
					break;

				case 500:
					// toast.error("Internal server error");
					break;
			}

			if (error.response && error.response.data) {
				return Promise.reject(error);
			}
		}

		return Promise.reject(error.message);
	}
);
// const router = createBrowserRouter([

// 	{
// 		path: "/login",
// 		element: <Login />,
// 	},
// 	{
// 		path: "/",
// 		element: <Root />,
// 	},
// 	{
// 		path: "/virtual-consultation",
// 		element: <App />,
// 	},
// 	{
// 		path: "/appointments",
// 		element: <Appointments />,
// 	},
// 	{
// 		path: "/patients",
// 		element: <Patients />,
// 	},
// 	{
// 		path: "/patient-queue",
// 		element: <PatientQueue />,
// 	},
// 	{
// 		path: "/my-account",
// 		element: <MyAccount />,
// 	},
// 	{
// 		path: "/consultation",
// 		element: <PatientConsultation />,
// 	},
// ]);
const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<Root />}>
			<Route path="index" element={<AppRoutes />}></Route>
			<Route path="login" element={<Login />}></Route>
			<Route path="his-nurse">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				<Route path="telemedicine" element={<Appointments />}></Route>
				<Route path="patient-queue" element={<PatientQueue />}></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
				{/* <Route path="inventory" element = {<Inventory />}></Route> */}
			</Route>

			<Route path="his-laboratory">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<PatientLaboratory />}></Route>
				<Route
					path="patient-lab-queue"
					element={<PatientLabQueue />}
				></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route>

			<Route path="his-imaging">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				<Route
					path="patient-lab-queue"
					element={<PatientImagingQueue />}
				></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route>

			<Route path="his-cashier">
				<Route path="" element={<Dashboard />}></Route>
				<Route
					path="patient-cashier-queue"
					element={<PatientCashierQueue />}
				></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route>

			<Route path="his-pharmacy">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				<Route path="consignments" element={<Consignments />}></Route>
				<Route path="inventory" element={<Inventories />}></Route>

				<Route
					path="patient-pharmacy-queue"
					element={<PatientPharmacyQueue />}
				></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route>

			<Route path="rhu-admin">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="rhu-list" element={<RHULists />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				<Route path="personnels" element={<RHUPersonnels />}></Route>
				<Route
					path="doctor-specialties"
					element={<DoctorSpecialties />}
				></Route>
				<Route path="rooms" element={<RHURooms />}></Route>
				<Route
					path="laboratory-tests"
					element={<LaboratoryTests />}
				></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route>
			
			<Route path="his-anesthesia">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element = {<Patients />}></Route>
				<Route path="patient-anesthesia-queue" element = {<PatientAnestesiaQueue />}></Route>
				<Route path="inventory" element = {<Inventory />}></Route>
			</Route>

			<Route path="pacu-nurse">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element = {<Patients />}></Route>
				<Route path="pacu-queue" element = {<PACUQueue />}></Route>
				<Route path="inventory" element = {<Inventory />}></Route>
			</Route>
			
			<Route path="opd-nurse">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element = {<Patients />}></Route>
				<Route path="opd-queue" element = {<OPDQueue />}></Route>
			</Route>

			<Route path="dc-frontdesk">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element = {<Patients />}></Route>
				<Route path="frontdesk-queue" element = {<FrontDeskQueue />}></Route>
			</Route>

			<Route path="dc-nurse">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element = {<Patients />}></Route>
				<Route path="nurse-queue" element = {<NurseQueue />}></Route>
			</Route>
			
			<Route path="dc-doctor">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element = {<Patients />}></Route>
				<Route
					path="patient-queue"
					element={<DoctorQueue />}
				></Route>
			</Route>

			<Route path="dc-laboratory">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element = {<Patients />}></Route>
				<Route
					path="patient-lab-queue"
					element={<PatientLaboratory />}
				></Route>
				<Route
					path="laboratory-tests"
					element={<LaboratoryTests />}
				></Route>
			</Route>
			
			<Route path="dc-imaging">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element = {<Patients />}></Route>
				<Route
					path="patient-imaging-queue"
					element={<PatientImaging />}
				></Route>
			</Route>
			<Route path="dc-cashier">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element = {<Patients />}></Route>
				<Route
					path="patient-receipt"
					element={<PatientCashierLab />}
				></Route>
				<Route
					path="discounts"
					element={<Discounts />}
				></Route>
				<Route
					path="laboratory-tests-rate"
					element={<LaboratoryTestsRate />}
				></Route>
			</Route>
			<Route path="dc-pharmacy">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				<Route path="inventory" element={<Inventories />}></Route>
				<Route
					path="patient-pharmacy-queue"
					element={<PatientPharmacyQueue />}
				></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route>

			<Route path="his-monitoring">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patient-monitoring" element = {<PatientMonitoring />}></Route>
			</Route>

			
			{/* <Route path="his-nurse">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				<Route path="patient-anesthesia-queue" element={<PatientAnestesiaQueue />}></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route> */}

			<Route path="his-er">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				<Route path="er-queue" element={<PatientERQueue />}></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
				{/* <Route path="inventory" element = {<Inventory />}></Route> */}
			</Route>

			<Route path="opd-infectious">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				<Route path="opdinfectious-queue" element={<InfectiousERQueue />}></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
				{/* <Route path="inventory" element = {<Inventory />}></Route> */}
			</Route>


			<Route path="his-md">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				{/* <Route path="telemedicine" element={<Appointments />}></Route> */}
				<Route
					path="patient-queue"
					element={<DoctorPatientQueue />}
				>
			</Route>

			
			<Route path="vegapunk">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				{/* <Route path="telemedicine" element={<Appointments />}></Route> */}
				<Route
					path="patient-queue"
					element={<DoctorPatientQueue />}
				>
				</Route>
				
				</Route>
				
				</Route>
				
				<Route path="his-surgeon">
				<Route path="" element={<Dashboard />}></Route>
				<Route path="patients" element={<Patients />}></Route>
				{/* <Route path="telemedicine" element={<Appointments />}></Route> */}
				
				<Route
					path="surgical-queue"
					element={<SurgeryQueue />}
				></Route>
				</Route>

			
			<Route path="his-billing">
				<Route path="" element={<Dashboard />}></Route>
				<Route
					path="patient-billing-queue"
					element={<PatientBillingQueue />}
				></Route>
				<Route path="my-acco 	unt" element={<MyAccount />}></Route>
			</Route>


			<Route path="his-housekeeping">
				<Route path="" element={<Dashboard />}></Route>
				<Route
					path="patient-housekeeping-queue"
					element={<PatientHousekeepingQueue />}
				></Route>
				<Route path="my-account" element={<MyAccount />}></Route>
			</Route>
			<Route path="*" element={<Error404 />}></Route>
		</Route>
	)
);
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;



const AppMain = (props) => {


	const [online, setOnline] = useState(navigator.onLine);
	const [token, setToken] = useState("");

	useEffect(() => {
		const handleStorageChange = (event) => {
			// Check if the storage event was triggered by a change in the specific item we are interested in
			if (event.key === 'token') {
				setToken(event.token);
			}
		  };
		  window.addEventListener('storage', handleStorageChange);
		  const storedData = localStorage.getItem('token');
		  if (storedData) {
			setToken(storedData);
		  }

		  return () => {
			window.removeEventListener('storage', handleStorageChange);
		  };
	},[]);
	useEffect(() => {
		console.log('Online', navigator.onLine);
		
	},[online,token]);

	return props.children;


}
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<AppMain>
			<RouterProvider router={router} />
		</AppMain>
	</React.StrictMode>
);
