"use client";
import { useRef } from "react";
import Button from "./Button";
import Words from "./Words";
import { gsap, useGSAP, reduced } from "@/lib/gsap";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const all = q(".pre");
      if (reduced()) {
        gsap.set(all, { autoAlpha: 1 });
        gsap.set(q(".hl"), { "--w": "100%" });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.35 });
      tl.set(all, { autoAlpha: 1 })
        .from(q(".eyebrow"), { y: 16, autoAlpha: 0, duration: 0.8 })
        .from(q("h1 .wi"), { yPercent: 115, rotate: 4, duration: 1.1, stagger: 0.07 }, "-=0.5")
        .fromTo(q(".hl"), { "--w": "0%" }, { "--w": "100%", duration: 0.9, ease: "expo.inOut" }, "-=0.55")
        .from(q(".hero-lead"), { y: 24, autoAlpha: 0, duration: 0.9 }, "-=0.6")
        .from(q(".hero-cta > *"), { y: 24, autoAlpha: 0, scale: 0.94, stagger: 0.1, duration: 0.8 }, "-=0.6")
        .from(q(".chat"), { y: 70, autoAlpha: 0, duration: 1.2 }, "-=1.1")
        .from(q(".chat-top > *"), { y: 10, autoAlpha: 0, stagger: 0.07, duration: 0.5 }, "-=0.6")
        .from(q(".scroll-cue"), { autoAlpha: 0, duration: 0.8 }, "-=0.2");

      // conversa: mensagens chegam uma a uma, com "digitando..."
      const msgs = q(".msg");
      const typing = q(".typing")[0];
      gsap.set(msgs, { autoAlpha: 0, y: 14, scale: 0.94 });
      gsap.set(typing, { autoAlpha: 0 });
      const chat = gsap.timeline({ delay: 2.1, repeat: -1, repeatDelay: 4 });
      msgs.forEach((m, i) => {
        const isOut = m.classList.contains("out");
        if (isOut) chat.set(typing, { autoAlpha: 1 }, ">+0.4").set(typing, { autoAlpha: 0 }, ">+0.9");
        chat.to(m, {
          autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)",
          transformOrigin: isOut ? "100% 100%" : "0 100%",
        }, ">+0.15");
      });
      chat.to(msgs, { autoAlpha: 0, y: -8, duration: 0.5, stagger: 0.05 }, "+=4");

      // inclinação suave do painel com o mouse
      const chatEl = q(".chat")[0];
      const rx = gsap.quickTo(chatEl, "rotateY", { duration: 0.9, ease: "power3" });
      const ry = gsap.quickTo(chatEl, "rotateX", { duration: 0.9, ease: "power3" });
      gsap.set(chatEl, { transformPerspective: 900 });
      const mv = (e: PointerEvent) => {
        rx((e.clientX / window.innerWidth - 0.5) * 8);
        ry(-(e.clientY / window.innerHeight - 0.5) * 6);
      };
      window.addEventListener("pointermove", mv, { passive: true });
      return () => window.removeEventListener("pointermove", mv);
    },
    { scope: root }
  );

  return (
    <section id="inicio" className="hero" ref={root}>
      <div className="hero-copy">
        <span className="eyebrow pre">Mais eficiência com IA</span>
        <h1 className="pre">
          <Words text="Coloque a IA para trabalhar" />{" "}
          <span className="hl">
            <Words text="no seu negócio." />
          </span>
        </h1>
        <p className="hero-lead pre">
          Sites, dashboards, cardápios digitais, automações e agentes de IA — para você ganhar tempo, organizar processos e vender mais.
        </p>
        <div className="row hero-cta">
          <Button size="lg" iconRight="arrow-right" href="#contato" className="pre">Quero automatizar</Button>
          <Button size="lg" variant="secondary" href="#solucoes" className="pre">Ver soluções</Button>
        </div>
      </div>

      <div className="chat pre">
        <div className="chat-top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/simbolo-cor.svg" alt="" />
          <div className="who">
            <b>Atendente IA</b>
            <small><span className="online" />online agora</small>
          </div>
          <span className="badge">Com IA</span>
        </div>
        <div className="msg in">Oi! Vocês entregam hoje?</div>
        <div className="msg out">Oi, Ana! Entregamos sim, até as 22h. Quer ver o cardápio de hoje?</div>
        <div className="msg in">Quero!</div>
        <div className="msg out">Aqui está o link do cardápio. É só escolher e eu já confirmo o pedido.</div>
        <div className="typing" aria-hidden="true"><i /><i /><i /></div>
      </div>
      <div className="scroll-cue pre" aria-hidden="true" />
    </section>
  );
}
