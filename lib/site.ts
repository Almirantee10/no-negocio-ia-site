export const WA = "5563992966374";
export const waLink = `https://wa.me/${WA}?text=${encodeURIComponent(
  "Olá! Vim pelo site e quero saber mais sobre as soluções da No Negócio IA."
)}`;

export const services = [
  { icon: "globe", title: "Criação de sites", desc: "Site profissional para apresentar sua empresa e trazer novos clientes." },
  { icon: "layout-dashboard", title: "Dashboards", desc: "Vendas, estoque e resultados em um painel simples de acompanhar." },
  { icon: "utensils", title: "Cardápio digital", desc: "Cardápio online com pedido direto no WhatsApp, fácil de atualizar." },
  { icon: "workflow", title: "Automações", desc: "Tarefas repetidas, cadastros e relatórios rodando sozinhos." },
  { icon: "bot", title: "Agentes de IA", desc: "Atendimento no WhatsApp e Instagram com o jeito da sua empresa, a qualquer hora." },
] as const;

export const problems = [
  { title: "Cliente esperando resposta", desc: "A IA atende na hora, inclusive fora do horário." },
  { title: "Processos bagunçados", desc: "A gente alinha o fluxo antes de automatizar." },
  { title: "Tempo perdido com tarefa repetida", desc: "Automações cuidam do operacional para você focar no que importa." },
  { title: "Decisão sem números", desc: "Dashboards mostram o que está funcionando." },
] as const;

export const steps = [
  { n: "01", title: "Diagnóstico", desc: "Conversamos sobre sua rotina e encontramos onde a IA gera mais resultado." },
  { n: "02", title: "Implantação", desc: "Criamos a solução e conectamos às ferramentas que você já usa." },
  { n: "03", title: "Acompanhamento", desc: "Ajustamos junto com você até tudo rodar redondo." },
] as const;

export const interestOptions = [
  "Criação de site", "Dashboard", "Cardápio digital", "Automações", "Agente de IA", "Ainda não sei",
];
