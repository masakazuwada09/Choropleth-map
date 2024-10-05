/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { forwardRef } from "react";
import Select, { components } from "react-select";
import AsyncSelect from "react-select/async";

const customStyles = {
	option: (provided, state) => {
		return {
			...provided,
			cursor: "pointer",
			color: state.isSelected ? "red" : "blue",
		};
	},
	control: () => ({
		// none of react-select's styles are passed to <Control />
	}),
	singleValue: (provided, state) => {
		const opacity = state.isDisabled ? 0.5 : 1;
		const transition = "opacity 300ms";
		return { ...provided, opacity, transition };
	},
};

const customOption = (props) => (
	<div
		className={`p-2 border-b first:rounded-t last:rounded-b last:border-b-0
		 hover:bg-slate-100 hover:text-darker duration-200 cursor-pointer ${
				props?.isSelected ? "!bg-blue-500 !text-white" : ""
			} ${
			props?.data?.disabled
				? "opacity-20 cursor-not-allowed pointer-events-none"
				: ""
		}`}
		{...props?.innerProps}
	>
		<div className="font-semibold">{props?.label}</div>
		{props?.data?.description ? (
			<div style={{ fontSize: "0.8em" }} className="opacity-70">
				{props.data.description}
			</div>
		) : (
			""
		)}
	</div>
);

const Control = ({ children, ...props }) => (
	<components.Control {...props} name="sample">
		<div
			className={`${props.selectProps?.controlClassName} flex flex-row border`}
		>
			{children}
		</div>
	</components.Control>
);

const ReactSelectInputField = (props, ref) => {
	const {
		className,
		inputClassName,
		label,
		id,
		value,
		icon,
		options,
		iconClassName,
		async = false,
		selectClassName = "",
		placeholder,
		error,
		onChange,
		onChangeGetData,
		isLoading,
		isClearable = true,
		isMulti = false,
		loading = false,
		getOptions, // [{label, value}]
		...rest
	} = props;

	const promiseOptions = async (inputValue) =>
		new Promise((resolve) => {
			setTimeout(async () => {
				// console.log("getOptions(inputValue)", getOptions(inputValue));
				let options_ = await getOptions(inputValue);
				resolve(options_);
			}, 300);
		});
	console.log("optionsoptions", options);
	return (
		<form className={`${className} w-full text-xs `} autoComplete="off">
			<label className="w-full ">
				{label && (
					<span
						className={`text-gray-700 dark:text-gray-700 mb-1 font-roboto ${
							error ? "text-danger" : "text-slate-600"
						}`}
					>
						{label}
					</span>
				)}

				{icon && <span className={` ${iconClassName}`}>{icon}</span>}

				{loading ? (
					<div
						className={`${
							label && "mt-2"
						} h-11 bg-slate-200 animate-pulse`}
					/>
				) : async ? (
					<AsyncSelect
						styles={customStyles}
						ref={ref}
						id={id}
						loadOptions={promiseOptions}
						// defaultOptions
						isClearable={isClearable}
						value={
							value
								? options?.find((item) => item.value === value)
								: ""
						}
						classNamePrefix="react-select"
						className={`react-select-container text-xs  ${selectClassName}`}
						controlClassName={`text-xs flex flex-row  duration-200 ${
							icon && "pl- "
						} ${error ? "error-input" : "default-input"} ${
							label && "mt-2"
						} ${inputClassName}`}
						onChange={(val) => {
							console.log("valval", val);
							if (onChange) onChange(val?.value || "");
							if (onChangeGetData) onChangeGetData(val);
						}}
						// options={options ?? []}
						placeholder={placeholder}
						components={{ Control, Option: customOption }}
						isLoading={isLoading}
						{...rest}
					/>
				) : (
					<Select
						styles={customStyles}
						ref={ref}
						id={id}
						isClearable={isClearable}
						value={
							isMulti
								? value
								: value
								? options.find((item) => item.value === value)
								: ""
						}
						classNamePrefix="react-select"
						className={`react-select-container text-xs ${selectClassName}`}
						controlClassName={`text-xs flex flex-row duration-200 overflow-auto max-h-[300px] ${
							icon && " "
						} ${error ? "error-input " : "default-input"} ${
							label && "mt-2 text-xs "
						} ${inputClassName}`}
						onChange={(val) => {
							console.log("valval", val);
							if (isMulti) {
								if (onChange) onChange(val || "");
							} else {
								if (onChange) onChange(val?.value || "");
								if (onChangeGetData) onChangeGetData(val);
							}
						}}
						options={options}
						placeholder={placeholder}
						components={{ Control, Option: customOption }}
						isLoading={isLoading}
						isMulti={isMulti}
						{...rest}
					/>
				)}

				{error && <div className="text-red-500 pt-1">{error}</div>}
			</label>
		</form>
	);
};
export default forwardRef(ReactSelectInputField);
