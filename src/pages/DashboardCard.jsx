import React from 'react';

const DashboardCard = ({ title, count, icon }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex items-center justify-between">
            <div className="flex items-center">
                <div className="p-3 bg-blue-500 text-white rounded-full">
                    {icon}
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
                    <p className="text-3xl font-bold text-gray-800">{count}</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardCard;