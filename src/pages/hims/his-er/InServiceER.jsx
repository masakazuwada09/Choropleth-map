import React from 'react'
import { doctorName, doctorSpecialty, patientFullName, patientRoomNumber, roomCategory } from '../../../libs/helpers';

/* eslint-disable react/prop-types */
const InServiceER = ({
	data,
	labOrdersStr = "",
	room = "1",
	patientQueueName = "#1 - John Doe",
	doctor = {
		title: "Dr.",
		name: "Tanya White",
		specialty: "",
	},
}) => {
    console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", data);
  return (
    <div className="flex flex-col bg-gray-50 border border-blue-100 p-4 rounded-xl relative">
			{data?.status == "in-service-result-reading" ? (
				<span className="bg-red-50 text-red-500 mb-4 text-center italic rounded-xl py-1 px-3 text-xs">
					Pending 
						<span className="text-red-500 font-medium ">
						For
						{labOrdersStr.includes(`"type":"imaging"`) &&
						labOrdersStr.includes(`"type":"laboratory-test"`)
							? " IMAGING and LABORATORY "
							: labOrdersStr.includes(`"type":"imaging"`)
							? " IMAGING "
							: " LABORATORY "}
						result reading
				</span>
			</span>
			) : (
				""
			)}
			<div className="grid grid-cols-1 lg:grid-cols-1 ">
				<div className="flex flex-col justify-center items-center">
					
					<h2 className=" text-3xl font-bold  text-success -mb-1">
					{/* {patientRoomNumber(room?.room)} */}
					{data?.room_number}
					{/* {data?.referredToDoctor?.room?.name} */}
					</h2>
				</div>{" "}
				<div className="flex flex-col justify-center items-center">
					<span className="font-light text-sm text-slate-600 mb-1">
						Patient
					</span>
					<h2 className=" text-3xl tracking-tight text-center font-bold text-teal-600 -mb-1">
						{patientFullName(data?.patient)}
					</h2>
				</div>
			</div>

			<span className="border-b  pb-4 mb-4 "></span>

			<span className="font-light mb-1     text-center text-xs text-slate-500">
				Doctor Assigned
			</span>
			<h4 className="text-lg text-center  font-bold text-indigo-900 -mb-1">
				{doctorName(data?.referredToDoctor)}
			</h4>
			<span className=" text-center font-light text-sm text-slate-600">
				{doctorSpecialty(data?.referredToDoctor)}
			</span>
		</div>
  )
}

export default InServiceER
