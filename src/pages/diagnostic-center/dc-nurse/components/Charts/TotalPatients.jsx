/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { calculateBPMeasurement } from "../../../../../libs/helpers";
/* const data = [
	{
		systolic: 110,
		diastolic: 80,
		time: "9:00 PM",
	},
	{
		systolic: 120,
		diastolic: 90,
		time: "10:00 PM",
	},
	{
		systolic: 100,
		diastolic: 80,
		time: "11:00 PM",
	},
	{
		systolic: 130,
		diastolic: 90,
		time: "12:00 PM",
	},
]; */
const CustomTooltip = ({ active, payload, label }) => {
	const getValue = (v) => {
		return <span className={`font-bold`}>{v} °C</span>;
	};
	console.log("payload", payload);
	if (active && payload && payload.length) {
		/* 		let v = parseFloat(payload[0].value);
		let color = "text-temp-normal";
		 */
		return (
			<div className="bg-white rounded-xl shadow flex flex-col gap-y-1 p-2 items-center justify-center">
				<label className="text-sm mb-0 text-secondary">
					{payload[0]?.payload?.time}
				</label>
				<label className="text-xl font-bold mb-0">
					{payload[0]?.payload?.systolic} /
					{payload[0]?.payload?.diastolic}
				</label>
				<div className="flex flex-col text-xs">
					<div className="flex items-center gap-2 mb-1 text-red-500">
						S: {payload[0]?.payload?.systolic}
					</div>
					<div className="flex items-center gap-2 text-blue-500">
						D: {payload[0]?.payload?.diastolic}
					</div>
					<div className="flex items-center gap-2 text-blue-500">
						RESULT:{" "}
						{payload[0]?.payload?.systolic &&
						payload[0]?.payload?.diastolic
							? calculateBPMeasurement(
									payload[0]?.payload?.systolic,
									payload[0]?.payload?.diastolic
							  )?.result
							: ""}
					</div>
				</div>
				{/* {getValue(payload[0].value)} */}
			</div>
		);
	}

	return null;
};
const TotalPatients = ({ w, h, patient }) => {
	const { id } = useParams();
	const [data, setData] = useState([]);
	useEffect(() => {
		if (patient?.id) {
			getData();
		}
	}, [patient?.id]);
	const getData = () => {
		Axios
			.get(
				`/v1/clinic/patient-charts/${patient?.id}?chart_type=blood_pressure`
			)
			.then((res) => {
				let _labels = res.data?.labels;
				let _values = res.data?.values;
				setData(
					_values?.map((item, index) => {
						console.log("_labels[index]", _labels[index]);
						let _d = new Date(_labels[index]);

						return {
							systolic: item?.blood_systolic || "",
							diastolic: item?.blood_diastolic || "",
							time: _labels[index],
						};
					})
				);
			});
	};
    
	return (
		<LineChart
			width={w}
			height={h}
			data={data.reverse()}
			margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
		>
			<Legend verticalAlign="top" height={36} />
			<Line
				type="monotone"
				dataKey="Pending for Payment"
				stroke="red"
				activeDot={{ r: 16 }}
			/>
			<Line
				type="monotone"
				dataKey="Pending for Billing"
				stroke="blue"
				activeDot={{ r: 16 }}
			/>
			<CartesianGrid stroke="#ccc" strokeDasharray="10 10" />
			<YAxis name="diastolic" domain={[0, 300]} />
			<XAxis name="time" dataKey={"time"} />
			<Tooltip content={CustomTooltip} />
		</LineChart>
	);
};

export default TotalPatients;
