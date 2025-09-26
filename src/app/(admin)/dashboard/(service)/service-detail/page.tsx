"use client";
import React, { useState } from "react";
import PreviewCard from "@/components/retreat/PreviewCard";
import { EditIcon } from "@/icons";
import ComponentCard from "@/components/common/ComponentCard";
import FileUploader from "@/components/common/FileUploader";
import { useRouter } from "next/navigation";

interface Retreat {
    name: string;
    category?: { name: string };
    status: "Published" | "Unpublished";
    serviceTime: Array<{
        date: string;
        startTime: string;
        endDate: string;
        endTime: string;
        slot: string;
        isLimitless?: boolean;
    }>;
    description?: string;
    benefit?: string;
    audience?: string;
    reason?: string;
    program?: string;
    foodCatalog?: string;
    include?: string;
    exclude?: string;
    bookingInfo?: string;
    cancellationPolicy?: string;
    location: {
        fullAddress?: string;
        country?: string;
        city?: string;
        state?: string;
        postalCode?: string;
    };
    serviceMedias?: Array<{ mediaURL: string }>;
    price?: number;
    discount?: number;
    discountFrom?: string;
    discountTo?: string;
    currency?: string;
    serviceAddons?: Array<{
        name?: string;
        price?: number;
        slot?: string;
        currency?: string;
        description?: string;
        media?: string[];
    }>;
    serviceprofessionals?: Array<{
        id: string;
        name: string;
        profession: string;
        imageUrl: string;
        attachedToService: boolean;
    }>;
}

const dummyRetreat: Retreat = {
    name: "Sunrise Yoga & Wellness Retreat 2025",
    category: { name: "Yoga, Meditation & Holistic Wellness" },
    status: "Unpublished",
    serviceTime: [
        {
            date: "2025-10-01",
            startTime: "07:00 AM",
            endDate: "2025-10-07",
            endTime: "10:00 AM",
            slot: "15",
            isLimitless: false,
        }
    ],
    description: `
    <p>
      Escape to the breathtaking mountains of Sedona for a transformative 7-day yoga and wellness retreat. 
      Surrounded by red rocks and serene landscapes, this retreat is designed to restore balance, 
      improve flexibility, and rejuvenate the mind, body, and spirit.
    </p>
  `,
    benefit: `
    <ul>
      <li>Daily guided yoga and meditation practices</li>
      <li>Holistic workshops on mindfulness and wellness</li>
      <li>Detoxification through organic plant-based meals</li>
      <li>Opportunity to reconnect with nature and self</li>
      <li>Personalized guidance from world-class instructors</li>
    </ul>
  `,
    audience: `
    <p>
      Ideal for yoga practitioners of all levels, wellness enthusiasts, corporate professionals seeking a digital detox, 
      couples looking for a bonding experience, and individuals who want to reconnect with themselves in a supportive community.
    </p>
  `,
    reason: `
    <p>
      In today’s fast-paced world, it’s easy to lose connection with our inner self. This retreat provides a peaceful escape, 
      helping you restore balance, cultivate mindfulness, and return home with renewed clarity and vitality.
    </p>
  `,
    program: `
    <p><strong>Day 1:</strong> Arrival, orientation, welcome circle, evening restorative yoga</p>
    <p><strong>Day 2:</strong> Sunrise meditation, Vinyasa flow, hiking, sound healing session</p>
    <p><strong>Day 3:</strong> Pranayama techniques, chakra alignment workshop, partner yoga</p>
    <p><strong>Day 4:</strong> Sunrise yoga, journaling, guided meditation, spa treatments</p>
    <p><strong>Day 5:</strong> Ashtanga yoga, mindful eating workshop, bonfire ceremony</p>
    <p><strong>Day 6:</strong> Free exploration, group discussion, sunset meditation</p>
    <p><strong>Day 7:</strong> Closing circle, gratitude practice, departure</p>
  `,
    foodCatalog: `
    <p>
      Organic, farm-to-table vegetarian and vegan meals prepared daily by expert chefs.
      Menu highlights include smoothie bowls, fresh salads, Ayurvedic teas, protein-rich legumes, 
      gluten-free breads, and wholesome desserts.
    </p>
  `,
    include: `
    <ul>
      <li>6 nights accommodation in luxury eco-lodges</li>
      <li>3 daily organic vegetarian meals</li>
      <li>Daily yoga and meditation classes</li>
      <li>Wellness workshops and guided activities</li>
      <li>Nature excursions and hikes</li>
      <li>Airport transfers from Sedona</li>
    </ul>
  `,
    exclude: `
    <ul>
      <li>Airfare and travel insurance</li>
      <li>Personal expenses and shopping</li>
      <li>Spa treatments not included in package</li>
      <li>Optional excursions outside the scheduled program</li>
    </ul>
  `,
    bookingInfo: `
    <p>
      Reserve your spot with a 30% deposit. Full payment is due 30 days before the retreat start date. 
      Early bird discounts are available for bookings made 60+ days in advance. 
    </p>
  `,
    cancellationPolicy: `
    <p>
      <strong>Full refund</strong> available up to 30 days before retreat start. 
      <strong>50% refund</strong> if canceled between 15-29 days before. 
      <strong>No refund</strong> within 14 days of start date. 
    </p>
  `,
    location: {
        fullAddress: "123 Mountain View Retreat Center, Peaceful Valley, Sedona",
        country: "USA",
        city: "Sedona",
        state: "Arizona",
        postalCode: "86336",
    },
    serviceMedias: [
        { mediaURL: "/images/user/user-31.jpg" },
        { mediaURL: "/images/user/user-32.jpg" },
        { mediaURL: "/images/user/user-33.jpg" },
    ],
    price: 1200,
    discount: 150,
    discountFrom: "2025-08-01",
    discountTo: "2025-09-01",
    currency: "$",
    serviceAddons: [
        {
            name: "Massage Therapy",
            price: 200,
            slot: "5",
            currency: "$",
            description: "Relaxing 60-minute full-body massages using essential oils.",
            media: ["/images/user/user-31.jpg", "/images/user/user-32.jpg"],
        },
        {
            name: "Sound Healing Session",
            price: 100,
            slot: "10",
            currency: "$",
            description: "Immerse yourself in deep relaxation with crystal bowl therapy.",
            media: ["/images/user/user-33.jpg"],
        },
        {
            name: "Private Yoga Class",
            price: 150,
            slot: "8",
            currency: "$",
            description: "One-on-one yoga session tailored to your level and goals.",
            media: ["/images/user/user-31.jpg"],
        },
    ],
    serviceprofessionals: [
        {
            id: "prof-001",
            name: "Alice Johnson",
            profession: "Lead Yoga Instructor",
            imageUrl: "/images/user/user-31.jpg",
            attachedToService: true,
        },
        {
            id: "prof-002",
            name: "Bob Smith",
            profession: "Massage Therapist",
            imageUrl: "/images/user/user-32.jpg",
            attachedToService: true,
        },
        {
            id: "prof-003",
            name: "Sophia Martinez",
            profession: "Mindfulness Coach",
            imageUrl: "/images/user/user-33.jpg",
            attachedToService: true,
        },
        {
            id: "prof-004",
            name: "David Kim",
            profession: "Sound Healing Specialist",
            imageUrl: "/images/user/user-31.jpg",
            attachedToService: true,
        },
    ],
};


const ViewRetreatDetail: React.FC = () => {
    const router = useRouter();
    // State to hold editable retreat data
    const [retreat, setRetreat] = useState<Retreat>(dummyRetreat);
    const [isEditing, setIsEditing] = useState(false);

    // Helper formatting
    const formatDate = (date: string) => new Date(date).toLocaleDateString();
    const formatTime = (time: string) => time;

    // Handle serviceTime update for a specific index and field
    const updateServiceTime = (
        index: number,
        field: keyof Retreat["serviceTime"][0],
        value: string
    ) => {
        const updatedServiceTime = [...retreat.serviceTime];
        updatedServiceTime[index] = { ...updatedServiceTime[index], [field]: value };
        setRetreat((prev) => ({ ...prev, serviceTime: updatedServiceTime }));
    };

    // Update nested location field
    const updateLocation = (field: keyof Retreat["location"], value: string) => {
        setRetreat((prev) => ({
            ...prev,
            location: { ...prev.location, [field]: value },
        }));
    };

    // Update service addon (only basic fields editable here)
    const updateServiceAddon = (
        index: number,
        field: keyof NonNullable<Retreat["serviceAddons"]>[0],
        value: string | number
    ) => {
        if (!retreat.serviceAddons) return;
        const updatedAddons = [...retreat.serviceAddons];
        updatedAddons[index] = { ...updatedAddons[index], [field]: value };
        setRetreat((prev) => ({ ...prev, serviceAddons: updatedAddons }));
    };

    return (
        <ComponentCard title="Retreat details">
            <div className="p-6  mx-auto">


                <div className="mb-6 flex justify-end ">

                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="mr-2 px-4 py-2 bg-[#C5AF98] text-white rounded flex items-center gap-2"
                            >
                                <EditIcon /> Cancel
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2"
                            >
                                <EditIcon /> Save
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-[#C5AF98] text-white rounded flex items-center gap-2"
                        >
                            <EditIcon /> Edit
                        </button>
                    )}

                    <button
                        onClick={() => setIsEditing(false)}
                        className="mr-2 px-4 py-2 bg-red-600 text-white rounded flex items-center gap-2 ml-5"
                    >
                        <EditIcon /> Delete
                    </button>
                </div>

                {retreat?.name && (
                    <>
                        <ComponentCard title="Basic Info" className="mb-6 !bg-[#FAF2E5]">
                            <PreviewCard
                                label="Name*"
                                value={retreat.name}
                                editable={isEditing}
                                onChange={(val) => setRetreat((prev) => ({ ...prev, name: val }))}
                            />
                            <PreviewCard
                                label="Sub-category"
                                value={retreat?.category?.name || ""}
                            //
                            />

                            {retreat.serviceTime.map((item, index) => (
                                <div className=" rounded mb-4" key={index}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <PreviewCard
                                            label="Date*"
                                            value={item.date}
                                            editable={isEditing}
                                            onChange={(val) => updateServiceTime(index, "date", val)}
                                            inputType="date" // added
                                        />
                                        <PreviewCard
                                            label="Start Time*"
                                            value={item.startTime}
                                            editable={isEditing}
                                            onChange={(val) => updateServiceTime(index, "startTime", val)}
                                            inputType="time" // added
                                        />
                                    </div>
                                    <div className="flex gap-4 mt-2">
                                        <PreviewCard
                                            label="End Date*"
                                            value={item.endDate}
                                            editable={isEditing}
                                            onChange={(val) => updateServiceTime(index, "endDate", val)}
                                            inputType="date" // added
                                        />
                                        <PreviewCard
                                            label="End Time*"
                                            value={item.endTime}
                                            editable={isEditing}
                                            onChange={(val) => updateServiceTime(index, "endTime", val)}
                                            inputType="time" // added
                                        />
                                    </div>
                                    <PreviewCard
                                        label="Available Slots*"
                                        value={item.slot}
                                        editable={isEditing}
                                        onChange={(val) => updateServiceTime(index, "slot", val)}
                                        inputType="text"
                                    />
                                    {item.isLimitless && (
                                        <p className="text-xs text-green-700 mt-1">Slot has no limits</p>
                                    )}
                                </div>
                            ))}

                        </ComponentCard>
                        <ComponentCard title="Additional Details" className="mb-6 !bg-[#FAF2E5]">


                            <PreviewCard
                                isHtml
                                label="Description*"
                                value={retreat.description || ""}
                                editable={isEditing}
                                onChange={(val) => setRetreat((prev) => ({ ...prev, description: val }))}
                                textarea
                            />
                            <PreviewCard
                                isHtml
                                label="Benefits"
                                value={retreat.benefit || ""}
                                editable={isEditing}
                                onChange={(val) => setRetreat((prev) => ({ ...prev, benefit: val }))}
                                textarea
                            />
                            <PreviewCard
                                isHtml
                                label="Who is this retreat for"
                                value={retreat.audience || ""}
                                editable={isEditing}
                                onChange={(val) => setRetreat((prev) => ({ ...prev, audience: val }))}
                                textarea
                            />
                            <PreviewCard
                                isHtml
                                label="Why this retreat"
                                value={retreat.reason || ""}
                                editable={isEditing}
                                onChange={(val) => setRetreat((prev) => ({ ...prev, reason: val }))}
                                textarea
                            />
                            <PreviewCard
                                isHtml
                                label="Program"
                                value={retreat.program || ""}
                                editable={isEditing}
                                onChange={(val) => setRetreat((prev) => ({ ...prev, program: val }))}
                                textarea
                            />
                            <PreviewCard
                                isHtml
                                label="Food Catalog"
                                value={retreat.foodCatalog || ""}
                                editable={isEditing}
                                onChange={(val) => setRetreat((prev) => ({ ...prev, foodCatalog: val }))}
                                textarea
                            />
                            <PreviewCard
                                isHtml
                                label="Include"
                                value={retreat.include || ""}
                                editable={isEditing}
                                onChange={(val) => setRetreat((prev) => ({ ...prev, include: val }))}
                                textarea
                            />
                            <PreviewCard
                                isHtml
                                label="Exclude"
                                value={retreat.exclude || ""}
                                editable={isEditing}
                                onChange={(val) => setRetreat((prev) => ({ ...prev, exclude: val }))}
                                textarea
                            />
                            <PreviewCard
                                isHtml
                                label="Booking Info"
                                value={retreat.bookingInfo || ""}
                                editable={isEditing}
                                onChange={(val) => setRetreat((prev) => ({ ...prev, bookingInfo: val }))}
                                textarea
                            />
                            <PreviewCard
                                isHtml
                                label="Cancellation Policy"
                                value={retreat.cancellationPolicy || ""}
                                editable={isEditing}
                                onChange={(val) => setRetreat((prev) => ({ ...prev, cancellationPolicy: val }))}
                                textarea
                            />

                        </ComponentCard>
                        <ComponentCard title="Location" className="mb-6 !bg-[#FAF2E5]">


                            <PreviewCard
                                label="Full Address*"
                                value={retreat.location.fullAddress || ""}
                                editable={isEditing}
                                onChange={(val) => updateLocation("fullAddress", val)}
                            />
                            <PreviewCard
                                label="Country*"
                                value={retreat.location.country || ""}
                                editable={isEditing}
                                onChange={(val) => updateLocation("country", val)}
                            />
                            <PreviewCard
                                label="City*"
                                value={retreat.location.city || ""}
                                editable={isEditing}
                                onChange={(val) => updateLocation("city", val)}
                            />
                            <PreviewCard
                                label="State*"
                                value={retreat.location.state || ""}
                                editable={isEditing}
                                onChange={(val) => updateLocation("state", val)}
                            />
                            <PreviewCard
                                label="Postal Code*"
                                value={retreat.location.postalCode || ""}
                                editable={isEditing}
                                onChange={(val) => updateLocation("postalCode", val)}
                            />

                        </ComponentCard>

                        {/* --- MEDIA SECTION --- */}
                        <ComponentCard title="Media" className="mb-6 !bg-[#FAF2E5]">
                            {isEditing ? (
                                <>
                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                        {retreat.serviceMedias?.map((media, idx) => (
                                            <div key={idx} className="relative group">
                                                {media.mediaURL.endsWith(".mp4") ? (
                                                    <video
                                                        src={media.mediaURL}
                                                        controls
                                                        className="rounded-lg w-full h-48 object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={media.mediaURL}
                                                        alt={`Media ${idx + 1}`}
                                                        className="rounded-lg w-full h-48 object-cover"
                                                    />
                                                )}
                                                <button
                                                    onClick={() => {
                                                        const updated =
                                                            retreat.serviceMedias?.filter((_, i) => i !== idx) || [];
                                                        setRetreat((prev) => ({ ...prev, serviceMedias: updated }));
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <FileUploader
                                        onFilesAdded={(files) => {
                                            const newMedia = files.map((file) => ({
                                                mediaURL: URL.createObjectURL(file), // temp preview
                                            }));
                                            setRetreat((prev) => ({
                                                ...prev,
                                                serviceMedias: [...(prev.serviceMedias || []), ...newMedia],
                                            }));
                                        }}
                                    />
                                </>
                            ) : (
                                <div className="grid grid-cols-4 gap-4">
                                    {retreat.serviceMedias?.map((media, idx) => (
                                        <img
                                            key={idx}
                                            src={media.mediaURL}
                                            alt={`Media ${idx + 1}`}
                                            className="rounded-lg object-cover w-full h-48"
                                        />
                                    ))}
                                </div>
                            )}
                        </ComponentCard>
                        <ComponentCard title="Pricing & Discounts" className="mb-6 !bg-[#FAF2E5]" >


                            <div className="flex flex-col gap-4 w-full">
                                <PreviewCard
                                    label="Price*"
                                    value={retreat.price?.toString() || ""}
                                    editable={isEditing}
                                    onChange={(val) => setRetreat((prev) => ({ ...prev, price: Number(val) }))}
                                    inputType="number"
                                />
                                <PreviewCard
                                    label="Discount"
                                    value={retreat.discount?.toString() || ""}
                                    editable={isEditing}
                                    onChange={(val) => setRetreat((prev) => ({ ...prev, discount: Number(val) }))}
                                    inputType="number"
                                />
                                <PreviewCard
                                    label="Discount From"
                                    value={retreat.discountFrom || ""}
                                    editable={isEditing}
                                    onChange={(val) => setRetreat((prev) => ({ ...prev, discountFrom: val }))}
                                    inputType="date"
                                />
                                <PreviewCard
                                    label="Discount To"
                                    value={retreat.discountTo || ""}
                                    editable={isEditing}
                                    onChange={(val) => setRetreat((prev) => ({ ...prev, discountTo: val }))}
                                    inputType="date"
                                />
                                <PreviewCard
                                    label="Currency"
                                    value={retreat.currency || ""}
                                    editable={isEditing}
                                    onChange={(val) => setRetreat((prev) => ({ ...prev, currency: val }))}
                                />
                            </div>

                        </ComponentCard>
                        {/* --- ADDONS SECTION WITH MEDIA --- */}
                        <ComponentCard title="Add-ons" className="mb-6 !bg-[#FAF2E5]">
                            {retreat.serviceAddons?.map((addon, index) => (
                                <div key={index} className="border rounded p-4 mb-4 w-full">
                                    <PreviewCard
                                        label="Name"
                                        value={addon.name || ""}
                                        editable={isEditing}
                                        onChange={(val) => updateServiceAddon(index, "name", val)}
                                    />
                                    <PreviewCard
                                        label="Price"
                                        value={addon.price?.toString() || ""}
                                        editable={isEditing}
                                        onChange={(val) => updateServiceAddon(index, "price", Number(val))}
                                        inputType="number"
                                    />
                                    <PreviewCard
                                        label="Slots"
                                        value={addon.slot || ""}
                                        editable={isEditing}
                                        onChange={(val) => updateServiceAddon(index, "slot", val)}
                                        inputType="text"
                                    />
                                    <PreviewCard
                                        label="Currency"
                                        value={addon.currency || ""}
                                        editable={isEditing}
                                        onChange={(val) => updateServiceAddon(index, "currency", val)}
                                    />
                                    <PreviewCard
                                        isHtml
                                        label="Description"
                                        value={addon.description || ""}
                                        editable={isEditing}
                                        onChange={(val) => updateServiceAddon(index, "description", val)}
                                        textarea
                                    />

                                    {/* Addon media */}
                                    {isEditing ? (
                                        <>
                                            <div className="grid grid-cols-4 gap-4 mb-4">
                                                {addon.media?.map((mediaUrl, idx) => (
                                                    <div key={idx} className="relative group">
                                                        {mediaUrl.endsWith(".mp4") ? (
                                                            <video
                                                                src={mediaUrl}
                                                                controls
                                                                className="rounded-lg w-full h-32 object-cover"
                                                            />
                                                        ) : (
                                                            <img
                                                                src={mediaUrl}
                                                                alt={`Addon media ${idx + 1}`}
                                                                className="rounded-lg w-full h-32 object-cover"
                                                            />
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                const updatedAddons = [...(retreat.serviceAddons || [])];
                                                                updatedAddons[index].media =
                                                                    updatedAddons[index].media?.filter((_, i) => i !== idx) || [];
                                                                setRetreat((prev) => ({
                                                                    ...prev,
                                                                    serviceAddons: updatedAddons,
                                                                }));
                                                            }}
                                                            className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <FileUploader
                                                onFilesAdded={(files) => {
                                                    const newMedia = files.map((file) =>
                                                        URL.createObjectURL(file)
                                                    );
                                                    const updatedAddons = [...(retreat.serviceAddons || [])];
                                                    updatedAddons[index].media = [
                                                        ...(updatedAddons[index].media || []),
                                                        ...newMedia,
                                                    ];
                                                    setRetreat((prev) => ({
                                                        ...prev,
                                                        serviceAddons: updatedAddons,
                                                    }));
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <div className="grid grid-cols-4 gap-4">
                                            {addon.media?.map((mediaUrl, idx) => (
                                                <img
                                                    key={idx}
                                                    src={mediaUrl}
                                                    alt={`Addon media ${idx + 1}`}
                                                    className="rounded-lg object-cover w-full h-32"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </ComponentCard>
                        <ComponentCard title="Service Professionals" className="mb-6 !bg-[#FAF2E5]">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {retreat.serviceprofessionals?.map((prof) => (
                                    <div
                                        key={prof.id}
                                        className="flex flex-col items-center bg-[#FAF2E5] rounded-lg shadow p-4"
                                    >
                                        <img
                                            src={prof.imageUrl}
                                            alt={prof.name}
                                            className="w-20 h-20 rounded-full object-cover mb-3"
                                        />
                                        <p className="font-semibold text-gray-800">{prof.name}</p>
                                        <p className="text-sm text-gray-500">{prof.profession}</p>
                                    </div>
                                ))}
                            </div>
                        </ComponentCard>
                    </>
                )}
            </div>
        </ComponentCard>
    );
};

export default ViewRetreatDetail;
