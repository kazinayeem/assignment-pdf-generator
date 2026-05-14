"use client";

import React from "react";

export const Section = ({ title, children }: any) => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

export const InfoCard = ({ title, content, icon }: any) => (
  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
    {icon && <div className="text-2xl mb-2">{icon}</div>}
    <h3 className="font-semibold text-slate-900">{title}</h3>
    <p className="text-sm text-slate-700 mt-2">{content}</p>
  </div>
);

export const CodeBlock = ({ code, language }: any) => (
  <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

export const InterviewQuestion = ({ q, a }: any) => (
  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <p className="font-semibold text-blue-900 mb-2">Q: {q}</p>
    <p className="text-sm text-blue-800">A: {a}</p>
  </div>
);
