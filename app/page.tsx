import Link from "next/link";
import Image from "next/image";
import React from "react";
import { FileText, FlaskConical, BarChart2, Users } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] gap-8 bg-gray-50 p-8 text-center">
      {/* Logo */}
      <div className="mb-4">
        <Image
          src="/diulogoside.png"
          alt="DIU Logo"
          width={180}
          height={50}
          priority
          className="object-contain"
        />
      </div>

      <h1 className="text-3xl font-bold text-gray-800">
        DIU Service Portal (unofficial)
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {/* Assignment Cover */}
        <Link href="/assignment" passHref>
          <div className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition cursor-pointer">
            <FileText className="w-5 h-5" />
            <span>Assignment Cover</span>
          </div>
        </Link>

        {/* Lab Report Cover */}
        <Link href="/lab-report" passHref>
          <div className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition cursor-pointer">
            <FlaskConical className="w-5 h-5" />
            <span>Lab Report Cover</span>
          </div>
        </Link>

        {/* Result Generator */}
        <Link href="/result" passHref>
          <div className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition cursor-pointer">
            <BarChart2 className="w-5 h-5" />
            <span>Generate Result</span>
          </div>
        </Link>

        {/* Personal Use for 41A, 42B2, 43H2 */}
        <Link href="/nayeem/assignment" passHref>
          <div className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition cursor-pointer">
            <FileText className="w-5 h-5" />
            <span>41A / 42B2 / 43H2 Assignment</span>
          </div>
        </Link>

        <Link href="/nayeem/lab" passHref>
          <div className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition cursor-pointer">
            <FlaskConical className="w-5 h-5" />
            <span>41A / 42B2 / 43H2 Lab Report</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
