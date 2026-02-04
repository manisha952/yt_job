import React from "react";
import { Separator } from "@radix-ui/react-separator";

const Footer = () => {
  return (
    <footer className="bg-[#0b1120] text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-14">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Press</li>
              <li className="hover:text-white cursor-pointer">Blog</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
            </ul>
          </div>

          {/* Job Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Job Categories</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Technology</li>
              <li className="hover:text-white cursor-pointer">Healthcare</li>
              <li className="hover:text-white cursor-pointer">Finance</li>
              <li className="hover:text-white cursor-pointer">Education</li>
              <li className="hover:text-white cursor-pointer">Marketing</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Resume Builder</li>
              <li className="hover:text-white cursor-pointer">Career Advice</li>
              <li className="hover:text-white cursor-pointer">Salary Calculator</li>
              <li className="hover:text-white cursor-pointer">Interview Tips</li>
              <li className="hover:text-white cursor-pointer">Help Center</li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">LinkedIn</li>
              <li className="hover:text-white cursor-pointer">Twitter</li>
              <li className="hover:text-white cursor-pointer">Facebook</li>
              <li className="hover:text-white cursor-pointer">Instagram</li>
              <li className="hover:text-white cursor-pointer">Payment Methods</li>
            </ul>
          </div>

        </div>

        {/* Separator */}
        <Separator className="my-10 bg-gray-700 h-px" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400">
          <p>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Made with ❤️ for job seekers</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
