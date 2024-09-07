import React, { useRef, useEffect, useState } from 'react';
import useDataTable from '../../../../hooks/useDataTable';
import useNoBugUseEffect from '../../../../hooks/useNoBugUseEffect';
import Pagination from '../../../../components/table/Pagination';
import UploadCSROrderModal from './modal/UploadCSROrderModal';
import { doctorName, doctorSpecialty, formatDateMMDDYYYY } from '../../../../libs/helpers';
import Table from '../../../../components/table/Table';
import FlatIcon from '../../../../components/FlatIcon';
import ActionBtn from '../../../../components/buttons/ActionBtn';
import ContentTitle from '../../../../components/buttons/ContentTitle';
import { useAuth } from '../../../../hooks/useAuth';
import Axios from '../../../../libs/axios';

const PatientCSROrder = (props) => {
    const { patient } = props;
    const csrFormRef = useRef(null);
    const { user } = useAuth();

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
        url: `/v1/anesthesia/patient-csr/patient/${patient?.id}`,
    });
console.log("dataaaaaaa----------------->>>", patient?.id)
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
        console.log('Data CSR----------------->>>>>>>>>>>>:', data);
    }, [data]);

    return (
        <div className=''>
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
                                return formatDateMMDDYYYY(new Date(data?.date));
                            },
                        },
                        {
                            header: "Supplies/Medicines",
                            className: "text-left",
                            tdClassName: "text-left",
                            key: "inventory_csrs_id",
                            cell: (data) => {
                                return data?.relationships?.inventory_csrs_id?.csr_supplies;
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
                                            {doctorName(data?.relationships?.doctor)}
                                        </span>
                                        <span className="text-[10px] font-light">
                                            {doctorSpecialty(data?.relationships?.doctor)}
                                        </span>
                                    </div>
                                );
                            },
                        },
                        {
                            header: "Quantity",
                            className: "text-center w-[100px]",
                            tdClassName: "text-center",
                            key: "quantity",
                            cell: (data) => {
                                return data?.quantity;
                            },
                        },
                        // {
                        //     header: "Status",
                        //     className: "text-center w-[150px]",
                        //     tdClassName: "text-center",
                        //     key: "order_status",
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
            <UploadCSROrderModal ref={csrFormRef} patient={patient} />
        </div>
    );
};

export default PatientCSROrder;
