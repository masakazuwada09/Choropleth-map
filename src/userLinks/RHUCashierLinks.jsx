/* eslint-disable react/prop-types */
import MenuLink from "../components/buttons/MenuLink";
import useCashierQueue from "../hooks/useCashierQueueOLD";

const RHUCashierLinks = ({ isActive }) => {
	const { pending } = useCashierQueue();
	return (
		<>
			<span className="text-xs font-light text-white	pt-3 pb-1 px-2 w-full border-t border-t-black border-opacity-10">
				Main Menu
			</span>
			<MenuLink
				to={``}
				active={isActive(``)}
				icon="rr-dashboard"
				text="Dashboard"
			/>
			<MenuLink
				to="/patient-cashier-queue"
				active={isActive("/patient-cashier-queue")}
				icon="rr-clipboard-list-check"
				text="Patient Queue"
				counter={parseInt(pending?.data?.length)}
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

export default RHUCashierLinks;
