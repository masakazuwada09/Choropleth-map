/* eslint-disable react/prop-types */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react-refresh/only-export-components */
import {
	Fragment,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { v4 as uuidv4 } from "uuid";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Draggable from "react-draggable";
import {
	dateToday,
	dateYYYYMMDD,
	formatDateMMDDYYYY,
	formatDateYYYYMMDD,
	patientFullName,
} from "../../../libs/helpers";
import ActionBtn from "../../buttons/ActionBtn";
import Axios from "../../../libs/axios";
import TextInputField from "../../inputs/TextInputField";
import ReactSelectInputField from "../../inputs/ReactSelectInputField";
import useNoBugUseEffect from "../../../hooks/useNoBugUseEffect";
import FlatIcon from "../../FlatIcon";
import useDataTable from "../../../hooks/useDataTable";
import Table from "../../table/Table";
import TextInput from "../../inputs/TextInput";
import LoadingScreen from "../../loading-screens/LoadingScreen";
const uniq_id = uuidv4();
// ... existing code ...

// ... existing code ...

// ... existing code ...

const CreateLabOrderModal = (props, ref) => {
	const { patient, onSuccess } = props;
	const {
	  register,
	  getValues,
	  watch,
	  control,
	  setValue,
	  reset,
	  handleSubmit,
	  formState: { errors },
	} = useForm();
	const {
	  page,
	  reloadData,
	  setPage,
	  meta,
	  setMeta,
	  loading,
	  setLoading,
	  paginate,
	  setPaginate,
	  data,
	  setData,
	  column,
	  setColumn,
	  direction,
	  setDirection,
	  filters,
	  setFilters,
	} = useDataTable({
	  url: `v1/laboratory/tests/list`,
	  defaultFilters: {
		key: uniq_id,
	  },
	});
	const [showData, setShowData] = useState(null);
	const [labType, setLabType] = useState("");
	const [appointment, setAppointment] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [tests, setTests] = useState([]);
	const [selectedTest, setSelectedTest] = useState([]); // Add state for selected test
	const [filteredTests, setFilteredTests] = useState([])
	const [searchQuery, setSearchQuery] = useState("");
	const [isGridView, setIsGridView] = useState(true);
	const [full, setFull] = useState(false);
	const [selectionCounts, setSelectionCounts] = useState({});
	const [recentTest, setRecentTest] = useState(null);
	
	useImperativeHandle(ref, () => ({
	  show: show,
	  hide: hide,
	}));
	
	const show = (data, appointmentData, type = null) => {
	  setFull(false);
	  setLabType(type);
	  getLaboratoryTests(type);
	  setShowData(data);
	  setTimeout(() => {
		if (appointmentData?.id) {
		  setValue("appointment_id", appointmentData?.id);
		}
		setValue("order_date", dateYYYYMMDD());
	  }, 200);
	  setModalOpen(true);
	};
  
	const hide = () => {
	  setModalOpen(false);
	  reset({
		laboratory_test_type: "",
		notes: "",
		order_date: "",
		patient_id: "",
		appointment_id: "",
	  });
	  setSelectedTest(null); // Reset selected test
	};
	useEffect(() => {
		// Load frequently selected or recent test from localStorage on mount
		const storedCounts = JSON.parse(localStorage.getItem("selectionCounts")) || {};
		const lastSelected = JSON.parse(localStorage.getItem("recentTest")) || null;
		setSelectionCounts(storedCounts);
		setRecentTest(lastSelected);
	}, []);
	
	useEffect(() => {
		// Update selection counts in localStorage
		localStorage.setItem("selectionCounts", JSON.stringify(selectionCounts));
	}, [selectionCounts]);
	
	useEffect(() => {
		// Automatically select the most frequent or recent test in the filtered list when in Grid view
		if (isGridView && filteredTests.length > 0) {
			let testToSelect = null;
	
			// 1. If recentTest exists and is part of the filteredTests, select it
			if (recentTest && filteredTests.some(test => test.id === recentTest.id)) {
				testToSelect = recentTest;
			}
	
			// 2. If no recentTest or it's not in the current filtered list, select the most frequent one
			if (!testToSelect) {
				testToSelect = filteredTests.reduce((prev, curr) => {
					const prevCount = selectionCounts[prev.id] || 12;
					const currCount = selectionCounts[curr.id] || 10;
					return currCount > prevCount ? curr : prev;
				}, filteredTests[0]);
			}
	
			// Automatically select the determined test
			setSelectedTest(testToSelect);
		}
	}, [filteredTests, isGridView, recentTest, selectionCounts]);

	const handleTestSelect = (test) => {
		// When a test is selected, update the recentTest and increment the count for that test
		setSelectedTest(test);
		setRecentTest(test);
		localStorage.setItem("recentTest", JSON.stringify(test));
	
		// Update the selection count for this test
		setSelectionCounts(prevCounts => ({
			...prevCounts,
			[test.id]: (prevCounts[test.id] || 0) + 1
		}));
	};

	const getLaboratoryTests = (type) => {
		// Set loading to true before starting the request
		setLoading(true);
		
		Axios.get(`/v1/laboratory/tests/list?type=${type}`)
		  .then((res) => {
			setTests(res.data.data);
			setFilteredTests(res.data.data); // Initialize filtered tests
		  })
		  .catch((error) => {
			console.error("Failed to fetch laboratory tests", error);
		  })
		  .finally(() => {
			// Set loading to false after the request is finished
			setLoading(false);
		  });
	  };
	const handleStop = (e, data) => {
		setPosition({ x: data.x, y: data.y });
	  };
	const handleStart = () => {
		setDragging(true); // Set dragging state to true when dragging starts
	  };
	  
	const submit = (data) => {
	  let formData = new FormData();
	  formData.append("laboratory_test_type", selectedTest?.id); // Use selectedTest for laboratory_test_type
	  formData.append("lab_rate", selectedTest?.lab_rate); // Use selectedTest for lab_rate
	  formData.append("notes", data?.notes);
	  formData.append("order_date", data?.order_date);
	  formData.append("patient_id", patient?.id);
	  formData.append("appointment_id", data?.appointment_id);
  
	  Axios.post(`v1/doctor/laboratory-order/store`, formData).then((res) => {
		reset();
		toast.success("Laboratory order created successfully!");
		onSuccess();
		hide();
	  });
	};
  
	const noHide = () => {};
	const handleDragStart = () => {
		setIsDragging(true);
	  };
	
	  const handleDragStop = () => {
		setIsDragging(false);
	  };
	const sendToInfectious = (data) => {
	  setLoading(true);
	  let formdata = new FormData();
	  formdata.append("rhu_id", data?.rhu_id);
	  formdata.append("doctor_id", data?.doctor_id);
	  formdata.append("room_number", data?.room_number);
	  formdata.append("_method", "PATCH");
  
	  Axios.post(`v1/clinic/tb-assign-to-doctor/${appointment?.id}`, formdata)
		.then((response) => {
		  let data = response.data;
		  setTimeout(() => {
			setAppointment(null);
		  }, 100);
		  setTimeout(() => {
			toast.success("Patient referral success!");
			setLoading(false);
		  }, 200);
		})
		.catch((err) => {
		  setLoading(false);
		  console.log(err);
		});
	};
	const handleSearch = (e) => {
		const query = e.target.value.toLowerCase();
		setSearchQuery(query);
		const filtered = tests.filter((test) =>
		  test.name.toLowerCase().includes(query)
		);
		setFilteredTests(filtered); // Update filtered tests based on search query
	  };

	  const handleToggleView = () => {
	setIsGridView((prev) => !prev);
	// Optionally select the first test when switching to grid view
	if (!isGridView && filteredTests.length > 0 && !selectedTest) {
		let testToSelect = recentTest || filteredTests[0]; // Fallback to the first test if no recentTest
		setSelectedTest(testToSelect);
	}
};
  
	return (
	  <Transition appear show={modalOpen} as={Fragment}>
		
		<Dialog as="div" className="" onClose={noHide}>
		  <Transition.Child
			as={Fragment}
			enter="ease-out duration-300"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="ease-in duration-200"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		  >
			<div className="fixed inset-0  z-[300]" />
		  </Transition.Child>
		  <Draggable  

							>
		  <div className="fixed inset-0 overflow-y-auto !z-[350]">
			<div className="flex min-h-full items-center justify-center p-4 text-center">
			  <Transition.Child
				as={Fragment}
				enter="ease-out duration-300"
				enterFrom="opacity-0 scale-95"
				enterTo="opacity-100 scale-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100 scale-100"
				leaveTo="opacity-0 scale-95"
			  >
		
				<Dialog.Panel className={`w-full ml-[850px] mt-[300px] border border-blue-200 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all ${
									full
										? " lg:max-w-[500vw]"
										: " lg:max-w-[30vw]"
								} `}>
				  <Dialog.Title
					as="div"
					className=" p-3 font-medium leading-6 flex flex-col items-start text-gray-900 bg-slate-50 border-b"
				  >
					<div className="flex gap-4 items-end">
					<span className="text-xl text-center font-bold  text-gray-700">
					  Create{" "}
					  {labType == "imaging" ? "Imaging" : "Laboratory"} Order
					</span>
					
					</div>
					<ActionBtn
											type="foreground"
											size="sm"
											className="absolute top-4 right-24 "
											onClick={() => {
												setFull((prevVal) => !prevVal);
											}}
										>
											<FlatIcon icon="br-expand-arrows-alt" />{" "}
											Fullscreen
										</ActionBtn>
					<ActionBtn
					  type="danger"
					  size="sm"
					  className="absolute top-4 right-4 "
					  onClick={hide}
					>
					  <FlatIcon icon="br-cross-small" /> Close
					</ActionBtn>
				  </Dialog.Title>

			<div className="p-3 flex flex-col gap-4  h-[500px]">
				<div className="flex flex-row gap-2 items-center justify-stretch ">
					
					<TextInputField
					  label="Select Date"
					  type="date"
					  error={errors?.order_date?.message}
					  placeholder="Enter order date"
					  {...register("order_date", {
						required: {
						  value: true,
						  message: "This field is required",
						},
					  })}
					/>
					
					<div className="flex flex-row gap-2">
                    <TextInputField
                      label="Search Tests"
                      placeholder="Search tests..."
                      value={searchQuery}
                      onChange={handleSearch}

                    />
                  </div>
					
				<div className="flex justify-end">
					<div className="w-[190px]"> 
				{selectedTest && ( <div className="text-xs text-gray-700 border p-3"> 
						<span>Price Rate: </span>
						 <b>{selectedTest.lab_rate}</b> 
			<button
          onClick={() => setSelectedTest(null)} // Clear selected test
          className="ml-4 text-sm text-red-500 hover:text-red-700"
       	 >
          Clear
        </button>
						 </div> )} 

						
					</div>

		{/* Grid Switcher */}
		<label className='flex justify-end cursor-pointer select-none items-center'>
        	<input
				type='checkbox'
				checked={isGridView}
				onChange={handleToggleView}
				className='sr-only'
        	/>
        
        <div className='shadow-card flex h-[46px] w-[82px] items-center justify-center rounded-md bg-white'>
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-sm ${
              !isGridView ? 'border text-gray-600 shadow-inner duration-300 ease-in-out' : 'text-gray-400'
            }`}
          >
           <FlatIcon 
		   		icon="fi fi-rs-list"
		   />
          </span>
          <span
            className={`flex h-7 w-7  items-center justify-center rounded-sm ${
              isGridView ? 'border text-gray-600 shadow-inner duration-300 ease-in-out' : 'text-gray-400'
            }`}
          >
			<FlatIcon 
		   		icon="fi fi-rr-grid"
		   />
          </span>
        </div>
      </label>

				</div>
				  
					
		

				</div>
				  
				<div className="overflow-auto border px-2 bg-gray-200 py-2 shadow-inner h-[500px]">
						{loading ? (
							<div className="p-5 flex items-center justify-center w-full">
							<h2 className="text-2xl font-bold animate-pulse flex items-center mt-[120px] gap-2">
								<l-cardio
								size="45"
								stroke="4"
								speed="0.90"
								color="black"
								></l-cardio>
							</h2>
							</div>
						) : 
							isGridView ? (
							<div className="grid grid-cols-4 gap-2 ">
								{filteredTests.map((test) => (
								<div
									key={test.id}
									className={`p-3 bg-white border shadow-xl gap-2 flex flex-col justify-center items-center rounded cursor-pointer ${
									selectedTest?.id === test.id
										? "border-blue-500 !bg-blue-100"
										: "border-gray-300"
									}`}
									onClick={() => setSelectedTest(test)}
								>
									<h1 className="text-xs font-bold">{test.name}</h1>
									<p className="text-xs text-green-700">
									Price: <b>₱{test.lab_rate}</b>
									</p>
								</div>
								))}
							</div>
										) : (
                  <div className="flex flex-col gap-2 ">
                    {filteredTests.map((test) => (
                      <div
                        key={test.id}
                        className={`p-3 bg-white flex flex-row justify-between border rounded cursor-pointer ${
                          selectedTest?.id === test.id
                            ? "border-blue-500 !bg-blue-100"
                            : "border-gray-300"
                        }`}
                        onClick={() => handleTestSelect(test)}
                      >
                        <h1 className="text-md font-bold">{test.name}</h1>
                        <p className="text-md text-green-700">
                          Price: <b>₱{test.lab_rate}</b>
                        </p>
                      </div>
                    ))}
                  </div>
                )}

				
                

              </div>
				
				

					<div className="gap-2">
						<div>
						{selectedTest && (
							<>
								
					  <TextInputField
					 
					  error={errors?.notes?.message}
					  placeholder="Enter notes"
					  {...register("notes", {
						required: {
						  value: true,
						  message: "This field is required",
						},
					  })}
					/>
							</>
					  
					)}
					</div>
					
					
					</div>
					
					{/* ... existing code ... */}
				  </div>
				  <div className="px-4 py-4 border-t flex items-center justify-end bg-slate-">
					
					<ActionBtn
					  // size="lg"
					  type="teal"
					  className="px-5"
					  onClick={handleSubmit(submit)}
					>
					  SUBMIT
					</ActionBtn>
				  </div>
				</Dialog.Panel>
				
			  </Transition.Child>
			</div>
		  </div>
		  </Draggable>
		</Dialog>
		
	  </Transition>
	 
	);
  };
  
  export default forwardRef(CreateLabOrderModal);