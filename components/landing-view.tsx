"use client";

import { useState } from "react";
import { LandingNavbar } from "./landing/landing-navbar";
import { MobileMenu } from "./landing/mobile-menu";
import { SearchModal } from "./landing/search-modal";
import { HeroSection } from "./landing/hero-section";
import { WhyChooseSection } from "./landing/why-choose-section";
import { ProductivitySection } from "./landing/productivity-section";
import { CSLearningSection } from "./landing/cs-learning-section";
import { PricingSection } from "./landing/pricing-section";
import { CTASection } from "./landing/cta-section";
import { DevelopmentNoticeModal } from "./landing/development-notice-loader";

export default function LandingView() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-page overflow-x-hidden">
      <LandingNavbar
        onSearchOpen={() => setSearchOpen(true)}
        onMobileOpen={() => setMobileOpen(true)}
      />

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <SearchModal
        open={searchOpen}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onClose={() => setSearchOpen(false)}
      />

      <DevelopmentNoticeModal />

      <main id="main-content">
        <HeroSection />
        <WhyChooseSection />
        <ProductivitySection />
        <CSLearningSection />
        <PricingSection />
        <CTASection />
      </main>
    </div>
  );
}
