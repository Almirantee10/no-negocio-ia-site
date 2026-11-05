"use client";
import { useRef } from "react";
import Icon from "./Icon";
import Words from "./Words";
import { services } from "@/lib/site";
import { gsap, useGSAP, reduced } from "@/lib/gsap";

export default function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      const q = gsap.utils.selector(root);

      gsap.from(q(".card"), {
        y: 80, autoAlpha: 0, rotateX: -14, transformOrigin: "50% 100%", stagger: 0.12, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: q(".cards")[0], start: "top 82%" },
      });
      gsap.from(q(".tile"), {
        scale: 0, rotate: -90, stagger: 0.12, duration: 0.8, ease: "back.out(2)", delay: 0.25,
        scrollTrigger: { trigger: q(".cards")[0], start: "top 82%" },
      });

      // cada cartão: inclinação 3D + brilho que segue o mouse
      q(".card").forEach((card) => {
        const el = card as HTMLElement;
        const rx = gsap.quickTo(el, "rotateX", { duration: 0.5, ease: "power3" });
        const ry = gsap.quickTo(el, "rotateY", { duration: 0.5, ease: "power3" });
        const icon = el.querySelector(".tile") as HTMLElement;
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          el.style.setProperty("--mx", px * 100 + "%");
          el.style.setProperty("--my", py * 100 + "%");
          ry((px - 0.5) * 10);
          rx(-(py - 0.5) * 10);
        };
        const enter = () => gsap.to(el, { y: -4, duration: 0.35, ease: "power3.out" });
        const leave = () => {
          rx(0); ry(0);
          gsap.to(el, { y: 0, duration: 0.5, ease: "power3.out" });
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerenter", enter);
        el.addEventListener("pointerleave", leave);
        el.addEventListener("pointerenter", () => gsap.fromTo(icon, { rotate: 0 }, { rotate: 360, duration: 0.7, ease: "power3.inOut" }));
      });
    },
    { scope: root }
  );

  return (
    <section id="solucoes" className="section" ref={root}>
      <div className="sec-head">
        <div className="l">
          <span className="eyebrow" data-fade>Soluções</span>
          <h2 data-words><Words text="O que a gente faz pelo seu negócio" /></h2>
        </div>
        <p data-fade>Soluções em inteligência artificial feitas sob medida para empresários e donos de comércio.</p>
      </div>
      <div className="cards">
        {services.map((s) => (
          <div className="card" key={s.title}>
            <div className="tile"><Icon name={s.icon} size={24} /></div>
            <h4>{s.title}</h4>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
