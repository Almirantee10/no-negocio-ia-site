"use client";
import { useRef } from "react";
import Button from "./Button";
import { waLink } from "@/lib/site";
import { gsap, useGSAP, reduced } from "@/lib/gsap";

export default function CtaBand() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      const q = gsap.utils.selector(root);
      gsap.from(q(".cta")[0], {
        scale: 0.92, y: 60, autoAlpha: 0, borderRadius: 80, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 88%" },
      });
      // anéis decorativos (nós da marca) respirando e flutuando com o scroll
      q(".ring-deco").forEach((r, i) => {
        gsap.to(r, {
          yPercent: i % 2 ? -30 : 30, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.to(r, { scale: 1.08, duration: 3 + i, yoyo: true, repeat: -1, ease: "sine.inOut" });
      });
    },
    { scope: root }
  );

  return (
    <div className="cta-wrap" ref={root}>
      <div className="cta">
        <span className="ring-deco" style={{ width: 340, height: 340, right: -80, top: -140 }} />
        <span className="ring-deco" style={{ width: 200, height: 200, right: 120, bottom: -110 }} />
        <div style={{ position: "relative" }}>
          <h2 data-fade>Vamos ver onde a IA cabe no seu negócio?</h2>
          <p>Chama a gente no WhatsApp.</p>
        </div>
        <Button size="lg" variant="dark" iconLeft="message-circle" href={waLink} target="_blank">Falar no WhatsApp</Button>
      </div>
    </div>
  );
}
