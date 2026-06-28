"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Github,
  Linkedin,
  Globe,
  Heart,
  FileText,
  ShieldCheck,
  ExternalLink,
  Lock,
  Cookie,
  Info,
  Wallet,
  BookOpen,
  Sparkles,
  Calculator,
  Wrench,
  Mail,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  const footerSections = {
    product: {
      title: "Product",
      links: [
        { label: "Assignment Cover", href: "/assignment", icon: FileText },
        { label: "CV Builder", href: "/cv-builder", icon: FileText },
        { label: "Lab Report", href: "/lab-report", icon: BookOpen },
        { label: "Learning Tools", href: "/tools", icon: Sparkles },
        { label: "Financial Calculators", href: "/calculators", icon: Calculator },
        { label: "Developer Tools", href: "/developer-tools", icon: Wrench },
        { label: "Lab Performance", href: "/lab-performance", icon: ShieldCheck },
      ],
    },
    resources: {
      title: "Resources",
      links: [
        { label: "All Tools", href: "/tools" },
        { label: "About Us", href: "/about" },
        { label: "bornosoftnr.com", href: "https://bornosoftnr.com", external: true },
      ],
    },
    company: {
      title: "Company",
      links: [
        { label: "About Us", href: "/about", icon: Info },
        { label: "bornosoftnr.com", href: "https://bornosoftnr.com", external: true },
        { label: "Dhaka, Bangladesh", href: "#", disabled: true },
      ],
    },
    legal: {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy-policy", icon: Lock },
        { label: "Cookie Policy", href: "/cookie-policy", icon: Cookie },
        { label: "Refund Policy", href: "/refund-policy", icon: Wallet },
        { label: "Secure Data", href: "/security-policy", icon: ShieldCheck },
      ],
    },
  };

  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-20 pb-8 px-4 sm:px-6 overflow-hidden relative">
      <div className="blur-orb w-[400px] h-[400px] bg-[#6D5DF6]/10 -top-40 right-0" aria-hidden />
      <div className="blur-orb w-[300px] h-[300px] bg-[#06B6D4]/8 bottom-0 left-0" aria-hidden />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          {/* Brand + Newsletter */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-[#6D5DF6] to-[#8B5CF6] rounded-2xl flex items-center justify-center shadow-lg shadow-[#6D5DF6]/20">
                <Sparkles className="w-5 h-5 text-white" aria-hidden />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Campus<span className="text-[#6D5DF6]">Flow</span>
                </span>
                <p className="text-xs font-medium text-slate-500 tracking-wide">Bornosoft by Nayeem</p>
              </div>
            </div>
            <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
              Empowering DIU students with precision tools for academic excellence.
              Generate official assignment covers, lab reports, ATS-friendly CVs, and master CS topics
              with interactive learning tools — all in one platform.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://bornosoftnr.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit bornosoftnr.com"
                className="p-3 bg-white/5 rounded-xl hover:bg-[#6D5DF6]/20 text-slate-400 hover:text-white transition-all border border-white/8 hover:border-[#6D5DF6]/30 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/kazinayeem"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/8 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/kazi-nayeem/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="p-3 bg-white/5 rounded-xl hover:bg-[#0077B5]/20 text-slate-400 hover:text-[#0077B5] transition-all border border-white/8 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Newsletter</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Stay updated with new tools and features.
              </p>
              <form onSubmit={handleNewsletter} className="space-y-3">
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@diu.edu.bd"
                    aria-label="Email for newsletter"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#6D5DF6]/50 transition-colors min-h-[44px]"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-premium w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#6D5DF6] to-[#8B5CF6] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#6D5DF6]/25 transition cursor-pointer min-h-[44px]"
                >
                  Subscribe <ArrowRight size={16} aria-hidden />
                </button>
              </form>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key} className="space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {"disabled" in link && link.disabled ? (
                      <span className="text-sm text-slate-500">{link.label}</span>
                    ) : "external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group min-h-[44px]"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 min-h-[44px]"
                      >
                        {"icon" in link && link.icon && (
                          <link.icon className="w-3.5 h-3.5 opacity-50" aria-hidden />
                        )}
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <p className="text-xs text-slate-500 text-center lg:text-left">
            © {currentYear}{" "}
            <span className="text-white font-semibold">CampusFlow</span> by{" "}
            <span className="text-[#6D5DF6] font-semibold">Bornosoft</span>. Unofficial DIU Student Project.
          </p>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 rounded-2xl border border-white/8"
          >
            <p className="text-xs text-slate-400 flex items-center gap-2">
              Developed with{" "}
              <Heart className="w-3 h-3 text-red-400 fill-red-400" aria-hidden /> by{" "}
              <span className="bg-gradient-to-r from-[#6D5DF6] to-[#8B5CF6] bg-clip-text text-transparent font-bold">
                Mohammad Ali Nayeem
              </span>
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <Link href="/privacy-policy" className="hover:text-white transition-colors min-h-[44px] flex items-center">
              Privacy
            </Link>
            <Link href="/cookie-policy" className="hover:text-white transition-colors min-h-[44px] flex items-center">
              Cookies
            </Link>
            <Link href="/tools" className="hover:text-white transition-colors min-h-[44px] flex items-center">
              Learning Tools
            </Link>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#22C55E]/10 text-[#22C55E] rounded-lg border border-[#22C55E]/20 text-[10px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden />
              OFFICIAL FORMATS
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
