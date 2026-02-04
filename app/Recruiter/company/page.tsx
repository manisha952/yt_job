"use client"
import { Button } from '@/components/ui/button'
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogClose, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootType } from '@/store'
import toast from 'react-hot-toast'
import axios from 'axios'

const Company = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        website: ""
    })

    const [loading, setLoading] = useState(false)
    const [LogoFile, setLogoFile] = useState<File | null>(null)
    const [companies, setCompanies] = useState<any[]>([])
    const [isDialogOpen, setISDialogOpen] = useState(false)
    const [editingCompanyId, setEditingCompany] = useState<string | null>(null)

    const user = useSelector((state: RootType) => state.auth.user) as any

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get("/api/company/mycompany", {
                    headers: { userId: user?._id }
                })
                setCompanies(response.data.company) //maybe company=Companies
            } catch (error) {
                console.log(error)
            }
        }
        if (user?._id) fetchCompanies()
    }, [user?._id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setLogoFile(file)
    }

    const fileToBase64 = (file: File): Promise<string> => {
         return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = (error) => reject(error)
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let LogoBase64 = ""
            if (LogoFile) LogoBase64 = await fileToBase64(LogoFile)

            const payLoad = { ...formData, logo: LogoBase64 }

            await axios.post("/api/company/create", payLoad, {
                headers: {
                    userId: user?._id,
                    "Content-Type": "application/json"
                }
            })

            toast.success("Company Created Successfully")
            setFormData({ title: "", description: "", location: "", website: "" })
            setLogoFile(null)

            const res = await axios.get("/api/company/mycompany", {
                headers: { userId: user?._id }
            })
            setCompanies(res.data.company)

        } catch {
            toast.error("Error while creating company")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (companyId: string) => {
        const companyToEdit = companies.find((c: any) => c._id === companyId)
        if (!companyToEdit) return

        setFormData({
            title: companyToEdit.title || "",
            description: companyToEdit.description || "",
            location: companyToEdit.location || "",
            website: companyToEdit.website || "",
        })

        setEditingCompany(companyId)
        setISDialogOpen(true)
    }


    const handleUpdate = async () => {
        if (!editingCompanyId) return

        setLoading(true)
        try {
            // let LogoBase64 = ""
            // if (LogoFile) LogoBase64 = await fileToBase64(LogoFile)
            let LogoBase64 :  string | null = null

            if (LogoFile) {
                try {
                    LogoBase64 = await fileToBase64(LogoFile)
                } catch (err) {
                    console.log("Base64 convert error:", err)
                    toast.error("Logo image invalid")
                    setLoading(false)
                    return
                }
            }


            const payLoad = { ...formData, logo: LogoBase64 }

            // ✅ FIXED: use PUT instead of POST
            await axios.put(`/api/company/update/${editingCompanyId}`, payLoad, {
                headers: {
                    userId: user?._id,
                    "Content-Type": "application/json"
                }
            })

            toast.success("Company updated Successfully")

            const res = await axios.get("/api/company/mycompany", {
                headers: { userId: user?._id }
            })
            setCompanies(res.data.company)
            setISDialogOpen(false)

        } catch {
            toast.error("Error while updating company")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='max-w-xl mx-auto p-4'>
            <h2 className='text-2xl font-semibold'>Create Company</h2>

            <form className='space-y-4' onSubmit={handleSubmit}>
                <Input name="title" value={formData.title || ""} onChange={handleChange} placeholder="Company title" required />
                <Input name="description" value={formData.description || ""} onChange={handleChange} placeholder="Company Description" required />
                <Input name="location" value={formData.location || ""} onChange={handleChange} placeholder="Company location" required />
                <Input name="website" value={formData.website || ""} onChange={handleChange} placeholder="Company website" required />
                <Input type="file" accept="image/*" onChange={handleLogoChange} />
                <Button type="submit">Create Company</Button>
            </form>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>Your Created Company</h2>

            <table className='min-w-full table-auto'>
                <tbody>
                    {companies.map((company) => (
                        <tr key={company._id}>
                            <td className='border px-4 py-2'>{company.title}</td>
                            <td className='border px-4 py-2'>{company.location}</td>
                            <td className='border px-4 py-2'>
                                <Button variant="outline" onClick={() => handleEdit(company._id)}>
                                    Edit
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Dialog open={isDialogOpen} onOpenChange={setISDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Company</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                        <Input name="title" value={formData.title || ""} onChange={handleChange} />
                        <Input name="description" value={formData.description || ""} onChange={handleChange} />
                        <Input name="location" value={formData.location || ""} onChange={handleChange} />
                        <Input name="website" value={formData.website || ""} onChange={handleChange} />
                        <Input type="file" accept="image/*" onChange={handleLogoChange} />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button disabled={loading} onClick={handleUpdate}>
                            {loading ? "Updating..." : "Update"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Company
