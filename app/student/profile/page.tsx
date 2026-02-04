'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootType } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Pencil } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { setUser } from '@/store/authSlice'
import toast from 'react-hot-toast'

// ✅ Define proper types for user and profile
interface Profile {
    bio?: string
    skills?: string[]
    study?: string
    experience?: string[]
    location?: string
}

interface User {
    name?: string
    email?: string
    phoneNumber?: string // fixed capitalization
    role?: string
    profile?: Profile
}

const StudentProfile = () => {
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    // ✅ Tell TS that user can be User or null
    const user = useSelector((state: RootType) => state.auth.user) as User | null
    const token = useSelector((state: RootType) => state.auth.token)
    const dispatch = useDispatch()

    const [form, setForm] = useState({
        bio: "",
        skills: "",
        study: "",
        experience: "",
        location: "",
    })

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (user?.profile) {
            setForm({
                bio: user.profile.bio || "",
                skills: user.profile.skills?.join(', ') || "",
                study: user.profile.study || "",
                experience: user.profile.experience?.join('\n') || "",
                location: user.profile.location || "",
            })
        }
    }, [user])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleUpadte = async () => {
        try {
            const updateData = {
                bio: form.bio,
                skills: form.skills.split(',').map(s => s.trim()),
                study: form.study,
                experience: form.experience.split('\n'),
                location: form.location,
            }

            const res = await axios.post(
                '/api/user/profile',
                updateData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            dispatch(setUser(res.data.user))
            toast.success('Profile updated successfully')
            setOpen(false)
        } catch (error) {
            console.log(error)
            toast.error('Facing error to update profile')
        }
    }

    if (!mounted) return null

    return (
        <div className="max-w-xl mx-auto mt-10 px-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Profile</h1>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Pencil className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>

                        {/* ✅ PLACEHOLDERS RESTORED */}
                        <div className="space-y-4">
                            <Textarea name="bio" placeholder="Bio" value={form.bio} onChange={handleChange} />
                            <Input name="study" placeholder="Study" value={form.study} onChange={handleChange} />
                            <Input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
                            <Textarea name="experience" placeholder="Experience (one per line)" value={form.experience} onChange={handleChange} />
                            <Input name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} />
                            <Button className="w-full" onClick={handleUpadte}>Save Change</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardContent className="space-y-4 pt-6">
                    <p>Name: {user?.name}</p>
                    <p>Email: {user?.email}</p>
                    <p>Phone Number: {user?.phoneNumber}</p> {/* fixed capitalization */}
                    <Badge>Role: {user?.role}</Badge>

                    <Separator />

                    <p>Bio: {user?.profile?.bio}</p>
                    <p>Study: {user?.profile?.study}</p>
                    <p>Location: {user?.profile?.location}</p>

                    <ul>
                        {user?.profile?.experience?.map((e: string, i: number) => (
                            <li key={i}>{e}</li>
                        ))}
                    </ul>

                    <p>Skills: {user?.profile?.skills?.join(', ')}</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default StudentProfile
