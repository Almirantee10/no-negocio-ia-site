"use client";
import { useRef } from "react";
import Button from "./Button";
import { waLink } from "@/lib/site";
import { gsap, ScrollTrigger, useGSAP, reduced } from "@/lib/gsap";

const links = [
  ["#solucoes", "Soluções"],
  ["#para-quem", "Para quem"],
  ["#como-funciona", "Como funciona"],
  ["#contato", "Contato"],
] as const;

export default function Header() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      if (!reduced()) {
        gsap.from(el.querySelectorAll(".logo-h, nav a, .btn"), {
          y: -18, autoAlpha: 0, stagger: 0.08, duration: 0.9, ease: "power3.out", delay: 0.2,
        });

        // esconde ao descer, mostra ao subir
        const hide = gsap.to(el, { yPercent: -100, paused: true, duration: 0.35, ease: "power2.inOut" });
        ScrollTrigger.create({
          start: 160, end: "max",
          onUpdate: (self) => { if (self.direction === 1) hide.play(); else hide.reverse(); },
        });
        ScrollTrigger.create({ start: 0, end: 160, onLeaveBack: () => hide.reverse() });
      }

      // link ativo conforme a seção
      links.forEach(([href]) => {
        const sec = document.querySelector(href);
        if (!sec) return;
        const a = el.querySelector(`nav a[href="${href}"]`);
        ScrollTrigger.create({
          trigger: sec, start: "top 55%", end: "bottom 55%",
          onToggle: (s) => a?.classList.toggle("active", s.isActive),
        });
      });
    },
    { scope: ref }
  );

  return (
    <header className="header" ref={ref}>
      <div className="in">
        <a href="#inicio" style={{ display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo-h" src="/logo/logo-horizontal-cor-sem-slogan.svg" alt="No Negócio IA" />
        </a>
        <nav>
          {links.map(([h, l]) => (
            <a key={h} href={h}>{l}</a>
          ))}
        </nav>
        <Button size="sm" variant="dark" iconLeft="message-circle" href={waLink} target="_blank">
          Falar com a gente
        </Button>
      </div>
    </header>
  );
}
