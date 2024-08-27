import useSWR from "swr";
import Axios from "../libs/axios";

const usePharmaQueue = () => {
	const {
		data: pending,
		// error,
		mutate: mutatePending,
	} = useSWR(
		"/v1/clinic/pharmacy-pending-signal-for-release?status=pending",
		() =>
			Axios.get("/v1/clinic/pharmacy-pending-signal-for-release")
				.then((res) => {
					return res.data;
				})
				.catch((error) => {
					if (error.response.status !== 409) throw error;

					// mutate("/v1/laboratory/get-queue");
				}),
		{
			revalidateIfStale: false,
			revalidateOnFocus: true,
		}
	);
	const {
		data: pendingMedsRelease,
		// error,
		mutate: mutatePendingMedsRelease,
	} = useSWR(
		"/v1/clinic/pharmacy-pending-medicine-release?status=pending",
		() =>
			Axios.get("/v1/clinic/pharmacy-pending-medicine-release")
				.then((res) => {
					return res.data;
				})
				.catch((error) => {
					if (error.response.status !== 409) throw error;

					// mutate("/v1/laboratory/get-queue");
				}),
		{
			revalidateIfStale: false,
			revalidateOnFocus: true,
		}
	);

	const {
		data: nowServing,
		// error,
		mutate: mutateNowServing,
	} = useSWR(
		"/v1/laboratory/get-queue",
		() =>
			Axios.get("/v1/laboratory/get-queue")
				.then((res) => {
					console.log("res.data clinic/rhu-patient-queue", res.data);
					return res.data;
				})
				.catch((error) => {
					if (error.response.status !== 409) throw error;

					// mutate("/v1/laboratory/get-queue");
				}),
		{
			revalidateIfStale: false,
			revalidateOnFocus: true,
		}
	);

	return {
		pending,
		mutatePending,
		pendingMedsRelease,
		mutatePendingMedsRelease,
		// nowServing,
		// mutateNowServing,
	};
};

export default usePharmaQueue;
