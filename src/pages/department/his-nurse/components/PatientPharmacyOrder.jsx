import React, { useEffect, useRef, useState } from 'react'
import Pagination from '../../../../components/table/Pagination';
import UploadPharmacyOrderModal from './modal/UploadPharmacyOrderModal';
import { doctorName, doctorSpecialty, formatDateMMDDYYYY } from '../../../../libs/helpers';
import FlatIcon from '../../../../components/FlatIcon';
import Table from '../../../../components/table/Table';
import ActionBtn from '../../../../components/buttons/ActionBtn';
import ContentTitle from '../../../../components/buttons/ContentTitle';
import useDataTable from '../../../../hooks/useDataTable';
import useNoBugUseEffect from '../../../../hooks/useNoBugUseEffect';
import { useAuth } from '../../../../hooks/useAuth';

const PatientPharmacyOrder = (props) => {
    const {
		patient,
	} = props;
    const pharmacyFormRef = useRef(null);

	const { user } = useAuth();
	console.log('Patient Pharmacy CSR Data----------->>>', patient?.id)
    const {
            page,
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
            reloadData,
        } = useDataTable({
            // url: `/v1/anesthesia/csr-pharmacy/show/${showData?.id}`,
          url: `/v1/anesthesia/patient-pharmacy/patient/${patient?.id}`,
            // defaultFilters: {
            //     ...(order_id ? { order_id: order_id } : {}),
            //     ...(laboratory_test_type
            //         ? { laboratory_test_type: laboratory_test_type }
            //         : {}),
            //     ...(appointment?.id > 0 ? { appointment_id: appointment?.id } : {}),
            // },
        });
		useEffect(() => {
        reloadData();
    }, [patient?.id]);
	useNoBugUseEffect({
		functions: () => {
			setFilters((prevFilters) => ({
				...prevFilters
			}));
		},
	});
	useEffect(() => {
        console.log('Data Pharmacy----------------->>>>>>>>>>>>:', data);
    }, [data]);
  return (
     <div>
     <ActionBtn
                type="teal"
                title="Add CSR"
                className=" mb-2 ml-auto mr-2 h-6"
                onClick={() => {
                    csrFormRef.current.show(patient);
                    console.log('patient CSR Modal Patient:', patient);
                }}
            > Add
                <FlatIcon icon="fi fi-rr-plus-small" className="mt-1 text-xl" />
            </ActionBtn>
     <div className="flex flex-col items-start">	
			<Table
				className={`pb-2`}
				loading={loading}
				columns={[
					{
						header: "Date",
						className: "text-left w-[150px]",
						tdClassName: "text-left",
						key: "date",
						cell: (data) => {
							return formatDateMMDDYYYY(
								new Date(data?.date)
							);
						},
					},
                    {
						header: "Supplies/Medicines",
						className: "text-left",
						tdClassName: "text-left",
						key: "inventory_pharmacies_id",
                        cell: (data) => {
									return data?.relationships?.inventory_pharmacies_id?.pharmacy_supplies;
								},
					},
					{
						header: "Doctor",
						className: "text-left",
						tdClassName: "text-left",
						key: "doctor_id",
						cell: (data) => {
							return (
								<div className="flex flex-col">
									<span className="font-medium text-black -mb-[4px]">
										{doctorName(
											data?.relationships?.doctor
										)}
									</span>
									<span className="text-[10px] font-light">
										{doctorSpecialty(
											data?.relationships?.doctor
										)}
									</span>
								</div>
							);
						},
					},
					{
						header: "Quantity",
						className: "text-center w-[100px] ",
						tdClassName: "text-center",
						key: "quantity",
						cell: (data) => {
									return data?.quantity;
								},
					},
					// {
					// 	header: "Status",
					// 	className: "text-center w-[150px] ",
					// 	tdClassName: "text-center",
					// 	key: "order_status",
					// 	// cell: (data) => {
					// 	// 	return <Status status={data?.order_status} />;
					// 	// },
					// },
					
					// {
					// 	header: "Delete",
					// 	className: `text-center ${isDoctor() ? "" : "hidden"}`,
					// 	tdClassName: `text-center ${
					// 		isDoctor() ? "" : "hidden"
					// 	}`,
					// 	key: "delete",
					// 	cell: (data) => {
					// 		return (
					// 			<div className="w-full flex items-center">
					// 				{/* {JSON.stringify(data)} */}
					// 				<ActionBtn
					// 					size="sm"
					// 					type="danger"
					// 					disabled={
					// 						data?.order_status ==
					// 						"for-result-reading"
					// 					}
					// 					className=" mx-auto"
					// 					onClick={() => {
					// 						deleteLabOrderRef.current.show(
					// 							data
					// 						);
					// 					}}
					// 				>
					// 					<FlatIcon icon="rr-trash" /> Delete
					// 				</ActionBtn>
					// 			</div>
					// 		);
					// 	},
					// },
				]}
				data={data}
			/>
			<Pagination
				page={page}
				setPage={setPage}
				pageCount={meta?.last_page}
				pageSize={paginate}
				setPageSize={setPaginate}
			/>
		</div>
        
        <UploadPharmacyOrderModal ref={pharmacyFormRef} patient={patient}/>
    </div>
  )
}

export default PatientPharmacyOrder
