"use client";
import React, { useState, useEffect } from "react";

import Image from "next/image";
import { CloseLineIcon, CopyIcon, FilterIcon, SearchIcon } from "@/icons";
import * as XLSX from "xlsx";
import { Circles } from 'react-loader-spinner'


import { getUsers, getUsersOtp, registerUser, sendVerificationCode, verifyToken } from "@/services/users.service";
import ComponentCard from "@/components/common/ComponentCard";
import ActionMenu from "@/components/common/ActionMenu";
import Pagination from "@/components/tables/Pagination";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import FileUploader from "@/components/common/FileUploader";
import { useAlert } from "@/components/context/AlertContext";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    subscribed: boolean;
    retreatOwner: boolean;
    subscriptionType: "platinum" | "silver" | "bronze";
}

export default function UsersTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isExtracting, setIsExtracting] = useState(false);
    const { showAlert } = useAlert();
    const router = useRouter();
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // ✅ NEW STATES
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [creatingUser, setCreatingUser] = useState(false);
    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        profileImg: "https://avatar.iran.liara.run/public/25",
    });

    const itemsPerPage = 10;

    useEffect(() => {
        const fetchUsersData = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiData = await getUsers(currentPage, itemsPerPage, searchQuery);
                setUsers(apiData.data);
                setTotalUsers(apiData.totalInDb);
            } catch (err: any) {
                setError("Failed to fetch user data.");
                setUsers([]);
                setTotalUsers(0);
            } finally {
                setLoading(false);
            }
        };

        fetchUsersData();
    }, [currentPage, searchQuery]);

    const handleSearchClick = () => {
        setCurrentPage(1);
        setSearchQuery(searchInput);
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setSearchQuery('');
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    const totalPages = Math.ceil(totalUsers / itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showAlert("success", "Copied!", `Email "${text}" copied to clipboard.`);
    };

    const getActionMenus = (userId: string) => [
        {
            label: "View",
            route: `/dashboard/users/${userId}`,
        },
        {
            label: "Activate",
            onClick: () => alert(`Activated ${userId}`),
        },
        {
            label: "Deactivate",
            onClick: () => alert(`Deactivated ${userId}`),
        },
    ];


    const handleFilesAdded = (files: File[]) => {
        setUploadedFiles(files);
    };



    const handleExtractData = async () => {
        if (uploadedFiles.length === 0) {
            showAlert("error", "Error", "Please upload a file first.");
            return;
        }

        setIsExtracting(true);

        const file = uploadedFiles[0];
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json<any>(worksheet);

                const results = [];
                const concurrencyLimit = 5; // Process 5 users at a time

                for (let i = 0; i < rows.length; i += concurrencyLimit) {
                    const batch = rows.slice(i, i + concurrencyLimit);
                    const batchPromises = batch.map(async (row) => {
                        const email = String(row.Email || "").toLowerCase();


                        try {
                            // Step 1: Send verification code
                            // await sendVerificationCode({ email, mode: "register" });

                            // Step 2: Get OTP from admin endpoint
                            // const otpResponse = await getUsersOtp(email);
                            // const token = otpResponse.otp;
                            // Step 3: Verify the token
                            // await verifyToken({ email, token });


                            // Step 4: Register the user
                            await registerUser({
                                phoneNumber: String(row.Phone || ""),
                                email: email,
                                firstName: String(row["First Name"] || ""),
                                lastName: String(row["Last Name"] || ""),
                                password: String(row.Password || "123456"),
                                role: "user",
                                countryCode: "NL",
                                profileImg: String(row["Image link"] || ""),
                            });

                            return { status: 'success', email: email };
                        } catch (err: any) {
                            const reason = err.response?.data?.message || 'Unknown error';
                            return { status: 'failed', email: email, reason: reason };
                        }
                    });
                    // Wait for the current batch to complete before moving to the next
                    results.push(...await Promise.allSettled(batchPromises));
                }

                const successfulRegistrations = results.filter(r => r.status === 'fulfilled' && (r.value as any)?.status === 'success');
                const failedRegistrations = results.filter(r => r.status === 'fulfilled' && (r.value as any)?.status === 'failed');

                if (successfulRegistrations.length > 0 || failedRegistrations.length > 0) {
                    showAlert(
                        'success',
                        'Import Complete',
                        `✅ Successfully registered ${successfulRegistrations.length} users. Failed to register ${failedRegistrations.length}.`
                    );
                } else {
                    showAlert(
                        'info',
                        'No Users Processed',
                        'The uploaded file did not contain any valid users to process.'
                    );
                }
            } catch (err: any) {
                showAlert("error", "Error", "An error occurred during file processing.");
            } finally {
                setIsExtracting(false);
                setShowUploadModal(false);
                setUploadedFiles([]);
            }
        };

        reader.readAsArrayBuffer(file);
    };
    return (
        <div className="space-y-6">
            <ComponentCard title="All users">
                <div className="space-y-6">
                    <div className="flex items-center justify-between gap-3">
                        <div className="relative flex-grow flex items-center h-11 w-full max-w-sm rounded-lg border border-gray-200 bg-transparent shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] xl:w-[430px]">
                            <span className="flex-shrink-0 pl-4 pr-2">
                                <SearchIcon />
                            </span>
                            <input
                                type="text"
                                placeholder="Search users by email"
                                className="flex-grow bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none dark:text-white/90 dark:placeholder:text-white/30"
                                onChange={(e) => setSearchInput(e.target.value)}
                                value={searchInput}
                                onKeyDown={handleKeyDown}
                            />
                            {searchInput && (
                                <button
                                    onClick={handleClearSearch}
                                    className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    aria-label="Clear search"
                                >
                                    <CloseLineIcon />
                                </button>
                            )}
                            <button
                                onClick={handleSearchClick}
                                className="flex-shrink-0 px-4 py-2 bg-[#C06A4D] text-white rounded-r-lg hover:bg-[#a6533c] transition-colors"
                                disabled={loading}
                                aria-label="Search"
                            >
                                Search
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setShowUploadModal(true)} className="bg-[#C06A4D] text-white px-4 py-2 rounded hover:bg-[#a6533c]">
                                Import Users
                            </button>
                            {/* ✅ NEW BUTTON */}
                            <button onClick={() => setShowCreateUserModal(true)} className="bg-[#54392A] text-white px-4 py-2 rounded hover:bg-[#3e2a1f]">
                                Create User
                            </button>
                        </div>
                    </div>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Circles
                                height="80"
                                width="80"
                                color="#C06A4D"
                                ariaLabel="circles-loading"
                                visible={true}
                            />

                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-[var(--app-bg)] dark:border-white/[0.05] dark:bg-white/[0.03]">
                            <div className="w-full overflow-x-auto">
                                <div className="min-w-[900px] h-[100vh] overflow-y-auto relative">
                                    <Table>
                                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                            <TableRow>
                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">User</TableCell>
                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Email</TableCell>
                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Phone</TableCell>
                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                            {users.length > 0 ? (
                                                users.map((user) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 overflow-hidden rounded-full">
                                                                    <Image
                                                                        className="w-full h-full object-cover"
                                                                        width={40}
                                                                        height={40}
                                                                        src={user.image || "/images/placeholder.jpg"}
                                                                        alt={user.name}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                                        {user.name}
                                                                    </span>
                                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                                        {user.retreatOwner ? "Retreat Owner" : "Regular User"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                            <div className="flex items-center gap-2 max-w-[220px] truncate">
                                                                <span className="truncate">{user.email}</span>
                                                                <button
                                                                    onClick={() => copyToClipboard(user.email)}
                                                                    className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                                                    aria-label="Copy email"
                                                                >
                                                                    <CopyIcon className="h-5 w-5 text-gray-500" />
                                                                </button>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                            N/A
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-start">
                                                            <Badge
                                                                size="sm"
                                                                color="success"
                                                            >
                                                                Active
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-start">
                                                            {/* <ActionMenu items={getActionMenus(user.id)} children={undefined} /> */}
                                                            <button
                                                                onClick={() => router.push(`/dashboard/users/${user.id}`)}
                                                                className="px-3 py-1 text-xs bg-[#C06A4D] text-white rounded-md font-medium"
                                                            >
                                                                View
                                                            </button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell className="text-center py-10 text-gray-500">
                                                        No users found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                            <div className="px-5 py-3">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </ComponentCard>
            <Modal showCloseButton={false} isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} className="max-w-[700px] m-4">
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-lg shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="flex justify-between items-center bg-[#54392A] text-white px-5 py-3">
                            <h2 className="text-lg font-semibold">Import User Data</h2>
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="text-white text-xl hover:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>
                        {/* Body */}
                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                <span className="font-semibold">Note:</span> Kindly ensure the template matches the required template for extraction
                            </p>
                            <FileUploader onFilesAdded={handleFilesAdded} />
                            <div className="mt-4 text-center text-sm text-gray-600">
                                Don’t have the right template?{" "}
                                <a
                                    href="/templates/user_template.xlsx"
                                    download
                                    className="text-[#C06A4D] font-medium hover:underline"
                                >
                                    Download Template
                                </a>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="px-6 py-4 flex justify-end border-t border-gray-200">
                            <button
                                onClick={handleExtractData}
                                disabled={uploadedFiles.length === 0 || isExtracting}
                                className={`font-semibold px-6 py-2 rounded transition ${uploadedFiles.length === 0 || isExtracting ? "bg-gray-400 cursor-not-allowed" : "bg-[#C06A4D] text-white hover:bg-[#a6533c]"}`}
                            >
                                {isExtracting ? <Circles
                                    height="20"
                                    width="20"
                                    color="#C06A4D"
                                    ariaLabel="circles-loading"
                                    visible={true}
                                />
                                    : "Extract Data"}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>



            {/* ✅ NEW Create User Modal */}
            <Modal showCloseButton={false} isOpen={showCreateUserModal} onClose={() => setShowCreateUserModal(false)} className="max-w-[700px] m-4">
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-lg shadow-lg overflow-hidden">
                        <div className="flex justify-between items-center bg-[#54392A] text-white px-5 py-3">
                            <h2 className="text-lg font-semibold">Create New User</h2>
                            <button onClick={() => setShowCreateUserModal(false)} className="text-white text-xl hover:text-gray-300">✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            {["firstName", "lastName", "email", "phoneNumber", "password", "profileImg"].map((f) => (
                                <div key={f}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{f}</label>
                                    <input
                                        type={f === "password" ? "password" : "text"}
                                        value={newUser[f as keyof typeof newUser]}
                                        onChange={(e) => setNewUser({ ...newUser, [f]: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#C06A4D]"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 flex justify-end border-t border-gray-200">
                            <button
                                onClick={async () => {
                                    if (!newUser.email || !newUser.firstName || !newUser.password) {
                                        showAlert("error", "Missing Fields", "Please fill all required fields.");
                                        return;
                                    }
                                    setCreatingUser(true);
                                    try {
                                        await registerUser({
                                            phoneNumber: newUser.phoneNumber,
                                            email: newUser.email.toLowerCase(),
                                            firstName: newUser.firstName,
                                            lastName: newUser.lastName,
                                            password: newUser.password,
                                            role: "user",
                                            countryCode: "NL",
                                            profileImg: newUser.profileImg,
                                        });
                                        showAlert("success", "User Created", `${newUser.email} registered successfully.`);
                                        setNewUser({ firstName: "", lastName: "", email: "", phoneNumber: "", password: "", profileImg: "" });
                                        setShowCreateUserModal(false);
                                    } catch (err: any) {
                                        const msg = err.response?.data?.message || "Failed to create user.";
                                        showAlert("error", "Error", msg);
                                    } finally {
                                        setCreatingUser(false);
                                    }
                                }}
                                disabled={creatingUser}
                                className={`font-semibold px-6 py-2 rounded transition ${creatingUser ? "bg-gray-400 cursor-not-allowed" : "bg-[#C06A4D] text-white hover:bg-[#a6533c]"}`}
                            >
                                {creatingUser ? (
                                    <Circles height="20" width="20" color="#fff" ariaLabel="loading" visible />
                                ) : (
                                    "Create User"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}