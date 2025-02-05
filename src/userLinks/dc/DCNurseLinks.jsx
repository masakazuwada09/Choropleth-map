import React from 'react'
import useDoctorQueue from '../../hooks/useDoctorQueue';
import useERQueue from '../../hooks/useERQueue';
import useReferralQueue from '../../hooks/useReferralQueue';
import MenuLink from '../../components/buttons/MenuLink';

const DCNurseLinks = ({ isActive }) => {
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
				to="/nurse-queue"
				active={isActive("/nurse-queue")}
				icon="rr-clipboard-list-check"
				text="Nurse Queue"
				counter={pending?.data?.length}
			/>
			<MenuLink
				to="/laboratory-tests"
				active={isActive("/laboratory-tests")}
				icon="rr-microscope"
				text="Laboratory Tests"
			/>
			<MenuLink
				to="/imaging-tests"
				active={isActive("/imaging-tests")}
				icon="fi fi-rr-skeleton"
				text="Imaging Tests"
			/>
			<MenuLink
				to="/map-municipalities"
				active={isActive("/map-municipalities")}
				icon="fi fi-rr-map"
				text="Map Municipalities"
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

export default DCNurseLinks
