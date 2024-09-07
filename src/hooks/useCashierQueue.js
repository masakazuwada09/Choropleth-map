import useSWR from "swr";
import Axios from "../libs/axios";


//Patient Queue
const useCashierQueue = () => {
	const {
		data: pending,
		// error,
		mutate: mutatePending,
	} = useSWR(
		"/v1/laboratory/get-queue?status=pending",
		() =>
			Axios.get("/v1/laboratory/get-queue")
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
		nowServing,
		mutateNowServing,
	};
};

export default useCashierQueue;
