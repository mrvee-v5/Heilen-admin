"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { ChevronDownIcon } from "@/icons"; // Assuming you have this icon; if not, replace with your own

export default function ServiceOptionDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !(dropdownRef.current as any).contains(event.target)
            ) {
                closeDropdown();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-[var(--app-bg)] border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
            >
                Select
                <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-300" />
            </button>

            <Dropdown
                isOpen={isOpen}
                onClose={closeDropdown}
                className="absolute left-0 z-10 w-40 p-2 mt-2 origin-top-left bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700"
            >
                <DropdownItem
                    tag="a"
                    onItemClick={closeDropdown}
                    className="flex w-full px-3 py-2 text-sm font-normal text-left text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                >
                    Retreat
                </DropdownItem>

                <DropdownItem
                    tag="a"
                    onItemClick={closeDropdown}
                    className="flex w-full px-3 py-2 text-sm font-normal text-left text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                >
                    Product
                </DropdownItem>
            </Dropdown>
        </div>
    );
}
