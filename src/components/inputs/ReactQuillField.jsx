/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { forwardRef } from "react";
import ReactQuill from "react-quill";
import { Fade } from "react-reveal";

const ReactQuillField = (props, ref) => {
	const {
		id,
		type = "text",
		label,
		labelClassName = "",
		placeholder = "Enter you notes here.",
		className = "",
		disabled = false,
		inputClassName = "",
		error,
		icon,
		defaultValue,
		register,
		value,
		...rest
	} = props;
	return (
		<div
			className={`${className ? className : ""} ${
				disabled ? "opacity-30 pointer-events-none" : ""
			} !duration-300`}
		>
			{label ? (
				<label
					htmlFor={id}
					className={`block mb-2 text-sm font-medium ${labelClassName} ${
						error
							? "text-red-700 dark:text-red-500"
							: "text-gray-700 dark:text-gray-700"
					}`}
				>
					{label}
				</label>
			) : (
				""
			)}
			<div className="relative w-full">
				<ReactQuill
					id={id}
					ref={ref || register}
					theme="snow"
					// value={editDiagnosisNotes}
					placeholder={placeholder}
					{...rest}
					// onChange={(e) => seteditDiagnosisNotes(e)}
					style={{
						border: 0,
					}}
					className={`${
						!error
							? " text-gray-900 text-sm border !border-transparent focus:ring-blue-500 focus:!bg-white focus:border-blue-500 block w-full"
							: "border-red-500 text-red-900 placeholder-red-700 text-sm border focus:ring-red-500 focus:!bg-white w-full"
					} !bg-opacity-60 text-sm duration-200 ${
						icon ? "pl-0" : " pl-0"
					} ${inputClassName ? inputClassName : ""} ${
						rest?.disabled
							? "opacity-50 cursor-none pointer-events-none"
							: ""
					}`}
				/>

				{/* <input
					type={type}
					id={id}
					value={value}
					defaultValue={defaultValue}
					ref={ref || register}
					disabled={disabled}
					className={`${
						!error
							? "bg-gray-50 border border-border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:!bg-white focus:border-blue-500 block w-full pr-3 py-2.5"
							: "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:!bg-white pr-3 py-2.5 w-full"
					} !bg-opacity-60 text-sm duration-200 ${
						icon ? "pl-10" : " pl-3"
					} ${inputClassName ? inputClassName : ""} ${
						rest?.disabled ? "opacity-50" : ""
					}`}
					{...rest}
				/> */}
			</div>
			{typeof error == "string" ? (
				<p className="mt-2 text-sm text-red-600 dark:text-red-500 mb-0">
					{error}
				</p>
			) : (
				""
			)}
			{error?.message ? (
				<p className="mt-2 text-sm text-red-600 dark:text-red-500 mb-0">
					{error?.message}
				</p>
			) : (
				""
			)}
		</div>
	);
};

export default forwardRef(ReactQuillField);