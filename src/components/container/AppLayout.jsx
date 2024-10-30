import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Header from "../layout/Header";
import FlatIcon from "../FlatIcon";
import MenuLink from "../buttons/MenuLink";
import React, { useEffect, useRef, useState } from "react";
import Img from "../Img";
import { ToastContainer } from "react-toastify";
import ConfirmLogoutModal from "../modal/ConfirmLogoutModal";
import RHUNurseLinks from "../../userLinks/RHUNurseLinks";
import RHUDoctorLinks from "../../userLinks/RHUDoctorLinks";
import RHUAdminLinks from "../../userLinks/RHUAdminLinks";
import RHULabLinks from "../../userLinks/RHULabLinks";
import RHUImagingLinks from "../../userLinks/RHUImagingLinks";
import useReValidateAuth from "../../hooks/useReValidateAuth";
import RHUPharmaLinks from "../../userLinks/RHUPharmaLinks";
import useNoBugUseEffect from "../../hooks/useNoBugUseEffect";
import { detectMobile } from "../../libs/helpers";
import RHUCashierLinks from "../../userLinks/RHUCashierLinks";
import HISAnesthesiaLink from "../../userLinks/hmis/HISAnesthesiaLink";
import HISNurseLink from "../../userLinks/hmis/HISNurseLink";
import HISAnesthesiaMonitorLink from "../../userLinks/hmis/HISAnesthesiaMonitorLink";
import HISErLink from "../../userLinks/hmis/HISErLink";
import HISDoctorLinks from "../../userLinks/hmis/HISDoctorLinks";
import HISBillingLink from "../../userLinks/hmis/HISBillingLink";
import HISHousekeepingLink from "../../userLinks/hmis/HISHousekeepingLink";
import OPDInfectiousLink from "../../userLinks/hmis/OPDInfectiousLink";
import HISSurgeonLink from "../../userLinks/hmis/HISSurgeonLink";
import HISPacuLink from "../../userLinks/hmis/HISPacuLink";
import HISOpdLink from "../../userLinks/hmis/HISOpdLink";
import HISCashierLink from "../../userLinks/hmis/HISCashierLink";
import DCFrontdeskLinks from "../../userLinks/dc/DCFrontdeskLinks";
import DCNurseLinks from "../../userLinks/dc/DCNurseLinks";
import DCDoctorLinks from "../../userLinks/dc/DCDoctorLinks";
import DCLabLinks from "../../userLinks/dc/DCLabLinks";
import DCImagingLinks from "../../userLinks/dc/DCImagingLinks";
import DCCashierLinks from "../../userLinks/dc/DCCashierLinks";
import DCPharmacyLinks from "../../userLinks/dc/DCPharmacyLinks";

const AppLayout = (props) => {
    useReValidateAuth();
    const confirmLogoutRef = useRef(null);
	const fullScreenRef = useRef(null);
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { user, logout } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });
    const { children } = props;
    
    const isActive = (name) => {
        if (name == "") {
            return location?.pathname == `/${String(user?.type).toLowerCase()}`;
        }
        return location?.pathname?.includes(name);
    };
    
    useNoBugUseEffect({
        functions: () => {
            setIsMobile(detectMobile());
        },
        params: [],
    });
	const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            fullScreenRef.current?.requestFullscreen().catch((err) => {
                alert(`Error attempting to enable fullscreen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };
    const renderLinks = () => {
        switch (String(user?.type).toLowerCase()) {
            case "his-nurse":
                return <RHUNurseLinks isActive={isActive} />;
            case "his-laboratory":
                return <RHULabLinks isActive={isActive} />;
            case "his-imaging":
                return <RHUImagingLinks isActive={isActive} />;
            case "his-cashier":
                return <HISCashierLink isActive={isActive} />;
            case "his-pharmacy":
                return <RHUPharmaLinks isActive={isActive} />;
            case "rhu-admin":
                return <RHUAdminLinks isActive={isActive} />;
            case "his-monitoring":
                return <HISAnesthesiaMonitorLink isActive={isActive} />;
            case "his-anesthesia":
                return <HISAnesthesiaLink isActive={isActive} />;
            case "his-er":
                return <HISErLink isActive={isActive} />;
            case "his-billing":
                return <HISBillingLink isActive={isActive} />;
            case "his-housekeeping":
                return <HISHousekeepingLink isActive={isActive} />;
            case "opd-infectious":
                return <OPDInfectiousLink isActive={isActive} />;
            case "his-surgeon":
                return <HISSurgeonLink isActive={isActive} />;
            case "pacu-nurse":
                return <HISPacuLink isActive={isActive} />;
            case "opd-nurse":
                return <HISOpdLink isActive={isActive} />;
            case "dc-frontdesk":
                return <DCFrontdeskLinks isActive={isActive} />;
            case "dc-nurse":
                return <DCNurseLinks isActive={isActive} />;
            case "dc-doctor":
                return <DCDoctorLinks isActive={isActive} />;
            case "dc-laboratory":
                return <DCLabLinks isActive={isActive} />;
            case "dc-imaging":
                return <DCImagingLinks isActive={isActive} />;
            case "dc-cashier":
                return <DCCashierLinks isActive={isActive} />;
            case "dc-pharmacy":
                return <DCPharmacyLinks isActive={isActive} />;
            case "his-md":
                return <HISDoctorLinks isActive={isActive} />;
            default:
                break;
        }
    };

    return (
		<div className="flex ">
 

		<div 				
		className={`cursor-pointer h-full w-20 ${!sidebarOpen ? 
								"w-80" : "w-50"} duration-500 relative`}
					
		onClick={() => {
								setSidebarOpen(!sidebarOpen);
								setSidebarOpen(false);
								
							}}>

		<div className="duration-500 ">
			<div className=" flex w-[280px]  h-[22.6px] dark:bg-blue-500 z-10 duration-400 items-center justify-start">

					<div className="px-5 py-6 mt-2  flex items-center gap-5">

					<h1 className={`text-gray-600 dark:!text-white duration-500 mt-5 font-semibold text-md text cursor-pointer ${
						sidebarOpen ? "scale-0 duration-500" : "scale-100 duration-500"
						  }`}
						  onClick={() => {
						setSidebarOpen((prevVal) => !prevVal);
						  }}>
							Diagnostic Center
						</h1>
					</div>

				{detectMobile() && sidebarOpen ? (
					<span
						className=""
						onClick={() => {
							setSidebarOpen(true);
						}}
					>
						
					</span>
				) : (
					""
				)}


			</div>



			<div className="flex flex-col  dark:!bg-blue-500 bg-white ">
				<div  className={'flex flex-col mt-7 h-[calc(100dvh-123px)] '}>
					
					{renderLinks()}
				
				<div className="">
					<div className="gap-2">
						
					<MenuLink
						to="/my-account"
						active={isActive("/my-account")}
						icon="rr-user"
						text="My Account"
					/>

					<MenuLink

						to="/logout"
						active={isActive("/logout")}
						onClick={async (e) => {
							await e.preventDefault();
							await e.stopPropagation();
							// await logout();
							confirmLogoutRef.current.show();
						}}
						icon="rr-sign-out-alt"
						text="Logout"
					/>

				
					</div>
					</div>
					
					
				</div>
				
			</div>

			<div className=" flex justify-start gap-2 px-2 py-2 pl-3 bg-white dark:!bg-blue-500 ">
						<Img
							src={user?.avatar}   // PROFILE AVATAR
							type="user"
							name={user?.name}
							className="h-14 w-14 rounded-lg"
						/>
						<div className="flex flex-col">
							
							<span className={`text-gray-600 text-sm  dark:!text-white font-bold cursor-pointer ${
							sidebarOpen ? "scale-0 duration-200" : "-left-[58px] -top-[-15px]"
							  }`}

						onClick={() => {
							setSidebarOpen((prevVal) => !prevVal);
							
						}}>
								{user?.name}
								
							</span>
							<span className={`text-gray-600 text-xs  dark:!text-white font-body cursor-pointer ${
							sidebarOpen ? "scale-0 duration-200" : "-left-[58px] -top-[-15px]"
							  }`}

						onClick={() => {
							setSidebarOpen((prevVal) => !prevVal);
							
						}}>
								{user?.type}
							</span>
						</div>
						
				</div>					
			</div>
		</div>


	<div ref={fullScreenRef} className="h-[100vh] z-10 index-0 w-full overflow-auto bg-white flex flex-col ">

		
		<Header
			setsidebarOpen={sidebarOpen}
			setSidebarOpen={setSidebarOpen}
			toggleFullScreen={toggleFullScreen}
			/>
		{children}

		
	</div>





	<ToastContainer theme="colored" />


	<ConfirmLogoutModal logout={logout} ref={confirmLogoutRef} />


</div>
    );
};

export default AppLayout;
