"use client";
import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import ActionMenu from "../common/ActionMenu";
import { UserDetail } from "@/services/types";
import { updateUserSubscription } from "@/services/users.service";
import { useAlert } from "../context/AlertContext";

interface BusinessInfoCardProps {
    user: UserDetail;
}

const availablePackages = ["platinum", "silver", "bronze", "gold", "free"];

export default function BusinessInfoCard({ user }: BusinessInfoCardProps) {
    const { isOpen, openModal, closeModal } = useModal();
    const business = user.business;
    const [isSaving, setIsSaving] = useState(false);
    const { showAlert } = useAlert();



    const [assignedPackage, setAssignedPackage] = useState(user.subscriptionType || "free");
    const [isActive, setIsActive] = useState(!!user.subscribed);

    // Temp states for modal inputs
    const [tempPackage, setTempPackage] = useState(assignedPackage);
    const [tempIsActive, setTempIsActive] = useState(isActive);

    if (!business) {
        return (
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <p>No business information available for this user.</p>
            </div>
        );
    }

    // Open modal and initialize temp state with current values


    // Save changes handler
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateUserSubscription(user.id, tempIsActive, tempPackage.toLowerCase());
            setAssignedPackage(tempPackage);
            setIsActive(tempIsActive);
            closeModal();
            showAlert(
                'success',
                "Package Updated",
                'Subscription package updated successfully.'
            );
        } catch (error) {
            alert("Failed to update subscription. Please try again.");
        }
        setIsSaving(false);
    };

    const packageMenuItems = availablePackages.map((pkg: any) => ({
        label: pkg,
        onClick: () => {
            setAssignedPackage(pkg);
        },
    }));





    // Initial assigned subscription states


    // Update assigned states whenever `user` changes (important if user loads async)
    useEffect(() => {
        if (user) {
            setAssignedPackage(user.subscriptionType || "free");
            setIsActive(!!user.subscribed);
        }
    }, [user]);

    // Sync temp modal inputs whenever assigned states change or when modal opens
    const handleOpenModal = () => {
        setTempPackage(assignedPackage);
        setTempIsActive(isActive);
        openModal();
    };

    useEffect(() => {
        console.log("User subscriptionType:", user.subscriptionType);
        console.log("User subscribed:", user.subscribed);
        console.log("assignedPackage:", assignedPackage);
        console.log("isActive:", isActive);
        console.log("tempPackage:", tempPackage);
        console.log("tempIsActive:", tempIsActive);
    }, [user, assignedPackage, isActive, tempPackage, tempIsActive]);

    return (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="w-full lg:flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                        Business Information
                    </h4>
                    <div className="flex flex-row gap-3 lg:items-center lg:justify-end">


                        <ActionMenu items={packageMenuItems}>
                            <button
                                onClick={handleOpenModal}
                                className="flex items-center justify-center gap-2 rounded-sm border border-gray-300 bg-[#7B8A76] px-4 py-3 text-sm font-medium text-white shadow-theme-xs"
                            >
                                Assign Package
                            </button>
                        </ActionMenu>
                        {/* <button
                            onClick={() => { }}
                            className="flex items-center justify-center gap-2 rounded-sm border border-gray-300 bg-[var(--app-btn-color)] px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-opacity-90"
                        >
                            <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                />
                            </svg>
                            Edit
                        </button> */}

                    </div>


                    <div className="mb-6">
                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                            Business Logo
                        </p>
                        <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {business.profileImg && (
                                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 w-20 h-20">
                                    <img
                                        src={business.profileImg}
                                        alt="Profile Image"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">



                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Business Name
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {business.businessName || "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Package
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {assignedPackage}
                            </p>
                        </div>
                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Email address
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {business.businessEmail || "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Phone
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {business.businessPhoneNumber || "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Country
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {business.businessAddress?.country || "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                City/State
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {business.businessAddress ? `${business.businessAddress.city}, ${business.businessAddress.state}` : "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Full Address
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {business.businessAddress ? `${business.businessAddress.fullAddress}, ${business.businessAddress.fullAddress}` : "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Postal Code
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {business.businessAddress?.postalCode || "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Joined Date
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {business.createdDate ? new Date(business.createdDate).toLocaleDateString() : "N/A"}
                            </p>
                        </div>



                        <div className="lg:col-span-2">
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Short Description
                            </p>
                            <div className="flex flex-wrap gap-2 min-w-0">
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {business.shortDescription || "N/A"}
                                </p>
                            </div>
                        </div>



                        <div className="lg:col-span-2">
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Detailed Description
                            </p>
                            <div className="flex flex-wrap gap-2 min-w-0">
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {business.description || "N/A"}
                                </p>
                            </div>
                        </div>




                        <div className="lg:col-span-2">
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Professions
                            </p>
                            <div className="flex flex-wrap gap-2 min-w-0">
                                {business.professions.length > 0 ? (
                                    business.professions.map((professionString, index) => {
                                        try {
                                            const profession = JSON.parse(professionString);
                                            return (
                                                <span
                                                    key={index}
                                                    className="inline-block rounded-full px-3 py-1 text-xs font-medium text-white bg-[var(--app-btn-color)]"
                                                >
                                                    {profession.title}
                                                </span>
                                            );
                                        } catch (e) {
                                            console.error("Failed to parse profession JSON:", e);
                                            return null;
                                        }
                                    })
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">N/A</p>
                                )}
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Business Location
                            </p>
                            <div className="flex flex-wrap gap-2 min-w-0">
                                {business.availableCountries.length > 0 ? (
                                    business.availableCountries.map((location) => (
                                        <span
                                            key={location}
                                            className="inline-block rounded-full px-3 py-1 text-xs font-medium text-white bg-[var(--app-btn-color)]"
                                        >
                                            {location}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">N/A</p>
                                )}
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Gallery
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {/* Profile Image */}
                                {business.profileImg && (
                                    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                                        <img
                                            src={business.profileImg}
                                            alt="Profile Image"
                                            className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}

                                {/* Media Items (Images & Videos) */}
                                {business.media && business.media.length > 0 ? (
                                    business.media.map((mediaItem) => {
                                        const isVideo = mediaItem.mediaURL.toLowerCase().endsWith(".mp4");
                                        return (
                                            <div
                                                key={mediaItem.id}
                                                className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                                            >
                                                {isVideo ? (
                                                    <video
                                                        src={mediaItem.mediaURL}
                                                        controls
                                                        className="w-full h-32 object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={mediaItem.mediaURL}
                                                        alt="Gallery Item"
                                                        className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 col-span-full">
                                        Gallery not available in the provided data.
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Edit Business Information
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Update the business details.
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Business Name</Label>
                                    <Input type="text" defaultValue={business.businessName || ""} />
                                </div>
                                <div>
                                    <Label>Email Address</Label>
                                    <Input type="text" defaultValue={business.businessEmail || ""} />
                                </div>
                                <div>
                                    <Label>Phone</Label>
                                    <Input type="text" defaultValue={business.businessPhoneNumber || ""} />
                                </div>
                                <div>
                                    <Label>Instagram Handle</Label>
                                    <Input type="text" defaultValue={business.instagramHandle || ""} />
                                </div>
                            </div>
                            <div className="mt-7">
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    Description
                                </h5>
                                <div className="grid grid-cols-1">
                                    <div className="col-span-1">
                                        <Label>Short Description</Label>
                                        <Input type="text" defaultValue={business.shortDescription || ""} />
                                    </div>
                                    <div className="col-span-1">
                                        <Label>Full Description</Label>
                                        <textarea
                                            className="w-full rounded-xl border border-gray-300 bg-gray-100 p-3 text-sm font-medium text-gray-800 outline-none transition-all duration-300 focus:border-gray-500 disabled:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white/80 dark:focus:border-gray-600"
                                            rows={4}
                                            defaultValue={business.description || ""}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Close
                            </Button>
                            <Button size="sm" onClick={handleSave}>
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>



            {/* Modal for subscription update */}
            <Modal showCloseButton={false} isOpen={isOpen} onClose={closeModal} className="max-w-[400px] m-4">
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden dark:bg-gray-900">
                        {/* Header */}
                        <div className="flex justify-between items-center bg-[#54392A] px-5 py-3">
                            <h4 className="text-xl font-semibold text-white">Assign Subscription Package</h4>
                            <button
                                onClick={closeModal}
                                className="text-white text-xl hover:text-gray-300"
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <div className="mb-4">
                                <Label htmlFor="package-select">Package</Label>
                                <select
                                    id="package-select"
                                    value={tempPackage}
                                    onChange={(e: any) => setTempPackage(e.target.value)}
                                    className="w-full rounded border border-gray-300 p-2 dark:bg-gray-800 dark:text-white"
                                >
                                    {availablePackages.map((pkg) => (
                                        <option key={pkg} value={pkg}>
                                            {pkg}
                                        </option>
                                    ))}
                                </select>


                            </div>

                            <div className="mb-6 flex items-center gap-3">
                                <Label htmlFor="subscription-toggle" className="mb-0">
                                    Subscription Active
                                </Label>

                                {/* Slider toggle button */}
                                <button
                                    id="subscription-toggle"
                                    role="switch"
                                    aria-checked={tempIsActive}
                                    onClick={() => setTempIsActive((prev) => !prev)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C06A4D] ${tempIsActive ? "bg-[#C06A4D]" : "bg-gray-300 dark:bg-gray-700"
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tempIsActive ? "translate-x-6" : "translate-x-1"
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={closeModal} disabled={isSaving}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? "Saving..." : "Save"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>



        </div>
    );
}