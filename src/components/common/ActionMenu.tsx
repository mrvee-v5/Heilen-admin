"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { MoreDotIcon } from "@/icons";

// Types for individual menu items
export interface ActionMenuItem {
  label: string;
  onClick?: () => void;
  route?: string; // Optional route for navigation
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  children?: React.ReactNode;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ items, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <el-dropdown class="inline-block">
        {/* Trigger button */}
        <button
          onClick={toggleDropdown}
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50"
        >
          {children || (
            <MoreDotIcon className="size-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          )}
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="-mr-1 size-5 text-gray-400"
          >
            <path
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
              fillRule="evenodd"
            />
          </svg>
        </button>

        {/* Menu */}
        {isOpen && (
          <el-menu
            anchor="bottom end"
            popover
            class="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-black/5 transition transform"
          >
            <div className="py-1">
              {items.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 focus:bg-gray-100 focus:text-gray-900 focus:outline-hidden"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </el-menu>
        )}
      </el-dropdown>
    </div>
  );
};

export default ActionMenu;
