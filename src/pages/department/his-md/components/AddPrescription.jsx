import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import ReactSelectInputField from "../../../../components/inputs/ReactSelectInputField";
import ActionBtn from "../../../../components/buttons/ActionBtn";
import FlatIcon from "../../../../components/FlatIcon";
import TextInputField from "../../../../components/inputs/TextInputField";
import ReactQuillField from "../../../../components/inputs/ReactQuillField";
import { procedureRates } from "../../../../libs/procedureRates";
import { caseCodes } from "../../../../libs/caseCodes";
import CaseDetails from "./CaseDetails";

const AddPrescription = ({
    prescribeItems,
    selectedItems = [],
    setSelectedItems,
    setProcedure,
    setDiagnosis,
    items = [],
    setItems,
    loading,
}) => {
    const [selectedProcedure, setSelectedProcedure] = useState(null);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

    const addNewSelectedItem = () => {
        setSelectedItems((prevItems) => [
            ...prevItems,
            {
                id: uuidv4(),
                item: null,
                quantity: 0,
            },
        ]);
    };

    const removeSelectedItem = (id) => {
        setSelectedItems((prevItems) =>
            prevItems.filter((item) => item.id !== id)
        );
    };

    const updateItemInSelected = (id, data) => {
        setSelectedItems((items) =>
            items.map((item) => {
                if (item.id === id) {
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

    const updateItemQty = (id, qty) => {
        setSelectedItems((items) =>
            items.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        quantity: qty,
                    };
                }
                return item;
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

    return (
        <>
            <div className="flex flex-col w-full gap-4 pb-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Diagnosis Section */}
                    <div className="flex flex-col gap-5 border p-5 rounded-xl shadow-xl">
                        <div>
                            <h4 className="text-sm text-gray-400  mb-2 py-2">
                                Add Diagnosis
                            </h4>
                          
                            <ReactSelectInputField
                                isClearable={true}
                                inputClassName=""
                                value={selectedDiagnosis?.CASE_CODE}
                                onChangeGetData={(data) => {
                                    if (setDiagnosis) {
                                        setDiagnosis(data?.value);
                                    }
                                    setSelectedDiagnosis(data?.item);
                                }}
                                placeholder="Select Diagnosis"
                                options={caseCodes?.map((item) => ({
                                    value: item?.CASE_CODE,
                                    label: item?.CASE_DESCRIPTION,
                                    item: item,
                                }))}
                            />
                        </div>
                        {selectedDiagnosis ? (
                            <CaseDetails
							
                                selectedCase={selectedDiagnosis}
                                title="Diagnosis Details"
                            />
                        ) : null}

						{/* <div className="mt-2 border-t py-5 border-t-slate-200">
                            <h4 className="text-sm text-gray-400  mb-2">
                                Add Procedure Rendered
                            </h4>
                           
                            <ReactSelectInputField
                                isClearable={true}
                                inputClassName=""
                                value={selectedProcedure?.CASE_CODE}
                                onChangeGetData={(data) => {
                                    setSelectedProcedure(data?.item);
                                    if (setProcedure) {
                                        setProcedure(data?.value);
                                    }
                                }}
                                placeholder="Select Procedure"
                                options={procedureRates?.map((item) => ({
                                    value: item?.CASE_CODE,
                                    label: item?.CASE_DESCRIPTION,
                                    item: item,
                                }))}
                            />
                        </div> */}
                        {/* {selectedProcedure ? (
                            <CaseDetails
                                selectedCase={selectedProcedure}
                                title="Procedure Details"
                            />
                        ) : null} */}
                    </div>

                    {/* Procedure Section */}
                    <div className="flex flex-col gap-5 border p-5 w-full rounded-xl shadow-xl">
					<div className="flex flex-row justify-between px-5">
                            <h4 className="text-sm text-gray-400 font-bold mb-0 ">
                                Add Prescription
                            </h4>
                            <div className="flex items-center justify-end gap-2">
                                <ActionBtn
                                    className="w-12"
                                    type="teal"
                                    size="sm"
                                    onClick={addNewSelectedItem}
                                >
                                    <FlatIcon icon="rr-plus"  />
                                </ActionBtn>
                            </div>
                        </div>

                        <div className="flex flex-col px-2">
                            <div className="table">
                                <table className="mb-2">
                                    <thead>
                                        <tr>
                                            <td className="font-medium">
                                                Item Information
                                            </td>
                                            <td className="text-center">
                                                Qty
                                            </td>
                                            <td className="text-center w-[100px]">
                                                Action
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedItems?.map((selectedItem) => (
                                            <React.Fragment
                                                key={`selectedItem-${selectedItem?.id}`}
                                            >
                                                <tr>
                                                    <td className="w-3/5">
                                                        <ReactSelectInputField
                                                            isClearable={true}
                                                            inputClassName=" "
                                                            value={
                                                                selectedItem
                                                                    ?.item?.id
                                                            }
                                                            onChangeGetData={(
                                                                data
                                                            ) => {
                                                                updateItemInSelected(
                                                                    selectedItem?.id,
                                                                    data
                                                                );
                                                            }}
                                                            
                                                            placeholder="Select Item"
                                                            options={items?.map(
                                                                (item) => ({
                                                                    label: item?.name,
                                                                    value: item?.id,
                                                                    description: (
                                                                        <div className="flex flex-col">
                                                                            <span>
                                                                                CODE:{" "}
                                                                                {
                                                                                    item?.code
                                                                                }
                                                                            </span>
                                                                            <span>
                                                                                DESCRIPTION:{" "}
                                                                                {
                                                                                    item?.name
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    ),
                                                                    item: item,
                                                                })
                                                            )}
                                                        />
                                                        <div className="flex flex-row items-start gap-2 p-4 divide-x">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold mb-1 text-xs">
                                                                    Item Code
                                                                </span>
                                                                <span>
                                                                    {
                                                                        selectedItem
                                                                            ?.item
                                                                            ?.code
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-col mt-2 pl-4">
                                                                <span className="font-bold mb-1 text-xs">
                                                                    Item
                                                                    Description
                                                                </span>
                                                                <span>
                                                                    {
                                                                        selectedItem
                                                                            ?.item
                                                                            ?.description
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="w-[88px] text-center">
                                                        <TextInputField
                                                            inputClassName="text-center !py-0 pl-1 !pr-0 h-10 !rounded"
                                                            defaultValue={1}
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
                                                                Remove
                                                            </ActionBtn>
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
                                                            placeholder="Sig.:"
                                                            onChange={(val) => {
                                                                updateItemSig(
                                                                    selectedItem?.id,
                                                                    val
                                                                );
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                        <tr>
                                            <td
                                                colSpan={9999}
                                                className="text-center"
                                            ></td>
                                        </tr>
										
                                    </tbody>
									
                                </table>
                                {selectedItems?.length === 0 ? (
                                    <p className="my-4 text-gray-400 text-sm text-center">
                                        Please click "+" to add a prescription.
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Prescription Section */}
                   
                </div>
                {/* <div className=" ml-[20px]">
                <span className="text-md font-bold text-gray-700 ">
                   
                   Remarks
               
                     </span>
                           <div className="flex flex-col w-[500px] ">
                                   <ReactQuillField
                                       label="Doctors remarks"
                                       placeholder="Enter doctor's remarks here..."
                                       inputClassName = "h-[100px] "
                                   />
                               </div>
                </div> */}
                
                                    
                <div className="flex flex-row justify-end">
                    <ActionBtn
                        className="px-4 !rounded- mx-auto w-1/6"
                        type="primary-dark"
                        disabled={selectedItems?.length === 0}
                        loading={loading}
                        onClick={() => {
                            prescribeItems();
                        }}
                    >
                        <FlatIcon
                            icon="rr-file-prescription"
                            className="mr-2 text-xl"
                        />
                        Send to Pharmacy
                    </ActionBtn>
                    
                </div>
            </div>
        </>
    );
};

export default AddPrescription;
