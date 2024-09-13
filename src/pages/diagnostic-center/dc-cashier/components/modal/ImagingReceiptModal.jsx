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
const ImagingReceiptModal = (props, ref) => {
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
        <div className="border-2 px-3 py-1 bg-gray-900 rounded-lg">
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
					<div className="flex flex-col-4 gap-2 bg-blue-950 mx-auto p-2 items-center">
						<div className="">
							<img src="/laboratory/radiology.png" className="w-20 h-20 object-contain" />
						</div>
						<div className="text-white">
							<div className="text-sm font-semibold">
								<span>DIAGNOSTIC CENTER</span>
							</div>
							<div className="text-xs font-light">
								<span>Capitol Complex, Alabel, Sarangani</span>
							</div>
							<div className="text-xs font-light">
								<span>Tel. No. 083 508 0262</span>
							</div>

							<div className="text-base text-white font-bold">
								<span>IMAGING REPORT</span>
							</div>
						</div>

						<div className="flex flex-col-2 text-sm ml-auto m-2 text-white bg-blue-900 px-5">
							<div className="text-white px-5 py-1">
								<InfoTextForPrint
									contentClassName="text-sm"
									title="Fullname"
									value={patientFullName(patient)}
								/>
								<InfoTextForPrint
									contentClassName="text-sm"
									title="Address"
									value={patientAddress(patient)}
								/>
								<InfoTextForPrint
									contentClassName="text-sm"
									title="Account No."
								/>
								<InfoTextForPrint
									contentClassName="text-sm"
									title="Imaging Attendant"
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

					<div className="flex flex-col p-2 text-sm relative bg-blue-950 text-white">
			<b>IMPORTANT REMINDERS:</b>
		
			<p className="text-xs">
				All Results on
				this Form are necessary. Imaging Report with incomplete
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
			
            <div className="p-6 flex flex-col gap-y-4 relative border-t-2 bg-white opacity-70">
        <div className="flex flex-col justify-center text-sm ">
		  <h1 className="text-xl font-bold mb-0 ">XRAY (PA View)</h1>

		</div>

        {showData?.type?.name == "CBC" ? (
		<div className="flex flex-col text-sm items-end ml-12">
		  <h1 className="text-4xl font-bold mb-0 ">CBC</h1>
		  <h3 className="text-lg font-bold mb-0">
			  (Complete Blood Count)
		  </h3>
		  <p className="text-sm">Revised September 2018</p>
		</div>
		) : showData?.type?.name == "FBS" ? (
				<div className="flex flex-col text-sm items-end ml-12">
				  <h1 className="text-4xl font-bold mb-0 ">FBS</h1>
				  <h3 className="text-lg font-bold mb-0">
					  (Fast Blood Sugar )
				  </h3>
				  <p className="text-sm">Revised September 2018</p>
				</div>
		) : showData?.type?.name == "RBS" ? (
			<div className="flex flex-col text-sm items-end ml-12">
			  <h1 className="text-4xl font-bold mb-0 ">RBS</h1>
			  <h3 className="text-lg font-bold mb-0">
				  (Random blood Sugar )
			  </h3>
			  <p className="text-sm">Revised September 2018</p>
			</div>
	) : ( ""
		)}


			<div className="text-start font-mono text-sm font-semibold">Impression</div>
			
		<div className="text-sm ">
			
			<div className=" font-mono gap-4">
				{appointment?.fbs !== null ? (
				<>
				
				<h1 className="mr-auto">- Bronchovascular markings are prominent in bilateral lung fields</h1>
                <h1 className="mr-auto">- Rest of the visualised lung fields are normal.</h1>
                <h1 className="mr-auto">- Biletaal hilum appears normal.</h1>
                <h1 className="mr-auto">- Cardiac silhouette is normal.</h1>
				<h1 className="text-center">{appointment?.fbs}</h1>
				
				</>
				):("")}
			</div>
			
		</div>
        <div className="text-start font-mono text-sm font-semibold">Impression</div>
            <h1 className="mr-auto">- Cardiac silhouette is normal.</h1>
        <div className="text-start font-mono text-sm font-semibold">Advice</div>
		
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

export default forwardRef(ImagingReceiptModal)
