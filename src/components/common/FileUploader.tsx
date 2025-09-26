"use client";
import React from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
    onFilesAdded: (files: File[]) => void;
    accept?: Record<string, string[]>;
    maxSize?: number;
    label?: string;
    subLabel?: string;
    hint?: string;
    icon?: React.ReactNode;
    className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
    onFilesAdded,
    accept = {
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
            ".xlsx",
        ],
    },
    maxSize = 10 * 1024 * 1024, // default 10MB
    label = "Click to select file",
    subLabel = "or drag and drop",
    hint = "XLS/XLSX (max. 10mb)",
    icon,
    className = "",
}) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept,
        maxSize,
        onDrop: (acceptedFiles) => onFilesAdded(acceptedFiles),
    });

    return (
        <div
            {...getRootProps()}
            className={`bg-[#FAF2E5] border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                } ${className}`}
        >
            <input {...getInputProps()} />

            <label className="flex flex-col items-center justify-center">
                {/* Dynamic Icon */}
                {icon || (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-12 h-12 text-gray-400 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 16a4 4 0 01.88-7.906A5 5 0 1117 9h1a4 4 0 010 8h-2m-6-4l3-3m0 0l3 3m-3-3v12"
                        />
                    </svg>
                )}

                {/* Labels */}
                <span className="text-[#C06A4D] font-medium">{label}</span>
                <span className="text-xs text-gray-500">{subLabel}</span>
                {hint && <span className="text-xs text-gray-400 mt-1">{hint}</span>}
            </label>
        </div>
    );
};

export default FileUploader;
