"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import axios from "axios"
import Cookies from "js-cookie"
import { useDispatch } from "react-redux"
import { setUser, setToken } from "@/store/authSlice"
import { useRouter } from "next/navigation"

const SignIn = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRadioChange = (value: string) => {
    setFormData({ ...formData, role: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await axios.post("/api/user/login", formData)

      const { token, user } = res.data

      // ✅ Redux state
      dispatch(setUser(user))
      dispatch(setToken(token))

      // ✅ localStorage (string only)
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      // ✅ Cookies
      Cookies.set("token", token, { expires: 7 })
      Cookies.set("user", JSON.stringify(user), { expires: 7 })

      toast.success("Login successful")

      // ✅ Proper Next.js redirect (Redux safe)
      router.push("/")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role */}
            <div>
              <Label>Role</Label>
              <RadioGroup
                className="flex gap-4 mt-2"
                onValueChange={handleRadioChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recruiter" />
                  <Label>Recruiter</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" />
                  <Label>Student</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignIn
