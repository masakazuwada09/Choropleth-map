import React, { useState } from 'react'
import { useAuth } from '../../../../hooks/useAuth';
import useNoBugUseEffect from '../../../../hooks/useNoBugUseEffect';
import FlatIcon from '../../../../components/FlatIcon';
import ActionBtn from '../../../../components/buttons/ActionBtn';
import InfoTextForPrint from '../../../../components/InfoTextForPrint';
import { dateToday } from '../../../../libs/helpers';

const Housekeeping = (props) => {
    const { loading: btnLoading, appointment, patient, onSave } = props;
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const componentRef = React.useRef(null);
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

    // const handleHousekeepingApproval = () => {
    //     if ()
    // }
		// Logic for saving the invoice
		// You can implement your save logic here
	};
  return (
     <div className="relative">
			{loading ? (
				<div className="absolute top-0 left-0 h-full w-full flex items-start justify-center bg-slate-200 bg-opacity-95 backdrop-blur pt-[244px] z-10">
					<div className="flex items-center justify-center text-2xl animate-pulse">
						Loading, please wait...
					</div>
				</div>
			) : (
				""
			)}
			<div className="m-2">
				<div className=" gap-2 text-base">
					<FlatIcon icon="rr-wallet" className="text-base" />
					<span className="text-lg font-semibold m-2">
						Status: {""}
						<span className="text-yellow-700">For Room Inspection</span>
						{/* {billingStatus === "pending" ? (
							<span className="text-yellow-700">Pending</span>
						) : (
							<span className="text-green-700">MGH</span>
						)} */}
					</span>
				</div>
			</div>

			<div className="border shadow p-2">
				<div className="text-justify mt-12" ref={componentRef}>
				
					{/* <div className="grid grid-cols-2">
						<div className="mt-8 ml-4">
							<InfoTextForPrint
								contentClassName="text-sm"
								title="CERTIFIED CORRECT BY"
								value={user?.name}
							/>
						</div>
						<div className="mt-8 mr-4">
							<InfoTextForPrint
								contentClassName="text-sm"
								title="OR Number"
								value={""}
							/>
							<InfoTextForPrint
								contentClassName="text-sm"
								title="Amount"
								value={patient?.civil_status}
							/>
							<InfoTextForPrint
								contentClassName="text-sm"
								title="Date"
								value={dateToday()}
							/>
						</div>
					</div>

					<div className="grid grid-cols-2">
						<div className="mt-4 ml-4">
							<InfoTextForPrint
								contentClassName="text-sm"
								title="Contact No."
								// value={patient?.civil_status}
							/>
							<p className="text-xs">PLEASE PAY AT THE CASHIER</p>
						</div>
						<div className="mt-8 mr-4">
							<p className="text-xs">
								Signature Over Printed Name of Member or
								Representative
							</p>
						</div>
					</div> */}
				</div>

				<div className="p-4 flex items-center justify-end">
					
					{/* Adding more billing-related information here if needed */}
					<ActionBtn
						type="success"
						className="ml-2"
						loading={btnLoading}
						onClick={handleSave}
					>
						<FlatIcon icon="rr-check" />
						Approve for Cashier
					</ActionBtn>
					{/* <ActionBtn className="ml-2" onClick={handleDownload}>
                    Download
                  </ActionBtn>  */}
				</div>
			</div>
		</div>
  )
}

export default Housekeeping
