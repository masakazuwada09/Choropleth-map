import React, { useRef, useState } from 'react'
import { formatDate } from "../libs/helpers";
import PatientProfileContent from "../pages/patients/components/PatientProfileContent";
import InfoText from "./InfoText";
import ContentTitle from "./buttons/ContentTitle";


/* eslint-disable react/prop-types */
const PatientProfileDetails = ({ patient }) => {
	return (
		<div className="flex flex-col items-start px-2">
		
			<PatientProfileContent patient={patient} />
			{/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 w-full mb-2">
				<InfoText
					icon="rr-cursor-text"
					className="lg:col-span-12"
					title="Lastname "
					value={patient?.lastname}
				/>
				<InfoText
					icon="rr-cursor-text"
					className="lg:col-span-12"
					title="Firstname "
					value={patient?.firstname}
				/>
				<InfoText
					icon="rr-cursor-text"
					className="lg:col-span-12"
					title="Middle Name"
					value={patient?.middle}
				/>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-1 gap-2 w-full mb-2">
				<InfoText
					icon="rr-venus-mars"
					title="Gender"
					value={
						<>
							{String(patient?.gender).toLowerCase() == "male" ? (
								<span className="text-blue-700">Male</span>
							) : (
								<span className="text-pink-700">Female</span>
							)}
						</>
					}
				/>
				<InfoText
					icon="rr-calendar-clock"
					title="Birthday"
					value={formatDate(patient?.birthday)}
				/>
				<InfoText
					icon="rr-following"
					title="Civil Status"
					value={patient?.civil_status}
				/>
				<InfoText
					icon="rr-file"
					title="Philhealth"
					value={patient?.philhealth}
				/>
			</div>
			<h5 className="text-base font-semibold text-tertiary mb-4 border-b w-2/3">
				Address
			</h5>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-2 w-full">
				<InfoText
					icon="rr-map-marker"
					title="Province"
					className="lg:col-span-6"
					labelClassName={`lg:col-span-4`}
					contentClassName={`lg:col-span-8`}
					value={"Sarangani"}
				/>
				<InfoText
					icon="rr-map-marker"
					title="City/Municipality"
					className="lg:col-span-6"
					labelClassName={`lg:col-span-4`}
					contentClassName={`lg:col-span-8`}
					value={patient?.municipality?.name}
				/>
				<InfoText
					icon="rr-map-marker"
					title="Barangay"
					className="lg:col-span-6"
					labelClassName={`lg:col-span-4`}
					contentClassName={`lg:col-span-8`}
					value={patient?.barangay?.name}
				/>
				<InfoText
					icon="rr-map-marker"
					title="Zone"
					className="lg:col-span-6"
					labelClassName={`lg:col-span-4`}
					contentClassName={`lg:col-span-8`}
					value={patient?.zone}
				/>
				<InfoText
					icon="rr-map-marker"
					title="Street"
					className="lg:col-span-6"
					labelClassName={`lg:col-span-4`}
					contentClassName={`lg:col-span-8`}
					value={patient?.street}
				/>
			</div>
			{patient?.income?.length > 0 ? (
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-3 w-full">
					<div className="table col-span-6">
						<table>
							<thead>
								<tr>
									<th>Job/Source of Income</th>
									<th className="text-right">Amount</th>
								</tr>
							</thead>
							<tbody>
								{patient?.income?.map((income) => (
									<tr key={`patient-income-${income?.id}`}>
										<td>{income?.name}</td>
										<td className="text-right">
											{income?.amount?.toFixed(2)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			) : (
				""
			)} */}
		</div>
	);
};

export default PatientProfileDetails;
