"use client";

import { useState } from "react";
import { LandingNavbar } from "./landing/landing-navbar";
import { MobileMenu } from "./landing/mobile-menu";
import { SearchModal } from "./landing/search-modal";
import { DevelopmentNoticeModal } from "./landing/development-notice-loader";
import { CookieConsent } from "./landing/cookie-consent";
import { AnnouncementBar } from "./landing/v4/announcement-bar";
import { HeroSectionV4 } from "./landing/v4/hero-section";
import { TrustSection } from "./landing/v4/trust-section";
import { FeatureShowcase } from "./landing/v4/feature-showcase";
import { LearningExplorer } from "./landing/v4/learning-explorer";
import { CareerPreview } from "./landing/v4/career-preview";
import { DevtoolsPreview } from "./landing/v4/devtools-preview";
import { TestimonialsSection } from "./landing/v4/testimonials-section";
import { FaqSection } from "./landing/v4/faq-section";
import { PricingSection } from "./landing/v4/pricing-section";
import { CtaSection } from "./landing/v4/cta-section";

export default function LandingView() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-page overflow-x-hidden">
        <AnnouncementBar />
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
        <CookieConsent />

        <main id="main-content">
          <HeroSectionV4 />
          <TrustSection />
          <FeatureShowcase />
          <LearningExplorer />
          <CareerPreview />
          <DevtoolsPreview />
          <TestimonialsSection />
          <FaqSection />
          <PricingSection />
          <CtaSection />
        </main>
    </div>
  );
}
