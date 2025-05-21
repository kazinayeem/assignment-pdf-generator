import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 bg-gray-100 min-h-[15vh] text-center text-sm text-gray-700 border-t border-gray-300 mt-2">
      <p>
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
