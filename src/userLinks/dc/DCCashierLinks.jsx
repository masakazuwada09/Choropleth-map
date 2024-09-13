/* eslint-disable react/prop-types */
import React from "react";
import MenuLink from "../../components/buttons/MenuLink";
import useMDQueue from "../../hooks/useMDQueue";

const DCCashierLinks = ({ isActive }) => {
	const { pending } = useMDQueue();
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
				to="/patient-receipt"
				active={isActive("/patient-receipt")}
				icon="rr-clipboard-list-check"
				text="Patient Receipt"
				counter={parseInt(pending?.data?.length)}
			/>
			<MenuLink
				to="/laboratory-tests-rate"
				active={isActive("/laboratory-tests-rate")}
				icon="rr-microscope"
				text="Lab Tests Rate"
			/>
			<MenuLink
				to="/discounts"
				active={isActive("/discounts")}
				icon="rr-microscope"
				text="Discounts"
			/>
			{/* <MenuLink
				to="/consignments"
				active={isActive("/consignments")}
				icon="rr-truck-side"
				text="Consignments"
			/> */}
			{/* <MenuLink
				to="/inventory"
				active={isActive("/inventory")}
				icon="rr-boxes"
				text="Inventory"
			/> */}
		</>
	);
};

export default DCCashierLinks;
