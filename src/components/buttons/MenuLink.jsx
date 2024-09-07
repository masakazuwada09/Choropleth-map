import React, {useState} from "react";
import { Link } from "react-router-dom";
import FlatIcon from "../FlatIcon";
import { useAuth } from "../../hooks/useAuth";

const MenuLink = ({
	active = false,
	to = "",
	icon,
	text,
	counter = 0,
	
	
	...rest
}) => {
	const { user } = useAuth();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	let base_url = `/${String(user?.type).toLowerCase()}`;
	return (
		<Link to={`${base_url}${to}`} {...rest}>
			<div
				className={`bg-blue-400 overflow-hidden bg-opacity-0 hover:bg-opacity-10 cursor-pointer py-3 px-4 flex items-center text-gray-500 gap-3 duration-200  ${
					active ? " !bg-opacity-10 " : ""
				}`} 
				
				
			>
				<span className={`text-gray-600 text-sm  dark:text-white font-bold cursor-pointer ${
						sidebarOpen ? " text-sm  duration-500" : " lg:!text-lg px-4  "
						  }`}
						  >
					<FlatIcon icon={icon} />
				</span>
				<span className={`text-gray-600 text-sm duration-500  dark:!text-white font-md cursor-pointer ${
						sidebarOpen ? "scale-0 duration-500" : "ml-[6px]  duration-500 "
						  }`}
						  >{text}</span>
				{counter == 0 ? (
					""
				) : (
					<div className="relative">
						<span className="bg-red-600 animate-ping absolute text-white w-full h-full rounded-full z-10"></span>
						<span className="bg-red-600 text-white z-20 px-2 rounded-full">
							{counter}
						</span>
					</div>
				)}
			</div>
		</Link>
	);
};

export default MenuLink;
