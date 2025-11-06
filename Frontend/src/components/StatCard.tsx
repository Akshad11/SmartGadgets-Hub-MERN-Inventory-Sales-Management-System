// src/components/StatCard.tsx
import React from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change }) => {
    return (
        <div className="bg-white shadow-md rounded-2xl p-5 flex flex-col justify-between transition-transform hover:scale-[1.02] duration-200">
            <div>
                <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                <h2 className="text-2xl font-semibold text-gray-800 mt-2">{value}</h2>
            </div>
            {change && (
                <p
                    className={`mt-2 text-sm font-medium ${change.startsWith("+") ? "text-green-600" : "text-red-500"
                        }`}
                >
                    {change} from last week
                </p>
            )}
        </div>
    );
};

export default StatCard;
