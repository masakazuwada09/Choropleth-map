import { Disclosure, Transition } from "@headlessui/react";
import FlatIcon from "./FlatIcon";
import ActionBtn from "./buttons/ActionBtn";

const CollapseDiv = ({
	title = "Title",
	children,
	headerClassName = "",
	bodyClassName = "",
	defaultOpen = false,
	
	
}) => {
	return (
		<Disclosure
			as={"div"}
			className="  border-gray-300 duration-200  "
			defaultOpen={defaultOpen}
		>
			{({ open }) => (
				<>

				
					<Disclosure.Button
						as="div"
						className={`bg-gray-100 p-3 gap-2 text-sm font-bold flex items-center cursor-pointer shadow-lg ${
							!open && ""
						} ${headerClassName}`}

						
					>
						
						{title}
						<FlatIcon
										
										icon="fi fi-rs-cursor-finger"
										className={`text-sm text-gray-500 duration-100  ${
											open ? "rotate-180 duration-400 " : ""
										} duration-200`}
									/>
						<div className="flex items-center justify-center ml-auto text-gray-400 text-xs">
							
						
									
						</div>
						
					</Disclosure.Button>

					<Transition
						show={open}
						enter="transition duration-300 ease-out"
						enterFrom="transform scale-100 opacity-0"
						enterTo="transform scale-100 opacity-100"
						leave="transition duration-200 ease-out"
						leaveFrom="transform scale-100 opacity-100"
						leaveTo="transform scale-100 opacity-0"
					>
						<Disclosure.Panel
							as="div"
							className={`p-3 ${bodyClassName} ` }
						>
							
							{children}
							
						</Disclosure.Panel>


				

					</Transition>
				</>
			)}
		</Disclosure>
	);
};

export default CollapseDiv;
