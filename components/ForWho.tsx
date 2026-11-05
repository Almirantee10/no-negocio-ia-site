"use client";
import { useRef } from "react";
import Words from "./Words";
import { problems } from "@/lib/site";
import { gsap, useGSAP, reduced } from "@/lib/gsap";

export default function ForWho() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      const q = gsap.utils.selector(root);
      const sticker = q(".sticker")[0];

      gsap.from(sticker, {
        x: -24, y: -24, boxShadow: "0px 0px 0 #141414", autoAlpha: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sticker, start: "top 80%" },
      });

      const tl = gsap.timeline({ scrollTrigger: { trigger: sticker, start: "top 70%" } });
      q(".prob").forEach((p, i) => {
        const circle = p.querySelector("circle") as SVGCircleElement;
        const len = 2 * Math.PI * 8;
        gsap.set(circle, { strokeDasharray: len, strokeDashoffset: len });
        tl.from(p, { x: 30, autoAlpha: 0, duration: 0.7, ease: "power3.out" }, i * 0.28)
          .to(circle, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, i * 0.28 + 0.1)
          .from(p.querySelector("b"), { letterSpacing: "0.04em", duration: 0.8, ease: "power3.out" }, i * 0.28 + 0.1);
      });
    },
    { scope: root }
  );

  return (
    <section id="para-quem" className="section who-sec" ref={root}>
      <div className="who-copy">
        <span className="eyebrow" data-fade>Para quem</span>
        <h2 data-words><Words text="Para o empresário que quer menos retrabalho e mais resultado." /></h2>
        <p className="muted" data-fade>
          A gente entende como o seu comércio funciona hoje, alinha os processos e coloca a IA onde ela economiza mais tempo.
        </p>
      </div>
      <div className="sticker">
        {problems.map((p) => (
          <div className="prob" key={p.title}>
            <span className="ring">
              <svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" /></svg>
            </span>
            <div>
              <b>{p.title}</b>
              <span className="d">{p.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
