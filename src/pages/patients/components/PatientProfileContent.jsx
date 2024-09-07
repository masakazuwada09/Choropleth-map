/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import CollapseDiv from "../../../components/CollapseDiv";
import { marital_status_lists, phic_no } from "../../../libs/patientFormOptions";

const TRow = ({ title, value }) => {
	return (
		<tr>
			<td className="text-sm pb-2 ">
				<span className="text-slate-700 text-md font-bold font-mono ">{title}</span>
			</td>
			<td className="text-sm pb-2 px-2">
				{typeof value == "object"
					? JSON.stringify(value)
					: value || "-"}
			</td>
		</tr>
	);
};
const PatientProfileContent = ({ patient }) => {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 px-2 gap-2 w-full text-slate-500 bg-gray-50 shadow-lg ">
			<CollapseDiv
				defaultOpen={true}
				title="I. PERSONAL DETAILS"
				bodyClassName="p-0"
			
			>
				<div className="square-table w-full ">
					<table className="">
						<tbody className="">
							<TRow title="Lastname:" value={patient?.lastname} />
							<TRow
								title="Firstname:"
								value={patient?.firstname}
							/>
							<TRow title="Middlename:" value={patient?.middle} />
							<TRow title="Suffix:" value={patient?.suffix} />
							<TRow title="Gender:" value={patient?.gender} />
							<TRow
								title="Civil Status:"
								value={
									patient?.information
										? marital_status_lists.find(
												(x) =>
													x.value ==
													patient?.information
														?.marital_status
										  )?.label
										: patient?.civil_status
								}
							/>
							{patient?.information?.mother_maiden_name ? (
								<>
									<TRow
										title="Mothers Maiden Name:"
										value={
											patient?.information
												?.mother_maiden_name
										}
									/>
								</>
							) : (
								<>
									<TRow
										title="Mothers Maiden Lastname:"
										value={patient?.mother_lastname}
									/>
									<TRow
										title="Mothers Maiden Firstname:"
										value={patient?.mother_firstname}
									/>
									<TRow
										title="Mothers Maiden Middlename:"
										value={patient?.mother_middlename}
									/>
								</>
							)}
						</tbody>
					</table>
				</div>
			</CollapseDiv>
			<CollapseDiv
				defaultOpen={true}
				title="II. ADDRESS AND CONTACT DETAILS"
			>
				<div className="square-table w-full">
					<table className="">
						<tbody className="">
							<TRow title="Latitude:" value={patient?.lat} />
							<TRow title="Latitude:" value={patient?.lng} />
							<TRow title="Region:" value={patient?.region} />
							<TRow title="Province:" value={patient?.province} />
							<TRow
								title="Municipality:"
								value={patient?.municipality}
							/>
							<TRow title="Barangay:" value={patient?.barangay} />
							<TRow title="Purok:" value={patient?.purok} />
							<TRow
								title="Street:"
								value={
									patient?.household?.street
										? patient?.household?.street
										: patient?.street
								}
							/>
							<TRow
								title="UNIT/Room No./Floor:"
								value={patient?.unit || "N/A"}
							/>
							<TRow
								title="Lot/Blk/phase/House No.:"
								value={
									patient?.household?.house_number
										? patient?.household?.house_number
										: patient?.house_number
								}
							/>
							<TRow
								title="Subdivision:"
								value={patient?.subdivision || "N/A"}
							/>
						</tbody>
					</table>
				</div>
			</CollapseDiv>
			<CollapseDiv
				defaultOpen={true}
				title="III. DECLARATION OF DEPENDENTS"
			>
				{patient?.dependents?.map((dependent) => {
					return (
						<div className="square-table w-full border p-2 rounded-lg mb-2">
							<table className="">
								<tbody className="">
									<TRow
										title="Lastname:"
										value={dependent?.lastname}
									/>
									<TRow
										title="Firstname:"
										value={dependent?.firstname}
									/>
									<TRow
										title="Middlename:"
										value={dependent?.middle_name || ""}
									/>
									<TRow
										title="Relationship:"
										value={dependent?.relationship}
									/>
								</tbody>
							</table>
						</div>
					);
				})}
				{patient?.dependents?.length == 0 ? (
					<p className="text-slate-200 italic">
						No dependents declared.
					</p>
				) : (
					""
				)}
			</CollapseDiv>
			<CollapseDiv defaultOpen={true} title="IV. MEMBER TYPE">
				<div className="square-table w-full mb-4">
					<table className="">
						<tbody className="">
							<TRow
								title="Philhealth No.:"
								value={patient?.philhealth}
								
								
							/>
							<TRow title="TIN:" value={patient?.tin} />
						</tbody>
					</table>
				</div>
				<div className="square-table w-full mb-4">
					<table className="">
						<tbody className="">
							<TRow
								title="Direct Contributor:"
								value={patient?.direct_contributor}
							/>
							<TRow
								title="Indirect Contributor:"
								value={patient?.indirect_contributor}
							/>
						</tbody>
					</table>
				</div>
				<div className="square-table w-full mb-2">
					<table className="">
						<tbody className="">
							<TRow
								title="Profession:"
								value={patient?.profession || "-"}
							/>
							<TRow
								title="Salary:"
								value={patient?.salary || "-"}
							/>
						</tbody>
					</table>
				</div>
			</CollapseDiv>
		</div>
	);
};

export default PatientProfileContent;
