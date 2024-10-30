import React from 'react'
import InfoTextForBilling from '../InfoTextForBilling'
import { dateToday, formatDate, dateOnlyToday, dateMMDDYYYY, patientFullName, patientAddress, formatCurrency  } from "../../../../../libs/helpers";
import useDataTable from '../../../../../hooks/useDataTable';
import PaymentTable from '../../../../../pages/diagnostic-center/dc-cashier/components/PaymentTable';


const AmountDue = (props) => {

    const { loading: btnLoading, 
            appointment, 
            patient,
            order_id, 
			laboratory_test_type,
			lab_rate, 
            } = props;
    const {

		loading
		,
		setLoading
		,
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
    
    let diagnosis = caseCodes?.find(
		(x) => x.CASE_CODE == appointment?.diagnosis_code
	);
    const safeParseFloat = (value) => {
        const num = parseFloat(value);
        return Number.isNaN(num) ? 0 : num;
      };
  return (
    <div className="border rounded-sm w-[360px] border-gray-300 ">
					
                    	<div className="">

						<div className="  text-white flex flex-row justify-center gap-9 divide-x  font-light text-start font-mono  items-center mb-3">
						<div className=" text-xs items-center justify-center flex  bg-gray-200 text-slate-800 ">
                            
                           ACCOUNT NUMBERS
                        </div>

						<div className=" text-xs items-center justify-center flex  bg-gray-200 text-slate-800">
                            
                           ACCOUNT BALANCE
                        </div>

						<div className=" text-xs items-center justify-center flex text-slate-800 bg-gray-200">
                            
                           AMOUNT DUE
                        </div>
						
					</div>

					<div className="    grid grid-cols-3 divide-x  font-light text-start font-mono border-t  border-t-slate-500 ">
						<div className=" text-xs items-center justify-center flex   text-slate-800 ">
                            
                           <InfoTextForBilling
                            className=''
                            contentClassName="font-bold "
                            value=""/>
                        </div>

						<div className="col-span-1 text-xs items-center justify-center flex   text-slate-800">
                            
                           <InfoTextForBilling
                            contentClassName="font-bold "
                            value=""/>
                        </div>

						<div className="col-span-1 text-xs items-center justify-center flex ">
                            
                           <InfoTextForBilling
                            contentClassName="font-bold "
                            value=""/>
                        </div>
						
					</div>

					<div className="    grid grid-cols-3 divide-x  font-light text-start font-mono border-t border-t-slate-500">
						<div className=" text-xs items-center justify-center flex   text-slate-800">
                            
                           <InfoTextForBilling
                            contentClassName="font-bold "
                            value=""/>
                        </div>

						<div className="col-span-1 text-xs items-center justify-center flex   text-slate-800">
                            
                           <InfoTextForBilling
                            contentClassName="font-bold "
                            value=""/>
                        </div>

						<div className="col-span-1 text-xs items-center justify-center flex ">
                            
                           <InfoTextForBilling
                            contentClassName="font-bold "
                            value=""/>
                        </div>
						
					</div>

					<div className="    grid grid-cols-3 divide-x  font-light text-start font-mono border-t border-t-slate-500">
						<div className=" text-xs items-center justify-center flex   text-slate-800">
                            
                           <InfoTextForBilling
                            contentClassName="font-bold "
                            value=""/>
                        </div>

						<div className="col-span-1 text-xs items-center justify-center flex   text-slate-800">
                            
                           <InfoTextForBilling
                            contentClassName="font-bold "
                            value=""/>
                        </div>

						<div className="col-span-1 text-xs items-center justify-center flex ">
                            
                           <InfoTextForBilling
                            contentClassName="font-bold "
                            value=""/>
                        </div>
						
					</div>

					<div className="    grid grid-cols-3 divide-x  font-light text-start font-mono border-t border-t-slate-500">
						<div className=" text-xs items-center justify-center flex   text-slate-800">
                            
                           <InfoTextForBilling
                            contentClassName="font-bold "
                            value=""/>
                        </div>

						<div className="col-span-1 text-xs items-center justify-center flex   text-slate-800">
                            
                           <InfoTextForBilling
                            contentClassName="font-bold "
                            value=""/>
                        </div>

						<div className="col-span-1 text-xs items-center justify-center flex ">
                            
                           <InfoTextForBilling
                            contentClassName="font-bold "
                            value=""/>
                        </div>
						
					</div>

					<div className="    grid grid-cols-3 divide-x  font-light text-start font-mono border-t border-t-slate-500">
						<div className=" text-xs items-center justify-center flex   text-slate-800">
                            
                           <InfoTextForBilling
                            contentClassName="font-bold "
                            value=""/>
                        </div>

						<div className="col-span-1 text-xs items-center justify-center flex   text-slate-800">
                            
                           <InfoTextForBilling
                            contentClassName="font-bold "
                            value=""/>
                        </div>

						<div className="col-span-1 text-xs items-center justify-center flex ">
                            
						<InfoTextForBilling
                            contentClassName="font-bold "
                            value=""/>
                        
                        </div>
						
					</div>
                    
                    
                    
					

                    <div className="flex flex-row w-full text-sm font-light font-mono border-t border-t-slate-500 items-center">

						
                        <div className=" text-xs font-bold justify-center flex-col flex  bg-gray-200 text-slate-800 border-r  border-r-slate-400 w-full ">
							AMOUNT ENCLOSED
                        </div>
					

						<div className="w-full  ">

                        <InfoTextForBilling
                            contentClassName="font-bold"
                            value=""/>
                        </div>

					
						<div className=" text-xs font-bold items-center justify-center flex h-8 bg-gray-700 text-white  w-full">
							TOTAL AMOUNT
                        </div>
                        

						<div className="w-full justify-center ">

                        <InfoTextForBilling
  contentClassName="font-bold"
  value={formatCurrency(
    safeParseFloat(diagnosis?.HOSPITAL_SHARE) +
    safeParseFloat(diagnosis?.PROFESSIONAL_FEE_PF_SHARE) +
    safeParseFloat(data?.lab_rate)
  )}
  data={data}
/>


          
                        </div>

					</div>
					

                    
				</div>
               </div>
  )
}




export default AmountDue