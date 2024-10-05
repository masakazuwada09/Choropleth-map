/* eslint-disable react/prop-types */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react-refresh/only-export-components */

import React, {
	Fragment,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import { Dialog, Transition } from "@headlessui/react";

import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
	dataURItoBlob,
} from "../../../../../libs/helpers";
import ActionBtn from "../../../../../components/buttons/ActionBtn";
import Axios from "../../../../../libs/axios";
import useNoBugUseEffect from "../../../../../hooks/useNoBugUseEffect";
import { useReactToPrint } from "react-to-print";
import FlatIcon from "../../../../../components/FlatIcon";
import useDataTable from "../../../../../hooks/useDataTable";
import { useAuth } from "../../../../../hooks/useAuth";

const InputFields = [
	{
		label: "Blood Pressure (SYSTOLIC)",
		name: "blood_systolic",
		placeholder: "SYSTOLIC",
		className: "lg:col-span-4",
		type: "text",
		required: {
			value: true,
			message: "This field is required.",
		},
	},

	{
		label: "BP Measurement",
		name: "bp_measurement",
		placeholder: "BP Measurement",
		className: "lg:col-span-4",
		type: "text",
	},
]

const Status = ({ status }) => {
	const color = () => {
		switch (status) {
			case "pending":
				return " text-red-700";
			case "for-result-reading":
				return " text-blue-700";
			default:
				return " text-white";
		}
	};
	return (
		<span
			className={`${color()} px-2 italic text-center rounded-2xl text-xs py-[2px]`}
		>
			{status}
		</span>
	);
};
const ViewLabResultModal = (props, ref) => {
	const { loading: btnLoading, appointment, onSave, showTitle = true,
		
		laboratory_test_type,
		allowCreate = true,
		onUploadLabResultSuccess,
		order_id,} = props;
	const { patient, onSuccess } = props;
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
	const { user } = useAuth();
	const {
		page,
		setPage,
		meta,
		setMeta,
		loading,
		setLoading,
		paginate,
		setPaginate,
		data,
		setData,
		column,
		setColumn,
		direction,
		setDirection,
		filters,
		setFilters,
		
	} = useDataTable({
		url: `/v1/doctor/laboratory-order/patient/${patient?.id}`,
		defaultFilters: {
			...(order_id ? { order_id: order_id } : {}),
			...(laboratory_test_type
				? { laboratory_test_type: laboratory_test_type }
				: {}),
			...(appointment?.id > 0 ? { appointment_id: appointment?.id } : {}),
		},
	});
	const [showData, setShowData] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const componentRef = React.useRef(null);
	const [tests, setTests] = useState([]);
	useNoBugUseEffect({
		functions: () => {},
	});
	const isDoctor = () => {
		return String(user?.type || "")
			.toLowerCase()
			.includes("doctor");
	};
	useImperativeHandle(ref, () => ({
		show: show,
		hide: hide,
	}));

	const show = (data) => {
		setShowData(data);
		setModalOpen(true);
	};
	const hide = () => {
		setModalOpen(false);
	};
	const submit = (data) => {
		let formData = new FormData();
		let config = {
			headers: {
				"content-type": "multipart/form-data",
			},
		};
		formData.append("_method", "PATCH");
		formData.append("lab_result_notes", data?.lab_result_notes);

		if (data?.attachment) {
			formData.append("attachment", dataURItoBlob(data?.attachment));
		}
		Axios.post(
			`v1/laboratory/upload-lab-result/${showData?.id}`,
			formData,
			config
		).then((res) => {
			reset();
			toast.success("Laboratory result uploaded successfully!");
			onSuccess();
			hide();
		});
	};
	
	const reloadData = () => {
		Axios.get(`v1/clinic/lab-result/${showData?.id}`).then(
			(res) => {
				setShowData(res.data.data);
				setKey(uuidv4());
			}
		);
	};


	const hasError = (name) => {
		return errors[name]?.message;
	};
	const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
	const isXrayUser = () => {
		return user?.type === "HIS-IMAGING";
	};
	const testHeader = isXrayUser() ? "Imaging Test" : "Laboratory Test";
	const renderResultCell = (data) => {
		if (data?.order_status === "pending") {
			if (isLaboratoryUser()) {
				const labModalRefs = {
					//Chemistry
					"FBS": uploadFBSRef,
					"RBS": uploadRBSRef,
					"Creatinine": uploadCreatinineRef,
					"Uric Acid": uploadUricAcidRef,
					"SGOT": uploadSGOTRef,
					"SGPT": uploadSGPTRef,
					"Alkaline Phos": uploadAlkalinePhosRef,
					"LDH": uploadLDHRef,
					"GGT": uploadGGTRef,
					"Magnesium": uploadMagnesiumRef,
					"Phophorus": uploadPhophorusRef,
					"Amylase": uploadAmylaseRef,
					"Culture and Sensitivity Initial Result": uploadcultureInitialRef,
					"Lipid Profile": uploadLipidProfileRef,
					"Electrolytes": uploadElectrolytesRef,
					"Bilirubin": uploadBilirubinRef,
					"Total Protein": uploadTotalProteinRef,
					"Urea": uploadUreaRef,
					"Oral Glucose Tolerance Test": uploadOralGlucoseRef,
					"24 Hours Urine Creatinine Clearance": uploadUrineCreatinineRef,
					//Hematology
					"CBC": uploadCBCResultRef,
					"Cuagulation Studies": uploadCuagulationStudiesRef,
					"Differential Count": uploadDifferentialCountRef,
					"Erythrocyte": uploadErythrocyteRef,
					"Platelet Count": uploadPlateletCountRef,
					"Red Cell Indices": uploadRedcellInficesRef,
					"Rerticulocyte Count": uploadReticulocyteRef,
					//Microbiology
					"AFB Stain": uploadAFBStainRef,
					"Culture Sensitivity Final Result": uploadCultureSensitivityFinalRef,
					"Gram Stain": uploadGramStainRef,
					"KOH": uploadKOHRef,
					//Microscopy
						//fecalysis
						"Ascaris Lumbricoides Ova": uploadAscarisRef,
						"Entamoeba Coli Cyst ": uploadEntomoebaCystRef,
						"Entamoeba Coli Trophozoite": uploadEntomoebaTrophozoiteRef,
						"Entamoeba Histolytica Cyst": uploadEntamoebaHistolyticaCystRef,
						"Entamoeba Histolytica Trophozoite": uploadEntamoebaHistolyticaTrophozoiteRef,
						"Fecal Occult Blood": uploadFecalOccultRef,
						"Giardia Lamblia Cyst": uploadGiardiaCystRef,
						"Giardia Lamblia Trophozoite": uploadGiardiaTrophozoiteRef,
						"Hookworm Ova": uploadHookwormRef,
						"Fecalysis Macroscopic Examination": uploadMacroscopicFecalysisRef,
						"Fecalysis Microscopic Examination": uploadMicroscopicFecalysisRef,
						"Trichiuris trichiura Ova": uploadTrichiurisRef,
						//Urine
						"Casts": uploadCastsRef,
						"Chemical Examination": uploadChemicalRef,
						"Crystal": uploadCrystalRef,
						"Urine Macroscopic Examination": uploadMacroscopicUrineRef,
						"Urine Microscopic Examination": uploadMicroscopicUrineRef,
						"Pregnancy Test": uploadPregnancyTestRef,
					//Serology
					"HBsAg (Hepatitis B Surface Antigen)": uploadHBsAGRef,
					"Anti - HBS": uploadAntiHBSRef,
					"Anti - HCV": uploadAntiHCVRef,
					"Syphilis (Rapid Test)": uploadSyphilisRef,
					"ASO (Antistreptolysin O Titer)": uploadASORef,
					"RA/RF (Rheumatoid Factor)": uploadRheumatoidRef,
					"CRP (C-Reactive Protein)": uploadCRPRef,
					"Troponin - I": uploadTroponinRef,
					"Dengue Duo": uploadDengueDuoRef,
					"Typhoid Test": uploadTyphoidRef,
					"Widal Test": uploadWidalTestRef,
					"CK - MB": uploadCKMBRef,
	
					"Blood Typing": uploadBloodTypeRef,
					"Covid-19 Rapid Test": uploadCovidTestRef,
					"Cross Matching": uploadCrossMatchingRef,
					"Miscellaneous Form": uploadMiscellaneousRef,
					
				};
		const modalRef = labModalRefs[data?.type?.name] || uploadLabResultRef;
				return (
					<span
						className="text-blue-700 flex items-center justify-center cursor-pointer hover:bg-slate-200 py-2 rounded-3xl gap-1"
						onClick={() => modalRef.current.show(data)}
					>
						<FlatIcon icon="rr-upload" />
						{data?.type?.name === "CBC" || data?.type?.name === "RBS" || data?.type?.name === "FBS" ? "Add Result" : "Upload"}
						
					</span>
				);
			} else {
				return <Status status={data?.order_status} />;
			}
		} else if (data?.order_status === "for-result-reading") {
			return (
				<span
					className="text-blue-700 flex items-center justify-center cursor-pointer hover:bg-slate-200 py-2 rounded-3xl gap-1"
					onClick={() => printLabResultRef.current.show({...data, appointment})}
				>
					<FlatIcon icon="rs-document" />
					View Result
				</span>
			);
		} else {
			return null;
		}
	};

	return (
		<Transition appear show={modalOpen} as={Fragment}>
			<Dialog as="div" className="" onClose={hide}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-blue-200 bg-opacity-75 backdrop-blur z-[300] " />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto !z-[350]">
					<div className="flex min-h-full w-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-[800px] transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all overflow-auto h-[280px]">
								<Dialog.Title
									as="div"
									className=" p-4 font-medium  flex flex-col items-start text-gray-900 bg-slate-50 border-b"
								>
									<span className="text-xl text-center font-bold  text-blue-900">
										Laboratory Result
									</span>
								</Dialog.Title>
								<div className=" flex flex-col  relative">
								<div className="bg-white  min-h-[1in]  overflow-auto phic-forms">



				<div className=" flex flex-col gap-y-2 relative">
	{showData?.type?.name === "CBC" ? (
	<div className="px-5 py-2 justify-center items-center">
		<h1 className="flex justify-center font-bold text-md border-b border-t ">
			Complete Blood Count (CBC)
		</h1>
		<table className="w-full">
			<thead>
				<tr className="flex justify-between gap-12 border-b">
					<th>Investigation</th>
					<th>Result</th>
					<th>Normal Range Value</th>
					<th>Unit</th>
				</tr>
			</thead>
			<tbody>
				<tr className="flex justify-between gap-12 border-b border-dashed">
					<td className="capitalize">Hemoglobin</td>
					<td>{showData?.appointment?.hemoglobin}</td>
					<td>13.0 - 17.0</td>
					<td>g/L</td>
				</tr>
				<tr className="flex justify-between gap-12 border-b border-dashed">
					<td className="capitalize">Hematocrit</td>
					<td>{showData?.appointment?.hematocrit}</td>
					<td>40% - 50%</td>
					<td>L/L</td>
				</tr>
				<tr className="flex justify-between gap-12 border-b border-dashed">
					<td className="capitalize">RBC Count</td>
					<td>{showData?.appointment?.rcbc}</td>
					<td>4.5 - 5.5</td>
					<td>x10¹²/L</td>
				</tr>
				<tr className="flex justify-between gap-12 border-b border-dashed">
					<td className="capitalize">WBC</td>
					<td>{showData?.appointment?.wbc}</td>
					<td>4000 - 11000</td>
					<td>x10⁹/L</td>
				</tr>
			</tbody>
		</table>
	</div>
) : showData?.type?.name === "FBS" ? (
	<div className="px-5 py-5 font-mono justify-center items-center">
		<h1 className="flex justify-center font-bold text-xs border-b border-t mb-2 mt-5">
			Fast Blood Sugar (FBS)
		</h1>
		<table className="w-full">
			<thead>
				<tr className="flex justify-between gap-12 border-b">
					<th>Investigation</th>
					<th>Result</th>
					<th>Normal Range Value</th>
					<th>Unit</th>
				</tr>
			</thead>
			<tbody>
				<tr className="flex justify-between gap-12 border-b border-dashed">
					<td className="capitalize">Glucose, Fasting, Plasma</td>
					<td>{showData?.appointment?.fbs}</td>
					<td>70.00 - 100.00</td>
					<td>mg/dL</td>
				</tr>
			</tbody>
		</table>
	</div>
) : showData?.type?.name === "RBS" ? (
	<div className="px-5 py-5 font-mono justify-center items-center">
		<h1 className="flex justify-center font-bold text-xs border-b border-t mb-2 mt-5">
			Random Blood Sugar (RBS)
		</h1>
		<table className="w-full">
			<thead>
				<tr className="flex justify-between gap-12 border-b">
					<th>Investigation</th>
					<th>Result</th>
					<th>Normal Range Value</th>
					<th>Unit</th>
				</tr>
			</thead>
			<tbody>
				<tr className="flex justify-between gap-12 border-b border-dashed">
					<td className="capitalize">Glucose, Random, Plasma</td>
					<td>{showData?.appointment?.rbs}</td>
					<td>75.00 - 100.00</td>
					<td>mg/dL</td>
				</tr>
			</tbody>
		</table>
	</div>
) : (
	<p>No lab results available.</p>
)}


								</div>
							</div>
									

								
								</div>

								<div className="px-4  border-t flex items-center justify-end bg-slate-">
									<ActionBtn
										// size="lg"
										type="foreground"
										className="px-5"
										onClick={hide}
									>
										CLOSE
									</ActionBtn>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default forwardRef(ViewLabResultModal);
