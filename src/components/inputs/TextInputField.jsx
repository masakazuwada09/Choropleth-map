/* eslint-disable react/prop-types */
import React, { forwardRef } from "react";

const TextInputField = (props, ref) => {
	const {
		id,
		type = "text",
		label,
		labelClassName = "",
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
				disabled ? "opacity-30 pointer-events-none " : ""
			} !duration-300`}
		>
			{label ? (
				<label
					htmlFor={id}
					className={`block mb-2 text-sm font-medium   ${labelClassName} ${
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
			<div className="relative w-full flex items-center">
				{icon ? (
					<span className="absolute left-0 mb-0 text-placeholder px-3 mt-1 ">
						{icon}
					</span>
				) : (
					""
				)}

				<input
					type={type}
					id={id}
					value={value}
					defaultValue={defaultValue}
					ref={ref || register}
					disabled={disabled}
					className={`${
						!error
							? "bg-gray-50 text-xs  border border-border text-gray-900 focus:ring-blue-500 focus:!bg-white focus:border-blue-500 block w-full pr-1 py-1"
							: "bg-red-50 border  border-red-500 text-red-900 placeholder-red-700 text-sm  focus:ring-red-500 focus:!bg-white pr-1 py-1 w-full"
					} !bg-opacity-60 text-sm duration-200 ${
						icon ? "pl-10" : " pl-3"
					} ${inputClassName ? inputClassName : ""} ${
						rest?.disabled ? "opacity-50 " : ""
					}`}
					{...rest}
				/>
			</div>
			{error ? (
				<p className="mt-2 text-sm text-red-600 dark:text-red-500 mb-0">
					{error}
				</p>
			) : (
				""
			)}
		</div>
	);
};

export default forwardRef(TextInputField);
