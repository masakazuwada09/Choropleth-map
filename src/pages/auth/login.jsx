import { useForm } from "react-hook-form";
import ActionBtn from "../../components/buttons/ActionBtn";
import LayoutContainer from "../../components/container/LayoutContainer";
import TextInput from "../../components/inputs/TextInput";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Axios from "../../libs/axios";
import TextInputField from "../../components/inputs/TextInputField";

const Login = () => {
	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm();
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState("");
	const submitBtnRef = useRef(null);
	// const [password, setPassword] = useState("");
	const { login } = useAuth({
		middleware: "guest",
		redirectIfAuthenticated: "/",
	});

	const setErrors = (data) => {
		console.log("errorserrors", data);
		setError("username", {
			type: "manual",
			message: "The provided credentials are incorrect.",
		});
		setLoading(false);
	};
	const submit = async (data) => {
		setLoading(true);
		console.log("submit", data);
		// clearErrors();
		try {
			await login({ data: data, setStatus, setErrors });
			console.log("status", status);
			// toast.success("Login success! Redirecting...");
		} catch (err) {
			console.log("err", err);
			setLoading(false);
			toast.error("Login failed! Please check your credentials.");
		}
	};

	return (
		<LayoutContainer>
			<ToastContainer theme="colored" />
			<div className=" z-20 mx-auto w-4/5 lg:w-[384px] p-11  absolute opacity rounded-xl flex flex-col items-center  bg-clip-padding shadow-lg">
				<img
					src="/diagnosislogo.png"
					alt="gtc-logo"
					className="w-[70px] mb-2"
				/>
				<h5 className="text-gray-700 font-bold uppercase mb-5 ">
					DIAGNOSTIC CENTER
				</h5>
				<form className="w-full" onSubmit={handleSubmit(submit)}>
					<TextInputField
						className="w-full mb-4"
						placeholder="Input username"
						id="username"
						{...register("username", {
							required: "This field is required",
						})}
						error={errors?.username?.message}
					/>
					<TextInputField
						className="w-full mb-6"
				
						placeholder="Input password"
						type="password"
						error={errors?.password?.message}
						{...register("password", {
							required: "This field is required",
						})}
					/>
					<ActionBtn
						buttonType="submit"
						type="teal"
						className="w-full border border-teal-800"
						ref={submitBtnRef}
						loading={loading}
						onClick={handleSubmit(submit)}
					>
						Login
					</ActionBtn>
					
				</form>
			</div>
		</LayoutContainer>
	);
};

export default Login;
