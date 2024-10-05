import { v4 as uuidv4 } from "uuid";
import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import ReactSelectInputField from "../../../../components/inputs/ReactSelectInputField";
import ActionBtn from "../../../../components/buttons/ActionBtn";
import FlatIcon from "../../../../components/FlatIcon";
import TextInputField from "../../../../components/inputs/TextInputField";
import ReactQuillField from "../../../../components/inputs/ReactQuillField";
import { useForm } from "react-hook-form";
import Axios from "../../../../libs/axios";

const AddPrescription = forwardRef(({
    prescribeItems,
    selectedItems = [],
    setSelectedItems,
    // selectedDiagnosis = [],
    // setSelectedDiagnosis,
    setDiagnosis,
    items = [],
    loading
}, ref) => {
    const {
		register,
		setValue,
		reset,
		formState: { errors },
	} = useForm();
    const [selectedDiagnosis, setSelectedDiagnosis] = useState([]);
    const [caseCodes, setCaseCodes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTests, setFilteredTests] = useState([]);
    const [isGridView, setIsGridView] = useState(true);
    const [checkedState, setCheckedState] = useState({});
    const [isItemUpdated, setIsItemUpdated] = useState(false);
    

    const hide = () => {
        setModalOpen(false);
        reset({
          laboratory_test_type: "",
          notes: "",
          order_date: "",
          patient_id: "",
          appointment_id: "",
        });
        setSelectedDiagnosis(null); // Reset selected setDiagnosis
      };

    useImperativeHandle(ref, () => ({
        show: show,
        hide: hide,
      }));

    const show = (data, appointmentData, type = null) => {
        setValue("order_date", dateYYYYMMDD());
        setModalOpen(true);
        setSelectedDiagnosis(null);
      };

      const addNewSelectedItem = () => {
        setSelectedItems((prevItems) => [
            ...prevItems,
            {
                id: uuidv4(),
                item: null,
                quantity: [],
            },
        ]);
        setIsItemUpdated(false); // Reset isItemUpdated when adding a new item
    };

    const removeSelectedItem = (id) => {
        setSelectedItems((prevItems) =>
            prevItems.filter((item) => item.id !== id)
        );
    };

    const handleToggleView = () => {
        setIsGridView(!isGridView); // Toggle between Grid and List view
    };

    const updateItemInSelected = (id, data) => {
        setSelectedItems((items) =>
            items.map((item) => {
                if (item.id === id) {
                    setIsItemUpdated(true); // Set to true when an item is updated
                    setSelectedDiagnosis(null);
                    return {
                        ...item,
                        inventory_id: data?.inventory?.id,
                        item: data?.item,
                    };
                }
                return item;
            })
        );
    };
    

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = caseCodes.filter((item) => 
            item.case_description.toLowerCase().includes(query) || 
            item.case_code.toLowerCase().includes(query)
        ) || [];
        
        setFilteredTests(filtered); // Update filtered tests based on the search query
    };

    useEffect(() => {
        const fetchCaseCodes = async () => {
            try {
                const response = await Axios.get("/v1/doctor/diagnosis/list");
                setCaseCodes(response.data.data || []); // Ensure it's an array
                setFilteredTests(response.data.data || [])
            } catch (error) {
                console.error("Error fetching case codes", error);
            }
        };

        fetchCaseCodes();
    }, []);

    const updateItemQty = (id, qty) => {
		setSelectedItems((items) =>
			items.map((item) => {
				if (item.id == id) {
					console.log("updateItemQty ==", item, id, qty);
					return {
						...item,
						quantity: qty,
					};
				} else {
					return item;
				}
			})
		);
	};

    const updateItemSig = (id, text) => {
        setSelectedItems((items) =>
            items.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        notes: text,
                    };
                }
                return item;
            })
        );
    };

    const handleCheckboxChange = (caseCode) => {
        setCheckedState((prev) => ({
          ...prev,
          [caseCode]: !prev[caseCode] // Toggle the checkbox state for this caseCode
        }));
        
        // Update selectedDiagnosis when a checkbox is checked
        const selectedItem = caseCodes.find(item => item.case_code === caseCode);
        if (selectedItem) {
            setSelectedDiagnosis(selectedItem); // Set selectedDiagnosis to the selected item
        } else {
            setSelectedDiagnosis(null); // Clear selection if not found
        }
    };
      
    
    return (
        <div className="flex flex-col w-full gap-4 pb-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className=" flex flex-col  h-[570px]">
                    <div className="flex flex-row gap-2 items-center justify-between">
                        
                        
                        
                        
                    </div>

                    <div className="flex justify-between gap-2">
                        <div className="flex flex-row gap-1">
                        <TextInputField
                           
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

                        <TextInputField
                           
                            placeholder="Search tests..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        </div>
                        
                        <div className="flex items-center justify-end gap-1">
                            {selectedDiagnosis && (
                                <div className="text-xs text-gray-700 border p-1 flex gap-2">
                                    
                                    <span><b>Case Code:</b> {selectedDiagnosis.case_code}</span> 
                                    <span><b>Case Rate:</b> {selectedDiagnosis.case_rate}</span> 
                                   
                                    <button 
                                        onClick={() => {
                                            setSelectedDiagnosis(null);
                                        }}
                                        className="text-xs text-red-500 hover:text-red-700"
                                    >
                                        Clear Selection
                                    </button>
                                </div>
                            )}

                            
                           {/* Grid Switcher */}
                           <label className='flex cursor-pointer select-none '>
                            <input
                                type='checkbox'
                                checked={isGridView}
                                onChange={handleToggleView}
                                className='sr-only'
                            />
                            <div className=' flex items-center justify-center  bg-white'>
                                <span
                                    className={`flex h-6 w-6 items-center justify-center  ${!isGridView ? 'border text-gray-600' : 'text-gray-400'}`}
                                >
                                    <FlatIcon icon="fi fi-rs-list" className="text-xs"/>
                                </span>
                                <span
                                    className={`flex h-6 w-6 items-center justify-center  ${isGridView ? 'border text-gray-600' : 'text-gray-400'}`}
                                >
                                    <FlatIcon icon="fi fi-rr-grid" className="text-xs"/>
                                </span>
                            </div>
                        </label>

                        </div>

                    </div>
                    
                    <div className="overflow-auto border px-1 bg-gray-200 py-1 border-gray-300 shadow-inner h-[600px]">
                    
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
                                
                                {(searchQuery ? filteredTests : caseCodes)?.map((item) => (
                                    <div
                                        key={item.case_code}
                                        className={`border rounded cursor-pointer  ${
                                            selectedDiagnosis?.case_code === item.case_code
                                                ? "border-blue-500 bg-blue-200"
                                                : "border-gray-400 bg-white"
                                        }`}
                                        onClick={() => {
                                            setDiagnosis(item.case_code);
                                            setDiagnosis(item.case_description);
                                            setSelectedDiagnosis(item);
                                        }}
                                    >
                                        <section className="flex flex-col h-[90px]">
                                            <label>
                                                <input
                                                    className="peer/showLabel absolute scale-0 "
                                                    type="checkbox"
                                                    checked={checkedState[item.case_code] || false}
                                                    onChange={() => handleCheckboxChange(item.case_code)}
                                                />
                                                <span className={`flex justify-center items-center h-[90px] px-1  overflow-hidden rounded-md bg-blue-200 text-cyan-800  transition-all duration-300 
                                                ${
                                            selectedDiagnosis?.case_code === item.case_code
                                                ? "border-blue-500 bg-blue-200"
                                                : "border-gray-400 bg-white"
                                            }`}>
                                                    
                                                    <p className="text-sm">{item.case_description}</p>
                        
                                                </span>
                                            </label>
                                        </section>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1 ">
                     {(searchQuery ? filteredTests : caseCodes)?.map((item) => (
                <div
                    key={item.case_code}
                    className={` border border-gray-400 rounded cursor-pointer flex justify-between gap-3 items-center text-sm px-1 text-cyan-800 ${
                        selectedDiagnosis?.case_code === item.case_code
                            ? "border-blue-500 bg-blue-100"
                            : "border-gray-300 bg-white"
                    }`}
                    onClick={() => {
                        setDiagnosis(item.case_code);
                        setDiagnosis(item.case_description);
                        setSelectedDiagnosis(item);
                    }}
                >
                    <p>{item.case_description}</p>
                    <p className="text-xs text-gray-500">Code: {item.case_code}</p>
            
                </div>
            ))}
                  </div>
                        )}
                    </div>
                </div>
                
            <div className="p-2 rounded-xl flex flex-col border justify-between shadow-lg h-[560px] ">
                <div className="flex flex-col">
                        <div className="flex flex-row p-2 items-center justify-between ">
                    <div className="flex flex-col">
						<h4 className="text-md text-teal-800  font-bold mb-0 ">
							Add Prescription
						</h4>
						<span className="text-slate-500 text-sm ">
							Select items to add prescription to patient
						</span>
					</div>
                <div className="flex gap-2 ">
                                                <ActionBtn
													className="px-2 !rounded-md h-8"
													type="foreground"
													onClick={addNewSelectedItem}
												>
													<FlatIcon icon="rr-square-plus" />
													Add
												</ActionBtn>

                                                {isItemUpdated && selectedItems.length > 0 && ( // Show button only if an item has been updated and there are selected items
            <ActionBtn
                className="px-2 !rounded-md h-8"
                type="teal"
                loading={loading}
                onClick={() => {
                    prescribeItems();
                }}
            >
                <FlatIcon
                    icon="rr-file-prescription"
                    className="mr-2 text-xl"
                />
                Submit Prescription
            </ActionBtn>
        )}
        {selectedItems.length === 0 && (
           ""
        )}
                    </div>                      
                    </div>



                    <div className="flex flex-col overflow-y-scroll border border-spacing-1 bg-zinc-300 h-[480px] ">
						<div className="table ">
							<table className="mb-1 ">
								<thead>
									<tr>
										<td className="font-medium">
											Item Information
										</td>
										{/* <td className="text-center">Unit</td> */}
										{/* <td className="text-center">Stock</td> */}
										<td className="text-center">Qty</td>
										<td className="text-center">
											Action
										</td>
                                        <td className="text-center">
											 Code
										</td>
                                        <td className="text-center ">
											Description
										</td>
									</tr>
								</thead>
							<tbody className="bg-white ">
									{selectedItems?.map((selectedItem) => {
										return (
											<>
												<tr
													key={`selectedItem-${selectedItem?.id}`}
												>
													<td className="w-[15vh] ">
                                                                <ReactSelectInputField
                                                                    isClearable={false}
                                                                    inputClassName=" "
                                                                    value={selectedItem?.item?.id}
                                                                    onChangeGetData={(data) => {
                                                                        console.log("data", data);
                                                                        updateItemInSelected(selectedItem?.id, data);
                                                                    }}
                                                                    placeholder={`Select Item`}
                                                                    options={items?.map((item) => ({
                                                                        label: item?.name,
                                                                        value: item?.id,
                                                                        description: (
                                                                            <div className="flex flex-col w-[500px]">
                                                                                <span>
                                                                                    CODE: {item?.code}
                                                                                </span>
                                                                                <span>
                                                                                    DESCRIPTION: {item?.name}
                                                                                </span>
                                                                            </div>
                                                                        ),
                                                                        item: item,
                                                                    }))}
                                                                    menuPortalTarget={document.body}
                                                                    styles={{
                                                                        control: (base) => ({
                                                                            
                                                                            width: '280px',
                                                                        
                                                                            zIndex: 10,
                                                                        }),
                                                                        menu: (base) => ({
                                                                            ...base,
                                                                            width: '645px', // Adjust the width of the dropdown
                                                                            zIndex: 9999, 
                                                                        }),
                                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                                    }}
                                                                />
                                                            </td>


													{/* <td className="text-center">
														{
															selectedItem?.item
																?.item
																?.unit_measurement
														}
													</td> */}
													{/* <td className="text-center">
													{
														selectedItem?.item
															?.quantity
													}
												</td> */}

													<td className=" text-center">
														<TextInputField
															inputClassName="text-center w-[50px] !pr-0 h-5 !rounded"
															defaultValue={0}
															type="number"
															placeholder="QTY"
															onChange={(e) => {
																updateItemQty(
																	selectedItem?.id,
																	e.target
																		.value
                                                                        
																);
															}}
														/>
													</td>
													<td>
														<div className="flex items-center justify-center gap-2">
															<ActionBtn
																type="danger"
																size="sm"
																onClick={() => {
																	removeSelectedItem(
																		selectedItem?.id
																	);
																}}
															>
																<FlatIcon icon="rr-trash" />
																
															</ActionBtn>
														</div>
													</td>
                                                    <td>
                                                   
															<div className="flex items-center gap-1 justify-center overflow-auto w-[100px]">
																
																<span className="text-sm font-mono text-teal-800 justify-center">
																	{
																		selectedItem
																			?.item
																			?.code
																	}
																</span>
															</div>
													
                                                    </td>
                                                    <td>
                                                            <div className="flex items-center gap-2  justify-center w-[100px]">
																
																<span className="text-sm font-mono  text-teal-800 justify-center">
																	{
																		selectedItem
																			?.item
																			?.description
																	}
																</span>
															</div>
                                                    </td>
                                                   
                                                     
												</tr>

												 <tr>
													<td
														colSpan={6}
														className="!pb-6"
													>
														<ReactQuillField
															className="bg-white"
															placeholder="Prescription Details"
															onChange={(val) => {
																console.log(
																	"onChange sig",
																	val
																);
																updateItemSig(
																	selectedItem?.id,
																	val
																);
																// updateNotes(
																// 	data,
																// 	vals
																// );
															}}
														/>
													</td>
												</tr>
                                                    
                                                    
												
											</>
										);
									})}
									<tr>
										
									</tr>
								</tbody>
							</table>
							{selectedItems?.length == 0 ? (
								<p className="my-4 text-gray-400 text-center">
									Please select items to add prescription.
								</p>
							) : (
								""
							)}
							
						</div>
					</div>

                </div>
                    
                
                                            
                                                 {/* <div>
                                                        <td
														colSpan={6}
														className="!pb-6"
													>
														<ReactQuillField
															className="bg-white"
															placeholder="Prescription:"
															onChange={(val) => {
																console.log(
																	"ONCHANGE SIGGGGGGGGGGGGGGGG",
																	val
																);
																// updateItemSig(
																// 	selectedItem
																// 			?.item
																// 			?.notes
																// );
																updateItemSig(
																	data,
																	val
																);
															}}
														/>
													</td>
                                                 </div> */}
                                                 
				</div>
            </div>
        </div>
    );
});

export default AddPrescription;
