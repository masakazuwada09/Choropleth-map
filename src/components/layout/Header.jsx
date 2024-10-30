import FlatIcon from "../FlatIcon";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import ReferralsListModal from "../modal/ReferralsListModal";
import AcceptPatientModal from "../modal/AcceptPatientModal";
import CloudServerModal from "../modal/CloudServerModal";
import UpdatePatientVitalsModal from "../modal/UpdatePatientVitalsModal";
import ConfirmLogoutModal from "../modal/ConfirmLogoutModal";
import ActionBtn from "../buttons/ActionBtn";

const Header = (props) => {
    const { setSidebarOpen, sidebarOpen, toggleFullScreen } = props;
    const { user, logout } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });

    const referralListRef = useRef(null);
    const updateVitalRef = useRef(null);
    const acceptPatientRef = useRef(null);
    const confirmLogoutRef = useRef(null);
    const cloudServerRef = useRef(null);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const trigger = useRef(null);
    const dropdown = useRef(null);

    // Toggle theme functionality
    const toggleTheme = () => {
        const isDarkMode = document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    };

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

    return (
        <>
            <div className="flex w-full ">
                <div className="h-full w-screen dark:bg-blue-500 duration-500 dark:text-white drop-shadow-[0_0px_20px_rgba(0,0,0,0.10)]">
                    <div className="flex gap-2 w-full justify-between px-1 py-3">
                        <div className="flex flex-row">
                            <div
                                className={`text-gray-600 dark:text-white text-xl flex cursor-pointer ${sidebarOpen ? "" : "items-center"}`}
                                onClick={() => setSidebarOpen((prevVal) => !prevVal)}  // This should toggle sidebarOpen
                            >
                                <FlatIcon icon="fi fi-bs-menu-dots-vertical" />
                            </div>
                            <span className="dark:text-white text-gray-500 font-bold text-md font-mono flex items-center">
                                {user?.type}
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            

                            <ActionBtn
                                onClick={toggleFullScreen}  // Toggle Fullscreen Button
                                 icon="fi fi-ss-expand"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                            >
                                Toggle Fullscreen
                            </ActionBtn>
                        </div>
                    </div>
                </div>
            </div>

            <ReferralsListModal ref={referralListRef} acceptPatientRef={acceptPatientRef} />
            <AcceptPatientModal ref={acceptPatientRef} />
            <ConfirmLogoutModal logout={logout} ref={confirmLogoutRef} />
            <UpdatePatientVitalsModal ref={updateVitalRef} />
            <CloudServerModal ref={cloudServerRef} />
        </>
    );
};

export default Header;

