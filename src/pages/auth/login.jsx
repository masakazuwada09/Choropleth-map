import { useForm } from "react-hook-form";
import ActionBtn from "../../components/buttons/ActionBtn";
import LayoutContainer from "../../components/container/LayoutContainer";
import TextInputField from "../../components/inputs/TextInputField";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import FlatIcon from "../../components/FlatIcon";
import HumanBiometric from "../../spline/components/HumanBiometric";
import HumanLungs from "../../spline/components/HumanLungs";
import Interface from "../../spline/components/Interface";
import Img from "../../components/Img";
import { FloatingDock } from "../../components/FloatingDock";


const Login = () => {
    const {
        register,
        handleSubmit,
        setError,
        watch,
        setValue,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);
    const [iconType, setIconType] = useState(null);
	const [status, setStatus] = useState("");
    const submitBtnRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth({
        middleware: "guest",
        redirectIfAuthenticated: "/",
    });

    // Watch for the username input
    const username = watch("username");
    const [currentStep, setCurrentStep] = useState(0);
    const nextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    const previousStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };
    useEffect(() => {
        if (username === "dc-nurse") {
            setIconType("nurse");
        } else if (username === "dc-doctor") {
            setIconType("doctor");
		} else if (username === "dc-pharmacy") {
            setIconType("pharmacy");
		} else if (username === "dc-laboratory") {
            setIconType("laboratory");
		} else if (username === "dc-imaging") {
            setIconType("imaging");
        } else if (username === "dc-cashier") {
            setIconType("cashier");    
        } else {
            setIconType(null);
        }
    }, [username]);
    const handleAdminLogin = () => {
        navigate("/admin-login"); // Redirect to the admin login form
    };
    const setErrors = (data) => {
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
    const handleLinkClick = (username) => {
        setValue("username", username); // Set the form value for username
        setIconType(username); // Explicitly set icon type to force re-render
      };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
	const links = [
		{
		  title: "Nurse",
		  icon: (
			<Img src="/Nurse.png" className="" />
		  ),
		  href: "#",
          onClick: () => handleLinkClick("dc-nurse"),
		},

		{
		  title: "Doctor",
		  icon: (
			<Img src="/Doctor.png" className="" />
		  ),
		  href: "#",
          onClick: () => handleLinkClick("dc-doctor"),
		},

		{
		  title: "Pharmacy",
		  icon: (
			<Img src="/Pharmacy.png" className="" />
		  ),
		  href: "#",
          onClick: () => handleLinkClick("dc-pharmacy"),
		},

		{
		  title: "Laboratory",
		  icon: (
			<Img src="/Laboratory-user.png" className="" />
		  ),
		  href: "#",
          onClick: () => handleLinkClick("dc-laboratory"),
		},

		{
		  title: "Radiology",
		  icon: (
			<Img src="/Radiology.png" className="" />
		  ),
		  href: "#",
          onClick: () => handleLinkClick("dc-imaging"),
		},
	 
		{
		  title: "Cashier",
		  icon: (
			<Img src="/Cashier-machine.png" className="" />
		  ),
		  href: "#",
          onClick: () => handleLinkClick("dc-cashier"),
		},
		
	  ];
    return (
        <>
            {/* <Interface className="z-10 absolute inset-0 " /> */}
            {/* <HumanBiometric />
            <HumanLungs /> */}
            <LayoutContainer>
                
                <ToastContainer theme="colored" />
                <div className=" brightness-200mx-auto w-4/5 lg:w-[384px]  p-11 justify-center opacity rounded-xl flex flex-col items-center absolute bg-clip-padding shadow-lg"
                    style={{
                        content: '""',
                        backgroundImage: 'url(/diagnosislogo.png)', // Set the background image
                        backgroundSize: '170px', // Cover the entire div
                        backgroundPosition: 'top', // Center the image
                        backgroundRepeat: 'no-repeat', // Prevent repeating
                        minHeight: '', // Ensure it covers the full viewport height
                    }}
                >
	   
       <span className="text-gray-300 text-md font-bold uppercase  absolute mb-[210px] mr-[1px]">
            DIAGNOSTIC&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;C&nbsp;&nbsp;E&nbsp;&nbsp;N&nbsp;&nbsp;T&nbsp;&nbsp;E&nbsp;&nbsp;R
        </span>
                    <div className="absolute mb-[120px]">
                           {/* Conditionally render the user icon based on username */}
                    {iconType === "nurse" && (
                        <div className="">
                            <Img src="/Nurse.png" className="h-[100px] " /> {/* Replace with actual nurse icon */}
                        </div>
                    )}
                    {iconType === "doctor" && (
                        <div className="">
                            <Img src="/Doctor.png" className="h-[100px]" /> {/* Replace with actual doctor icon */}
                        </div>
                    )}
					{iconType === "pharmacy" && (
                        <div className="ml-5">
                            <Img src="/Pharmacy.png" className="h-[100px]" /> {/* Replace with actual doctor icon */}
                        </div>
                    )}
					{iconType === "laboratory" && (
                        <div className="">
                            <Img src="/Laboratory-user.png" className="h-[100px]" /> {/* Replace with actual doctor icon */}
                        </div>
                    )}
					{iconType === "imaging" && (
                        <div className="">
                            <Img src="/Radiology.png" className="h-[100px]" /> {/* Replace with actual doctor icon */}
                        </div>
                    )}
                    {iconType === "cashier" && (
                        <div className="">
                            <Img src="/Cashier-machine.png" className="h-[100px]" /> {/* Replace with actual doctor icon */}
                        </div>
                    )}
                    </div>
                 

                    <div className="justify-end flex flex-col ">
                    <FloatingDock
                        mobileClassName=""
                        items={links.map((link) => ({
                            ...link,
                            onClick: (e) => {
                                e.preventDefault();
                                link.onClick();
                            },
                        }))}
                    />
                   
                    </div>
                    <form className="w-full" onSubmit={handleSubmit(submit)}>
                    {currentStep === 0 && (
                        
                        <div className="w-full mb-4 z-60 inset-0">
                        {username ? (
                            <div className="text-lg font-bold text-gray-500 justify-center flex mb-12">{username}</div>
                        ) : (
                            <TextInputField
                                placeholder="Input username"
                                id="username"
                                {...register("username", {
                                    required: "This field is required",
                                })}
                                error={errors?.username?.message}
                            />
                        )}
                    </div>
                )}
                {currentStep === 1 && (
                    <div className="relative w-full mb-3">
                        <TextInputField
                            className="w-full pr-10 z-60 inset-0"
                            placeholder="Input password"
                            type={showPassword ? "text" : "password"}
                            error={errors?.password?.message}
                            {...register("password", {
                                required: "This field is required",
                            })}
                        />
                        <span
                            className="absolute justify-center bg-teal-600 inset-y-0 right-0 flex items-center px-4 cursor-pointer"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <FlatIcon className="text-teal-800" icon="fi fi-rs-crossed-eye" />
                            ) : (
                                <FlatIcon className="text-teal-300" icon="fi fi-rs-eye" />
                            )}
                        </span>
                    </div>
                )}
                <div className="flex flex-col justify-between">
                    {currentStep > 0 && (
                        <button type="button"  onClick={previousStep} className="btn">
                        <FlatIcon icon="fi fi-sr-arrow-circle-left" className="text-gray-300 text-4xl"/>
                      
                        </button>
                        
                    )}
                    {currentStep < 1 ? (
                        <button type="button"  onClick={nextStep} className="btn">
                            <FlatIcon icon="fi fi-sr-arrow-circle-right" className="text-gray-300 text-4xl"/>
                          
                        </button>
                    ) : (
                        <ActionBtn
                            buttonType="submit"
                            type="foreground"
                            className="w-full border border-teal-800"
                            ref={submitBtnRef}
                            loading={loading}
                        >
                            Login
                        </ActionBtn>
                    )}
                </div>
                        
                    </form>
                </div>
            </LayoutContainer>
        </>
    );
};

export default Login;
