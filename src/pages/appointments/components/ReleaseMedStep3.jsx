/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import ContentTitle from "../../../components/buttons/ContentTitle";
import ActionBtn from "../../../components/buttons/ActionBtn";
import FlatIcon from "../../../components/FlatIcon";
import { useStepperContext } from "../../../components/StepperContext";

const ReleaseMedStep3 = ({
	submitSelfie,
	loading,
	imageCaptured,
	setImageCaptured,
}) => {
	const videoRef = useRef(null);
	const [stream, setStream] = useState(false);
	const { userData, setUserData } = useStepperContext();
	const startCamera = async () => {
		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: true,
			});
			setStream(mediaStream);
			videoRef.current.srcObject = mediaStream;
		} catch (error) {
			console.error("Error accessing camera:", error);
		}
	};

	const stopCamera = () => {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			setStream(null);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
	  };

	const captureImage = async () => {
		const canvas = document.createElement("canvas");
		canvas.width = videoRef.current.videoWidth;
		canvas.height = videoRef.current.videoHeight;
		canvas
			.getContext("2d")
			.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

		const capturedImage = canvas.toDataURL("image/jpeg"); // Convert canvas to base64 JPEG

		// Now you can send the capturedImage to your server using Axios
		try {
			setImageCaptured(capturedImage);
			stopCamera();
		} catch (error) {
			console.error("Error uploading image:", error);
		}
	};

	return (
		<>
			<div className="flex flex-col items-center justify-center mb-4 text-center">
				<ContentTitle title="Satisfaction Rating" />
			</div>
			<div className="flex flex-col items-center justify-center w-full">
				<div className="flex flex-col mb-2">
					<div className="relative">
						<video
							ref={videoRef}
							className="border w-[256px] h-[256px] bg-black"
							autoPlay
							playsInline
							style={{ transform: "scaleX(-1)" }}
						/>
						<img
							src={imageCaptured}
							className={`absolute top-0 left-0 border w-[256px] h-[256px] bg-black ${
								!stream && imageCaptured
									? "opacity-100"
									: "opacity-0"
							}`}
							style={{ transform: "scaleX(-1)" }}
						/>
					</div>

					{stream ? (
						<ActionBtn
							size="sm"
							type="danger"
							className="!rounded-none"
							onClick={captureImage}
						>
							<FlatIcon icon="rr-camera" />
							Capture
						</ActionBtn>
					) : (
						<ActionBtn
							size="sm"
							type="success"
							className="!rounded-none"
							onClick={startCamera}
						>
							<FlatIcon icon="rr-record" />
							Start Camera
						</ActionBtn>
					)}
				</div>
				<p className="text-red-500 mb-0  text-center uppercase">
					NOTE: The picture should clearly show <br /> both you and
					the patient.
				</p>

				<ActionBtn
					disabled={!imageCaptured}
					loading={loading}
					onClick={submitSelfie}
				>
					Take Selfie
				</ActionBtn>
			</div>
		</>
	);
};

export default ReleaseMedStep3;
