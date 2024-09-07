import FlatIcon from "./FlatIcon";

const InfoTextForPrint = ({
	className = "",
	labelClassName = "",
	contentClassName = "",
	icon,
	title,
	value,
	...rest
}) => {
	return (
		<div
			className={`flex flex-col sm:flex-row items-center capitalize font-mono ${className}`}
			{...rest}
		>
			<label
				className={`w-full text-placeholder flex text-xs font-light border-opacity-50 capitalize text-slate-800 lg:col-span-2  ${labelClassName}`}
			>
				{icon ? <FlatIcon icon={icon} className="mr-1 " /> : ""} {title}:
			</label>

				<div
					contentEditable
					className={`rounded-md  px-1 text-xs font-light border-r border-l  border-slate-300 capitalize lg:col-span-1 items-center ${contentClassName}`}
					onInput={(e) => {
						// Use a regular expression to remove non-numeric characters
						const currentText = e.currentTarget.innerText;
						const numericText = currentText.replace(/[^0-9]/g, '');
						if (currentText !== numericText) {
							e.currentTarget.innerText = numericText;
						}
					}}
				>
					{value || (
						<>
							<span className="text-slate-800 font-normal text-xs italic"></span> &nbsp;
						</>
					)}
				</div>

		</div>
	);
};

export default InfoTextForPrint;
