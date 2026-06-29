"use client";

import { motion } from "framer-motion";
import { BRAND } from "@/lib/brand";
import type { Certificate } from "@/lib/learning/types";

export function CertificateView({ cert }: { cert: Certificate }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl border-4 border-brand/30 bg-gradient-to-br from-white to-brand/5 dark:from-background dark:to-brand/10 shadow-2xl"
    >
      <div className="absolute top-4 right-4 text-xs text-slate-400 font-mono">{cert.id}</div>
      <div className="text-center">
        <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-2">{BRAND.platform} Certificate</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Certificate of Completion</h2>
        <p className="text-slate-500 mb-2">This certifies that</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">{cert.studentName}</p>
        <p className="text-slate-500 mb-1">has successfully completed</p>
        <p className="text-xl font-bold text-brand mb-4">{cert.subject}{cert.topic ? ` — ${cert.topic}` : ""}</p>
        <p className="text-slate-600 dark:text-slate-300 mb-6">with a score of <strong>{cert.score}%</strong></p>
        <div className="flex justify-center gap-8 text-sm text-slate-400">
          <span>Issued: {new Date(cert.issuedAt).toLocaleDateString()}</span>
          <span>Type: {cert.type.replace(/-/g, " ")}</span>
        </div>
        <div className="mt-8 w-20 h-20 mx-auto rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-xs text-slate-400 font-mono">
          QR
        </div>
        <p className="text-[10px] text-muted-foreground mt-4">
          {BRAND.platform} · {BRAND.companyTagline}
        </p>
        <p className="text-[10px] text-slate-400 mt-1">Verify at /verify/{cert.id}</p>
      </div>
    </motion.div>
  );
}
