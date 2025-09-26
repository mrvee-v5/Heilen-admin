import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ServiceOptionDropdown from "@/components/service/ServiceOptionDropdown";
import BasicTableOne from "@/components/tables/BasicTableOne";
import UsersTable from "@/components/tables/usersTable";
import BusinessInfoCard from "@/components/user-profile/BusinessInforCard";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
    // other metadata
};

export default function BasicTables() {
    return (
        <div>
            {/* <PageBreadcrumb pageTitle="Users" /> */}

            <ComponentCard title="" >
                <UserMetaCard />
                <UserInfoCard />
                <UserAddressCard />
                <BusinessInfoCard />
            </ComponentCard>

        </div>
    );
}
