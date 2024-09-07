import React from 'react';
import Axios from '../../../../../libs/axios';
import useSWR from 'swr';


//IN QUEUE 
const useNurseQueue = () => {
    const {
		data: pending,
		// error,
		// mutate,
	} = useSWR(
		"/v1/profile/sph-patient-queue",
		() =>
			Axios.get("/v1/profile/sph-patient-queue")
				.then((res) => {
					console.log("res.data clinic/sph-patient-queue", res.data);
					return res.data;
				})
				.catch((error) => {
					if (error.response.status !== 409) throw error;

					// mutate("/v1/profile/sph-patient-queue");
				}),
		{
			revalidateIfStale: true,
			revalidateOnFocus: true,
		}
	);
	const {
		data: pendingForRelease,
		// error,
		mutate: mutatePendingForRelease,
	} = useSWR(
		"/v1/clinic/his-pending-for-medicine-release",
		() =>
			Axios.get("/v1/clinic/his-pending-for-medicine-release")
				.then((res) => {
					console.log(
						"res.data clinic/his-pending-for-medicine-release",
						res.data
					);
					return res.data;
				})
				.catch((error) => {
					if (error.response.status !== 409) throw error;

					// mutate("/v1/profile/sph-patient-queue");
				}),
		{
			revalidateIfStale: true,
			revalidateOnFocus: true,
		}
	);

	const {
		data: nowServing,
		// error,
		// mutate,
	} = useSWR(
		"/v1/profile/sph-patient-queue",
		() =>
			Axios.get("/v1/profile/sph-patient-queue")
				.then((res) => {
					console.log("res.data clinic/sph-patient-queue", res.data);
					return res.data;
				})
				.catch((error) => {
					if (error.response.status !== 409) throw error;

					// mutate("/v1/profile/sph-patient-queue");
				}),
		{
			revalidateIfStale: true,
			revalidateOnFocus: true,
		}
	);

  return {
		pending,
		nowServing,
		pendingForRelease,
		mutatePendingForRelease,
	};
}

export default useNurseQueue
