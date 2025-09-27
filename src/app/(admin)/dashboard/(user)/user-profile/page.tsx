"use client";
import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import BusinessInfoCard from "@/components/user-profile/BusinessInforCard";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { getUserById } from "@/services/users.service";
import { UserDetail } from "@/services/types";

// NOTE: You'll need to replace this with a dynamic ID, e.g., from the URL or state
const USER_ID = "dda3c12f-77c5-40a7-9e8f-0b75cf5c438a";

export default function BasicTables() {
    const [user, setUser] = useState<UserDetail | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
    }, []);

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
                {user && <UserInfoCard user={user} />}
                {user && user.business && <BusinessInfoCard user={user} />}

            </ComponentCard>
        </div>
    );
}