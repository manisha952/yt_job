"use client"
import { RootType } from '@/store';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CreateJob = () => {
    const user = useSelector((state: RootType) => state.auth.user)

    const [companies, setCompanies] = useState<any[]>([]);
    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        salary: "",
        experinceLevel: "",
        requirement: "",
        jobType: "",
        position: "",
        company: "",
        created_by:""
        
    });

    useEffect(() => {
        


        const fetchCompanies = async () => {
           

            try {
                const response = await axios.get("/api/company/mycompany", {
                    headers: { userId: (user as any)?._id }
                });
                setCompanies(response.data.company);
            } catch (error) {
                console.log(error);
            }
        };
        fetchCompanies();
    }, [user]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const {
            title,
            description,
            location,
            salary,
            experinceLevel,
            requirement,
            jobType,
            position,
            company,
            
        } = form;

        if (
            !title ||
            !description ||
            !location ||
            !salary ||
            !experinceLevel ||
            !requirement ||
            !jobType ||
            !position ||
            !company
        ) {
            alert("please fill all the required fields");
            return;
        }

        try {
            const payload = {
            
                title,
                description,
                location,
                salary: Number(salary),
                experinceLevel: Number(experinceLevel),
                requirement: requirement
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                jobType,
                position: Number(position),
                company,
                created_by: (user as any)?._id
            };

            const response = await axios.post("/api/job/create", payload);
            toast.success("Job created successfully");

            setForm({
                title: "",
                description: "",
                location: "",
                salary: "",
                experinceLevel: "",
                requirement: "",
                jobType: "",
                position: "",
                company: "",
                created_by:""
                
            });

        } catch (error) {
            console.log(error);
            toast.error("Facing problem to create job");
        }
    };

    return (
        <div className='max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10'>
            <h1 className='text-3xl font-bold mb-6 text-gray-800'>Create Job</h1>

            <form className='space-y-5' onSubmit={handleSubmit}>
                {[
                    { label: "Title", name: "title", type: "text" },
                    { label: "Requirements (comma separated)", name: "requirement", type: "text" },
                    { label: "Salary", name: "salary", type: "number" },
                    { label: "Experince Level (years)", name: "experinceLevel", type: "number" },
                    { label: "Location", name: "location", type: "text" },
                    { label: "Job Type", name: "jobType", type: "text" },
                    { label: "Position", name: "position", type: "number" },
                ].map((field) => (
                    <div key={field.name}>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            {field.label}
                        </label>
                        <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={form[field.name as keyof typeof form]}
                            onChange={handleChange}
                            required
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                ))}

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Description
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        required
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Company
                    </label>
                    <select
                        name="company"
                        id="company"
                        value={form.company}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                    >
                        <option value="">Select your company</option>
                        {companies.map((comp) => (
                            <option key={comp._id} value={comp._id}>
                                {comp.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='mt-4'>
                    <button
                        type='submit'
                        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 cursor-pointer'
                    >
                        Create Job
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateJob;
