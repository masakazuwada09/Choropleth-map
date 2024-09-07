import { Tab } from "@headlessui/react";
import { Fragment, useState } from "react";
const TabGroupHorizontal = ({
	tabClassName,
	contentClassName = "",
	contents,
}) => {
	/* 
    
    [
        {
            title: NODE,
            content: NODE
        }
    ]

    */
	const [selectedIndex, setSelectedIndex] = useState(0);
	return (
		<Tab.Group
			as="div"
			className="flex"
			selectedIndex={selectedIndex}
			onChange={setSelectedIndex}
		>
			<Tab.List
				as="div"
				className=" border-r flex flex-col pr-3 pb-3  gap-3   min-w-[252px]"
			>
				{contents.map(({ title }, i) => (
					<Tab as={Fragment} key={`tab-g-${i}`}>
						{({ selected }) => (
							<div
								className={`px-3 py-2 duration-200 text-base rounded-lg flex gap-2 cursor-pointer hover:bg-primary/[0.2] ${
									selected
										? "bg-primary/[0.2] text-primary border border-secondary/25"
										: "border border-transparent"
								}`}
							>
								{title}
							</div>
						)}
					</Tab>
				))}
			</Tab.List>
			<Tab.Panels as="div" className="w-full">
				{contents.map(({ content }, i) => (
					<Tab.Panel
						key={`tab-p-${i}`}
						data-headlessui-state={
							selectedIndex == i ? "selected" : ""
						}
						as="div"
						className={`p-0 duration-200 text-base rounded-xl flex flex-col overflow-auto ${contentClassName} ${
							contentClassName?.includes("max-h")
								? ""
								: "min-h-[288px] max-h-[calc(100vh-428px)]"
						}`}
					>
						{content}
					</Tab.Panel>
				))}
			</Tab.Panels>
		</Tab.Group>
	);
};

export default TabGroupHorizontal;
