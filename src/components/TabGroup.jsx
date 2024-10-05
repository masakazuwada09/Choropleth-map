/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/prop-types */
import { Tab } from "@headlessui/react";
import React, { Fragment, useState } from "react";

import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import FlatIcon from "./FlatIcon";
import { Fade } from "react-reveal";

const LeftArrow = ({ className }) => {
	const { isFirstItemVisible, scrollPrev } =
		React.useContext(VisibilityContext);

	return (
		<div
			className={`${
				className
					? className
					: "h-full flex items-center px-3 duration-200 border-r cursor-pointer absolute top-0 bg-white z-10 "
			}`}
			disabled={isFirstItemVisible}
			onClick={() => scrollPrev()}
		>
			<FlatIcon
				icon="rr-angle-circle-left"
				className={`text-lg ${
					isFirstItemVisible ? " opacity-10" : " opacity-100 "
				}`}
			/>
		</div>
	);
};

const RightArrow = ({ className }) => {
	const { isLastItemVisible, scrollNext } =
		React.useContext(VisibilityContext);

	return (
		<div
			className={`${
				className
					? className
					: "h-full flex items-center px-3 duration-200 border-l cursor-pointer absolute top-0 bg-white z-10 right-0"
			}`}
			onClick={() => scrollNext()}
		>
			<FlatIcon
				icon="rr-angle-circle-right"
				className={`text-lg ${
					isLastItemVisible ? " opacity-10" : " opacity-100"
				}`}
			/>
		</div>
	);
};

const TabGroup = ({
	tabClassName = "",
	arrowClassName = "",
	contentClassName = "",
	scrollContainerClassName = "",
	contents,
	titleChildren,
}) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	return (
		<Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
			<Tab.List as="div" className={`relative ${tabClassName}`}>
				<ScrollMenu
					LeftArrow={LeftArrow}
					RightArrow={RightArrow}
					scrollContainerClassName={`px-[60px] gap-2 overflow-x-hidden ${scrollContainerClassName}`}
				>
					{contents.map(({ title, i }, index) => (
						<Tab
							as={"div"}
							key={`tab-g-${index}`}
							className={`outline-0`}
						>
							{({ selected }) => (
								<div
									className={`outline-0 rounded-2xl relative px-2 w-[170px] py-2 duration-200  flex gap-2 justify-center items-center bg-white cursor-pointer hover:bg-primary/[0.1] ${
										selected
											? " shadow-lg  text-slate-800 border border-teal-400"
											: " text-xs border border-transparent"
									}`}
								>
									{typeof title == "function"
										? title({
												selectedIndex: selectedIndex,
												setSelectedIndex:
													setSelectedIndex,
										  })
										: title}
								</div>
							)}
						</Tab>
					))}
					{titleChildren}
				</ScrollMenu>
			</Tab.List>
			<Tab.Panels>
				{contents.map(({ content, i }, index) => (
					<Tab.Panel
						key={`tab-p-${index}`}
						data-headlessui-state={
							selectedIndex == i ? "selected" : ""
						}
						as="div"
						className={`px-1 duration-200 text-base rounded-xl  flex flex-col ${contentClassName} ${
							contentClassName.includes("")
								? ""
								: ""
						}`}
					>
						{typeof content == "function"
							? content({
									selectedIndex: selectedIndex,
									setSelectedIndex: setSelectedIndex,
							  })
							: content}
					</Tab.Panel>
				))}
			</Tab.Panels>
		</Tab.Group>
	);
};

export default TabGroup;
