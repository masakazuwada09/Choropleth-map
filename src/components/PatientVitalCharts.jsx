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
import TabGroupHorizontal from "./TabGroupHorizontal";
import BloodPressureChart from "./vitals/BloodPressureChart";
import PulseChart from "./vitals/PulseChart.JSX";
import RespirationChart from "./vitals/RespirationChart";
import TemperatureChart from "./vitals/TemperatureChart";
import GlucoseChart from "./vitals/GlucoseChart";
import HumanBiometric from "../spline/components/HumanBiometric";
import HumanLungs from "../spline/components/HumanLungs";

const PatientVitalCharts = (props) => {
	const { patient, allowCreate } = props;

	const createPrescriptionRef = useRef(null);
	const selecItemRef = useRef(null);

	return (
		<div className="flex flex-col items-start px-2 py-2 mr-2 ml-2 bg-white">
			<ContentTitle title="Patient Vital Charts"></ContentTitle>
			<div className="mt-4">
				<TabGroupHorizontal
					contentClassName={"max-h "}
					contents={[
						{
							title: (
								<>
									<img
										src="/vitals/bp.png"
										className="w-6 h-6 object-contain mr-2"
									/>
									Blood Pressure
								</>
							),
							content: (
								<div className="flex flex-col w-[900px] relative">
									<h3 className="font-bold px-4 flex items-center gap-3 relative mb-3 text-2xl">
										<img
											src="/vitals/bp.png"
											className="w-11 h-11 object-contain"
										/>
										Blood Pressure
									</h3>

									<BloodPressureChart
										patient={patient}
										w={512}
										h={384}
									/>
									
								</div>
							),
						},
						{
							title: (
								<>
									<img
										src="/vitals/heart-rate.png"
										className="w-6 h-6 object-contain mr-2"
									/>
									Heart Rate
								</>
							),
							content: (
								<div className="flex flex-col w-full relative">
									<h3 className="font-bold px-4 flex items-center gap-3 relative mb-3 text-2xl">
										<img
											src="/vitals/heart-rate.png"
											className="w-11 h-11 object-contain"
										/>
										Heart Rate
									</h3>

									<PulseChart
										patient={patient}
										w={512}
										h={384}
									/>
								</div>
							),
						},
						{
							title: (
								<>
									<img
										src="/vitals/respiration.png"
										className="w-6 h-6 object-contain mr-2"
									/>
									Respiratory Rate
								</>
							),
							content: (
								<div className="flex flex-col  relative w-[900px] gap-2 ">
									<h3 className="font-bold px-4 flex items-center gap-3 relative mb-3 text-2xl">
										<img
											src="/vitals/respiration.png"
											className="w-11 h-11 object-contain"
										/>
										Respiratory Rate
									</h3>

									<RespirationChart
										patient={patient}
										w={512}
										h={384}
									/>
									<HumanLungs 
									className=""
									/>
								</div>
							),
						},
						{
							title: (
								<>
									<img
										src="/vitals/temperature-celcius.png"
										className="w-6 h-6 object-contain mr-2"
									/>
									Temperature
								</>
							),
							content: (
								<div className="flex flex-col w-full relative">
									<h3 className="font-bold px-4 flex items-center gap-3 relative mb-3 text-2xl">
										<img
											src="/vitals/temperature-celcius.png"
											className="w-11 h-11 object-contain"
										/>
										Temperature
									</h3>

									<TemperatureChart
										patient={patient}
										w={512}
										h={384}
									/>
								</div>
							),
						},
						{
							title: (
								<>
									<img
										src="/vitals/glucose.png"
										className="w-6 h-6 object-contain mr-2"
									/>
									Glucose
								</>
							),
							content: (
								<div className="flex flex-col w-full relative">
									<h3 className="font-bold px-4 flex items-center gap-3 relative mb-3 text-2xl">
										<img
											src="/vitals/glucose.png"
											className="w-11 h-11 object-contain"
										/>
										Glucose Levels
									</h3>

									<GlucoseChart
										patient={patient}
										w={512}
										h={384}
									/>
								</div>
							),
						},
					]}
				/>
			</div>
			
		</div>
		
	);
};

export default PatientVitalCharts;
