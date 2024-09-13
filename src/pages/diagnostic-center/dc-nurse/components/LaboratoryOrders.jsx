/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import useDataTable from "../../../../hooks/useDataTable";
import {
	doctorName,
	doctorSpecialty,
	formatDateMMDDYYYY,
	formatDateMMDDYYYYHHIIA,
} from "../../../../libs/helpers";
import FlatIcon from "../../../../components/FlatIcon";
import ActionBtn from "../../../../components/buttons/ActionBtn";
import ContentTitle from "../../../../components/buttons/ContentTitle";
import Pagination from "../../../../components/table/Pagination";
import Table from "../../../../components/table/Table";
import CreateLabOrderModal from "../../../../components/patient-modules/modals/CreateLabOrderModal";
import { useAuth } from "../../../../hooks/useAuth";
import useNoBugUseEffect from "../../../../hooks/useNoBugUseEffect";
import UploadLabResultModal from "../../../../components/patient-modules/modals/UploadLabResultModal";
import ViewLabResultModal from "../../../../components/patient-modules/modals/ViewLabResultModal";
import UploadCBCModal from "../../../../components/patient-modules/modals/UploadCBCModal";
import DeleteOrderModal from "../../../../components/patient-modules/modals/DeleteOrderModal";
import UploadOGTTModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadOGTTModal";
import UploadPregnancyTestModal from "../../../../components/patient-modules/modals/laboratory/microscopy/urine-examination/UploadPregnancyTestModal";
import UploadFBSModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadFBSModal";
import UploadRBSModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadRBSModal";
import UploadCreatinineModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadCreatinineModal";
import UploadUricAcidModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadUricAcidModal";
import UploadSGOTModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadSGOTModal";
import UploadSGPTModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadSGPTModal";
import UploadAlkalinePhosModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadAlkalinePhosModal";
import UploadLDHModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadLDHModal";
import UploadGGTModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadGGTModal";
import UploadMagnesiumModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadMagnesiumModal";
import UploadPhosphurosModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadPhosphurosModal";
import UploadAmylaseModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadAmylaseModal";
import UploadCultureSensitiveInitialModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadCultureSensitiveInitialModal";
import UploadLipidProfileModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadLipidProfileModal";
import UploadElectrolytesModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadElectrolytesModal";
import UploadBilirubinModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadBilirubinModal";
import UploadTotalProteinModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadTotalProteinModal";
import UploadUreaModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadUreaModal";
import UploadUrineCreatinineClearanceModal from "../../../../components/patient-modules/modals/laboratory/chemistry/UploadUrineCreatinineClearanceModal";
import UploadCompleteBloodCountModal from "../../../../components/patient-modules/modals/laboratory/hematology/UploadCompleteBloodCountModal";
import UploadCuagulationStudiesModal from "../../../../components/patient-modules/modals/laboratory/hematology/UploadCuagulationStudiesModal";
import UploadDifferentialCountModal from "../../../../components/patient-modules/modals/laboratory/hematology/UploadDifferentialCountModal";
import UploadErythrocyteModal from "../../../../components/patient-modules/modals/laboratory/hematology/UploadErythrocyteModal";
import UploadPlateletCountModal from "../../../../components/patient-modules/modals/laboratory/hematology/UploadPlateletCountModal";
import UploadRedCellIndicesModal from "../../../../components/patient-modules/modals/laboratory/hematology/UploadRedCellIndicesModal";
import UploadReticulocyteCount from "../../../../components/patient-modules/modals/laboratory/hematology/UploadReticulocyteCount";
import UploadAFBStainModal from "../../../../components/patient-modules/modals/laboratory/microbiology/UploadAFBStainModal";
import UploadCultureSensitivityFinalModal from "../../../../components/patient-modules/modals/laboratory/microbiology/UploadCultureSensitivityFinalModal";
import UploadGramStainModal from "../../../../components/patient-modules/modals/laboratory/microbiology/UploadGramStainModal";
import UploadKOHModal from "../../../../components/patient-modules/modals/laboratory/microbiology/UploadKOHModal";
import UploadAscarisModal from "../../../../components/patient-modules/modals/laboratory/microscopy/fecalysis/UploadAscarisModal";
import UploadEntamoebaColiCystModal from "../../../../components/patient-modules/modals/laboratory/microscopy/fecalysis/UploadEntamoebaColiCystModal";
import UploadEntamoebaColiTrophozoiteModal from "../../../../components/patient-modules/modals/laboratory/microscopy/fecalysis/UploadEntamoebaColiTrophozoiteModal";
import UploadEntamoebaHistolyticaCystModal from "../../../../components/patient-modules/modals/laboratory/microscopy/fecalysis/UploadEntamoebaHistolyticaCystModal";
import UploadEntamoebaHistolyticaTrophozoiteModal from "../../../../components/patient-modules/modals/laboratory/microscopy/fecalysis/UploadEntamoebaHistolyticaTrophozoiteModal";
import UploadFecalOccultBloodModal from "../../../../components/patient-modules/modals/laboratory/microscopy/fecalysis/UploadFecalOccultBloodModal";
import UploadGiardiaLambliaCystModal from "../../../../components/patient-modules/modals/laboratory/microscopy/fecalysis/UploadGiardiaLambliaCystModal";
import UploadGiardiaLambliaTrophozoiteModal from "../../../../components/patient-modules/modals/laboratory/microscopy/fecalysis/UploadGiardiaLambliaTrophozoiteModal";
import UploadHookWormModal from "../../../../components/patient-modules/modals/laboratory/microscopy/fecalysis/UploadHookWormModal";
import UploadMacroscopicModal from "../../../../components/patient-modules/modals/laboratory/microscopy/fecalysis/UploadMacroscopicModal";
import UploadMicroscopicModal from "../../../../components/patient-modules/modals/laboratory/microscopy/fecalysis/UploadMicroscopicModal";
import UploadTrichiurisModal from "../../../../components/patient-modules/modals/laboratory/microscopy/fecalysis/UploadTrichiurisModal";
import UploadCastsModal from "../../../../components/patient-modules/modals/laboratory/microscopy/urine-examination/UploadCastsModal";
import UploadCrystalsModal from "../../../../components/patient-modules/modals/laboratory/microscopy/urine-examination/UploadCrystalsModal";
import UploadChemicalExamModal from "../../../../components/patient-modules/modals/laboratory/microscopy/urine-examination/UploadChemicalExamModal";
import UploadMacroscopicExamModal from "../../../../components/patient-modules/modals/laboratory/microscopy/urine-examination/UploadMacroscopicExamModal";
import UploadMicroscopicExamModal from "../../../../components/patient-modules/modals/laboratory/microscopy/urine-examination/UploadMicroscopicExamModal";
import UploadAntiHBSModal from "../../../../components/patient-modules/modals/laboratory/serology/UploadAntiHBSModal";
import UploadAntiHCVModal from "../../../../components/patient-modules/modals/laboratory/serology/UploadAntiHCVModal";
import UploadASOModal from "../../../../components/patient-modules/modals/laboratory/serology/UploadASOModal";
import UploadCKMBModal from "../../../../components/patient-modules/modals/laboratory/serology/UploadCKMBModal";
import UploadCRPModal from "../../../../components/patient-modules/modals/laboratory/serology/UploadCRPModal";
import UploadDengueDuoModal from "../../../../components/patient-modules/modals/laboratory/serology/UploadDengueDuoModal";
import UploadHBsAgModal from "../../../../components/patient-modules/modals/laboratory/serology/UploadHBsAgModal";
import UploadRheumatoidModal from "../../../../components/patient-modules/modals/laboratory/serology/UploadRheumatoidModal";
import UploadSyphilisModal from "../../../../components/patient-modules/modals/laboratory/serology/UploadSyphilisModal";
import UploadTroponinModal from "../../../../components/patient-modules/modals/laboratory/serology/UploadTroponinModal";
import UploadTyphoidTestModal from "../../../../components/patient-modules/modals/laboratory/serology/UploadTyphoidTestModal";
import UploadWidalTestModal from "../../../../components/patient-modules/modals/laboratory/serology/UploadWidalTestModal";
import UploadBloodTypingModal from "../../../../components/patient-modules/modals/laboratory/UploadBloodTypingModal";
import UploadCovidRapidTestModal from "../../../../components/patient-modules/modals/laboratory/UploadCovidRapidTestModal";
import UploadCrossMatchingModal from "../../../../components/patient-modules/modals/laboratory/UploadCrossMatchingModal";
import UploadMiscellaneousFormModal from "../../../../components/patient-modules/modals/laboratory/UploadMiscellaneousFormModal";
import TextInputField from "../../../../components/inputs/TextInputField";
import { useForm } from "react-hook-form";
import PrintLabResultModal from "../../../../components/patient-modules/modals/PrintLabResultModal";
import PrintAllLabResultModal from "../../../../components/patient-modules/modals/PrintAllLabResultModal";
import PrintReceipt from "../../dc-cashier/components/PrintReceipt";
import ImagingReceipt from "../../dc-imaging/components/ImagingReceipt";
import LaboratoryReceipt from "../../dc-cashier/components/LaboratoryReceipt";

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
const LaboratoryOrders = (props) => {
	const {
		showTitle = true,
		appointment: propAppointment,
		patient,
		laboratory_test_type,
		allowCreate = true,
		onUploadLabResultSuccess,
		order_id,
	} = props;
	const {
		register,
		getValues,
		setValue,
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const { user } = useAuth();
    const [appointment, setAppointment] = useState(propAppointment);
	const isLaboratoryUser = () => {
		return user?.type == "DC-Laboratory";
	};
	const isXrayUser = () => {
		return user?.type === "HIS-IMAGING";
	};
	const testHeader = isXrayUser() ? "Imaging Test" : "Laboratory Test";
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
		reloadData,
	} = useDataTable
	({
		url: `/v1/doctor/laboratory-order/patient/${patient?.id}`,
		defaultFilters: {
			...(order_id ? { order_id: order_id } : {}),
			...(laboratory_test_type
				? { laboratory_test_type: laboratory_test_type }
				: {}),
			...(appointment?.id > 0 ? { appointment_id: appointment?.id } : {}),
		},
	});
	useNoBugUseEffect({
		functions: () => {
			setFilters((prevFilters) => ({
				...prevFilters,

				order_id: order_id,
			}));
		},
	});
	const createLabOrderRef = useRef(null);
	const uploadLabResultRef = useRef(null);
	const printLabResultRef = useRef(null);
	const imagingReceiptRef = useRef(null);
	const laboratoryReceiptRef = useRef(null);
	//chemistry ref
	const uploadFBSRef = useRef(null);
	const uploadRBSRef = useRef(null);
	const uploadCreatinineRef = useRef(null);
	const uploadUricAcidRef = useRef(null);
	const uploadSGOTRef = useRef(null);
	const uploadSGPTRef = useRef(null);
	const uploadAlkalinePhosRef = useRef(null);
	const uploadLDHRef = useRef(null);
	const uploadGGTRef = useRef(null);
	const uploadMagnesiumRef = useRef(null);
	const uploadPhophorusRef = useRef(null);
	const uploadAmylaseRef = useRef(null);
	const uploadcultureInitialRef = useRef(null);
	const uploadLipidProfileRef = useRef(null);
	const uploadElectrolytesRef = useRef(null);
	const uploadBilirubinRef = useRef(null);
	const uploadTotalProteinRef = useRef(null);
	const uploadUreaRef = useRef(null);
	const uploadOralGlucoseRef = useRef(null);
	const uploadUrineCreatinineRef = useRef(null);
	// hematology ref
	const uploadCBCResultRef = useRef(null);
	const uploadCuagulationStudiesRef = useRef(null);
	const uploadDifferentialCountRef = useRef(null);
	const uploadErythrocyteRef = useRef(null);
	const uploadPlateletCountRef = useRef(null);
	const uploadRedcellInficesRef = useRef(null);
	const uploadReticulocyteRef = useRef(null);
	// microbiology ref
	const uploadAFBStainRef = useRef(null);
	const uploadCultureSensitivityFinalRef = useRef(null);
	const uploadGramStainRef = useRef(null);
	const uploadKOHRef = useRef(null);
	// microscopy ref
		// fecalysis ref
		const uploadAscarisRef = useRef(null);
		const uploadEntomoebaCystRef = useRef(null);
		const uploadEntomoebaTrophozoiteRef = useRef(null);
		const uploadFecalOccultRef = useRef(null);
		const uploadGiardiaCystRef = useRef(null);
		const uploadGiardiaTrophozoiteRef = useRef(null);
		const uploadHookwormRef = useRef(null);
		const uploadMacroscopicFecalysisRef = useRef(null);
		const uploadMicroscopicFecalysisRef = useRef(null);
		const uploadTrichiurisRef = useRef(null);
		const uploadEntamoebaHistolyticaCystRef = useRef(null);
		const uploadEntamoebaHistolyticaTrophozoiteRef = useRef(null);
		// urine ref
		const uploadCastsRef = useRef(null);
		const uploadChemicalRef = useRef(null);
		const uploadCrystalRef = useRef(null);
		const uploadMacroscopicUrineRef = useRef(null);
		const uploadMicroscopicUrineRef = useRef(null);
		const uploadPregnancyTestRef = useRef(null);
	// serology ref
	const uploadAntiHBSRef = useRef(null);
	const uploadAntiHCVRef = useRef(null);
	const uploadASORef = useRef(null);
	const uploadCKMBRef = useRef(null);
	const uploadCRPRef = useRef(null);
	const uploadDengueDuoRef = useRef(null);
	const uploadHBsAGRef = useRef(null);
	const uploadRheumatoidRef = useRef(null);
	const uploadSyphilisRef = useRef(null);
	const uploadTroponinRef = useRef(null);
	const uploadTyphoidRef = useRef(null);
	const uploadWidalTestRef = useRef(null);

	const uploadBloodTypeRef = useRef(null);
	const uploadCovidTestRef = useRef(null);
	const uploadCrossMatchingRef = useRef(null);
	const uploadMiscellaneousRef = useRef(null);


	const deleteLabOrderRef = useRef(null);
	const isDoctor = () => {
		return String(user?.type || "DC-NURSE")
			.toLowerCase()
			.includes("doctor");
	};

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
		
		<div className="flex flex-col items-start px-8">
			<div className="flex flex-row justify-between w-full">
			{/* <TextInputField
										label="Date"
										type="date"
										error={errors?.order_date?.message}
										placeholder="Enter order date"
										{...register("order_date", {
											required: {
												value: true,
												message:
													"This field is required",
											},
										})}
									/> */}

				{showTitle ? (
				<ContentTitle
					title={
						laboratory_test_type == 1
							? "Imaging Order"
							: "Laboratory Order"
					}
				>
					{user?.type == "DC-NURSE"  &&  allowCreate ? (
						<button
							className="px-4 rounded-xl text-sm items-center justify-center text-blue-600 hover:text-blue-500"
							size="sm"
							
							onClick={() => {
								createLabOrderRef.current.show(
									patient,
									appointment,
									laboratory_test_type == 1
										? "imaging"
										: "laboratory-test"
								);
								// setUpdate(true);
							}}
						>
							<FlatIcon icon="rr-edit" className="mr-1" />
							Create{" "}
							{laboratory_test_type == 1
								? "Imaging"
								: "Laboratory"}{" "}
							Order
						</button>
					) : (
						""
					)}
				</ContentTitle>

			) : (

				""
			)}
			

				{/* <ActionBtn
                className="text-gray-700 flex items-center justify-end cursor-pointer hover:bg-green-600 py-2 rounded-3xl gap-2"
                onClick={() => printReceipt.current.show({...data, appointment})}
				type="info"
            >
                <FlatIcon icon="rs-document" />
                Print Receipt
            </ActionBtn> */}

			
			
			</div>
			

			
					
			<div className="flex flex-col w-full">
				<div>
				<Table
				className={`pb-2`}
				loading={loading}
				columns={[
					{
						header: "Order Date",
						className: "text-left",
						tdClassName: "text-left",
						key: "date",
						cell: (data) => {
							return formatDateMMDDYYYY(
								new Date(data?.order_date)
							);
						},
					},
					{
						header: testHeader,
						className: "text-left",
						tdClassName: "text-left",
						key: "type",
						cell: (data) => {
							return data?.type?.name;
						},
					},
					{
						header: "Rate",
						className: "text-left",
						tdClassName: "text-left",
						key: "lab_rate",
						cell: (data) => `₱ ${data.lab_rate}`,
					},
					{
						header: "Notes",
						className: "text-left",
						tdClassName: "text-left",
						key: "notes",
					},
					{
						header: "Medical Doctor",
						className: "text-left",
						tdClassName: "text-left",
						key: "doctor",
						cell: (data) => {
							return (
								<div className="flex flex-col">
									<span className="font-medium text-black -mb-[4px]">
										{doctorName(
											data?.relationships?.doctor
										)}
									</span>
									<span className="text-[10px] font-light">
										{doctorSpecialty(
											data?.relationships?.doctor
										)}
									</span>
								</div>
							);
						},
					},
					{
						header: "Status",
						className: "text-center ",
						tdClassName: "text-center",
						key: "order_status",
						cell: (data) => {
							return <Status status={data?.order_status} />;
						},
					},
					{
						header: "Result",
						className: "text-center",
						tdClassName: "text-center",
						key: "order_status",
						cell: renderResultCell,
					},
					{
						header: "Delete",
						className: `text-center `,
						tdClassName: `text-center `,
						key: "delete",
						cell: (data) => {
							return (
								<div className="w-full flex items-center">
									{/* {JSON.stringify(data)} */}
									<ActionBtn
										size="sm"
										type="danger"
										disabled={
											data?.order_status ==
											""
										}
										className=" mx-auto"
										onClick={() => {
											deleteLabOrderRef.current.show(
												data
											);
										}}
									>
										<FlatIcon icon="rr-trash" /> Delete
									</ActionBtn>
								</div>
							);
						},
					},
				]}
				data={data}
			/>
				</div>
			
			<div classname="flex justify-end">
			<Pagination
				page={page}
				setPage={setPage}
				pageCount={meta?.last_page}
				pageSize={paginate}
				setPageSize={setPaginate}
			/>
			</div>
			
			</div>
			
			<CreateLabOrderModal
				patient={patient}
                appointment={appointment?.id}
				onSuccess={() => {
					reloadData();
				}}
				ref={createLabOrderRef}
			/>

			<UploadLabResultModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadLabResultRef}
			/>
			{/* chemistry modal */}
			{/* <UploadFBSModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadFBSRef}
			/> */}
			<UploadFBSModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadFBSRef}
			/>
			<UploadRBSModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadRBSRef}
			/>
			<UploadCreatinineModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadCreatinineRef}
			/>
			<UploadUricAcidModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadUricAcidRef}
			/>
			<UploadSGOTModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadSGOTRef}
			/>
			<UploadSGPTModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadSGPTRef}
			/>
			<UploadAlkalinePhosModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadAlkalinePhosRef}
			/>
			<UploadLDHModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadLDHRef}
			/>
			<UploadGGTModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadGGTRef}
			/>
			<UploadMagnesiumModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadMagnesiumRef}
			/>
			<UploadPhosphurosModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadPhophorusRef}
			/>
			<UploadAmylaseModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadAmylaseRef}
			/>
			<UploadCultureSensitiveInitialModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadcultureInitialRef}
			/>
			<UploadLipidProfileModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadLipidProfileRef}
			/>
			<UploadElectrolytesModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadElectrolytesRef}
			/>
			<UploadBilirubinModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadBilirubinRef}
			/>
			<UploadTotalProteinModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadTotalProteinRef}
			/>
			<UploadUreaModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadUreaRef}
			/>
			<UploadOGTTModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadOralGlucoseRef}
			/>
			<UploadUrineCreatinineClearanceModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadUrineCreatinineRef}
			/>
			{/* Hematology Modal */}
			<UploadCompleteBloodCountModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadCBCResultRef}
			/>
			<UploadCuagulationStudiesModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadCuagulationStudiesRef}
			/>
			<UploadDifferentialCountModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadDifferentialCountRef}
			/>
			<UploadErythrocyteModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadErythrocyteRef}
			/>
			<UploadPlateletCountModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadPlateletCountRef}
			/>
			<UploadRedCellIndicesModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadRedcellInficesRef}
			/>
			<UploadReticulocyteCount
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadReticulocyteRef}
			/>

			{/* Microbiology Modal */}
			<UploadAFBStainModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadAFBStainRef}
			/>
			<UploadCultureSensitivityFinalModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadCultureSensitivityFinalRef}
			/>
			<UploadGramStainModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadGramStainRef}
			/>
			<UploadKOHModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadKOHRef}
			/>
			{/* Microscopy Modal */}
				{/* Fecalysis Modal */}
				<UploadAscarisModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadAscarisRef}
			/>
			<UploadEntamoebaColiCystModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadEntomoebaCystRef}
			/>
			<UploadEntamoebaColiTrophozoiteModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadEntomoebaTrophozoiteRef}
			/>
			<UploadEntamoebaHistolyticaCystModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadEntamoebaHistolyticaCystRef}
			/>
			<UploadEntamoebaHistolyticaTrophozoiteModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadEntamoebaHistolyticaTrophozoiteRef}
			/>
			<UploadFecalOccultBloodModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadFecalOccultRef}
			/>
			<UploadGiardiaLambliaCystModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadGiardiaCystRef}
			/>
			<UploadGiardiaLambliaTrophozoiteModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadGiardiaTrophozoiteRef}
			/>
			<UploadHookWormModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadHookwormRef}
			/>
			<UploadMacroscopicModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadMacroscopicFecalysisRef}
			/>
			<UploadMicroscopicModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadMicroscopicFecalysisRef}
			/>
			<UploadTrichiurisModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadTrichiurisRef}
			/>
				{/* Urine Modal */}
				<UploadCastsModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadCastsRef}
			/>
			<UploadChemicalExamModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadChemicalRef}
			/>
			<UploadCrystalsModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadCrystalRef}
			/>
			<UploadMacroscopicExamModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadMacroscopicUrineRef}
			/>
			<UploadMicroscopicExamModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadMicroscopicUrineRef}
			/>
			<UploadPregnancyTestModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadPregnancyTestRef}
			/>
			{/* Serology Modal */}
			<UploadAntiHBSModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadAntiHBSRef}
			/>
			<UploadAntiHCVModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadAntiHCVRef}
			/>
			<UploadASOModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadASORef}
			/>
			<UploadCKMBModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadCKMBRef}
			/>
			<UploadCRPModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadCRPRef}
			/>
			<UploadDengueDuoModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadDengueDuoRef}
			/>
			<UploadHBsAgModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadHBsAGRef}
			/>
			<UploadRheumatoidModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadRheumatoidRef}
			/>
			<UploadSyphilisModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadSyphilisRef}
			/>
			<UploadTroponinModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadTroponinRef}
			/>
			<UploadTyphoidTestModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadTyphoidRef}
			/>
			<UploadWidalTestModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadWidalTestRef}
			/>


			<UploadBloodTypingModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadBloodTypeRef}
			/>
			<UploadCovidRapidTestModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadCovidTestRef}
			/>
			<UploadCrossMatchingModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadCrossMatchingRef}
			/>
			<UploadMiscellaneousFormModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={uploadMiscellaneousRef}
			/>

		
			<PrintLabResultModal
				patient={patient}
				onSuccess={() => {
					onUploadLabResultSuccess();
					reloadData();
				}}
				ref={printLabResultRef}
			/>
			
			
			<DeleteOrderModal
				ref={deleteLabOrderRef}
				onSuccess={() => {
					reloadData();
				}}
			/>
		</div>
	);
};

export default LaboratoryOrders;
