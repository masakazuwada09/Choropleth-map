import React, { useState } from 'react';
import { calculateAge, formatDate, patientFullName } from "../../libs/helpers";
import FlatIcon from "../FlatIcon";
import Img from "../Img";
import { useAuth } from "../../hooks/useAuth";
import ProgressBar from '../ProgressBar';

const PatientMenu = ({ patient, active = false, ...rest }) => {
  const { checkUserType } = useAuth();
  const [currentStage, setCurrentStage] = useState('Nurse');

  // Define progress and status text based on user type
  const stages = {
    "DC-NURSE": { progress: 16.66, statusText: '10%' },
    "DC-CASHIER": { progress: 33.33, statusText: '25%' },
    "DC-LABORATORY": { progress: 50, statusText: '50%' },
    "DC-DOCTOR": { progress: 66.66, statusText: '75%' },
    "DC-PHARMACY": { progress: 83.33, statusText: '90%' },
    "DC-FINALIZE": { progress: 100, statusText: 'Finalizing' }
  };

  // Determine the current user type and corresponding progress
  const userType = Object.keys(stages).find(type => checkUserType(type));
  const currentStageData = stages[userType] || stages["DC-NURSE"];

  return (
    <div
       icon="fi fi-sr-paperclip-vertical"
      className={`outline-none text-blue-500 rounded-xl p-3 flex items-center gap-3 hover:bg-white cursor-pointer duration-300 border border-blue-300 hover:border-blue-500 hover:shadow-lg ${
        active ? "bg-white !border-blue-500 shadow-lg" : ""
      }`}
      {...rest}
    >
      <Img
        src={patient?.avatar || ""}
        type="user"
        name={patientFullName(patient)}
        className=" w-14 rounded-md object-contain bg-slate-200"
      />
      
      {/* FlatIcon only active when PatientMenu is active */}
     

      <div className="flex flex-col">
        <span className={`text-base text-slate-600 font-semibold ${active ? "text-teal-600" : ""}`}>
          {patientFullName(patient)}
        </span>
        <div className="flex lg:gap-4">
          <div className="flex gap-4 text-sm text-slate-500 mb-1">
            <div className="flex items-center gap-2 text-sm">
              <FlatIcon
                icon="rr-venus-mars"
                className="text-sm"
              />
              {String(patient?.gender).toLowerCase() === "male" ? (
                <span className="text-teal-700">Male</span>
              ) : (
                <span className="text-pink-700">Female</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <FlatIcon
              icon="rr-calendar-clock"
              className="text-sm"
            />
            <span>{calculateAge(patient?.birthday)} yrs old</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <FlatIcon icon="rr-calendar" className="text-sm" />
          <span>{formatDate(patient?.birthday)}</span>
        </div>

        {/* ProgressBar Section with Tooltip */}
        {/* <div className="relative w-[270px] mb-4">
          <ProgressBar
            progress={currentStageData.progress}
            statusText={currentStageData.statusText}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700 bg-gray-100 p-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {currentStageData.statusText}
            </span>
          </div>
        </div> */}

        {/* Conditional Content */}
        {checkUserType("DC-NURSE") ? (
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="text-green-700 font-bold"></span>
          </div>
        ) : checkUserType("DC-CASHIER") ? (
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <FlatIcon icon="fi fi-br-peso-sign" className="text-sm text-red-800" />
            <span className="text-red-700 font-bold">PENDING FOR PAYMENT</span>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default PatientMenu;
