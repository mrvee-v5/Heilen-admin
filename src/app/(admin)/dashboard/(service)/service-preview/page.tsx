// app/retreat-detail/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDownIcon, ChevronUpIcon } from "@/icons";
import { getServiceDetail } from "@/services/services.service";

/**
 * Full Retreat Detail Page (Next.js + Tailwind)
 * - Image carousel header with overlay nav & "See more" button
 * - Sticky compact header appears on scroll
 * - Modal gallery (See more)
 * - Action buttons, info rows, CTA footer
 * - Accordion sections (RetreatActionBar)
 *
 * Uses only React + Tailwind classes (no external icon libs required).
 */

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

/* ---------------- Dummy data ---------------- */
const dummyService = {
    id: "svc-001",
    name: "Peaceful Mountain Retreat",
    images: [
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80&auto=format&fit=crop",
    ],
    otherMedia: [
        "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1526779259211-4f6b6f6b7a9a?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1497215728101-855ad9c5d003?q=80&w=1770&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1534354271811-9a4c58df189c?q=80&w=1770&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1770&auto=format&fit=crop",
    ],
    description: "Recharge your mind, body, and spirit in the serene beauty of the mountains.",
    fullDescription: "Nestled in a secluded valley, our retreat offers a tranquil escape from the hustle and bustle of city life. The program is carefully crafted to cater to all levels, from beginners to experienced practitioners. You'll enjoy daily yoga sessions led by certified instructors, deep-dive meditation workshops, and peaceful hikes through ancient forests. All meals are locally sourced, organic, and prepared with your wellness in mind.",
    startDate: "2025-11-10",
    endDate: "2025-11-14",
    duration: "5 days, 4 nights",
    location: {
        country: "Nigeria",
        address: "Peace Valley, Hilltop",
        venue: "Tranquil Meadows Wellness Center",
        coordinates: {
            lat: 9.0765,
            lng: 7.3986
        }
    },
    price: "$499",
    currency: "USD",
    organizer: {
        name: "Jane Doe",
        image: "/images/user/user-21.jpg",
        description: "Jane is an experienced retreat leader with over a decade of experience in holistic wellness, mindfulness, and coaching. She believes in creating a supportive and nurturing environment for all participants.",
        rating: 4.8,
        reviews: 75,
        certifications: ["Certified Yoga Instructor (200 RYT)", "Mindfulness-Based Stress Reduction (MBSR) Practitioner"]
    },
    professionals: [
        { id: 1, name: "John Smith", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=60&auto=format&fit=crop", role: "Yoga Instructor", bio: "John specializes in Vinyasa and restorative yoga, focusing on gentle movements and deep relaxation." },
        { id: 2, name: "Emily Brown", image: "https://images.unsplash.com/photo-1545996124-5fcd6f15c6ae?w=200&q=60&auto=format&fit-crop", role: "Meditation Guide", bio: "Emily has studied various meditation techniques and helps participants cultivate a practice that fits their lifestyle." },
    ],
    benefit: "Reduce stress, gain clarity, and improve overall wellness. You will leave feeling refreshed, centered, and with a deeper connection to nature and yourself.",
    bookingInfo: "Reserve your spot early as space is limited to ensure a personalized experience for every participant. A non-refundable deposit is required at the time of booking to secure your reservation.",
    includedDetails: ["Accommodation for 4 nights", "Three gourmet vegetarian meals per day", "Daily yoga and meditation sessions", "Guided hikes and nature walks", "Access to on-site wellness facilities"],
    excludedDetails: ["Travel expenses to and from the retreat location", "Personal insurance", "Optional spa treatments or one-on-one coaching sessions"],
    cancellationPolicy: "Full refund if canceled 30 days before the event. Cancellations made within 15-29 days will receive a 50% refund. No refunds will be provided for cancellations within 14 days of the event. Exceptions may be considered for documented emergencies.",
    otherRetreats: [
        { id: "r1", name: "Beachside Wellness", date: "Jan 2026", price: "$999", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=60&auto=format&fit=crop" },
        { id: "r2", name: "Forest Healing", date: "Mar 2026", price: "$799", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=60&auto=format&fit=crop" },
        { id: "r3", name: "Urban Mindfulness", date: "Apr 2026", price: "$350", image: "https://images.unsplash.com/photo-1534354271811-9a4c58df189c?q=80&w=1770&auto=format&fit=crop" },
    ],
    futureDates: [
        { startDate: "2025-11-10", availableSlots: 2, price: 499, addOns: [{ name: "Airport transfer", price: 50 }, { name: "Extra workshop", price: 75 }] },
        { startDate: "2026-03-15", availableSlots: 5, price: 520, addOns: [{ name: "Private coaching session", price: 100 }] }
    ],
    reviews: [
        { id: "rev-1", author: "Alex K.", rating: 5, comment: "An incredible experience. I felt completely rejuvenated and at peace. Jane is a wonderful guide!" },
        { id: "rev-2", author: "Samantha T.", rating: 4, comment: "The venue was stunning and the food was amazing. The schedule was a bit packed, but overall, it was a great retreat." }
    ]
};

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
const PrimaryButton = ({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void, className?: string }) => (
    <button onClick={onClick} className={`w-full bg-[#C06A4D]  text-white py-3 rounded-lg font-semibold ${className}`}>
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

/* ---------------- Main Page ---------------- */

export default function RetreatDetailPage() {
    const router = useRouter();
    const params = useSearchParams();
    const serviceId = params.get("id"); // /retreat-detail?id=<serviceId>

    const [svc, setSvc] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isGalleryOpen, setGalleryOpen] = useState(false);
    const [showCompactHeader, setShowCompactHeader] = useState(false);

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

    const getFirstSlots = (fd: any[] = []) => {
        const found = fd.find((r) => r.availableSlots > 0);
        return found ? found.availableSlots : 0;
    };

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
                            <div className="text-xs text-gray-500">
                                {svc?.location?.country} • {svc.startDate}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded bg-white"><IconShare /></button>
                            <button className="p-2 rounded bg-white"><IconChat /></button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto">
                {/* Carousel */}
                <section className="relative bg-[#FAF2E5]">
                    <RetImageCarousel
                        images={svc.medias?.map((m: any) => m.mediaURL) ?? []}
                        onOpenGallery={() => setGalleryOpen(true)}
                    />

                    <div className="py-4 mt-10">
                        <div className="bg-[#FAF2E5] rounded-xl p-4">
                            <h1 className="text-xl font-bold text-[#54392A]">{svc.name}</h1>
                            <p className="text-sm text-gray-500 mt-1">{svc.textDescription}</p>

                            <div className="mb-5 mt-5 text-sm text-gray-600">
                                <div className="flex items-center gap-2 mb-3">
                                    <IconCalendar />
                                    <span>{svc.startDate} - {svc.endDate}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <IconLocation />
                                    <span>{svc.location?.fullAddress}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <IconMoney />
                                    <span className="font-semibold">
                                        {svc.currency} {svc.price}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                                <button className="flex items-center gap-2 border border-gray-200 rounded px-3 py-2 text-sm">
                                    <IconLocation /> View on Map
                                </button>
                                <button className="flex items-center gap-2 border border-gray-200 rounded px-3 py-2 text-sm">
                                    <IconChat /> Plan a discovery call
                                </button>
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
                                    <img src={svc.organizerImage} alt={svc.organizerName} />
                                </div>
                                <div>
                                    <div className="font-semibold text-[#54392A]">{svc.organizerName}</div>
                                    <div className="text-sm text-gray-600">{svc.organizerDescription}</div>
                                    <div className="flex items-center gap-1 text-yellow-500 mt-1">
                                        <IconStar /> <span>{svc.organizerRating}</span>
                                    </div>
                                </div>
                            </div>
                        </RetreatActionBar>

                        <RetreatActionBar title="Facilitators">
                            <div className="flex gap-3 overflow-x-auto py-2">
                                {svc.professionals?.map((p: any) => (
                                    <TeamCard key={p.id} data={{ name: p.name, image: p.image }} />
                                ))}
                            </div>
                        </RetreatActionBar>

                        <RetreatActionBar title="Benefits">
                            <div dangerouslySetInnerHTML={{ __html: svc.benefit }} />
                        </RetreatActionBar>

                        <RetreatActionBar title="Included">
                            <div dangerouslySetInnerHTML={{ __html: svc.includedDetails }} />
                        </RetreatActionBar>

                        <RetreatActionBar title="Excluded">
                            <div dangerouslySetInnerHTML={{ __html: svc.excludedDetails }} />
                        </RetreatActionBar>

                        <RetreatActionBar title="Cancellation policy">
                            <div dangerouslySetInnerHTML={{ __html: svc.cancellationPolicy }} />
                        </RetreatActionBar>
                    </div>
                </section>

                <div className="h-24" />
            </main>

            {/* Footer CTA */}
            <div className="w-full bg-white/95 border-t border-gray-200 p-4 mt-8">
                <div className="max-w-5xl mx-auto px-4 flex gap-3">
                    <div className="flex-1 text-lg font-semibold">
                        {getFirstSlots(svc.futureDates)} slots left
                    </div>
                    <div className="w-48">
                        <PrimaryButton>Approve</PrimaryButton>
                    </div>
                    <div className="w-48">
                        <PrimaryButton className="!bg-[#54392A]" onClick={() => router.push("/dashboard/service-detail")}>
                            Edit
                        </PrimaryButton>
                    </div>
                    <div className="w-48">
                        <PrimaryButton className="!bg-[#EB5757]">Reject</PrimaryButton>
                    </div>
                </div>
            </div>

            {/* Media gallery modal */}
            <MediaModal
                open={isGalleryOpen}
                images={svc.medias?.map((m: any) => m.mediaURL) ?? []}
                onClose={() => setGalleryOpen(false)}
            />
        </div>
    );
}