import { useForm } from "react-hook-form";
import CollapseDiv from "../../../components/CollapseDiv";
import FlatIcon from "../../../components/FlatIcon";
import PatientVitals from "../../../components/PatientVitals";
import {
	generalHistories,
	medicalSurgicalHistories,
	symptoms,
} from "../../../libs/appointmentOptions";
import {
	doctorName,
	doctorSpecialty,
	formatDateMMDDYYYYHHIIA,
	keyByValue,
} from "../../../libs/helpers";
import useNoBugUseEffect from "../../../hooks/useNoBugUseEffect";
import TextInputField from "../../../components/inputs/TextInputField";
import { react, useEffect, useState } from "react";
import AppointmentStatus from "../../../components/AppointmentStatus";

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
					{value} &nbsp;
				</span>
			</div>
		</div>
	);
};
const AppointmentDetails = ({
	showService = true,
	appointment,
	serviceComponent,
	forResult = false,
	customStatus = null,
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
	useNoBugUseEffect({
		functions: () => {
			setTimeout(() => {
				if (appointment?.social_history) {
					Object.keys(appointment?.social_history).map((key) => {
						setValue(key, appointment?.social_history[key]);
					});
				}
				// if (appointment?.general_history) {
				// 	Object.keys(appointment?.general_history).map((key) => {
				// 		setValue(key, appointment?.general_history[key]);
				// 	});
				// }

				// if (appointment?.surgical_history) {
				// 	Object.keys(appointment?.surgical_history).map((key) => {
				// 		setValue(key, appointment?.surgical_history[key]);
				// 	});
				// }
				// if (appointment?.environmental_history) {
				// 	Object.keys(appointment?.environmental_history).map(
				// 		(key) => {
				// 			setValue(
				// 				key,
				// 				appointment?.environmental_history[key]
				// 			);
				// 		}
				// 	);
				// }
			}, 1000);
		},
		params: [appointment?.id],
	});

	return (
		<div className="flex flex-col">
			<h4 className="border flex items-center text-base font-bold p-2 mb-0 border-indigo-100 lg:col-span-12">
				<span>Appointment Information</span>
				<span className="ml-auto">
					Status:{" "}
					<b className="uppercase font-normal">
						<AppointmentStatus
							customStatus={customStatus}
							forResult={forResult}
							appointment={appointment}
						/>
					</b>
				</span>
			</h4>
			{appointment?.id ? (
				<>
					<div className="flex flex-col gap-y-4 px-4 border-x border-b rounded-b-xl border-indigo-100 pt-5 pb-4">
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-3 px-4">
							{appointment?.doctor?.name ? (
								<InfoText
									className="lg:col-span-6"
									label="Doctor:"
									value={
										<div className="flex flex-col">
											<span>
												{doctorName(
													appointment?.doctor
												)}
											</span>
											<span className="text-xs font-light">
												{doctorSpecialty(
													appointment?.doctor
												)}
											</span>
										</div>
									}
								/>
							) : (
								""
							)}
							{appointment?.referredToDoctor?.name ? (
								<InfoText
									className="lg:col-span-6"
									label="Doctor:"
									value={
										<div className="flex flex-col">
											<span>
												{doctorName(
													appointment?.referredToDoctor
												)}
											</span>
											<span className="text-xs font-light">
												{doctorSpecialty(
													appointment?.referredToDoctor
												)}
											</span>
										</div>
									}
								/>
							) : (
								""
							)}
							<InfoText
								className="lg:col-span-6"
								label="Initial Diagnosis:"
								value={appointment?.post_notes}
							/>
							<InfoText
								className="lg:col-span-6"
								label="Date:"
								value={formatDateMMDDYYYYHHIIA(
									new Date(appointment?.created_at)
								)}
							/>
							<InfoText
								className="lg:col-span-6"
								label="Chief complaint:"
								value={appointment?.pre_notes}
							/>
							<InfoText
								className="lg:col-span-6"
								label="Reason for appointment:"
								value={appointment?.reason}
							/>
							<InfoText
								className="lg:col-span-6"
								label="Mode of consultation:"
								valueClassName=" !uppercase"
								value={appointment?.mode_of_consultation}
							/>
							<InfoText
								className="lg:col-span-6"
								label="PHIC ID:"
								value={appointment?.phic_no}
							/>
							<InfoText
								className="lg:col-span-12"
								label="Brief Clinical History and Pertinent Physical Examination:"
								value={appointment?.history}
							/>
							<InfoText
								className="lg:col-span-12"
								label="Laboratory Findings (Including ECG, X-ray, and other diagnostic procedures):"
								value={appointment?.lab_findings}
							/>
						</div>
						<CollapseDiv
							defaultOpen={false}
							withCaret={true}
							title="More details"
							headerClassName="bg-blue-50"
							bodyClassName="p-0"
						>
							<div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-	">
								<h4 className="border-y-2 flex items-center text-sm font-medium p-2 mb-0 lg:col-span-12">
									<span>General History</span>
								</h4>
								<div className="grid grid-cols-1 lg:grid-cols-12 gap-x-4 px-2 lg:col-span-12">
									<div className="flex flex-col lg:col-span-4">
										{generalHistories?.map(
											(data, index) => {
												if (index <= 4)
													return (
														<div
															className="flex flex-col"
															key={`${keyByValue(
																data?.value
															)}`}
														>
															<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
																<input
																	type="checkbox"
																	checked={
																		appointment?.general_history
																			? appointment
																					?.general_history[
																					data
																						?.name
																			  ] !=
																			  "false"
																			: false
																	}
																	readOnly
																	{...register(
																		data?.name
																	)}
																/>
																<span>
																	{
																		data?.label
																	}
																</span>
															</label>
														</div>
													);
											}
										)}
									</div>
									<div className="flex flex-col lg:col-span-3 ">
										{generalHistories?.map(
											(data, index) => {
												if (index > 4 && index <= 9)
													return (
														<div
															className="flex flex-col"
															key={`${keyByValue(
																data?.value
															)}`}
														>
															<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
																<input
																	checked={
																		appointment?.general_history
																			? appointment
																					?.general_history[
																					data
																						?.name
																			  ] !=
																			  "false"
																			: false
																	}
																	readOnly
																	type="checkbox"
																	{...register(
																		data?.name
																	)}
																/>
																<span className="">
																	{
																		data?.label
																	}
																</span>
															</label>
														</div>
													);
											}
										)}
									</div>
									<div className="flex flex-col lg:col-span-5">
										{generalHistories?.map(
											(data, index) => {
												if (index > 9)
													return (
														<div
															className="flex flex-col"
															key={`${keyByValue(
																data?.label
															)}`}
														>
															<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
																<input
																	type="checkbox"
																	checked={
																		appointment?.general_history
																			? appointment
																					?.general_history[
																					data
																						?.name
																			  ] !=
																			  "false"
																			: false
																	}
																	readOnly
																	{...register(
																		data?.name
																	)}
																/>
																<span>
																	{
																		data?.label
																	}
																</span>
															</label>
															{data?.specify ? (
																<TextInputField
																	readOnly
																	labelClassName="whitespace-nowrap"
																	className="flex items-center gap-4"
																	inputClassName="!p-2 !h-8"
																	label={`${data?.specify}:`}
																	placeholder="Please specify"
																	defaultValue={
																		appointment?.general_history
																			? appointment
																					?.general_history[
																					data
																						?.name
																			  ] !=
																			  "false"
																			: false
																	}
																	{...register(
																		`${data?.name}_details`
																	)}
																/>
															) : (
																""
															)}
														</div>
													);
											}
										)}
									</div>
								</div>
								<div className="lg:col-span-12">
									<h4 className="border-y-2 text-sm font-medium p-2 mb-3">
										Medical and Surgical History
									</h4>
									<div className="table table-bordered">
										<table className="bordered">
											<thead>
												<tr>
													<th className="w-1/3">
														Click if patient has an
														experience
													</th>
													<th>
														Details (i.e.
														medications taken, yeat
														diagnosed, year of
														surgery or injury, etc.)
													</th>
												</tr>
											</thead>
											<tbody>
												{medicalSurgicalHistories?.map(
													(data) => {
														return (
															<tr
																key={`${keyByValue(
																	data?.label
																)}`}
															>
																<td className="!py-0 align-middle">
																	<label className=" mb-0 p-2 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
																		<input
																			type="checkbox"
																			checked={
																				appointment?.surgical_history &&
																				appointment
																					?.surgical_history[
																					data
																						?.name
																				] !=
																					"false" &&
																				appointment
																					?.surgical_history[
																					data
																						?.name
																				] !==
																					null
																			}
																			readOnly
																			{...register(
																				data?.name,
																				{}
																			)}
																		/>
																		<span>
																			{
																				data?.label
																			}
																		</span>
																	</label>
																</td>
																<td className="p-1">
																	<TextInputField
																		inputClassName="bg-white"
																		placeholder={`${data?.label} details...`}
																		disabled={
																			appointment?.surgical_history &&
																			appointment
																				?.surgical_history[
																				data
																					?.name
																			]
																				? false
																				: true
																		}
																		{...register(
																			`${data?.name}_details`,
																			{}
																		)}
																	/>
																</td>
															</tr>
														);
													}
												)}
											</tbody>
										</table>
									</div>
								</div>
								<div className="lg:col-span-12">
									<h4 className="border-y-2 text-base font-bold p-2 mb-4">
										Personal / Social history
									</h4>

									<div className="table table-bordered mb-4">
										<table>
											<tbody>
												<tr>
													<th
														colSpan={3}
														className="!text-blue-600"
													>
														Diet, feeding, nutrition
														(in most days of the
														week)
													</th>
												</tr>
												<tr>
													<td>
														Intake of high sugar
														(chocolates, pastries,
														cakes, softdrinks, etc):
													</td>
													<td className="lg:w-1/4">
														<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
															<input
																type="radio"
																className="pointer-events-none"
																value="no"
																{...register(
																	"intake_high_sugar",
																	{}
																)}
															/>
															<span>
																No, patient
																follows balanced
																diet
															</span>
														</label>
													</td>
													<td className="lg:w-1/4">
														<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
															<input
																type="radio"
																className="pointer-events-none"
																value="yes"
																{...register(
																	"intake_high_sugar",
																	{}
																)}
															/>
															<span>Yes</span>
														</label>
													</td>
												</tr>

												<tr>
													<td>Takes supplements</td>
													<td colSpan={2}>
														<div className="flex items-center gap-10">
															<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
																<input
																	type="radio"
																	className="pointer-events-none"
																	value="no"
																	{...register(
																		"take_supplements",
																		{}
																	)}
																/>
																<span>No</span>
															</label>
															<div className="flex items-center gap-2">
																<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
																	<input
																		type="radio"
																		className="pointer-events-none"
																		value="yes"
																		{...register(
																			"take_supplements",
																			{}
																		)}
																	/>
																	<span>
																		Yes
																	</span>
																</label>
																<TextInputField
																	{...register(
																		"take_supplements_details",
																		{}
																	)}
																	disabled={
																		watch(
																			"take_supplements"
																		) !=
																		"yes"
																	}
																	inputClassName="bg-white"
																	placeholder="Specify..."
																/>
															</div>
														</div>
													</td>
												</tr>
												<tr>
													<td>
														Deworming every 6 months
														(only until age 12)
													</td>
													<td colSpan={2}>
														<div className="flex items-center gap-10">
															<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
																<input
																	type="radio"
																	className="pointer-events-none"
																	value="no"
																	{...register(
																		"deworming_6months",
																		{}
																	)}
																/>
																<span>No</span>
															</label>
															<div className="flex items-center gap-2">
																<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
																	<input
																		type="radio"
																		className="pointer-events-none"
																		value="yes"
																		{...register(
																			"deworming_6months",
																			{}
																		)}
																	/>
																	<span>
																		Yes
																	</span>
																</label>
																<TextInputField
																	inputClassName="bg-white"
																	disabled={
																		watch(
																			"deworming_6months"
																		) !=
																		"yes"
																	}
																	placeholder="Specify..."
																	{...register(
																		"deworming_6months_details",
																		{}
																	)}
																/>
															</div>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</div>

									<div className="table table-bordered mb-4">
										<table>
											<tbody>
												<tr>
													<th
														colSpan={3}
														className="!text-blue-600"
													>
														Oral health
													</th>
												</tr>

												<tr>
													<td>
														Use of flouride
														toothpaste
													</td>
													<td>
														<div className="flex items-center gap-10">
															<label className="cursor-pointer mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
																<input
																	type="radio"
																	className="pointer-events-none"
																	value="no"
																	{...register(
																		"flouride_toothpaste",
																		{}
																	)}
																/>
																<span>No</span>
															</label>
															<label className="cursor-pointer mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
																<input
																	type="radio"
																	className="pointer-events-none"
																	value="yes"
																	{...register(
																		"flouride_toothpaste",
																		{}
																	)}
																/>
																<span>Yes</span>
															</label>
															<TextInputField
																disabled={
																	watch(
																		"flouride_toothpaste"
																	) != "yes"
																}
																labelClassName="!mb-0 whitespace-nowrap"
																className="flex flex-row items-center gap-2"
																type="date"
																label="Last dental check-up:"
																inputClassName="bg-white"
															/>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</div>

									<div className="table table-bordered mb-4">
										<table>
											<tbody>
												<tr>
													<th
														colSpan={3}
														className="!text-blue-600"
													>
														Physical activity
													</th>
												</tr>
												<tr>
													<td>
														<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
															<input
																type="radio"
																className="pointer-events-none"
																value="Sedentary"
																{...register(
																	"physical_activity",
																	{}
																)}
															/>
															<span>
																Sedentary
															</span>
														</label>
													</td>
												</tr>
												<tr>
													<td>
														<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
															<input
																type="radio"
																className="pointer-events-none"
																value="With supervised moderate"
																{...register(
																	"physical_activity",
																	{}
																)}
															/>
															<span>
																With supervised
																moderate to
																vigorous
																physical
																activites (brisk
																walk, jogging,
																running,
																bicycling, etc.)
																for at least 1
																hour/day
															</span>
														</label>
													</td>
												</tr>
												<tr>
													<td>
														<div className="flex flex-col">
															<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
																<input
																	type="radio"
																	className="pointer-events-none"
																	value="With vigorous-intensity"
																	{...register(
																		"physical_activity",
																		{}
																	)}
																/>
																<span>
																	With
																	vigorous-intensity
																	activities,
																	including
																	those which
																	strengthen
																	the muscle
																	and bones,
																	at least 3х
																	/ week
																</span>
															</label>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</div>

									<div className="table table-bordered mb-4">
										<table>
											<tbody>
												<tr>
													<th
														colSpan={3}
														className="!text-blue-600"
													>
														Daily screen time
													</th>
												</tr>
												<tr>
													<td>
														<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
															<input
																type="radio"
																className="pointer-events-none"
																value="no screen time"
																{...register(
																	"daily_screen_time",
																	{}
																)}
															/>
															<span>
																No screen time
															</span>
														</label>
													</td>
													<td>
														<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
															<input
																type="radio"
																className="pointer-events-none"
																value="less 1 hour"
																{...register(
																	"daily_screen_time",
																	{}
																)}
															/>
															<span>
																{`< 1 hour sedentary screen time`}
															</span>
														</label>
													</td>
													<td>
														<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
															<input
																type="radio"
																className="pointer-events-none"
																value="more 1 hour"
																{...register(
																	"daily_screen_time",
																	{}
																)}
															/>
															<span>
																{`> 1 hour sedentary screen time`}
															</span>
														</label>
													</td>
												</tr>
											</tbody>
										</table>
									</div>

									<div className="table table-bordered mb-4">
										<table>
											<tbody>
												<tr>
													<th
														colSpan={5}
														className="!text-blue-600"
													>
														Violence and injuries
													</th>
												</tr>
												<tr>
													<td>
														<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
															<input
																type="radio"
																className="pointer-events-none"
																value="none"
																{...register(
																	"violence_injuries",
																	{}
																)}
															/>
															<span>None</span>
														</label>
													</td>
													<td>
														<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
															<input
																type="radio"
																className="pointer-events-none"
																value="electrocution"
																{...register(
																	"violence_injuries",
																	{}
																)}
															/>
															<span>
																Electrocution
															</span>
														</label>
													</td>
													<td>
														<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
															<input
																type="radio"
																className="pointer-events-none"
																value="falls"
																{...register(
																	"violence_injuries",
																	{}
																)}
															/>
															<span>Falls</span>
														</label>
													</td>
													<td>
														<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
															<input
																type="radio"
																className="pointer-events-none"
																value="mauling"
																{...register(
																	"violence_injuries",
																	{}
																)}
															/>
															<span>Mauling</span>
														</label>
													</td>
													<td>
														<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
															<input
																type="radio"
																className="pointer-events-none"
																value="others"
																{...register(
																	"violence_injuries",
																	{}
																)}
															/>
															<span>Others</span>
															<TextInputField
																disabled={
																	watch(
																		"violence_injuries"
																	) !=
																	"others"
																}
																inputClassName="bg-white"
																placeholder="Others..."
																{...register(
																	"violence_injuries_details",
																	{}
																)}
															/>
														</label>
													</td>
												</tr>
											</tbody>
										</table>
									</div>

									<div className="table table-bordered mb-4">
										<table>
											<tbody>
												<tr>
													<th
														colSpan={5}
														className="!text-blue-600"
													>
														Bullying and harassment
													</th>
												</tr>
												<tr>
													<td>
														<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
															<input
																type="radio"
																className="pointer-events-none"
																value="none"
																{...register(
																	"bully_harassment",
																	{}
																)}
															/>
															<span>None</span>
														</label>
													</td>
													<td>
														<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
															<input
																type="radio"
																className="pointer-events-none"
																value="at home"
																{...register(
																	"bully_harassment",
																	{}
																)}
															/>
															<span>At home</span>
														</label>
													</td>
													<td>
														<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
															<input
																type="radio"
																className="pointer-events-none"
																value="in school"
																{...register(
																	"bully_harassment",
																	{}
																)}
															/>
															<span>
																In school
															</span>
														</label>
													</td>
													<td>
														<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
															<input
																type="radio"
																className="pointer-events-none"
																value="online"
																{...register(
																	"bully_harassment",
																	{}
																)}
															/>
															<span>Online</span>
														</label>
													</td>
													<td>
														<label className="mb-0 flex items-center text-sm gap-2 text-gray-600 cursor-pointer hover:!text-blue-600">
															<input
																type="radio"
																className="pointer-events-none"
																value="others"
																{...register(
																	"bully_harassment",
																	{}
																)}
															/>
															<span>Others</span>
															<TextInputField
																disabled={
																	watch(
																		"bully_harassment"
																	) !=
																	"others"
																}
																inputClassName="bg-white"
																placeholder="Others..."
																{...register(
																	"bully_harassment_details",
																	{}
																)}
															/>
														</label>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</CollapseDiv>

						<CollapseDiv
							defaultOpen={
								appointment?.status == "pending" &&
								appointment?.vital_id == null
							}
							withCaret={true}
							title="Patient Vitals"
							headerClassName="bg-blue-50"
							bodyClassName="p-0"
						>
							<PatientVitals
								showTitle={false}
								appointment={appointment}
								patient={appointment?.patient}
							/>
							
						</CollapseDiv>
						{showService &&
						(appointment?.vital_id ||
							appointment?.has_for_reading?.length) ? (
							<CollapseDiv
								defaultOpen={true}
								withCaret={true}
								title="Services"
								headerClassName="bg-blue-50"
								bodyClassName="p-0"
							>
								{serviceComponent}
							</CollapseDiv>
						) : (
							""
						)}
					</div>
				</>
			) : (
				""
			)}
		</div>
	);
};

export default AppointmentDetails;
