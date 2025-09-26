import React from "react";
import RichTextEditor from "../common/RichTextEditor";

interface PreviewCardProps {
    label?: string;
    value: string;
    icon?: React.ReactNode;
    prefix?: string;
    isHtml?: boolean;
    editable?: boolean;
    onChange?: (newValue: string) => void;
    textarea?: boolean;
    inputType?: "text" | "date" | "time" | any;
}

const PreviewCard: React.FC<PreviewCardProps> = ({
    label,
    prefix,
    value,
    icon,
    isHtml,
    editable = false,
    onChange,
    textarea = false,
    inputType = "text",
}) => {
    // Convert "07:00 AM" → "07:00" for <input type="time">
    const convertToTimeInput = (timeWithAmPm: string) => {
        if (!timeWithAmPm) return "";
        const [time, modifier] = timeWithAmPm.split(" "); // "07:00 AM"
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours < 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    };

    // Convert "07:00" back → "07:00 AM" when saving
    const convertFromTimeInput = (time: string) => {
        if (!time) return "";
        let [hours, minutes] = time.split(":").map(Number);
        const ampm = hours >= 12 ? "PM" : "AM";
        if (hours > 12) hours -= 12;
        if (hours === 0) hours = 12;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${ampm}`;
    };

    return (
        <div className="mb-4 w-full">
            {label && <p className="text-[#54392A] text-sm mb-1">{label}</p>}
            <div className="flex items-start border border-gray-300 p-3 bg-[var(--app-bg)] rounded w-full">
                {prefix && <span className="mr-2 font-medium shrink-0">{prefix}</span>}

                <div className="flex-1 w-full text-[#54392A] text-sm">
                    {editable ? (
                        isHtml ? (
                            <RichTextEditor
                                value={value}
                                onChange={(val) => onChange?.(val)}
                            />
                        ) : textarea ? (
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded resize-y"
                                value={value}
                                onChange={(e) => onChange?.(e.target.value)}
                                rows={3}
                            />
                        ) : inputType === "time" ? (
                            <input
                                type="time"
                                value={convertToTimeInput(value)} // ✅ Normalize for input
                                onChange={(e) =>
                                    onChange?.(convertFromTimeInput(e.target.value)) // ✅ Store back with AM/PM
                                }
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        ) : (
                            <input
                                type={inputType}
                                value={value}
                                onChange={(e) => onChange?.(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        )
                    ) : isHtml ? (
                        <div
                            dangerouslySetInnerHTML={{ __html: value }}
                            className="prose w-full"
                        />
                    ) : (
                        <span className="block w-full">{value}</span>
                    )}
                </div>

                {icon && <div className="ml-2 shrink-0">{icon}</div>}
            </div>
        </div>
    );
};

export default PreviewCard;
