import React, {useState} from "react";
import { useStepperContext } from "../../../../../../components/StepperContext";
import ReleaseMedStep1 from "../../../../../appointments/components/ReleaseMedStep1";
import ContentTitle from "../../../../../../components/buttons/ContentTitle";
import InfoText from "../../../../../../components/InfoText";
import { doctorName } from "../../../../../../libs/helpers";

const PrescriptionStep = (props, ref) => {
  const { userData, setUserData } = useStepperContext();
  const [loading, setLoading] = useState(false);
  const { appointment, setAppointment, mutateAll } = props;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const releasePrescription = (data) => {
		// setLoading(true);
		// console.log("prescriptionItems", prescriptionItems);
		let formData = new FormData();
		// formData.append("appointment_id", appointment_id);
		formData.append("_method", "PATCH");
		appointment?.prescriptions.map((data) => {
			formData.append("inventory_id[]", data.inventory_id);
			formData.append("quantity[]", data.quantity);
			formData.append("items[]", data?.item?.id);
			formData.append("sig[]", data?.sig);
			formData.append("details[]", "medicine released");
		});
		Axios.post(
			`/v1/clinic/tb-released-medicine/${appointment?.id}`,
			formData
		)
			.then((res) => {
				setStep(2);
				toast.success("Prescription released!");
			})
			.finally(() => {
				setLoading(false);
			});
	};
  return (
    <>
			<ContentTitle title="Patient Prescriptions">
				<span className="ml-1 text-xs font-bold text-red-600">
					APPROVED FOR RELEASE
				</span>
			</ContentTitle>
			<InfoText
				className="w-full"
				title="Prescribed By"
				value={doctorName(appointment?.prescribedByDoctor)}
			/>
			<div className="table w-full">
				<table>
					<thead>
						<tr>
							<th>Item Code</th>
							<th>Item Information</th>
							<th className="text-center">Qty</th>
							<th>Unit</th>
						</tr>
					</thead>
					<tbody>
						{appointment?.prescriptions?.map((item) => {
							return (
								<>
									<tr key={`opri-${item?.id}`}>
										<td>{item?.item?.code}</td>
										<td>{item?.item?.name}</td>
										<td className="text-center">
											{item?.quantity}
										</td>
										<td>{item?.item?.unit_measurement}</td>
									</tr>
									<tr>
										<td colSpan={4}>Sig.:{item?.sig}</td>
									</tr>
								</>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* <ActionBtn
				className="px-4 !rounded-2xl w-1/2 mx-auto mt-5"
				type="success"
				onClick={releasePrescription}
			>
				<FlatIcon icon="rr-check" className="mr-2 text-xl" />
				Release Prescription
			</ActionBtn> */}
		</>
  );
}

export default PrescriptionStep;