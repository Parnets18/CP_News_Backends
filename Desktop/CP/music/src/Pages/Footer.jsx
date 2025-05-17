import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-8 pl-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Our Page Section */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Our Page</h1>
            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-transparent border-b-2 border-gray-400 w-16">
                &nbsp;
              </h2>
              <h2 className="text-xl font-semibold text-red-900">About</h2>
              <ul className="space-y-1 text-red-900">
                <li><strong>Our Team</strong></li>
                <li><strong>Our Event</strong></li>
                <li><strong>Blog & News</strong></li>
              </ul>
            </div>
          </div>

          {/* Our Class Section */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Our Class</h1>
            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-transparent border-b-2 border-gray-400 w-16">
                &nbsp;
              </h2>
              <h2 className="text-xl font-semibold text-red-900">Private Lesson</h2>
              <ul className="space-y-1 text-red-900">
                <li><strong>Preschool Class</strong></li>
                <li><strong>Schooler Class</strong></li>
                <li><strong>Teenage Class</strong></li>
              </ul>
            </div>
          </div>

          {/* Quick Link Section */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Quick Link</h1>
            <div className="space-y-2">
              <h2 className="text-xl  font-semibold text-transparent border-b-2 border-gray-400 w-16">
                &nbsp;
              </h2>
              <ul className="space-y-1 text-red-900">
                <li><strong>Faq</strong></li>
                <li><strong>Contact</strong></li>
                <li><strong>Community</strong></li>
                <li><strong>Terms & Condition</strong></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white">
              <FaFacebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaTwitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaInstagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaLinkedin className="h-6 w-6" />
            </a>
          </div>
          <p className="mt-4 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}