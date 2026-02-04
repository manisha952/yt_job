"use client"
import React, { useState } from 'react'
import {Card,CardContent,CardHeader,CardTitle,} from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label"
import { RadioGroup,RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation'

const SignUp = () => {
   const [formData,setFormData] = useState({
    name:"",
    email:"",
    password:"",
    role:"",
    phoneNumber:"",   
});
const  router = useRouter();


    const handleRadioChange =(value: any) => {
        setFormData({...formData, role :value})
    }

    const handleChange = (e:any) =>{
        setFormData({...formData, [e.target.name]:e.target.value})
    };

    const handleSubmit = async (e:any) =>{
       e.preventDefault(); 
       console.log("formData",formData);
       const res = await axios.post("/api/user/register",formData);
       console.log(res.data);
       if(res.status===200){
        toast.success("Register succesfull!");
        router.push("/sign-in")
       }else{
        toast.error("Register fail. please try again!")
       }
    }

  return (
    <div className='flex  item-center  justify-center bg-gray-200 p-4'>
    <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className=''>
            <CardTitle className='text-xl'>Register</CardTitle>
        </CardHeader>
        <CardContent>
            <form className='space-y-4' onSubmit={handleSubmit}>
                {/* Name*/}
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder='Enter Your Name'
                    required
                    />
                </div>

                {/* Email */}
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='Enter Your Email'
                    required
                    />
                </div>

                {/* Password */}
                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input 
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder='Enter Your Password'
                    required
                    />
                </div>

                {/* Phone Number */}
                <div>
                    <Label htmlFor="PhoneNumber">PhoneNumber</Label>
                    <Input 
                    id="PhoneNumber"
                    name="phoneNumber"    
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder='Enter Your PhoneNumber'
                    required
                    />
                </div>

                {/* Role */}
                <div>
                    <Label>Role</Label>
                    <RadioGroup
                      className='flex gap-4 mt-2'
                      defaultValue=''
                      onValueChange={handleRadioChange}
                    >
                        <div className='items-center flex space-x-2'>
                            <RadioGroupItem value="recruiter" id='recruiter'/>
                            <Label>Recruiter</Label>
                        </div>
                        <div className='items-center flex space-x-2'>
                            <RadioGroupItem value="student" id='student'/>
                            <Label>Student</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Submit */}
                <Button type='submit' className='w-full'>Register</Button>
            </form>
        </CardContent>
    </Card>
    </div>
  )
}

export default SignUp
