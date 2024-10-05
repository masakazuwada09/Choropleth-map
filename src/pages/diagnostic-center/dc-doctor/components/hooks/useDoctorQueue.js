import useSWR from "swr";
import Axios from "../../../../../libs/axios";

const useDoctorQueue = () => {
	const {
		data: pending,
		// error,
		mutate: mutatePending,
	} = useSWR(
		"/v1/profile/diagnosis-patient-queue/",
		() =>
			Axios.get("/v1/profile/diagnosis-patient-queue")
				.then((res) => {
					console.log("RESULT_READINGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG", res.data);
					return res.data;
				})
				.catch((error) => {
					if (error.response.status !== 409) throw error;

					// mutate("/v1/clinic/doctor-pending-for-consultation");
				}),
		{
			revalidateIfStale: true,
			revalidateOnFocus: true,
		}
	);
	const {
		data: pendingForResultReading,
		// error,
		mutate: mutatePendingForResultReading,
	} = useSWR(
		"/v1/clinic/doctor-for-result-reading",
		() =>
			Axios.get("/v1/clinic/doctor-for-result-reading")
				.then((res) => {
					// console.log("res.data clinic/rhu-patient-queue", res.data);
					return res.data;
				})
				.catch((error) => {
					if (error.response.status !== 409) throw error;

					// mutate("/v1/clinic/doctor-pending-for-consultation");
				}),
		{
			revalidateIfStale: true,
			revalidateOnFocus: true,
		}
	);

	//IN SERVICE
	const {
		data: nowServing,
		// error,
		mutate: mutateNowServing,
	} = useSWR(
		"/v1/clinic/doctor-in-service-consultation",
		() =>
			Axios.get("/v1/clinic/doctor-in-service-consultation")
				.then((res) => {
					return res.data;
				})
				.catch((error) => {
					if (error.response.status !== 409) throw error;

					// mutate("/v1/clinic/doctor-pending-for-consultation");
				}),
		{
			revalidateIfStale: true,
			revalidateOnFocus: true,
		}
	);

	return {
		pending,
		pendingForResultReading,
		nowServing,
		mutatePending,
		mutatePendingForResultReading,
		mutateNowServing,
	};
};

export default useDoctorQueue;
