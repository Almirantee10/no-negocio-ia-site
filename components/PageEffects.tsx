"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, reduced } from "@/lib/gsap";

/** Efeitos globais: barra de progresso, revelações por atributo e botões magnéticos. */
export default function PageEffects() {
  const bar = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    if (reduced()) return;

    // barra de progresso do scroll
    gsap.to(bar.current, {
      scaleX: 1, ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });

    // títulos: palavra por palavra
    gsap.utils.toArray<HTMLElement>("[data-words]").forEach((el) => {
      gsap.from(el.querySelectorAll(".wi"), {
        yPercent: 115, rotate: 3, duration: 1, stagger: 0.06, ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    // textos de apoio
    gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((el) => {
      gsap.from(el, {
        y: 28, autoAlpha: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
      });
    });

    // botões magnéticos
    const cleanups: (() => void)[] = [];
    if (window.matchMedia("(pointer:fine)").matches) {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1,0.5)" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1,0.5)" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
        };
        const leave = () => { xTo(0); yTo(0); };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
      });
    }

    // recalcula posições quando a fonte termina de carregar
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <div className="progress" aria-hidden="true">
      <i ref={bar as React.RefObject<HTMLElement | null> as never} />
    </div>
  );
}
