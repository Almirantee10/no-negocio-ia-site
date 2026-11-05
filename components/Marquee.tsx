"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, reduced } from "@/lib/gsap";

const items = ["Criação de sites", "Dashboards", "Cardápio digital", "Automações", "Agentes de IA", "Mais eficiência com IA"];

function Group() {
  return (
    <div className="marquee-group">
      {items.map((t, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
          <span className={`t ${i === items.length - 1 ? "o" : ""}`}>{t}</span>
          <span className="node" />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      const loop = gsap.to(track.current, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
      // a velocidade do scroll acelera (e inverte) o marquee
      ScrollTrigger.create({
        start: 0, end: "max",
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 350);
          gsap.to(loop, { timeScale: 1 + v, duration: 0.2, overwrite: true });
          gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.2, ease: "power2.out" });
        },
      });
    },
    { scope: root }
  );

  return (
    <div className="marquee" ref={root} aria-hidden="true">
      <div className="marquee-track" ref={track}>
        <Group />
        <Group />
      </div>
    </div>
  );
}
