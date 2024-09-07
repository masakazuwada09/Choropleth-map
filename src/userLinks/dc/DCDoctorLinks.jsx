import React from 'react'
import useLabQueue from '../../hooks/useLabQueue';
import useReferralQueue from '../../hooks/useReferralQueue';
import MenuLink from '../../components/buttons/MenuLink';

const DCDoctorLinks = ({ isActive }) => {
    const { pending } = useLabQueue();
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

			<MenuLink
				to="/patient-queue"
				active={isActive("/patient-queue")}
				icon="rr-clipboard-list-check"
				text="Patient Queue"
				counter={pending?.data?.length}
			/>
			
			
			
		</>
  )
}

export default DCDoctorLinks
