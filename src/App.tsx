import React from "react";
import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import MarqueeLogos from "./components/MarqueeLogos";
import BentoGrid from "./components/BentoGrid";
import CourseCatalog from "./components/CourseCatalog";
import MentorChat from "./components/MentorChat";
import CommandCenter from "./components/CommandCenter";
import TrajectoryTimeline from "./components/TrajectoryTimeline";
import CertificateShowcase from "./components/CertificateShowcase";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="font-sans antialiased bg-[#f7f9ff] text-[#171c21] min-h-screen">
      {/* Floating Blurred Navigation Header */}
      <NavBar />

      <main className="space-y-12">
        {/* Hero Banner Section */}
        <HeroSection />

        {/* Dynamic Logos Carousel */}
        <MarqueeLogos />

        {/* Bento Grid Features */}
        <BentoGrid />

        {/* Course Catalog */}
        <CourseCatalog />

        {/* Interactive Timeline Trajectory */}
        <TrajectoryTimeline />

        {/* AI Career Mentor Chat Panel */}
        <MentorChat />

        {/* Live Coding Command Center Dashboard */}
        <CommandCenter />

        {/* Verified Certificate Showcase Builder */}
        <CertificateShowcase />

        {/* Call to Action Cohort Subscription */}
        <CTASection />
      </main>

      {/* Footer Branding Links */}
      <Footer />
    </div>
  );
}
