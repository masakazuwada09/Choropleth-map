/* eslint-disable react/prop-types */
import MenuLink from "../../components/buttons/MenuLink";
import usePharmaQueue from "../../hooks/usePharmaQueue";

const DCPharmacyLinks = ({ isActive }) => {
	const { pending, pendingMedsRelease } = usePharmaQueue();
	return (
		<>
			
			<MenuLink
				to={``}
				active={isActive(``)}
				icon="rr-dashboard"
				text="Dashboard"
			/>
			<MenuLink
				to="/patient-pharmacy-queue"
				active={isActive("/patient-pharmacy-queue")}
				icon="rr-clipboard-list-check"
				text="Patient Queue"
				counter={
					parseInt(pending?.data?.length) +
					parseInt(pendingMedsRelease?.data?.length)
				}
			/>
			<MenuLink
				to="/consignments"
				active={isActive("/consignments")}
				icon="rr-truck-side"
				text="Consignments"
			/>
			<MenuLink
				to="/inventory"
				active={isActive("/inventory")}
				icon="rr-boxes"
				text="Inventory"
			/>
		</>
	);
};

export default DCPharmacyLinks;
