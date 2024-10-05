import { Link } from "react-router-dom";
import FlatIcon from "../FlatIcon";
import { useAuth } from "../../hooks/useAuth";
import ActionBtn from "../buttons/ActionBtn";
import Img from "../Img";
import ReferralsListModal from "../modal/ReferralsListModal";
import { useEffect, useState, useRef } from "react";
import useClinic from "../../hooks/useClinic";
import AcceptPatientModal from "../modal/AcceptPatientModal";
import UpdatePatientVitalsModal from "../modal/UpdatePatientVitalsModal";
import CloudServerModal from "../modal/CloudServerModal";
import { Disclosure, Menu, Popover, Transition } from '@headlessui/react'
import {ChevronRightIcon , PhoneIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import ConfirmLogoutModal from "../modal/ConfirmLogoutModal";
import MenuLink from "../buttons/MenuLink";
import {
	ArrowPathIcon,
	ChartPieIcon,
	CursorArrowRaysIcon,
	FingerPrintIcon,
	SquaresPlusIcon,
  } from '@heroicons/react/24/outline'



const Header = (props) => {
	const { setSidebarOpen, sidebarOpen } = props;
	const {  checkUserType } = useAuth();
	const { data } = useClinic();
	const referralListRef = useRef(null);
	const updateVitalRef = useRef(null);
	const acceptPatientRef = useRef(null);
	const confirmLogoutRef = useRef(null);
	const cloudServerRef = useRef(null);
	const { user, logout } = useAuth({
		middleware: "auth",
		redirectIfAuthenticated: "/",
	});
	if (user) {
		console.log("datadatadatuser", user);
	}

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const trigger = useRef(null);
	const dropdown = useRef(null);


	 const solutions = [
	
	  ]
	  const callsToAction = [
		{ name: 'Account Settings', href: '#', icon: PlayCircleIcon },
		{ name: 'Logout', href: '#', icon: PhoneIcon },
	  ]

	
	  const isActive = (name) => {
        if (name == "") {
            return location?.pathname == `/${String(user?.type).toLowerCase()}`;
        }
        return location?.pathname?.includes(name);
    };
	const toRHUword = (str) => {
		return str?.replace("RHU", "Rural Health Unit");
	};
	const updatePatientVital = (patient) => {
		updateVitalRef.current.show(patient);
	};


	
		
	  
		// close on click outside
		useEffect(() => {
		  const clickHandler = ({ target }) => {
			if (!dropdown.current) return;
			if (
			  !dropdownOpen ||
			  dropdown.current.contains(target) ||
			  trigger.current.contains(target)
			)
			  return;
			setDropdownOpen(false);
		  };

		  document.addEventListener("click", clickHandler);
		  return () => document.removeEventListener("click", clickHandler);
		});
	  
		// close if the esc key is pressed
		useEffect(() => {
		  const keyHandler = ({ keyCode }) => {
			if (!dropdownOpen || keyCode !== 27) return;
			setDropdownOpen(false);
		  };
		  document.addEventListener("keydown", keyHandler);
		  return () => document.removeEventListener("keydown", keyHandler);
		});

		useEffect(() => {
			const savedTheme = localStorage.getItem("theme");
			const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
	
			if (savedTheme) {
				document.documentElement.classList.toggle("dark", savedTheme === "dark");
			} else {
				document.documentElement.classList.toggle("dark", prefersDarkScheme);
			}
		}, []);


{/*Theme*/}


const toggleTheme = () => {
	const isDarkMode = document.documentElement.classList.toggle("dark");
	localStorage.setItem("theme", isDarkMode ? "dark" : "light");
};



	return (
		<>
			<div className="flex ">
				<div className=" h-full w-full dark:!bg-blue-500 duration-500 dark:text-white  duration-400 drop-shadow-[0_0px_20px_rgba(0,0,0,0.10)] border-b ">
					<div className="flex gap-2 w-full justify-between px-5 py-3 ">
						<div className="flex flex-row">
						
							<div
							className={`text-gray-600 dark:!text-white text-xl cursor-pointer  ${
								sidebarOpen ? "" : " -left-[4px] absolute opacity-90  "
								  }`}
								  onClick={() => {
									setSidebarOpen((prevVal) => !prevVal);	
								}}
							>
								<FlatIcon
									
									icon="fi fi-rr-menu-burger"
								
								/>
								
								
							</div>
							<span
								className="dark:!text-white text-gray-500 font-bold text-md font-mono flex items-center "
							>
								
								{user?.type}
							</span>
							{checkUserType("nurse") ? (
							<>
								<div
									className="ml-4 flex items-center gap-2 mr-2 px-3 mt-2 mb-2 text-sm font-light dark:!text-white text-gray-700 hover:bg-blue-900 hover:bg-opacity-20 cursor-pointer  rounded-xl border border-gray-500 dark:!border-white border-opacity-20 dark:!border-opacity-20"
									onClick={() => {
										cloudServerRef.current.show();
									}}
								>
									<FlatIcon
										icon="rr-network-cloud"
										className="text-base"
									/>
									<span className="hidden lg:block">
										Cloud Server
									</span>
								</div>
								<div
									className="ml-4 flex items-center gap-2 mr-2 px-3 mt-2 mb-2 text-sm font-light dark:!text-white text-gray-700 hover:bg-blue-900 hover:bg-opacity-20 cursor-pointer  rounded-xl border border-gray-500 dark:!border-white border-opacity-20 dark:!border-opacity-20"
									onClick={() => {
										referralListRef.current.show();
									}}
								>
									<FlatIcon icon="rr-bells" />
									Patient Referrals
									{data?.referrals?.length ? (
										<div className="relative">
											<span className="bg-red-600 animate-ping absolute text-white w-full h-full rounded-full z-10"></span>
											<span className="bg-red-600 text-white z-20 px-2 rounded-full">
												{data?.referrals?.length}
											</span>
										</div>
									) : (
										""
									)}
								</div>
							</>
						) : (
							""
						)}
						
						</div>


			
		


	


	






						{/* <div className="mb- flex ml-4 justify-center items-center bg-primary-dark bg-opacity-10 py-4">
							<Img
								src={user?.avatar}
								type="user"
								name={user?.name}
								className="h-10 w-10 rounded border border-white"
							/>
							 
						</div> 

						{/* <div className="ml-4 flex items-center gap-2 text-white cursor-pointer ">
						<ActionBtn
							type="foreground"
							onClick={logout}
							className="gap-2 bg-opacity-10 !text-blue-100 text- rounded-xl"
						>
							Logout
							<FlatIcon icon="rr-sign-out-alt" />
						</ActionBtn>
					</div> */}
					</div>
				</div>
			</div>
			<ReferralsListModal
				ref={referralListRef}
				acceptPatientRef={acceptPatientRef}
				updatePatientVital={updatePatientVital}
			/>
			<AcceptPatientModal ref={acceptPatientRef} />
			<ConfirmLogoutModal logout={logout} ref={confirmLogoutRef} />
			<UpdatePatientVitalsModal ref={updateVitalRef} />
			<CloudServerModal staticModal={false} ref={cloudServerRef} />
		</>
	);
};

export default Header;
