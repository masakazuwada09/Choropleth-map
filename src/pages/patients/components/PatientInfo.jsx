/* eslint-disable react/prop-types */
import  { React, useRef, useState } from 'react'
import { v4 as uuidv4 } from "uuid";
import FlatIcon from "../../../components/FlatIcon";
import { useForm } from "react-hook-form";
import useNoBugUseEffect from '../../../hooks/useNoBugUseEffect';
import Axios from '../../../libs/axios';
import AppointmentStatus from '../../../components/AppointmentStatus';
import Img from "../../../components/Img";
import {
	calculateAge,
	formatDate,
	patientAddress,
	getPhilHealth,
	patientFullName,
} from "../../../libs/helpers";

const uniq_id = uuidv4();

/* eslint-disable react/prop-types */
const InfoText = ({
	className = "",
	valueClassName = "",
	label,
	icon,
	value,
}) => {
	return (
		<div className={`flex flex-col ${className}`}>
			{label ? (
				<span className="text-slate-800 text-xs capitalize mb-1">
					{label}
				</span>
			) : (
				""
			)}
			<div className="flex items-center mb-0 gap-2">
				<span className="flex items-center justify-center">
					<FlatIcon
						icon={icon || "bs-arrow-turn-down-right"}
						className="text-[10px] text-slate-600 ml-1"
					/>
				</span>
				<span
					className={`capitalize gap-1 text-slate-900 flex text-base flex-wrap ${valueClassName} `}
				>
					{value}
				</span>
			</div>
		</div>
	);
};


const PatientInfo = ({ 
		appointment: propAppointment,
		patient, 
		children, 
		patientSelfie,
	}) => {
	
		

		const {
			register,
			getValues,
			setValue,
			control,
			reset,
			watch,
			handleSubmit,
			formState: { errors },
		} = useForm();


		
		const [appointment, setAppointment] = useState(propAppointment);
		const [key, setKey] = useState(uniq_id);

		useNoBugUseEffect({
			functions: () => {
				setTimeout(() => {
					if (appointment?.social_history) {
						Object.keys(appointment?.social_history).map((key) => {
							console.log(
								"appointment?.social_history[key]",
								key,
								appointment?.social_history[key]
							);
							setValue(key, appointment?.social_history[key]);
						});
					}
				}, 1500);
			},
			params: [appointment?.id, key],
		});


		const refreshData = () => {
			Axios.get(`v1/clinic/get-appointment/${appointment?.id}`).then(
				(res) => {
					setAppointment(res.data.data);
					setKey(uuidv4());
				}
			);
		};


	return (
		<div className='flex flex-row w-full items-center'>
			

			<div className="  rounded-full aspect-square bg-background">
				<Img
					type="user"
					name={`${patient?.firstname}-${patient?.lastname}`}
					src={patientSelfie ? patientSelfie : patient?.avatar || ""}
					className="min-h-[90px] min-w-[90px] aspect-square object-cover rounded-lg"
					alt=""
					id="user-image-sample"
					key={`key-${patient?.id}-${patient?.avatar}`}
				/>
			</div>


			<div className="pl-3 !text-sm w-full ">
				<h6
					className={` text-xl font-semibold flex pt-4 items-center ${
						String(patient?.gender).toLowerCase() == "male"
							? "text-teal-800"
							: "text-pink-800"
					} mb-0`}
				>
					{patientFullName(patient)}
				</h6>
				<div className="flex gap-6 ">
					<div className="flex items-center gap-2 text-base">
						<FlatIcon
							icon="rr-calendar-clock"
							className="text-base"
						/>
						<span>{calculateAge(patient?.birthday)} yrs. old</span>
					</div>
					<div className="flex items-center gap-2 text-base">
						<FlatIcon icon="rr-calendar" className="text-base" />
						<span>{formatDate(patient?.birthday)}</span>
					</div>
					<div className="flex items-center gap-2 text-base">
						<FlatIcon icon="rr-venus-mars" className="text-base" />
						{String(patient?.gender).toLowerCase() == "male" ? (
							<span className="text-teal-700 font-bold">Male</span>
						) : (
							<span className="text-pink-700">Female</span>
						)}
					</div>
				</div>

				<div className="flex gap-2 text-base">
					<FlatIcon icon="rr-map-marker" className="text-base" />
					<span className="capitalize  flex w-full">
						{patientAddress(patient)}
					</span>

					
				</div>	
			</div>

	{/* <div className="flex flex-col items-center justify-center w-full">
      <img
        src="/vitals/philhealthlogo.png"
        className="w-8 h-8 object-contain "
      />
	  <div className="capitalize font-bold text-sm text-gray-900 ">
        <div>
          PHILHEALTH IDENTIFICATION NUMBER (PIN)
          
        </div>
		
	</div>
	<span >{patient?.philhealth}</span>
    </div> */}

	
	
				
			{children}
			
			</div>

			
			
			
			
	)
};

export default PatientInfo;
