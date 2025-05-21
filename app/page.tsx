import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gray-50 p-8">
      {/* Logo */}
      <div className="mb-6">
        <Image
          src="/diulogoside.png"
          alt="DIU Logo"
          width={180}
          height={50}
          priority
          className="object-contain"
        />
      </div>

      <h1 className="text-2xl font-semibold mb-6">Select Cover Page</h1>

      <div className="flex gap-4">
        <Link href="/assignment">
          <h1 className="px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition">
            Assignment Cover
          </h1>
        </Link>

        <Link href="/lab-report">
          <h1 className="px-6 py-3 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition">
            Lab Report Cover
          </h1>
        </Link>

        <Link href="/result">
          <h1 className="px-6 py-3 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition">
            Result Generate
          </h1>
        </Link>
      </div>
    </div>
  );
}
