
"use client"

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootType } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { notFound } from "next/navigation";

// ✅ Fix TypeScript error by defining user type
type UserType = {
    _id: string;
    name: string;
    email: string;
    role: "recruiter" | "candidate" | string;
};

const RecruiterProfile = () => {
    const user = useSelector((state: RootType) => state.auth.user) as UserType | null;

    // ✅ Role check
    if (user && user.role !== "recruiter") {
        notFound();
    }

    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <div className='max-w-md mx-auto p-6 mt-14 mb-16'>
            <h1 className='text-2xl font-bold mb-4'>Recruiter Profile</h1>
            <Card>
                <CardContent className='space-y-4 pt-6 text-sm'>
                    {/* ✅ Name and Email */}
                    <p>
                        <strong>Name :</strong> {user?.name || "No Name"}
                    </p>
                    <p>
                        <strong>Email :</strong> {user?.email || "No Email"}
                    </p>

                    <Separator />

                    {/* ✅ Role */}
                    <p className='flex items-center gap-2'>
                        <strong>Role :</strong>
                        <Badge>{user?.role || "No Role"}</Badge>
                    </p>

                    <Separator />

                    {/* ✅ Removed repeated Email */}
                </CardContent>
            </Card>
        </div>
    );
}

export default RecruiterProfile;

