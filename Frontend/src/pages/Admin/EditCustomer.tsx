// src/pages/Admin/EditCustomer.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axiosInstance";
import Breadcrumb from "../../components/Breadcrumb";

interface ICustomer {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    createdAt?: string;
    updatedAt?: string;
}

const EditCustomer: React.FC = () => {
    const { token } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState<ICustomer | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch customer details
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const res = await api.get<ICustomer>(`/customers/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCustomer(res.data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load customer");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [id, token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCustomer((prev) => (prev ? { ...prev, [name]: value } : prev));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customer) return;

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await api.put(
                `/customers/${customer._id}`,
                {
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phone,
                    address: customer.address,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess("✅ Customer updated successfully!");
            setTimeout(() => navigate("/admin/staff-customers"), 1000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update customer");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-500">
                Loading customer details...
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                Customer not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto mb-6">
                <Breadcrumb
                    items={[
                        { label: "Dashboard", path: "/admin/dashboard" },
                        { label: "Staff & Customers", path: "/admin/staff-customers" },
                        { label: `Edit Customers` }
                    ]}
                />
            </div>
            <div className="flex justify-center items-center px-4">
                <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Edit Customer</h2>

                    {error && <p className="text-red-500 text-center mb-3">{error}</p>}
                    {success && <p className="text-green-600 text-center mb-3">{success}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={customer.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={customer.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={customer.phone || ""}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                placeholder="Enter phone number"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Address</label>
                            <textarea
                                name="address"
                                value={customer.address || ""}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                rows={3}
                                placeholder="Enter address"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mt-4"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditCustomer;
