import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
    label: string;
    path?: string; // if path is undefined, it means this is the current page
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav className="flex items-center text-gray-600 text-sm mb-4">
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    {item.path ? (
                        <Link
                            to={item.path}
                            className="hover:text-blue-600 transition-colors font-medium"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-500">{item.label}</span>
                    )}

                    {index < items.length - 1 && (
                        <ChevronRight size={16} className="mx-2 text-gray-400" />
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumb;
