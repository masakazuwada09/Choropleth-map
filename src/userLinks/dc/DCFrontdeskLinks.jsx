import React from 'react'
import useDoctorQueue from '../../hooks/useDoctorQueue';
import useERQueue from '../../hooks/useERQueue';
import useReferralQueue from '../../hooks/useReferralQueue';
import MenuLink from '../../components/buttons/MenuLink';

const DCFrontdeskLinks = ({ isActive }) => {
    const { pending } = useERQueue();
	// const { pending: referralsPending, pendingPrescription } =
	// 	useReferralQueue();
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

			{/* <MenuLink
				to="/telemedicine"
				active={isActive("/telemedicine")}
				icon="rr-wifi"
				text="TeleMedicine"
			/> */}
			<MenuLink
				to="/frontdesk-queue"
				active={isActive("/frontdesk-queue")}
				icon="rr-clipboard-list-check"
				text="Front Desk Queue"
				counter={pending?.data?.length}
			/>
			{/* <MenuLink
				to="/surgical-queue"
				active={isActive("/surgical-queue")}
				icon="rr-clipboard-list-check"
				text="Surgical Queue"
				counter={pending?.data?.length}
			/> */}
			{/* <MenuLink
				to="/patient-referrals"
				active={isActive("/patient-referrals")}
				icon="rr-chart-user"
				text="Patient Referrals"
				counter={
					parseInt(referralsPending?.data?.length) +
					parseInt(pendingPrescription?.data?.length)
				}
			/> */}
			{/* <MenuLink
				to="/teleconsult"
				active={isActive("/patient-queue")}
				icon="rr-clipboard-list-check"
				text="Tele-consult"
				// counter={pending?.data?.length}
			/> */}
		</>
  )
}

export default DCFrontdeskLinks
