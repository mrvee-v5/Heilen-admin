"use client";
import React, { useState } from "react";



import Image from "next/image";
import { CopyIcon, FilterIcon, SearchIcon } from "@/icons";
import ActionMenu from "@/components/common/ActionMenu";
import Pagination from "@/components/tables/Pagination";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import ComponentCard from "@/components/common/ComponentCard";



interface Order {
    id: number;
    user: {
        image: string;
        name: string;
        role: string;
    };
    email: string;
    phone: string;
    status: "Active" | "Inactive";
    package: "Premium" | "Gold" | "Basic"; // <-- renamed subscription → package
    noOfServices: number; // <-- service count
}

const tableData: Order[] = [
    {
        id: 1,
        user: {
            image: "/images/user/user-17.jpg",
            name: "Lindsey Curtis",
            role: "Web Designer",
        },
        email: "lindsey.curtis@example.com",
        phone: "+1 555-123-4567",
        status: "Active",
        package: "Premium",
        noOfServices: 4,
    },
    {
        id: 2,
        user: {
            image: "/images/user/user-18.jpg",
            name: "Kaiya George",
            role: "Project Manager",
        },
        email: "kaiya.george@example.com",
        phone: "+1 555-987-6543",
        status: "Inactive",
        package: "Gold",
        noOfServices: 0,
    },
    {
        id: 3,
        user: {
            image: "/images/user/user-17.jpg",
            name: "Zain Geidt",
            role: "Content Writer",
        },
        email: "zain.geidt@example.com",
        phone: "+1 555-654-3210",
        status: "Active",
        package: "Basic",
        noOfServices: 2,
    },
    {
        id: 4,
        user: {
            image: "/images/user/user-20.jpg",
            name: "Abram Schleifer",
            role: "Digital Marketer",
        },
        email: "abram.schleifer@example.com",
        phone: "+1 555-321-9876",
        status: "Inactive",
        package: "Gold",
        noOfServices: 1,
    },
    {
        id: 5,
        user: {
            image: "/images/user/user-21.jpg",
            name: "Carla George",
            role: "Front-end Developer",
        },
        email: "carla.george@example.com",
        phone: "+1 555-789-1234",
        status: "Active",
        package: "Premium",
        noOfServices: 6,
    },
    {
        id: 6,
        user: {
            image: "/images/user/user-22.jpg",
            name: "Marcus Thompson",
            role: "UI Designer",
        },
        email: "marcus.thompson@example.com",
        phone: "+1 555-456-7890",
        status: "Inactive",
        package: "Basic",
        noOfServices: 0,
    },
];

export default function BasicTableOne() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(tableData.length / itemsPerPage);
    const paginatedData = tableData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert(`Copied to clipboard: ${text}`);
    };

    const ActionMenus = [
        {
            label: "View",
            route: "/dashboard/user-profile",
        },
        {
            label: "Activate",
            onClick: () => alert(`Activated `),
        },

        {
            label: "Deactivate",
            onClick: () => alert(`Deactivated `),
        },
    ]

    return (
        <div className="space-y-6">
            <ComponentCard title="All users">
                <div className="space-y-6">
                    <div className="flex items-center justify-between gap-3">
                        <div className="relative">
                            <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                                <SearchIcon />
                            </span>
                            <input
                                type="text"
                                placeholder="Search users by name or email"
                                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                            />
                        </div>
                        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                            <FilterIcon />
                            Filter
                        </button>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-[var(--app-bg)] dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="w-full overflow-x-auto">
                            <Table>
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Retreat Organizer
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Email
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Phone
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Status
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Package
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            No. of Services
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>

                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {paginatedData.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 overflow-hidden rounded-full">
                                                        <Image
                                                            width={40}
                                                            height={40}
                                                            src={order.user.image}
                                                            alt={order.user.name}
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                            {order.user.name}
                                                        </span>
                                                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                            {order.user.role}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Email with copy icon */}
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <div className="flex items-center gap-2 max-w-[220px] truncate">
                                                    <span className="truncate">{order.email}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(order.email)}
                                                        className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                                        aria-label="Copy email"
                                                    >
                                                        <CopyIcon className="h-5 w-5 text-gray-500" />
                                                    </button>
                                                </div>
                                            </TableCell>

                                            {/* Phone with copy icon */}
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <div className="flex items-center gap-2 max-w-[160px] truncate">
                                                    <span className="truncate">{order.phone}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(order.phone)}
                                                        className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                                        aria-label="Copy phone"
                                                    >
                                                        <CopyIcon className="h-5 w-5 text-gray-500" />
                                                    </button>
                                                </div>
                                            </TableCell>

                                            {/* Status badge */}
                                            <TableCell className="px-4 py-3 text-start">
                                                <Badge
                                                    size="sm"
                                                    color={order.status === "Active" ? "success" : "error"}
                                                >
                                                    {order.status}
                                                </Badge>
                                            </TableCell>

                                            {/* Package badge */}
                                            <TableCell className="px-4 py-3 text-start">
                                                <Badge size="sm" color="warning">
                                                    {order.package}
                                                </Badge>
                                            </TableCell>

                                            {/* No. of Services */}
                                            <TableCell className="px-4 py-3 text-start">
                                                <Badge
                                                    size="sm"
                                                    color={order.noOfServices > 0 ? "success" : "error"}
                                                >
                                                    {order.noOfServices}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="px-4 py-3 text-start">
                                                <ActionMenu
                                                    items={ActionMenus}
                                                    children={undefined} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="px-5 py-3">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </ComponentCard>
        </div>
    );
}
