import React, {useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Controller, useForm } from "react-hook-form";
import FlatIcon from "../../../../components/FlatIcon";
import InfoTextForPrint from "../../../../components/InfoTextForPrint";
import {  dateMMDDYYYY, patientFullName, patientAddress, } from "../../../../libs/helpers";
import ActionBtn from "../../../../components/buttons/ActionBtn";
import SummaryOfCharges from "./SummaryOfCharges";
import SummaryWithPhic from "../../../../components/cashier-billing/component/billing/SummaryWithPhic";
import ProfessionalFeeSOA from "../../../../components/cashier-billing/component/billing/ProfessionalFeeSOA";
import { useAuth } from "../../../../hooks/useAuth";
import useNoBugUseEffect from "../../../../hooks/useNoBugUseEffect";
import InfoTextForBilling from "../../../../components/cashier-billing/component/billing/InfoTextForBilling";
import QRCode from "qrcode.react";
import AmountDue from "../../../../components/cashier-billing/component/billing/components/AmountDue";
import CreditCardDetails from "./modal/CreditCardDetails";
import Img from "../../../../components/Img";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CaseDetails from "../../dc-nurse/components/Forms/CaseDetails";
import { caseCodes } from "../../../../libs/caseCodes";
import Draggable from "react-draggable";
import { PhotoIcon } from "@heroicons/react/24/solid";
import ReactQuillField from "../../../../components/inputs/ReactQuillField";
import DOMPurify from "dompurify";
import TextInputField from "../../../../components/inputs/TextInputField";
import { FloatingDock } from "../../../../components/FloatingDock";
import PaymentTable from "./PaymentTable";
import useDataTable from "../../../../hooks/useDataTable";
import { formatDateMMDDYYYY } from "../../../../libs/helpers";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";
import DoneDiagnosisModal from "./modal/DoneDiagnosisModal";

const FormHeading = ({ title }) => {
	return (
		
		<div className="flex items-center h-12">
		<div className="flex items-center">
		  
		</div>
		<div className="flex-grow slanted bg-blue-500 flex items-center justify-start pl-1">
		  <span className="text-white">www.laboratory.com</span>
		</div>
		<div className="flex-grow slanted-reverse bg-blue-700 flex items-center justify-start pl-1">
		<span className="text-blue-700" value="">.</span>
		</div>
		
		  <div className="slanted bg-blue-500 flex items-center justify-start pl-4"></div>
		
		  
	  </div>
	);
};


/* eslint-disable react/prop-types */
const BillingStatement = (props) => {
    const { loading: 
            btnLoading, 
            appointment, 
            patient, 
            onSave, 
            laboratory_test_type,
            lab_rate,
            order_id,} = props;
    
    const { user } = useAuth();
    const [showData, setShowData] = useState(null);
    const componentRef = React.useRef(null);
    const billingStatus = patient?.billing_status || "pending";
    const [isMinimized, setIsMinimized] = useState(true);
    const [position, setPosition] = useState({ x: 20, y: 2 });
    const [isDiagnosisChecked, setIsDiagnosisChecked] = useState("");
    const [isEmploymentChecked, setIsEmploymentChecked] = useState("");
    const { control, handleSubmit } = useForm();
    const [diagnosisName, setdiagnosisName] = useState("");
    const [diagnosisAddress, setdiagnosisAddress] = useState(""); 
    const [diagnosisPhone, setdiagnosisPhone] = useState("");
    const [diagnosisEmail, setdiagnosisEmail] = useState("");  
    const [imageSrc, setImageSrc] = useState(null);
    const deleteLabOrderRef = useRef(null);
    const handleEmploymentChange = () => {
        setIsEmploymentChecked(!isEmploymentChecked);
        if (isDiagnosisChecked) {
            setIsDiagnosisChecked(false);
        }
    };
    
    const handleDiagnosisChange = () => {
        setIsDiagnosisChecked(!isDiagnosisChecked);
        if (!isDiagnosisChecked) {
            setIsEmploymentChecked(false);
        }
    };
    const {
      loading,
      setLoading,
      data,
      setFilters,
      reloadData,
    } = useDataTable
    ({
      url: patient?.id ? `/v1/doctor/laboratory-order/patient/${patient?.id}` : null, 
      defaultFilters: {
        ...(order_id 
          ? { order_id: order_id } 
          : {}),
        ...(laboratory_test_type
          ? { laboratory_test_type: laboratory_test_type }
          : {}),
        ...(lab_rate
          ? { lab_rate: lab_rate }
          : {}),
        ...(appointment?.id > 0 
          ? { appointment_id: appointment?.id } 
          : {}),
      },
    });
    useNoBugUseEffect({
        functions: () => {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        },
        params: [appointment],
    });
    const onSubmit = (data) => {
        setdiagnosisName(data.diagnosisName);
        setdiagnosisAddress(data.diagnosisAddress);
        setdiagnosisPhone(data.diagnosisPhone);
        setdiagnosisEmail(data.diagnosisEmail);
		setPurpose(data.purpose);
    };
    const handleSave = () => {
        if (onSave) {
            onSave();
        }
        // Logic for saving the invoice
        // You can implement your save logic here
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const handleStop = (e, data) => {
		setPosition({ x: data.x, y: data.y });
	  };
    const handleDownload = async () => {
        const input = componentRef.current;
        const canvas = await html2canvas(input, {
            scale: 2, // Increase scale to ensure higher resolution
        });
        const imgData = canvas.toDataURL("image/png");
        
        // Create a new jsPDF instance
        const pdf = new jsPDF({
            orientation: "p", // Portrait
            unit: "mm",
            format: "a4" // A4 size
        });
    
        // Get the dimensions of the image
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Calculate the aspect ratio
        const imgWidth = imgProps.width;
        const imgHeight = imgProps.height;
        const ratio = imgWidth / imgHeight;
        
        let width = pdfWidth;
        let height = pdfWidth / ratio;
        
        if (height > pdfHeight) {
            height = pdfHeight;
            width = pdfHeight * ratio;
        }
    
        // Add the image to the PDF
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        
        // Save the PDF
        pdf.save("BillingStatement.pdf");
    };
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageSrc(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
    const links = [
      {
        title: "Home",
        icon: (
          <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-400" />
        ),
        href: "#",
      },
   
      {
        title: "Products",
        icon: (
          <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-400" />
        ),
        href: "#",
      },
      {
        title: "Components",
        icon: (
          <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-400" />
        ),
        href: "#",
      },
      {
        title: "Aceternity UI",
        icon: (
          ""
        ),
        href: "#",
      },
      {
        title: "Changelog",
        icon: (
          <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-400" />
        ),
        href: "#",
      },
   
      {
        title: "Twitter",
        icon: (
          <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-400" />
        ),
        href: "#",
      },
      {
        title: "GitHub",
        icon: (
          <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-400" />
        ),
        href: "#",
      },
    ];
    
    return (
        
        <div
			className=" w-[1110px] h-[7.7in] ml-[280px] ">
        <div className="relative">
            {loading ? (
                <div className="absolute top-0 left-0 h-full w-full flex items-start justify-center bg-slate-200 bg-opacity-95 backdrop-blur pt-[244px] ">
                    <div className="flex items-center justify-center text-2xl animate-pulse">
                        Loading, please wait...
                    </div>
                </div>
            ) : (
                ""
            )}

            <div className="flex flex-col w-[1100px]">
              <div className="p-2 flex items-center ">

                    

                    <div className="flex items-center">
     
            <ActionBtn
              className="ml-2 text-xs text-black border"
              onClick={() => setIsMinimized(!isMinimized)}
              type="foreground"
            > 
              {isMinimized ?  <FlatIcon className="text-sm text-gray-500" icon="fi fi-rr-edit" /> : <FlatIcon className="text-sm text-gray-400" icon="fi fi-sr-edit" />}
              <span>Edit Billing</span>
            </ActionBtn>
             
          </div>
        </div>

               
    <div className="p-1 flex w-[350vh]">
      <div className={`bg-gray-100 border border-gray-400 rounded-lg duration-100 transform transition ease-in-out ${isMinimized ? "skew-x-2 opacity-0 " : "scale-100 opacity-100 w-[250px] "}`}>
        {!isMinimized && (
          <>
            <div className="border mt-1 ml-1 mr-1 rounded-lg px-3 shadow-lg py-2">
            <span className="text-sm flex justify-start text-gray-500 border-b border-gray-300 mb-3">Edit Billing Details</span>
              <div className="flex flex-row gap-2 items-center">
                <FlatIcon icon="fi fi-rr-hospital" className="block text-md font-sm leading-6 text-gray-500" />
                <span className="text-xs text-gray-500">Diagnosis Name</span>
              </div>
              <div className="flex flex-col mt-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name="diagnosisName"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name } }) => (
                      <TextInputField
                        name={name}
                        value={value}
                        onChange={onChange} // Ensure this updates the state
                        placeholder="Enter Diagnosis Name here..."
                      />
                    )}
                  />
                  <div className="flex flex-row gap-2 items-center">
                <FlatIcon icon="fi fi-rr-address-book" className="block text-md font-sm leading-6 text-gray-500" />
                <span className="text-xs text-gray-500">Diagnosis Address</span>
              </div>
                  <Controller
                    name="diagnosisAddress"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name } }) => (
                      <TextInputField
                        name={name}
                        value={value}
                        type="text"
                        onChange={onChange} // Ensure this updates the state
                        placeholder="Enter Diagnosis Address here..."
                      />
                    )}
                  />
                   <div className="flex flex-row gap-2 items-center">
                <FlatIcon icon="fi fi-rr-square-phone-hangup" className="block text-md font-sm leading-6 text-gray-500" />
                <span className="text-xs text-gray-500">Phone no:</span>
              </div>
                  <Controller
                    name="diagnosisPhone"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name } }) => (
                      <TextInputField
                        name={name}
                        value={value}
                        type="number"
                        onChange={onChange} // Ensure this updates the state
                        placeholder="Enter Phone here..."
                      />
                    )}
                  />
                  <div className="flex flex-row gap-2 items-center">
                <FlatIcon icon="fi fi-rr-envelope" className="block text-md font-sm leading-6 text-gray-500" />
                <span className="text-xs text-gray-500">Email Address:</span>
              </div>
                  <Controller
                    name="diagnosisEmail"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name } }) => (
                      <TextInputField
                        name={name}
                        value={value}
                        type="email"
                        onChange={onChange} // Ensure this updates the state
                        placeholder="Enter Email here..."
                      />
                    )}
                  />
                  <div className="flex justify-end">
                    <button className="text-xs bg-gray-200 hover:bg-gray-400 rounded-lg px-4 py-1 mt-2 text-teal-700 hover:text-teal-50 transition-colors duration-300" type="submit">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="mt-5 flex justify-center rounded-lg border border-dashed border-gray-900/25 mr-12 ml-12 mb-4">
              <div className="text-center">
                <PhotoIcon className=" h-1 w-12 text-gray-300" aria-hidden="true" />
                <div className="flex text-sm leading-b text-gray-600">
                  <label
                    htmlFor="file-input"
                    className="relative cursor-pointer rounded-md  font-semibold text-teal-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2 hover:text-teal-500"
                  >
                    Upload Signature
                    <input
                      type="file"
                      id="file-input"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <p className="text-xs leading-5 text-gray-600">PNG, JPG, Bitmap</p>
              </div>
            </div>

                    <div className="flex flex-col justify-center px-3">
                    <ActionBtn
                            type="foreground"
                            className="text-base gap-2  mb-2 items-center transition ease-in-out delay-30 hover:-translate-y-1 hover:scale-100 duration-100"
                            onClick={handlePrint}
                        >
                            <FlatIcon icon="rr-print" /> Print
                        </ActionBtn>
                 
                    
                    
                        <ActionBtn
                            type="foreground"
                            className="text-base gap-2  mb-2 items-center transition ease-in-out delay-30 hover:-translate-y-1 hover:scale-100 duration-100"
                            onClick={handleDownload}
                        >
                            <FlatIcon icon="fi fi-rr-download" /> PDF
                        </ActionBtn>
       
      
        {/*                     
          <ActionBtn
						className="text-base gap-2  mb-2 items-center transition ease-in-out delay-30 hover:-translate-y-1 hover:scale-100 duration-100"
						onClick={handleDownload}
						type="foreground"
					>
						<FlatIcon icon="fi fi-bs-disk" /> PDF
					</ActionBtn> */}
          <button onClick={() => {
											deleteLabOrderRef.current.show(
												data
											);
										}} className="inline-flex mb-2 h-9 animate-shimmer items-center justify-center rounded-md bg-[linear-gradient(110deg,#24a60d,45%,#40ff19,55%,#24a60d)] bg-[length:200%_100%] px-6 font-medium text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          Done 
        </button>

                    </div>
            {/* {billingStatus === "mgh" && ( */}
                      
          </>
        )}
      </div>

    {/*DOCUMENT*/}
    <div className="w-[8.8in] h-[6.9in] ml-1 overflow-auto rounded-xl border-teal-500 border-2">
        <div className="bg-gradient-to-bl from-rose-100 to-teal-100 flex flex-col w-[8.6in] h-[11.8in] border-gray-200 border-2 mx-auto relative rounded-lg px-1 py-1" ref={componentRef}>   
            <header class="mb-1">
                <div class="flex justify-between items-center border-b border-b-slate-500 border-dashed px-5">
                <div className="flex gap-4">
                {(imageSrc || "/laboratory.png") && (
              <div className="flex flex-col justify-end items-center">
                    <img
                        src={imageSrc || "/laboratory.png"}
                        alt="Uploaded Signature"
                        className="object-contain bottom-0 left-0 right-0 top-0 h-20 w-15 opacity-70"
                    />
                </div>
            )}
                

      <Img
				src={patient?.avatar || ""}
				type="user"
				name={patientFullName(patient)}
				className="h-14 w-14 rounded-full object-contain bg-slate-400"
			/>
                </div>
            

                <div className="block flex-col w-[150px]">
                    
                    <div
                    className="flex-1  text-gray-900 text-lg"
                    dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(diagnosisName || "Diagnosis Center") 
                    }}
                />
                    <div
                    className="flex-1  text-xs text-gray-600"
                    dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(diagnosisAddress || "Diagnosis Address") 
                    }}
                />
                    <div
                    className="flex-1  text-xs text-gray-600"
                    dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(diagnosisPhone || "Phone: (123) 456-7890") 
                    }}
                />
                   
                </div>

				
                
                <CreditCardDetails />

            </div>
        </header>

            

                <div className="flex flex-row justify-between gap-5">
                    <div className="border rounded-sm w-[350px] border-gray-400">
					    <div className=" bg-gray-200 text-slate-700  rounded-sm grid grid-cols-6  text-xs  text-center font-mono">
						        <div className="col-span-3"> 
                                DIAGNOSTIC DATE
                                </div>
						         <div className="col-span-3">
                                END DATE
                                </div>
                                
					    </div>
                
					    <div className="grid grid-cols-2 text-sm font-light font-mono shadow">
							
					

						<div className="">
		
                        <InfoTextForBilling
                            value={dateMMDDYYYY()}/>
						</div>

						<div className="">
                        <InfoTextForBilling
                                value={dateMMDDYYYY()}/>
                        </div>
                        
                        </div>
						<div className="px-3 py-2 flex flex-col w-full mt">
							
                    
						<InfoTextForPrint
							contentClassName="text-sm w-full items-center border rounded-sm w-[350px] mb-2 border-gray-400"
							title="PATIENT NAME"
							value={patientFullName(patient)}
							
						/>
						
						<InfoTextForPrint
							contentClassName="text-sm w-full items-center border rounded-sm w-[350px] mb-2 border-gray-400"
							className=""
							title="ADDRESS"
							value={patientAddress(patient)}
						/>
					
						<InfoTextForPrint
							contentClassName="text-sm w-full items-center border rounded-sm w-[350px] border-gray-400"
							title="PHILHEALTH NUMBER"
							value={patient?.philhealth}
						/>
							
                        
                        </div>

						
                       
					</div>


                    <div className="items-center">

					        <AmountDue
						          appointment={appointment}
                      patient={patient}
					        />
		
                    </div>
                    
                </div>


                <div className="flex flex-row justify-between mt-2">
                    <h5 className="text-xs font-bold justify-center w-[570px] text-teal-800">
                        Please check box if address is incorrect or insurance infromation has changed, and indicate change(s) on reverse side or call 573-883-7718
				    </h5>
                <h5 className="text-md font-italic justify-start">
					
				</h5>
                <h5 className="text-md font-bold justify-start text-teal-800">
					BILLING STATEMENT
				</h5>
                </div>
                                        
                    

                    <SummaryWithPhic
                        code={
                            appointment?.diagnosis_code
                        }
                        cases={
                            caseCodes ||
                            []
                        }
                        appointment={appointment}
                        patient={patient}
                        className="m-2"
                    />
                    <SummaryOfCharges
                        appointment={appointment}
                        patient={patient}
                        className="m-2 font-bold"
                    />
                    <ProfessionalFeeSOA
                        appointment={appointment}
                        patient={patient}
                        className="m-2"
                    />
                    
                    <div className="grid grid-cols-2">
                        <div className="mt-2 ml-4 ml">
                            <InfoTextForPrint
                                contentClassName="text-sm"
                                title="CERTIFIED CORRECT BY"
                                value={user?.name}
                            />
                        </div>
                        
                    </div>

                    <div className="grid grid-cols-2">
                        <div className="mt-4 ml-4">
                            <InfoTextForPrint
                                contentClassName="text-sm"
                                title="Contact No."
                            />
                            <p className="text-xs">PLEASE PAY AT THE CASHIER</p>
                        </div>
                        <div className="mt-8 mr-4">
                            <p className="text-xs">
                                Signature Over Printed Name of Member or
                                Representative
                            </p>
                        </div>
						
                    
                    </div>
<footer
  class="flex flex-col items-end  bg-gradient-to-bltext-center text-white mt-[17px] justify-between">
  <div class="">
  <div className="flex  overflow-hidden flex-row gap-2 mt-2">
    <div className="  sm:w-full  md:w-full  lg:w-full  xl:w-full">
    <div className="flex flex-col justify-start items-end gap-2">
        <div className="flex flex-row gap-2 ">
        <FlatIcon
            icon="fi fi-sr-circle-phone"
            className="text-teal-800 opacity-70"
        />
            <span icon="fi fi-brands-visa" className="text-sm text-gray-700 text-font-semibold">Contact Us</span>          
            </div>
            <div className="flex flex-row gap-2 ml-6">
            <div
                    className="flex-1  text-xs text-gray-600"
                    dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(diagnosisEmail || "contact@laboratory.com") 
                    }}
                />
            <div
                    className="flex-1  text-xs text-gray-600"
                    dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(diagnosisPhone || "Phone: (123) 456-7890") 
                    }}
                />
            </div>
           
          </div>
 </div>
 <div className=" ">
                    <QRCode
						value={`user-${showData?.receivedBy?.username}`}
						level="H"
						size={50}
					/>
 </div>
</div>
  </div>
</footer>


                    </div>
                  

                </div>

      <DoneDiagnosisModal
				ref={deleteLabOrderRef}
				onSuccess={() => {
					reloadData();
				}}
			/>
                
            </div>
            
            </div>

            


        </div>
       </div> 
    );
};

export default BillingStatement;
