import { useState } from "react";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Offer } from "@/components/site/Offer";
import { Estimator } from "@/components/site/Estimator";
import { Availability } from "@/components/site/Availability";
import { Gallery } from "@/components/site/Gallery";
import { Contact } from "@/components/site/Contact";
import { Footer, MobileCallBar } from "@/components/site/Footer";
import { CallGuard } from "@/components/site/CallGuard";
import { scrollToId } from "@/lib/api";

export default function Landing() {
  const [prefill, setPrefill] = useState(null);
  const inquire = (data) => {
    setPrefill({ ...data });
    setTimeout(() => {
      const mobile = window.matchMedia("(max-width: 1023px)").matches;
      scrollToId(mobile ? "szybkie-zapytanie" : "kontakt", mobile ? -90 : -72);
    }, 50);
  };
  return (
    <div className="site grain relative min-h-screen bg-[#0A0A0A] text-white" data-testid="landing-page">
      <SmoothScroll />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Offer />
        <Estimator onInquiry={inquire} />
        <Availability onInquiry={inquire} />
        <Gallery />
        <Contact prefill={prefill} />
      </main>
      <Footer />
      <MobileCallBar />
      <CallGuard />
    </div>
  );
}
