'use client';

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootType } from "@/store";
import { logout } from "@/store/authSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; // no other imports change

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // ✅ for client-only rendering

  const user = useSelector((state: RootType) => state.auth.user);
  const dispatch = useDispatch();

  const router = useRouter(); // ✅ useRouter instance

  // mark when component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted && !!user; // ✅ only true after hydration

  const handleLogout = () => {
    dispatch(logout());

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    Cookies.remove("token");
    Cookies.remove("user");

    router.push("/sign-in"); // ✅ client-side redirect after logout
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link href="/" className="text-2xl font-extrabold text-blue-600">
              Job Portal
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-blue-600"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex ml-10 space-x-8">
            <a className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Jobs
            </a>
            <a className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Companies
            </a>
            <a className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Career Resources
            </a>
          </nav>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* ✅ Fixed Profile button using Link */}
                <Button variant="outline" asChild>
                  <Link href={user?.role === "student" ? "/student/profile" : "/recruiter/profile"}>
                    Profile
                  </Link>
                </Button>

                <Button
                  className="bg-blue-800 hover:bg-blue-700"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline">Sign In</Button>
                <Button className="bg-blue-800 hover:bg-blue-700">
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <nav className="flex flex-col space-y-4">
              <a className="text-gray-700 hover:text-blue-600 text-sm">
                Jobs
              </a>
              <a className="text-gray-700 hover:text-blue-600 text-sm">
                Companies
              </a>
              <a className="text-gray-700 hover:text-blue-600 text-sm">
                Career Resources
              </a>
            </nav>

            <div className="flex flex-col space-y-2 pt-4">
              {isLoggedIn ? (
                <>
                  {/* ✅ Fixed Mobile Profile button */}
                  <Button variant="outline" asChild>
                    <Link href={user?.role === "student" ? "/student/profile" : "/recruiter/profile"}>
                      Profile
                    </Link>
                  </Button>

                  <Button
                    className="bg-blue-800 hover:bg-blue-700"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline">Sign In</Button>
                  <Button className="bg-blue-800 hover:bg-blue-700">
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
