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
	
	useImperativeHandle(ref, () => ({
	  show: show,
	  hide: hide,
	}));
  
	const show = (data, appointmentData, type = null) => {
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
  
	const getLaboratoryTests = (type) => {
		Axios.get(`/v1/laboratory/tests/list?type=${type}`).then((res) => {
		  setTests(res.data.data);
		  setFilteredTests(res.data.data); // Initialize filtered tests
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
		setIsGridView(!isGridView); // Toggle between Grid and List view
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
			<div className="fixed inset-0 bg-black bg-opacity-60  z-[300]" />
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
		
				<Dialog.Panel className="w-full lg:max-w-[630px] transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
				  <Dialog.Title
					as="div"
					className=" p-4 font-medium leading-6 flex flex-col items-start text-gray-900 bg-slate-50 border-b"
				  >
					<div className="flex gap-4 items-end">
					<span className="text-xl text-center font-bold  text-gray-600">
					  Create{" "}
					  {labType == "imaging" ? "Imaging" : "Laboratory"} Order
					</span>
					<span className="text-sm font-light text-gray-900 ">
					  Complete form to create laboratory order
					</span>
					</div>
					
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
					{selectedTest && ( <div className="text-md text-gray-700 border p-3 shadow-xl"> 
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
            className={`flex h-9 w-9 items-center justify-center rounded ${
              !isGridView ? 'bg-primary text-white' : 'text-body-color'
            }`}
          >
           <FlatIcon 
		   		icon="fi fi-rs-list"
		   />
          </span>
          <span
            className={`flex h-9 w-9 items-center justify-center rounded ${
              isGridView ? 'bg-primary text-white' : 'text-body-color'
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
				  
				<div className="overflow-auto border px-2 bg-gray-100 py-4 ">
				
                {isGridView ? (
                  <div className="grid grid-cols-4 gap-4 ">
                    {filteredTests.map((test) => (
                      <div
                        key={test.id}
                        className={`p-4 border rounded cursor-pointer ${
                          selectedTest?.id === test.id
                            ? "border-blue-500 bg-blue-100"
                            : "border-gray-300"
                        }`}
                        onClick={() => setSelectedTest(test)}
                      >
                        <h1 className="text-md font-bold">{test.name}</h1>
                        <p className="text-sm text-gray-700">
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
                        className={`p-4 border rounded cursor-pointer ${
                          selectedTest?.id === test.id
                            ? "border-blue-500 bg-blue-100"
                            : "border-gray-300"
                        }`}
                        onClick={() => setSelectedTest(test)}
                      >
                        <h1 className="text-md font-bold">{test.name}</h1>
                        <p className="text-sm text-gray-700">
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