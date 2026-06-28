"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
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

const UniversitiesSection = dynamic(
  () => import("./landing/v5/universities-section").then((m) => ({ default: m.UniversitiesSection })),
  { ssr: true }
);
const ProductDemoSection = dynamic(
  () => import("./landing/v5/product-demo-section").then((m) => ({ default: m.ProductDemoSection })),
  { ssr: true }
);
const FeatureComparisonSection = dynamic(
  () => import("./landing/v5/feature-comparison").then((m) => ({ default: m.FeatureComparisonSection })),
  { ssr: true }
);
const RoadmapSection = dynamic(
  () => import("./landing/v5/roadmap-section").then((m) => ({ default: m.RoadmapSection })),
  { ssr: true }
);
const ChangelogSection = dynamic(
  () => import("./landing/v5/changelog-section").then((m) => ({ default: m.ChangelogSection })),
  { ssr: true }
);
const GitHubSection = dynamic(
  () => import("./landing/v5/github-section").then((m) => ({ default: m.GitHubSection })),
  { ssr: true }
);
const CommunitySection = dynamic(
  () => import("./landing/v5/community-section").then((m) => ({ default: m.CommunitySection })),
  { ssr: true }
);
const NewsletterSection = dynamic(
  () => import("./landing/v5/newsletter-section").then((m) => ({ default: m.NewsletterSection })),
  { ssr: true }
);

export default function LandingView() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(72);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const updateHeight = () => setHeaderHeight(el.offsetHeight);
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    updateHeight();

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-surface-page overflow-x-hidden">
        <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
          <AnnouncementBar />
          <LandingNavbar
            stacked
            onSearchOpen={() => setSearchOpen(true)}
            onMobileOpen={() => setMobileOpen(true)}
          />
        </div>
        <div style={{ height: headerHeight }} aria-hidden className="shrink-0" />

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
          <UniversitiesSection />
          <FeatureShowcase />
          <ProductDemoSection />
          <LearningExplorer />
          <CareerPreview />
          <DevtoolsPreview />
          <FeatureComparisonSection />
          <TestimonialsSection />
          <RoadmapSection />
          <ChangelogSection />
          <GitHubSection />
          <CommunitySection />
          <NewsletterSection />
          <FaqSection />
          <PricingSection />
          <CtaSection />
        </main>
    </div>
  );
}
