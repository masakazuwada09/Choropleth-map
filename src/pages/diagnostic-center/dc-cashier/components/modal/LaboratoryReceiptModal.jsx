/* eslint-disable react/prop-types */
import React, { Fragment, forwardRef, useImperativeHandle, useState } from 'react'
import ActionBtn from '../../../../../components/buttons/ActionBtn';
import TextInputField from '../../../../../components/inputs/TextInputField';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import Axios from '../../../../../libs/axios';
import useNoBugUseEffect from '../../../../../hooks/useNoBugUseEffect';
import { useForm } from 'react-hook-form';
import { useReactToPrint } from "react-to-print";
import FlatIcon from '../../../../../components/FlatIcon';
import InfoTextForPrint from '../../../../../components/InfoTextForPrint';
import { patientFullName, patientAddress, doctorName } from '../../../../../libs/helpers';
import QRCode from "qrcode.react";
const FormHeading = ({ title }) => {
	return (
		<div className="flex items-center bg-blue-200">
			<div className="flex-grow slanted bg-blue-500 flex items-center justify-start pl-1">
				<span className="text-white">Laboratory </span>
			</div>
			<div className="flex-grow slanted-reverse bg-blue-700 flex items-center justify-start pl-1">
				<span className="text-blue-700" value="">.</span>
			</div>
			
		</div>
	);
};
const LaboratoryReceiptModal = (props, ref) => {
    const { patient, onSuccess, appointment } = props;
	const {
        register,
		getValues,
		watch,
		control,
		setValue,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm();
    const [showData, setShowData] = useState(null);
	const [saving, setSaving] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
    const componentRef = React.useRef(null);
    const [doctor, setDoctor] = useState(null);
    useNoBugUseEffect({
		functions: () => {},
	});
	useImperativeHandle(ref, () => ({
		show: show,
		hide: hide,
	}));

	const show = (data) => {
		console.log("patient", patient?.id);
		console.log("/v1/laboratory/tests/list");
		setShowData(data);
		setModalOpen(true);
	};
	const hide = () => {
		setModalOpen(false);
	};
	const submit = (data) => {
		setSaving(true);

		let formdata = new FormData();

		formdata.append("_method", "PATCH");
		formdata.append("rbs", data?.rbs);
		Axios.post(`v1/clinic/tb-lab-result/${showData?.id}`, formdata)
			.then((res) => {
				reset();
				toast.success("Laboratory result submitted successfully!");
				onSuccess();
				hide();
			})
			.finally(() => {
				setTimeout(() => {
					setSaving(false);
				}, 1000);
			});
	};

    const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});

	const handleDownload = async () => {
		const input = componentRef.current;
		const canvas = await html2canvas(input);
		const imgData = canvas.toDataURL("image/png");
		const pdf = new jsPDF("p", "mm", "a6");
		const imgProps = pdf.getImageProperties(imgData);
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
		pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
		pdf.save("LaboratoryReport.pdf");
	};

  return (
    <Transition appear show={modalOpen} as={Fragment}>
			<Dialog as="div" className="" onClose={hide}>
				<Transition.Child
					 as={Fragment}
      enter="transform transition ease-out duration-300"
      enterFrom="translate-x-full opacity-0"
      enterTo="translate-x-0 opacity-100"
      leave="transform transition ease-in duration-200"
      leaveFrom="translate-x-0 opacity-100"
      leaveTo="translate-x-full opacity-0"
				>
					<div className="fixed inset-0  z-[300]" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto h-full !z-[550]">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-out duration-300"
          enterFrom="-translate-y-full opacity-0"
          enterTo="translate-y-0 opacity-100"
          leave="transform transition ease-in duration-200"
          leaveFrom="translate-y-0 opacity-100"
          leaveTo="-translate-y-full opacity-0"
        >

	<Dialog.Panel className=" w-[900px] rounded-2xl bg-slate-200 text-left align-middle shadow-2xl transition-all ">
								
		<div className="mt-5 w-[900px] flex justify-center">
			<div className="border-2 px-3 py-1 bg-gray-800 rounded-lg">
				<div className="flex flex-row justify-end">
					<ActionBtn
						className="text-base gap-2 ml-2 mb-2 items-center transition ease-in-out delay-30 hover:-translate-y-1 hover:scale-100 duration-100"
						onClick={handlePrint}
						type="success"
					>
						<FlatIcon icon="rr-print" /> Print
					</ActionBtn>
					<ActionBtn
						className="text-base gap-2 ml-2 mb-2 items-center transition ease-in-out delay-30 hover:-translate-y-1 hover:scale-100 duration-100"
						onClick={handleDownload}
						type="secondary"
					>
						<FlatIcon icon="fi fi-bs-disk" /> Save
					</ActionBtn>
				</div>
				<div className="" ref={componentRef}>
					{/* Add the content that you want to print or save as PDF */}
					<div className="flex gap-1 bg-blue-200 mx-auto p-2">
						<div className="">
							<img src="/laboratory.png" className="w-16 h-16" />
						</div>
						<div className="">
							<div className="text-sm font-semibold">
								<span>DIAGNOSTIC CENTER</span>
							</div>
							<div className="text-xs font-light">
								<span>Capitol Complex, Alabel, Sarangani</span>
							</div>
							<div className="text-xs font-light">
								<span>Tel. No. 083 508 0262</span>
							</div>

							<div className="text-base text-blue-700 font-bold">
								<span>LABORATORY REPORT</span>
							</div>
						</div>

						<div className="flex flex-col-1 text-sm ml-auto bg-blue-200">
							<div>
								<InfoTextForPrint
									contentClassName="text-sm w-full"
									title="Fullname"
									value={patientFullName(patient)}
								/>
								<InfoTextForPrint
									contentClassName="text-sm "
									title="Address"
									value={patientAddress(patient)}
								/>
								<InfoTextForPrint
									contentClassName="text-sm"
									title="Account No."
								/>
								<InfoTextForPrint
									contentClassName="text-sm"
									title="Laboratory Attendant"
									value={doctorName(doctor)}
								/>
							</div>
							
							<QRCode
								value={`user-${appointment?.scheduledBy?.username}`}
								className="ml-8"
								level="H"
								size={50}
							/>
						</div>
					</div>

					<FormHeading title="" />

					<div className="flex flex-col p-2 text-sm relative bg-blue-200 ">
			<b>IMPORTANT REMINDERS:</b>
		
			<p className="text-xs">
				All Results on
				this Form are necessary. Laboratory Report with incomplete
				information shall not be processed.
			</p>{" "}
			<b className="text-xs">
				FALSE/INCORRECT INFORMATION OR MISREPRESENTATION
				SHALL BE SUBJECT TO CRIMINAL, CIVIL OR
				ADMINISTRATIVE LIABILITIES.
			</b>
		</div>

		<div className="p-6 flex flex-col gap-y-4 relative border-t-2 bg-white">
			<div className="text-center font-mono text-sm font-semibold">FINAL REPORT</div>
			
		<div className="text-sm">
			<div className="text-center font-mono text-sm font-semibold">----------------CHEMISTRY----------------</div>
			<div className="grid grid-cols-4 font-mono gap-4">
				{appointment?.fbs !== null ? (
				<>
				<div className="mr-auto">FASTING BLOOD SUGAR(FBS)</div>
				<div className="text-center">{appointment?.fbs}</div>
				<div className="mr-auto">-</div>
				<div className="mr-auto">mL</div>
				</>
				):("")}
			</div>
			<div className="grid grid-cols-4 font-mono gap-4">
				{appointment?.rbs !== null ? (
				<>
				<div className="mr-auto">RANDOM BLOOD SUGAR(RBS)</div>
				<div className="text-center">{appointment?.rbs}</div>
				<div className="mr-auto">-</div>
				<div className="mr-auto">mL</div>
				</>
				):("")}
			</div>
			<div className="grid grid-cols-4 font-mono gap-4">
				{appointment?.creatinine !== null ? (
				<>
				<div className="mr-auto">CREATININE</div>
				<div className="text-center">{appointment?.creatinine}</div>
				<div className="mr-auto">-</div>
				<div className="mr-auto">mL</div>
				</>
				):("")}
			</div>
			<div className="grid grid-cols-4 font-mono gap-4">
				{appointment?.uric_acid !== null ? (
				<>
				<div className="mr-auto">URIC ACID</div>
				<div className="text-center">{appointment?.uric_acid}</div>
				<div className="mr-auto">-</div>
				<div className="mr-auto">mL</div>
				</>
				):("")}
			</div>
			<div className="grid grid-cols-4 font-mono gap-4">
				{appointment?.sgot !== null ? (
				<>
				<div className="mr-auto">SGOT</div>
				<div className="text-center">{appointment?.sgot}</div>
				<div className="mr-auto">-</div>
				<div className="mr-auto">mL</div>
				</>
				):("")}
			</div>
			<div className="grid grid-cols-4 font-mono gap-4">
				{appointment?.sgpt !== null ? (
				<>
				<div className="mr-auto">SGPT</div>
				<div className="text-center">{appointment?.sgpt}</div>
				<div className="mr-auto">-</div>
				<div className="mr-auto">mL</div>
				</>
				):("")}
			</div>
			<div className="grid grid-cols-4 font-mono gap-4">
				{appointment?.alkaline_phos !== null ? (
				<>
				<div className="mr-auto">ALKALINE PHOS.</div>
				<div className="text-center">{appointment?.alkaline_phos}</div>
				<div className="mr-auto">-</div>
				<div className="mr-auto">mL</div>
				</>
				):("")}
			</div>
			<div className="grid grid-cols-4 font-mono gap-4">
				{appointment?.ldh !== null ? (
				<>
				<div className="mr-auto">LDH</div>
				<div className="text-center">{appointment?.ldh}</div>
				<div className="mr-auto">-</div>
				<div className="mr-auto">mL</div>
				</>
				):("")}
			</div>
			<div className="grid grid-cols-4 font-mono gap-4">
				{appointment?.ggt !== null ? (
				<>
				<div className="mr-auto">GGT</div>
				<div className="text-center">{appointment?.ggt}</div>
				<div className="mr-auto">-</div>
				<div className="mr-auto">mL</div>
				</>
				):("")}
			</div>
			<div className="grid grid-cols-4 font-mono gap-4">
				{appointment?.magnesium !== null ? (
				<>
				<div className="mr-auto">Magnesium</div>
				<div className="text-center">{appointment?.magnesium}</div>
				<div className="mr-auto">-</div>
				<div className="mr-auto">mL</div>
				</>
				):("")}
			</div>
			<div className="grid grid-cols-4 font-mono gap-4">
				{appointment?.phophorus !== null ? (
				<>
				<div className="mr-auto">Phophorus</div>
				<div className="text-center">{appointment?.phophorus}</div>
				<div className="mr-auto">-</div>
				<div className="mr-auto">mL</div>
				</>
				):("")}
			</div>
			<div className="grid grid-cols-4 font-mono gap-4">
				{appointment?.amylase !== null ? (
				<>
				<div className="mr-auto">Amylase</div>
				<div className="text-center">{appointment?.amylase}</div>
				<div className="mr-auto">-</div>
				<div className="mr-auto">mL</div>
				</>
				):("")}
			</div>
			
			<div className="grid grid-cols-4 font-mono gap-4">
				{appointment?.hour_urine_volume !== null ? (
				<>
				<div className="mr-auto">24 HOUR URINE VOLUME</div>
				<div className="mr-auto">{appointment?.hour_urine_volume}</div>
				<div className="mr-auto">-</div>
				<div className="mr-auto">mL</div>
				</>
				):("")}
			</div>
			<div className="grid grid-cols-4 font-mono gap-4">
				{appointment?.serum_creatinine !== null ? (
				<>
				<div className="mr-auto">SERUM CREATININE</div>
				<div className="mr-auto">{appointment?.serum_creatinine}</div>
				<div className="mr-auto">-</div>
				<div className="mr-auto">mg/dL</div>
				</>
				):("")}
			</div>
			<div className="grid grid-cols-4 font-mono gap-4">
				{appointment?.urine_creatinine !== null ? (
				<>
				<div className="mr-auto">URINE CREATININE</div>
				<div className="mr-auto">{appointment?.urine_creatinine}</div>
				<div className="mr-auto">-</div>
				<div className="mr-auto">mg/dL</div>
				</>
				):("")}
			</div>
			<div className="grid grid-cols-4 font-mono gap-4">
				{appointment?.hours_urine !== null ? (
				<>
				<div className="mr-auto">HOURS URINE CREATININE</div>
				<div className="mr-auto">{appointment?.hours_urine}</div>
				<div className="mr-auto">-</div>
				<div className="mr-auto">1000-1500mg</div>
				</>
				):("")}
			</div>
			<div className="grid grid-cols-4 font-mono gap-4">
				{appointment?.creatinine_clearance !== null ? (
				<>
				<div className="mr-auto">CREATININE CLEARANCE</div>
				<div className="mr-auto">{appointment?.creatinine_clearance}</div>
				<div className="mr-auto">-</div>
				<div className="mr-auto">98.156 mL/min</div>
				</>
				):("")}
			</div>
		</div>
			
		</div>
				</div>
			</div>
		</div>

								<div className="px-4 py-4 border-t flex items-center justify-end bg-slate-">
									
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
  )
}

export default forwardRef(LaboratoryReceiptModal)
