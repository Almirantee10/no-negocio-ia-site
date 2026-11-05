"use client";
import { useRef } from "react";
import Words from "./Words";
import { steps } from "@/lib/site";
import { gsap, useGSAP, reduced } from "@/lib/gsap";

export default function HowItWorks() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      const q = gsap.utils.selector(root);
      const grid = q(".steps")[0];

      // a linha laranja "corre" de passo em passo conforme o scroll
      const tl = gsap.timeline({
        scrollTrigger: { trigger: grid, start: "top 78%", end: "bottom 55%", scrub: 0.8 },
      });
      q(".step").forEach((s, i) => {
        const n = s.querySelector(".n") as HTMLElement;
        const target = i + 1;
        n.textContent = "00";
        const o = { v: 0 };
        tl.to(s.querySelector(".rule i"), { scaleX: 1, duration: 1, ease: "none" }, i * 0.9)
          .to(s.querySelector(".dot"), { scale: 1, duration: 0.3, ease: "back.out(3)" }, i * 0.9 + 0.8)
          .from(s.querySelector("h3"), { y: 30, autoAlpha: 0, duration: 0.5 }, i * 0.9 + 0.1)
          .from(s.querySelector("p"), { y: 30, autoAlpha: 0, duration: 0.5 }, i * 0.9 + 0.25)
          .to(o, {
            v: target, duration: 0.5, ease: "none",
            onUpdate: () => { n.textContent = String(Math.round(o.v)).padStart(2, "0"); },
          }, i * 0.9);
      });
    },
    { scope: root }
  );

  return (
    <section id="como-funciona" className="dark-sec" ref={root}>
      <div className="container">
        <span className="eyebrow on-dark" data-fade>Como funciona</span>
        <h2 data-words><Words text="Do primeiro papo à solução rodando no seu negócio." /></h2>
        <div className="steps">
          {steps.map((s) => (
            <div className="step" key={s.n}>
              <div className="rule"><i /></div>
              <span className="dot" />
              <span className="n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
