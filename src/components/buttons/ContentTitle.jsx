const ContentTitle = ({ title, children }) => {
	return (
		<>
			<div className="flex items-center gap-4 w-full">
				<h5 className="text-md text-left font-bold  text-teal-700 mb-0">
					{title}
				</h5>
				{children}
			</div>
			
		</>
	);
};

export default ContentTitle;
