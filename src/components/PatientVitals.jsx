/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { formatDateMMDDYYYYHHIIA } from "../libs/helpers";
import ActionBtn from "./buttons/ActionBtn";
import VitalsForm from "./VitalsForm";
import { useForm } from "react-hook-form";
import UpdatePatientVitalsModal from "./modal/UpdatePatientVitalsModal";
import FlatIcon from "./FlatIcon";
import useNoBugUseEffect from "../hooks/useNoBugUseEffect";
import Axios from "../libs/axios";
import ContentTitle from "./buttons/ContentTitle";
import { cardio } from 'ldrs'



const Card = ({ title, children, icon, color }) => {
	return (
		<div className="shadow-sm rounded-xl flex items-center p-3 w-1/2 2xl:w-[calc(100%/3-24px)] border-[0.5px] border-blue-300">
			<div className="flex flex-col pb-3">
				<h3
					className="text-base font-bold text-gray-900 mb-0 text-opacity-75"
					style={{ color: color }}
				>
					{title}
				</h3>
				<div className="h-[3px] w-4/5 bg-blue-300 mb-[1px]" />
				<div className="h-[2px] w-2/5 bg-red-300 mb-3" />
				{children}
			</div>
			<div className="p-1 bg-white bg-opacity-5 rounded-xl ml-auto">
				<img
					src={`/vitals/${icon}.png`}
					className="w-10 object-contain"
				/>
			</div>
		</div>
	);
};
const PatientVitals = (props) => {
	const {
		patient,
		appointment = null,
		showTitle = true,
		mutateAll,
		onSuccess,
	} = props;
	const {
		register,
		formState: { errors },
	} = useForm();
	const [vitals, setVitals] = useState(false);
	const [update, setUpdate] = useState(false);
	const [loading, setLoading] = useState(true);
	const updateVitalRef = useRef(null);
	useNoBugUseEffect({
		functions: () => {
			if (patient?.id) getPatientVitals(patient);
		},
		params: [patient?.id],
	});
	const getPatientVitals = (patientData) => {
		setLoading(true);
		Axios.get(`v1/patient-vitals/vital-signs/${patientData?.id}`)
			.then((res) => {
				setVitals(res.data.data || []);
				if (onSuccess) {
					onSuccess(res.data.data);
				}
			})
			.finally(() => {
				setTimeout(() => {
					setLoading(false);
				}, 1000);
			});
	};
	cardio.register()


	return (
		<div className="flex flex-col items-start">
			{showTitle ? (
				<ContentTitle title="Patient Vitals">
					{/* <ActionBtn
						size="sm"
						onClick={() => {
							updateVitalRef.current.show(patient, appointment);
							// setUpdate(true);
						}}
					>
						<FlatIcon icon="rr-edit" className="mr-1" />
						Update Vitals
					</ActionBtn> */}
				</ContentTitle>
			) : (
				<div className="flex items-center gap-4 pb-2">
					{vitals?.updated_at ? (
						<>
							<span className="text-base">
								Last updated{" "}
								{vitals?.updated_at
									? formatDateMMDDYYYYHHIIA(
											new Date(vitals?.updated_at)
									  )
									: ""}
							</span>
							{/* <ActionBtn
								size="sm"
								onClick={() => {
									updateVitalRef.current.show(
										patient,
										appointment
									);
									// setUpdate(true);
								}}
							>
								<FlatIcon icon="rr-edit" className="mr-1" />
								Update Vitals
							</ActionBtn> */}
						</>
					) : (
						""
					)}
				</div>
			)}
			{loading ? (
				<div className="p-5 flex items-center justify-center w-full">
					<h2 className="text-2xl font-bold animate-pulse flex items-center gap-2">
							<l-cardio
							size="65"
							stroke="4"
							speed="2" 
							color="black" 
							></l-cardio>
						
					</h2>
				</div>
			) : appointment?.vital_id ? (
				<div className="flex items-start justify-start flex-wrap gap-6 pb-11 w-full px-0">
					<Card
						color="black"
						title="Blood Pressure"
						icon="blood-pressure"
					>
						<div className="flex items-center gap-2">
							<b className="text-2xl text-darker">
								{vitals?.blood_systolic}
							</b>
							<span className="text-base text-placeholder">
								/
							</span>
							<b className="text-2xl text-darker">
								{vitals?.blood_diastolic}
							</b>
							<span className="text-placeholder text-base">
								mmHG
							</span>
						</div>
					</Card>
					<Card color="red" title="Heart Rate" icon="heart-rate">
						<div className="flex items-center gap-2">
							<b className="text-2xl text-darker">
								{vitals?.pulse}
							</b>
							<span className="text-placeholder text-base">
								bpm
							</span>
						</div>
					</Card>
					<Card
						color="blue"
						title="Respiratory Rate"
						icon="respiration"
					>
						<div className="flex items-center gap-2">
							<b className="text-2xl text-darker">
								{vitals?.respiratory}
							</b>
							<span className="text-placeholder text-base">
								bpm
							</span>
						</div>
					</Card>
					<Card
						color="darkorange"
						title="Temperature"
						icon="temperature-celcius"
					>
						<div className="flex items-center gap-2">
							<b className="text-2xl text-darker">
								{vitals?.temperature}
							</b>
							<span className="text-placeholder text-base">
								°C
							</span>
						</div>
					</Card>
					<Card color="green" title="Height" icon="height">
						<div className="flex items-center gap-2">
							<b className="text-2xl text-darker">
								{vitals?.height}
							</b>
							<span className="text-placeholder text-base">
								cm
							</span>
						</div>
					</Card>
					<Card color="brown" title="Weight" icon="weight">
						<div className="flex items-center gap-2">
							<b className="text-2xl text-darker">
								{vitals?.weight}
							</b>
							<span className="text-placeholder text-base">
								kg
							</span>
						</div>
					</Card>

					<Card color="blue" title="BMI" icon="weight">
						<div className="flex items-center gap-2">
							<b className="text-xl text-darker">{vitals?.bmi}</b>
							<span className="text-placeholder text-base"></span>
						</div>
					</Card>
					<Card color="red" title="Covid 19" icon="swab">
						<div className="flex items-center gap-2">
							<b className="text-xl text-darker">
								{vitals?.covid_19}
							</b>
							<span className="text-placeholder text-base"></span>
						</div>
					</Card>
					<Card
						color="orange"
						title="Tubercolosis"
						icon="mycobacterium-tuberculosis"
					>
						<div className="flex items-center gap-2">
							<b className="text-xl text-darker">{vitals?.tb}</b>
							<span className="text-placeholder text-base"></span>
						</div>
					</Card>
					<Card color="red" title="Blood Type" icon="blood-donation">
						<div className="flex items-center gap-2">
							<b className="text-xl text-darker">
								{vitals?.bloody_type == "undefined"
									? "N/A"
									: vitals?.bloody_type || "-"}
							</b>
							<span className="text-placeholder text-base"></span>
						</div>
					</Card>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center gap-4 px-5 w-full">
					<span className="">
						No patient vitals record found. <br />
						Click on "<b>Update Vitals</b>" to update.
					</span>
					<ActionBtn
						size="lg"
						onClick={() => {
							updateVitalRef.current.show(patient, appointment);
							// setUpdate(true);
						}}
					>
						<FlatIcon icon="rr-edit" className="mr-1" />
						Update Vitals
					</ActionBtn>
				</div>
			)}
			<UpdatePatientVitalsModal
				ref={updateVitalRef}
				onSuccess={(data) => {
					console.log("onSuccess", getPatientVitals(patient));
					if (mutateAll) mutateAll();
					if (onSuccess) onSuccess(data);
				}}
			/>
		</div>
	);
};

export default PatientVitals;
