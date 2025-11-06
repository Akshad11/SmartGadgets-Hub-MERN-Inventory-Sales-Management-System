// src/components/DashboardChart.tsx
import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";

interface ChartProps {
    title: string;
    data: { name: string; value: number }[];
    type?: "line" | "bar";
}

const DashboardChart: React.FC<ChartProps> = ({ title, data, type = "line" }) => {
    return (
        <div className="bg-white shadow-md rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                {type === "line" ? (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                ) : (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
    );
};

export default DashboardChart;
