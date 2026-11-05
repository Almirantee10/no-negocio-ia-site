"use client";
import { useRef, useState } from "react";
import Button from "./Button";
import Icon, { Instagram } from "./Icon";
import Words from "./Words";
import { WA, waLink, interestOptions } from "@/lib/site";
import { gsap, useGSAP, reduced } from "@/lib/gsap";

const empty = { nome: "", whats: "", empresa: "", interesse: "", msg: "" };

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [form, setForm] = useState(empty);
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const errNome = tried && !form.nome.trim() ? "Informe seu nome" : "";
  const errWhats = tried && form.whats.replace(/\D/g, "").length < 10 ? "Informe um WhatsApp com DDD" : "";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || form.whats.replace(/\D/g, "").length < 10) {
      setTried(true);
      if (!reduced()) gsap.fromTo(".form-card", { x: -8 }, { x: 0, duration: 0.6, ease: "elastic.out(1.2,0.25)" });
      return;
    }
    const t = `Olá! Sou ${form.nome}${form.empresa ? ` da ${form.empresa}` : ""}. Tenho interesse em: ${form.interesse || "conhecer as soluções"}.${form.msg ? `\n${form.msg}` : ""}\nMeu WhatsApp: ${form.whats}`;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(t)}`, "_blank");
    setTried(false);
    setSent(true);
  };

  useGSAP(
    () => {
      if (reduced()) return;
      const q = gsap.utils.selector(root);
      gsap.from(q(".form-card"), {
        y: 70, autoAlpha: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: q(".form-card")[0], start: "top 85%" },
      });
      gsap.from(q(".field, .form .btn"), {
        y: 24, autoAlpha: 0, stagger: 0.09, duration: 0.7, ease: "power3.out", delay: 0.25,
        scrollTrigger: { trigger: q(".form-card")[0], start: "top 80%" },
      });
      gsap.from(q(".c-link"), {
        x: -30, autoAlpha: 0, stagger: 0.15, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: q(".c-links")[0], start: "top 88%" },
      });
    },
    { scope: root }
  );

  // anima a troca para a mensagem de sucesso
  useGSAP(
    () => {
      if (sent && !reduced()) {
        const tl = gsap.timeline();
        tl.from(".sent > *", { y: 20, autoAlpha: 0, stagger: 0.1, duration: 0.6, ease: "power3.out" })
          .from(".sent .ok", { scale: 0, rotate: -120, duration: 0.7, ease: "back.out(2.4)" }, 0);
      }
    },
    { dependencies: [sent], scope: root }
  );

  return (
    <section id="contato" className="section contact" ref={root}>
      <div className="c-copy">
        <span className="eyebrow" data-fade>Contato</span>
        <h2 data-words><Words text="Bora conversar sobre o seu negócio?" /></h2>
        <p className="l" data-fade>
          Conte o que você precisa. A gente responde pelo WhatsApp com uma proposta de como a IA pode ajudar.
        </p>
        <div className="c-links">
          <a className="c-link" href={waLink} target="_blank" rel="noopener noreferrer">
            <span className="ic" style={{ background: "var(--nn-laranja)", color: "var(--nn-preto)" }}><Icon name="message-circle" size={22} /></span>
            <span><small>WhatsApp</small>(63) 99296-6374</span>
          </a>
          <a className="c-link" href="https://instagram.com/nonegocio.ia" target="_blank" rel="noopener noreferrer">
            <span className="ic" style={{ background: "var(--nn-preto)", color: "var(--nn-papel)" }}><Instagram size={22} /></span>
            <span><small>Instagram</small>@nonegocio.ia</span>
          </a>
        </div>
      </div>

      <div className="form-card">
        {!sent ? (
          <form className="form" onSubmit={submit} noValidate>
            <div className={`field ${errNome ? "err" : ""}`}>
              <label htmlFor="nome">Seu nome</label>
              <input id="nome" placeholder="Como podemos te chamar?" value={form.nome} onChange={set("nome")} />
              {errNome && <span className="e">{errNome}</span>}
            </div>
            <div className={`field ${errWhats ? "err" : ""}`}>
              <label htmlFor="whats">WhatsApp</label>
              <input id="whats" type="tel" placeholder="(00) 00000-0000" value={form.whats} onChange={set("whats")} />
              {errWhats && <span className="e">{errWhats}</span>}
            </div>
            <div className="field">
              <label htmlFor="empresa">Empresa ou comércio</label>
              <input id="empresa" placeholder="Nome do seu negócio" value={form.empresa} onChange={set("empresa")} />
            </div>
            <div className="field">
              <label htmlFor="interesse">Tenho interesse em</label>
              <select id="interesse" value={form.interesse} onChange={set("interesse")}>
                <option value="">Escolha uma opção</option>
                {interestOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="msg">Conte um pouco (opcional)</label>
              <textarea id="msg" placeholder="O que mais toma o seu tempo hoje?" value={form.msg} onChange={set("msg")} />
            </div>
            <Button type="submit" size="lg" full iconRight="arrow-right">Quero meu diagnóstico</Button>
          </form>
        ) : (
          <div className="sent">
            <div className="ok"><Icon name="check" size={28} /></div>
            <h3>Recebemos, {form.nome.trim().split(" ")[0]}!</h3>
            <p className="muted">Abrimos o WhatsApp com a sua mensagem pronta. É só tocar em enviar que a gente responde.</p>
            <Button variant="secondary" onClick={() => { setSent(false); setForm(empty); }}>Enviar outra mensagem</Button>
          </div>
        )}
      </div>
    </section>
  );
}
