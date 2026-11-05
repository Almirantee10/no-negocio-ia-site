"use client";
import { useRef } from "react";
import { waLink } from "@/lib/site";
import { gsap, useGSAP, reduced } from "@/lib/gsap";

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from(gsap.utils.selector(root)(".f-brand, .f-col"), {
        y: 40, autoAlpha: 0, stagger: 0.12, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 90%" },
      });
    },
    { scope: root }
  );

  return (
    <footer className="footer" ref={root}>
      <div className="f-grid">
        <div className="f-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/logo-horizontal-negativo-transparente.svg" alt="No Negócio IA" style={{ height: 56, width: "auto" }} />
          <p>Soluções em inteligência artificial para o seu negócio.</p>
        </div>
        <div className="f-col">
          <span className="eyebrow">Navegue</span>
          <a href="#solucoes">Soluções</a>
          <a href="#para-quem">Para quem</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#contato">Contato</a>
        </div>
        <div className="f-col">
          <span className="eyebrow">Contato</span>
          <a href="https://instagram.com/nonegocio.ia" target="_blank" rel="noopener noreferrer">Instagram @nonegocio.ia</a>
          <a href={waLink} target="_blank" rel="noopener noreferrer">WhatsApp (63) 99296-6374</a>
          <span style={{ color: "var(--neutral-400)" }}>Atendimento em todo o Brasil</span>
        </div>
      </div>
      <div className="f-bottom">
        <span>© 2026 No Negócio IA</span>
        <span className="eyebrow" style={{ fontSize: 11 }}>Mais eficiência com IA</span>
      </div>
    </footer>
  );
}
