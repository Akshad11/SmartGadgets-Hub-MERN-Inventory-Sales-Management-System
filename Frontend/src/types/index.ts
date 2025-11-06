
export interface IStaff {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "staff";
    createdAt?: string;
    updatedAt?: string;
}

export interface ILoginResponse {
    user: IStaff;
    token: string;
}


export interface IProduct {
    _id: string;
    name: string;
    description?: string;
    brand?: string;
    category: string;
    price: number;
    stock: number;
    imageUrl?: string;
    createdBy: string | IStaff;
    createdAt?: string;
    updatedAt?: string;
}


export interface ICustomer {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    createdAt?: string;
    updatedAt?: string;
}
// src/types/order.ts
export interface IOrderItem {
    product: string; // Product ID
    name: string;
    quantity: number;
    price: number;
    imageUrl?: string;
}

export interface IShippingAddress {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
}

export interface IOrder {
    _id?: string;
    customer: string; // Customer ID
    orderItems: IOrderItem[];
    processedBy?: string; // Staff ID
    paymentMethod: "COD" | "Credit Card" | "Debit Card" | "UPI" | "Net Banking";
    paymentStatus?: "Pending" | "Paid" | "Failed";
    shippingAddress: IShippingAddress;
    totalAmount: number;
    orderStatus?: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
    createdAt?: string;
    updatedAt?: string;
}
