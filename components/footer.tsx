import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 sm:py-8 bg-gray-100 text-center text-xs sm:text-sm text-gray-700 border-t border-gray-300 mt-auto">
      <p className="px-4">
        <strong>Mohammad Ali Nayeem</strong> &mdash; Student, SWE <br />
        <a
          href="https://github.com/kazinayeem"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          github.com/kazinayeem
        </a>
      </p>
    </footer>
  );
};

export default Footer;
