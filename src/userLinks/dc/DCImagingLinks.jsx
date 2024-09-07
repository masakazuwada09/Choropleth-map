/* eslint-disable react/prop-types */
import React from "react";
import MenuLink from "../../components/buttons/MenuLink";
import useLabQueue from "../../hooks/useLabQueue";

const DCImagingLinks = ({ isActive }) => {
	const { pending } = useLabQueue();
	return (
		<>
			
			<MenuLink
				to={``}
				active={isActive(``)}
				icon="rr-dashboard"
				text="Dashboard"
			/>
			<MenuLink
				to="/patients"
				active={isActive("/patients")}
				icon="rr-users"
				text="Patients"
			/>
			<MenuLink
				to="/patient-imaging-queue"
				active={isActive("/patient-imaging-queue")}
				icon="rr-clipboard-list-check"
				text="Patient Queue"
				counter={pending?.data?.length}
			/>
		</>
	);
};

export default DCImagingLinks;
