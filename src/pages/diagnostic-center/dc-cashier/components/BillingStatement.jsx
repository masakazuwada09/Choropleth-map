import React, {  useState } from "react";
import { useReactToPrint } from "react-to-print";
import FlatIcon from "../../../../components/FlatIcon";
import InfoTextForPrint from "../../../../components/InfoTextForPrint";
import {  dateMMDDYYYY, patientFullName, patientAddress, } from "../../../../libs/helpers";
import ActionBtn from "../../../../components/buttons/ActionBtn";
import SummaryOfCharges from "../../../../components/cashier-billing/component/billing/SummaryOfCharges";
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
    const { loading: btnLoading, appointment, patient, onSave} = props;
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [showData, setShowData] = useState(null);
    const componentRef = React.useRef(null);
    const billingStatus = patient?.billing_status || "pending";


    useNoBugUseEffect({
        functions: () => {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        },
        params: [appointment],
    });

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

    return (
        
        <div
			className=" w-[8.7in]  rounded-lg ">
        <div className="relative ">
            {loading ? (
                <div className="absolute top-0 left-0 h-full w-full flex items-start justify-center bg-slate-200 bg-opacity-95 backdrop-blur pt-[244px] ">
                    <div className="flex items-center justify-center text-2xl animate-pulse">
                        Loading, please wait...
                    </div>
                </div>
            ) : (
                ""
            )}
            <div className="p-4 flex items-center justify-end ">
                    {/* {billingStatus === "mgh" && ( */}
                        <ActionBtn
                            className="text-base gap-2 ml-2 mb-2 items-center transition ease-in-out delay-30 hover:-translate-y-1 hover:scale-100 duration-100"
                            onClick={handlePrint}
                        >
                            <FlatIcon icon="rr-print" /> Print
                        </ActionBtn>
                    {/* )} */}
                    
                    <ActionBtn
						className="text-base gap-2 ml-2 mb-2 items-center transition ease-in-out delay-30 hover:-translate-y-1 hover:scale-100 duration-100"
						onClick={handleDownload}
						type="secondary"
					>
						<FlatIcon icon="fi fi-bs-disk" /> Save
					</ActionBtn>
                    <ActionBtn
                        type="success"
                        className="text-base gap-2 ml-2 mb-2 items-center transition ease-in-out delay-30 hover:-translate-y-1 hover:scale-100 duration-100"
                        loading={btnLoading}
                        onClick={handleSave}
                    >
                        <FlatIcon icon="rr-check" />
                        Done Diagnose
                    </ActionBtn>
                </div>

            
                
            <div className="p-1 ">
    <div className="w-full h-[7.5in]">
        <div className="bg-gradient-to-blfrom-rose-100 to-teal-100 flex flex-col w-[8.5in] h-[11.8in] border-gray-200 border-2 mx-auto relative overflow-auto rounded-lg px-1 py-1" ref={componentRef}>   
            <header class="mb-2">
                <div class="flex justify-between items-center border-b border-b-slate-500 border-dashed ">
                <div className="flex gap-2">
                <img
			    src="/laboratory.png"
				className=" object-contain bottom-0 left-0 right-0 top-0 h-12 w-12 overflow-hidden bg-fixed opacity-70 "
				/>

            <Img
				src={patient?.avatar || ""}
				type="user"
				name={patientFullName(patient)}
				className="h-14 w-14 rounded-full object-contain bg-slate-400"
			/>
                </div>
            

                <div className="mr-12 ">
                    <h1 class=" font-bold text-md text-gray-800">{patient?.RHU_name}Diagnostic Center Name</h1>
                    <p class=" text-gray-600 text-xs">123 Medical Street, City, Country</p>
                    <p class=" text-gray-600 text-xs">Phone: (123) 456-7890</p>
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


                {/* <div className="flex flex-row justify-between mt-2">
                    <h5 className="text-xs font-bold justify-center w-[370px] text-blue-800">
                        Please check box if address is incorrect or insurance infromation has changed, and indicate change(s) on reverse side or call 573-883-7718
				    </h5>
                <h5 className="text-md font-italic justify-start">
					
				</h5>
                <h5 className="text-md font-italic justify-start">
					BILLING STATEMENT
				</h5>
                </div> */}
            
          


               

                <div className="flex flex-row justify-between mt-2 items-center">
                    
                    

                    <h5 className="text-xs font-bold justify-center w-[370px] text-gray-800">
                        
				    </h5>
                
                </div>

                       
                    <SummaryOfCharges
                        appointment={appointment}
                        patient={patient}
                        className="m-2 font-bold"
                    />
                    <SummaryWithPhic
                        appointment={appointment}
                        patient={patient}
                        className="m-2"
                    />
                    <ProfessionalFeeSOA
                        appointment={appointment}
                        patient={patient}
                        className="m-2"
                    />

               

                    <div className="grid grid-cols-2">
                        <div className="mt-8 ml-4 ml">
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
            <p className="text-xs text-gray-700"><b>Email:</b> support@example.com</p>
            <p className="text-xs text-gray-700"><b>Phone:</b> (123) 456-7890</p>
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


  <div class="w-full p-2 text-center ">
    © 2023 Copyright:
    <a href="https://tw-elements.com/">TW Elements</a>
  </div>
</footer>
                    </div>

                </div>
                    
                
            </div>
        </div>
       </div> 
    );
};

export default BillingStatement;
