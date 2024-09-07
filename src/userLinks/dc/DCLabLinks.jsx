/* eslint-disable react/prop-types */
import MenuLink from "../../components/buttons/MenuLink";
import useLabQueue from "../../hooks/useLabQueue";

const DCLabLinks = ({ isActive }) => {
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
				text="Laboratory Results"
			/>
			<MenuLink
				to="/patient-lab-queue"
				active={isActive("/patient-lab-queue")}
				icon="rr-microscope"
				text="Laboratory Queue"
				counter={pending?.data?.length}
			/>
		</>
	);
};

export default DCLabLinks;
