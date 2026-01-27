"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { FileText, FlaskConical, BarChart2 } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] gap-8 bg-gray-50 p-4 sm:p-8 text-center">
      {/* Logo */}
      <div className="mb-4">
        <Image
          src="/diulogoside.png"
          alt="DIU Logo"
          width={180}
          height={50}
          priority
          className="object-contain max-w-xs sm:max-w-sm"
        />
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 px-2">
        Daffodil International University Student Portal (unofficial)
      </h1>

      <p className="text-sm sm:text-base text-gray-700 max-w-2xl px-2">
        Built for DIU students to quickly generate assignment and lab report covers. Crafted by
        Mohammad Ali Nayeem.
      </p>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 max-w-2xl">
        {/* Assignment Cover */}
        <Link href="/assignment" passHref>
          <div className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition cursor-pointer text-sm sm:text-base whitespace-nowrap">
            <FileText className="w-5 h-5 flex-shrink-0" />
            <span>Assignment Cover</span>
          </div>
        </Link>

        {/* Lab Report Cover */}
        <Link href="/lab-report" passHref>
          <div className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition cursor-pointer text-sm sm:text-base whitespace-nowrap">
            <FlaskConical className="w-5 h-5 flex-shrink-0" />
            <span>Lab Report Cover</span>
          </div>
        </Link>

        {/* Result Generator */}
        <div 
          onClick={(e) => {
            e.preventDefault();
            alert("This feature is currently not working. Please wait, we will fix it soon!");
          }}
          className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition cursor-pointer opacity-75 text-sm sm:text-base whitespace-nowrap"
        >
          <BarChart2 className="w-5 h-5 flex-shrink-0" />
          <span>Generate Result</span>
        </div>

        {/* Personal Use for 41A, 42B2, 43H2 */}
        <Link href="/nayeem/assignment" passHref>
          <div className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition cursor-pointer text-sm sm:text-base whitespace-nowrap">
            <FileText className="w-5 h-5 flex-shrink-0" />
            <span>41A / 42B2 / 43H2 Assignment</span>
          </div>
        </Link>

        <Link href="/nayeem/lab" passHref>
          <div className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition cursor-pointer text-sm sm:text-base whitespace-nowrap">
            <FlaskConical className="w-5 h-5 flex-shrink-0" />
            <span>41A / 42B2 / 43H2 Lab Report</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
