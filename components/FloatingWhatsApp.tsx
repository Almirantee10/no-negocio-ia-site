"use client";
import { useRef } from "react";
import Icon from "./Icon";
import { waLink } from "@/lib/site";
import { gsap, useGSAP, reduced } from "@/lib/gsap";

export default function FloatingWhatsApp() {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    if (reduced()) return;
    gsap.from(ref.current, { scale: 0, rotate: -90, duration: 0.9, ease: "back.out(2)", delay: 2.6 });
  }, { scope: ref });

  return (
    <a ref={ref} className="float-wa" href={waLink} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp" data-magnetic>
      <Icon name="message-circle" size={28} />
    </a>
  );
}
