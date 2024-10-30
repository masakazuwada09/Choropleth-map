import React, { useState,useEffect, useRef } from "react";
import FlatIcon from "../components/FlatIcon";
import AppLayout from "../components/container/AppLayout";
import PageHeader from "../components/layout/PageHeader";
import PromotionsModal from "../components/modal/PromotionsModal";
import { useAuth } from "../hooks/useAuth";
import useNoBugUseEffect from "../hooks/useNoBugUseEffect";
import BloodPressureChart from "../components/vitals/BloodPressureChart";
import TotalPatients from "./diagnostic-center/dc-nurse/components/Charts/TotalPatients";
import useDataTable from "../hooks/useDataTable";
import PatientMenu from "../components/buttons/PatientMenu";
import PatientLists from "./patients/components/PatientLists";
import InteractiveCube
 from "../spline/components/InteractiveCube";
import HumanBiometric from "../spline/components/HumanBiometric";
import PatientsGraph from "./patients/components/Graph/PatientsGraph";
import PatientsRadar from "./patients/components/Graph/PatientsRadar";
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import PickMapLocation from "../components/PickMapLocation";
const Dashboard = (patient) => {
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
  useNoBugUseEffect({
		functions: () => {
			setPaginate(500);
		},
	});
	const { user } = useAuth();
  	const patientCount = patients ? patients.length : 0;
	const promotionModalRef = useRef(null);
	useNoBugUseEffect({
		functions: () => {
			setTimeout(() => {
				promotionModalRef.current.show();
			}, 400);
		},
		params: [1],
	});

	const radarChartData = [
		{
		  metric: "Heart Rate",
		  PatientA: 80,
		  PatientB: 70,
		  fullMark: 100,
		},
		{
		  metric: "Blood Pressure",
		  PatientA: 120,
		  PatientB: 110,
		  fullMark: 150,
		},
		{
		  metric: "Cholesterol",
		  PatientA: 200,
		  PatientB: 180,
		  fullMark: 300,
		},
		{
		  metric: "Respiration",
		  PatientA: 18,
		  PatientB: 20,
		  fullMark: 25,
		},
		{
		  metric: "Oxygen Saturation",
		  PatientA: 98,
		  PatientB: 96,
		  fullMark: 100,
		},
	  ];
	  const [position, setPosition] = useState({
		lat: 6.103330,
		lng: 125.220560,
	});

	return (
		<>
		<HumanBiometric className="z-50 index-0 absolute "/>
			<AppLayout>
				
				<div className="flex p-3 mt-4">
	<div className="lg:col-span-8">
	<div class="mb-5 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
          <div class="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-6 h-6 text-white">
              <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"></path>
              <path fill-rule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clip-rule="evenodd"></path>
              <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"></path>
            </svg>
          </div>
          <div class="p-4 text-right">
            <p class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">TOTAL Patients</p>
            <h4 class="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{patientCount}</h4>
          </div>
          <div class="border-t border-blue-gray-50 p-4">
            <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
              <strong class="text-green-500">+55%</strong>&nbsp;than last week
            </p>
          </div>
        </div>
        <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
          <div class="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-pink-600 to-pink-400 text-white shadow-pink-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-6 h-6 text-white">
              <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="p-4 text-right">
            <p class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">Today's Patients</p>
            <h4 class="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-teal-500">2</h4>
          </div>
          <div class="border-t border-blue-gray-50 p-4">
            <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
              <strong class="text-green-500">+3%</strong>&nbsp;than last month
            </p>
          </div>
        </div>
		<div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
          <div class="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-pink-600 to-pink-400 text-white shadow-pink-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-6 h-6 text-white">
              <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="p-4 text-right">
            <p class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">Today's Patients</p>
            <h4 class="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-teal-500">2</h4>
          </div>
          <div class="border-t border-blue-gray-50 p-4">
            <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
              <strong class="text-green-500">+3%</strong>&nbsp;than last month
            </p>
          </div>
        </div>
        
       
      </div>

      <div className="flex flex-col gap-y-2 max-h-[calc(100vh-312px)] overflow-auto pr-5 border rounded-md max-w-full absolute">
        
		{patients?.map((patientData) => {
			return (
				<PatientLists
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

		<div className="w-[700px] absolute ml-[550px] flex mt-[200px]">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={30} domain={[0, 300]} />
                  <Radar
                    name="Patient A"
                    dataKey="PatientA"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Patient B"
                    dataKey="PatientB"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
			
																
					</div>
					
				</div>
			</AppLayout>
			
			{/* <PromotionsModal ref={promotionModalRef} /> */}
		</>
	);
};

export default Dashboard;
