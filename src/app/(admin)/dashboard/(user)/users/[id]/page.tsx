"use client";
import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import BusinessInfoCard from "@/components/user-profile/BusinessInforCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { getUserById } from "@/services/users.service";
import { UserDetail } from "@/services/types";
import { useParams } from "next/navigation";


export default function BasicTables() {
    const [user, setUser] = useState<UserDetail | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const USER_ID: any = params.id;


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUserById(USER_ID);
                setUser(userData);
                setIsLoading(false);
            } catch (err) {
                setError("Failed to fetch user data.");
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [USER_ID]);

    if (isLoading) {
        return <div>Loading user data...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!user) {
        return <div>No user data found.</div>;
    }

    return (
        <div>
            <ComponentCard title="">
                <UserMetaCard user={user} />
                <BusinessInfoCard user={user} />
            </ComponentCard>
        </div>
    );
}