// Quebra um texto em palavras com máscara — animadas via [data-words] (ver PageEffects) ou pelo Hero.
export default function Words({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span
          key={i}
          className="w"
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: ".12em", marginBottom: "-.12em" }}
        >
          <span className="wi" style={{ display: "inline-block", willChange: "transform" }}>
            {w}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}
