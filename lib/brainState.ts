// Estado compartilhado entre o ScrollTrigger (GSAP) e o canvas do cérebro.
export const brain = {
  yaw: 0,        // rotação extra vinda do scroll (rad)
  scale: 1,      // zoom
  x: 0,          // deslocamento horizontal (fração da largura)
  y: 0,          // deslocamento vertical (fração da altura)
  energy: 1,     // multiplicador de pulsos de dados
  opacity: 1,
};
