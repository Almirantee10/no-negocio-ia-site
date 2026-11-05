import BrainBackground from "@/components/BrainBackground";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import ForWho from "@/components/ForWho";
import HowItWorks from "@/components/HowItWorks";
import Contact from "@/components/Contact";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import PageEffects from "@/components/PageEffects";

export default function Page() {
  return (
    <>
      <BrainBackground />
      <PageEffects />
      <div className="page">
        <Header />
        <main>
          <Hero />
          <Marquee />
          <Services />
          <ForWho />
          <HowItWorks />
          <Contact />
          <CtaBand />
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </>
  );
}
