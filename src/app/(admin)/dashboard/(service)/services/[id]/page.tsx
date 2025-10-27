"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronDownIcon, ChevronUpIcon } from "@/icons";
import { getServiceDetail } from "@/services/services.service";
import { updatePublishStatus } from "@/services/services.service";
import { Modal } from "@/components/ui/modal";
import { useAlert } from "@/components/context/AlertContext";

/* ---------- small SVG icons as components ---------- */
const IconChevronLeft = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const IconChevronRight = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const IconShare = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 6l-4-4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 2v14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IconChat = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IconCalendar = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
);
const IconClock = ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" /><path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IconLocation = ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 1118 0z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" /></svg>
);
const IconMoney = ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 1v22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><path d="M17 5H9a4 4 0 000 8h6a4 4 0 010 8H7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IconStar = ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.431L23 9.748l-5.5 5.356L18.335 24 12 20.201 5.665 24 7.5 15.104 2 9.748l7.332-1.73z" /></svg>
);
const IconClose = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);


/* ------------- helper small components ------------- */
function RetImageCarousel({ images, onOpenGallery }: { images: string[]; onOpenGallery: () => void }) {
    const [index, setIndex] = useState(0);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        // auto cycle every 5s
        timerRef.current = window.setInterval(() => setIndex((i) => (i + 1) % images.length), 5000);
        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current);
        };
    }, [images.length]);

    return (
        <div className="relative w-full ">
            <div className="w-full aspect-[16/9] bg-gray-100 overflow-hidden rounded-2xl">
                <img
                    src={images[index]}
                    alt={`slide-${index}`}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* overlay nav icons (top-left/back, top-right actions) */}
            <div className="absolute inset-0 px-4 pt-4 pointer-events-none">
                <div className="flex justify-between items-start">
                    <button
                        onClick={() => window.history.back()}
                        className="pointer-events-auto bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm"
                        aria-label="back"
                    >
                        <IconChevronLeft size={18} />
                    </button>

                    <div className="flex gap-2 items-center pointer-events-auto">
                        <button className="bg-white/90 p-2 rounded-full shadow-sm" aria-label="share">
                            <IconShare />
                        </button>
                    </div>
                </div>
            </div>

            {/* left/right arrows */}
            <button
                onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow pointer-events-auto"
                aria-label="prev"
            >
                <IconChevronLeft />
            </button>
            <button
                onClick={() => setIndex((i) => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow pointer-events-auto"
                aria-label="next"
            >
                <IconChevronRight />
            </button>

            {/* dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`w-2 h-2 rounded-full ${i === index ? "bg-white" : "bg-white/60"}`}
                        aria-label={`dot-${i}`}
                    />
                ))}
            </div>
        </div>
    );
}

function MediaModal({ open, images, onClose }: { open: boolean; images: string[]; onClose: () => void }) {
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        if (!open) setIdx(0);
    }, [open]);
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
            <div className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b">
                    <div />
                    <button onClick={onClose} className="p-2 text-gray-700">
                        <IconClose />
                    </button>
                </div>
                <div className="p-4">
                    <div className="w-full aspect-[16/9] bg-gray-100 overflow-hidden rounded">
                        <img src={images[idx]} alt={`media-${idx}`} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex items-center justify-between mt-3 gap-2">
                        <div className="flex gap-2 overflow-auto">
                            {images.map((img, i) => (
                                <button key={i} onClick={() => setIdx(i)} className={`w-20 h-14 rounded overflow-hidden ${i === idx ? "ring-2 ring-green-600" : ""}`}>
                                    <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setIdx((p) => Math.max(0, p - 1))} className="px-3 py-2 bg-gray-100 rounded">Prev</button>
                            <button onClick={() => setIdx((p) => Math.min(images.length - 1, p + 1))} className="px-3 py-2 bg-gray-100 rounded">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------- IconRounded small helper ---------- */
const IconRounded = ({ children, bg = "bg-white", size = 10 }: { children: React.ReactNode; bg?: string; size?: number }) => (
    <div className={`w-${size} h-${size} rounded-full ${bg} flex items-center justify-center`}>
        {children}
    </div>
);

/* ---------- Call-to-action button ---------- */
const PrimaryButton = ({ children, onClick, className, disabled }: { children: React.ReactNode; onClick?: () => void, className?: string, disabled?: boolean }) => (
    <button onClick={onClick} className={`w-full bg-[#C06A4D] text-white py-3 rounded-lg font-semibold ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} disabled={disabled}>
        {children}
    </button>
);

/* ---------- Collapsible action bar ---------- */
const RetreatActionBar = ({ title, children, defaultOpen = true }: { title: string; children?: React.ReactNode; defaultOpen?: boolean }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className=" border-b border-gray-100 py-3">
            <button onClick={() => setOpen((s) => !s)} className="bg-[#54392A] w-full flex items-center justify-between p-3 overflow-hidden rounded">
                <span className="text-lg font-semibold text-[#FAF2E5]">{title}</span>
                <span className="text-[#FAF2E5]">{open ? <ChevronUpIcon /> : <ChevronDownIcon />}</span>
            </button>
            {open && <div className="mt-3 text-[#54392A]">{children}</div>}
        </div>
    );
};

/* ---------- TeamCard simple ---------- */
const TeamCard = ({ data }: { data: { name: string; image: string } }) => (
    <div className="w-36 flex-shrink-0  rounded-lg p-3 text-center">
        <div className="w-16 h-16 mx-auto rounded-full overflow-hidden">
            <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
        </div>
        <div className="mt-2 text-sm font-medium">{data.name}</div>
    </div>
);

/* ---------- New Modal component for Remark ---------- */
const RemarkModal = ({
    isOpen,
    onClose,
    onConfirm,
    status,
    isSaving
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (remark: string) => void;
    status: "Publish" | "Unpublish";
    isSaving: boolean;
}) => {
    const [remark, setRemark] = useState("");

    return (
        <Modal showCloseButton={false} isOpen={isOpen} onClose={onClose} className="max-w-[400px] m-4">
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden dark:bg-gray-900">
                    {/* Header */}
                    <div className="flex justify-between items-center bg-[#54392A] px-5 py-3">
                        <h4 className="text-xl font-semibold text-white">{status} Service</h4>
                        <button
                            onClick={onClose}
                            className="text-white text-xl hover:text-gray-300"
                            aria-label="Close modal"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        <div className="mb-4">
                            <label htmlFor="remark" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Remark (required)
                            </label>
                            <textarea
                                id="remark"
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                rows={4}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-[#C06A4D] focus:ring-[#C06A4D] sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border rounded-lg text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => onConfirm(remark)}
                                disabled={!remark.trim() || isSaving}
                                className="px-4 py-2 bg-[#C06A4D] text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? "Saving..." : `Confirm ${status}`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};



/* ---------------- Main Page ---------------- */
export default function RetreatDetailPage() {
    const router = useRouter();
    const params = useParams();
    const serviceId: any = params.id;

    const [svc, setSvc] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isGalleryOpen, setGalleryOpen] = useState(false);
    const [showCompactHeader, setShowCompactHeader] = useState(false);
    const [isRemarkModalOpen, setRemarkModalOpen] = useState(false);
    const [isUpdatingStatus, setUpdatingStatus] = useState(false);
    const [targetStatus, setTargetStatus] = useState<"Publish" | "Unpublish">("Publish");
    const { showAlert } = useAlert();

    // Fetch retreat detail
    useEffect(() => {
        if (!serviceId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getServiceDetail(serviceId);
                setSvc(data);
            } catch (err) {
                console.error("Failed to fetch service", err);
                setError("Failed to load retreat details.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [serviceId]);

    // Sticky header toggle
    useEffect(() => {
        const onScroll = () => {
            setShowCompactHeader(window.scrollY > 180);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const getFirstSlots = (slots: any[] = []) => {
        const found = slots.find((r) => !r.isLimitless);
        return found ? found.slot : 0;
    };

    const handleUpdateStatus = async (publish: boolean, remark: string) => {
        if (isUpdatingStatus || !remark.trim()) return;

        try {
            setUpdatingStatus(true);
            await updatePublishStatus(serviceId, publish, remark);
            const updatedData = await getServiceDetail(serviceId);
            setSvc(updatedData);
            setRemarkModalOpen(false);
            showAlert(
                "success",
                "Publish status updated",
                "Service status updated successfully."
            );
        } catch (err) {
            console.error("Failed to update service status", err);
            showAlert(
                "error",
                "Error",
                "Failed to update service status. Please try again."
            );
        } finally {
            setUpdatingStatus(false);
        }
    };

    const isPublished = svc?.isPublished;
    const buttonText = isPublished ? "Unpublish" : "Publish";
    const buttonColorClass = isPublished ? "!bg-[#EB5757]" : "";

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-600">
                Loading retreat details...
            </div>
        );
    }

    if (error || !svc) {
        return (
            <div className="flex items-center justify-center h-screen text-red-500">
                {error || "Retreat not found"}
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Sticky compact header */}
            <div
                className={`fixed top-0 left-0 right-0 z-40 transition-transform ${showCompactHeader ? "translate-y-0" : "-translate-y-20"
                    } transform-gpu`}
            >
                <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
                    <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-3">
                        <button onClick={() => router.back()} className="p-1 rounded-full bg-white">
                            <IconChevronLeft />
                        </button>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-[#54392A]">{svc.name}</div>
                            <div className="text-xs text-[#54392A]">
                                {svc?.location?.country} •{" "}
                                {svc.timeSlots?.[0]?.startDate}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded bg-white">
                                <IconShare />
                            </button>
                            <button className="p-2 rounded bg-white">
                                <IconChat />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto">
                {/* Carousel */}
                <section className="relative bg-[#FAF2E5]">
                    <RetImageCarousel
                        images={svc.media?.map((m: any) => m.mediaURL) ?? []}
                        onOpenGallery={() => setGalleryOpen(true)}
                    />

                    <div className="py-4 mt-10">
                        <div className="bg-[#FAF2E5] rounded-xl p-4">
                            <h1 className="text-xl font-bold text-[#54392A]">{svc.name}</h1>
                            <p className="text-sm text-[#54392A] mt-1">
                                {svc.shortDescription}
                            </p>

                            <div className="mb-5 mt-5 text-sm text-[#54392A]">
                                <div className="flex items-center gap-2 mb-3">
                                    <IconCalendar />
                                    <span>
                                        {svc.timeSlots?.[0]?.startDate} -{" "}
                                        {svc.timeSlots?.[0]?.endDate}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <IconLocation />
                                    <span>{svc.location?.fullAddress}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="font-semibold">
                                        {svc.currency} {svc.price}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Accordions */}
                <section>
                    <div className="bg-[#FAF2E5] rounded-xl p-4 shadow-sm">
                        <RetreatActionBar title="About this retreat" defaultOpen>
                            <div dangerouslySetInnerHTML={{ __html: svc.description }} />
                        </RetreatActionBar>

                        <RetreatActionBar title="Program">
                            <div dangerouslySetInnerHTML={{ __html: svc.program }} />
                        </RetreatActionBar>

                        <RetreatActionBar title="Food">
                            <div dangerouslySetInnerHTML={{ __html: svc.foodCatalog }} />
                        </RetreatActionBar>

                        <RetreatActionBar title="Meet the organizer" defaultOpen>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full overflow-hidden">
                                    <img
                                        src={svc.business?.owner?.profileImg}
                                        alt={svc.business?.owner?.name}
                                    />
                                </div>
                                <div>
                                    <div className="font-semibold text-[#54392A]">
                                        {svc.business?.owner?.name}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {svc.business?.businessName}
                                    </div>
                                    {/* <div className="flex items-center gap-1 text-yellow-500 mt-1">
                                        <IconStar />{" "}
                                        <span>
                                            {svc.statistics?.averageRating ?? 0}
                                        </span>
                                    </div> */}
                                </div>
                            </div>
                        </RetreatActionBar>

                        <RetreatActionBar title="Facilitators">
                            <div className="flex gap-3 overflow-x-auto py-2">
                                {svc.professionals?.map((p: any) => (
                                    <TeamCard
                                        key={p.id}
                                        data={{
                                            name: p.name,
                                            image: p.profileImg,
                                        }}
                                    />
                                ))}
                            </div>
                        </RetreatActionBar>

                        <RetreatActionBar title="Benefits">
                            <div dangerouslySetInnerHTML={{ __html: svc.benefit }} />
                        </RetreatActionBar>

                        {/* Add-ons */}
                        <RetreatActionBar title="Available Add-ons">
                            <div className="space-y-4">
                                {svc.addOns?.map((addon: any) => (
                                    <div
                                        key={addon.id}
                                        className="border border-gray-200 rounded-lg p-4 flex flex-col gap-4 shadow-sm"
                                    >
                                        <div className="text-sm font-medium text-gray-500">
                                            {addon.currency} {addon.price} &bull;{" "}
                                            {addon.slot} slots
                                        </div>

                                        <div className="flex-1">
                                            <h4 className="font-semibold text-[#54392A]">
                                                {addon.name}
                                            </h4>
                                            <p className="text-sm text-[#54392A] mt-1">
                                                {addon.description}
                                            </p>
                                        </div>

                                        {addon.media?.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {addon.media.map(
                                                    (img: string, idx: number) => (
                                                        <div
                                                            key={idx}
                                                            className="w-full h-24 overflow-hidden rounded-lg bg-gray-100"
                                                        >
                                                            <img
                                                                src={img}
                                                                alt={`${addon.name} image ${idx + 1
                                                                    }`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </RetreatActionBar>

                        <RetreatActionBar title="Included">
                            <div dangerouslySetInnerHTML={{ __html: svc.include }} />
                        </RetreatActionBar>

                        <RetreatActionBar title="Excluded">
                            <div dangerouslySetInnerHTML={{ __html: svc.exclude }} />
                        </RetreatActionBar>

                        <RetreatActionBar title="Cancellation policy">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: svc.cancellationPolicy,
                                }}
                            />
                        </RetreatActionBar>
                    </div>
                </section>

                <div className="h-24" />
            </main>

            {/* Footer CTA */}
            <div className="w-full bg-white/95 border-t border-gray-200 p-4 mt-8">
                <div className="max-w-5xl mx-auto px-4 flex gap-3">
                    <div className="flex-1 text-lg font-semibold">
                        {getFirstSlots(svc.timeSlots)} slots left
                    </div>
                    <div className="w-48">
                        <PrimaryButton
                            onClick={() => {
                                setTargetStatus(isPublished ? "Unpublish" : "Publish");
                                setRemarkModalOpen(true);
                            }}
                            className={buttonColorClass}
                            disabled={isUpdatingStatus}
                        >
                            {isUpdatingStatus ? "Updating..." : buttonText}
                        </PrimaryButton>
                    </div>
                </div>
            </div>

            {/* Media gallery modal */}
            <MediaModal
                open={isGalleryOpen}
                images={svc.media?.map((m: any) => m.mediaURL) ?? []}
                onClose={() => setGalleryOpen(false)}
            />

            {/* Remark Modal for Publish/Reject */}
            <RemarkModal
                isOpen={isRemarkModalOpen}
                onClose={() => setRemarkModalOpen(false)}
                onConfirm={(remark) =>
                    handleUpdateStatus(targetStatus === "Publish", remark)
                }
                status={targetStatus}
                isSaving={isUpdatingStatus}
            />
        </div>
    );
}
