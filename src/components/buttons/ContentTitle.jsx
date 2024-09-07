const ContentTitle = ({ title, children }) => {
	return (
		<>
			<div className="flex items-center gap-4">
				<h5 className="text-md text-left font-bold  text-gray-600 mb-0">
					{title}
				</h5>
				{children}
			</div>
			
		</>
	);
};

export default ContentTitle;
