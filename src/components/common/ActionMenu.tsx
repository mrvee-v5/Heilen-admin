"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "@/icons";

// Types for individual menu items
export interface ActionMenuItem {
    label: string;
    onClick?: () => void;
    route?: string; // Optional route for navigation
}

interface ActionMenuProps {
    items: ActionMenuItem[];
    children: React.ReactNode
}

const ActionMenu: React.FC<ActionMenuProps> = ({ items, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    const handleItemClick = (item: ActionMenuItem) => {
        closeDropdown();

        if (item.onClick) {
            item.onClick();
        } else if (item.route) {
            router.push(item.route);
        }
    };

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
            <button onClick={toggleDropdown} className="dropdown-toggle">
                {children || <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />}

            </button>


            <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
                {items.map((item, index) => (
                    <DropdownItem
                        key={index}
                        tag="a"
                        onItemClick={() => handleItemClick(item)}
                        className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                    >
                        {item.label}
                    </DropdownItem>
                ))}
            </Dropdown>
        </div>
    );
};

export default ActionMenu;
