'use client';

export default function BackgroundAnimado() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">

      {/* O VÍDEO DE FUNDO
        - autoPlay: Começa sozinho
        - loop: Repete infinitamente
        - muted: Mudo (obrigatório para navegadores deixarem dar autoplay)
        - playsInline: Evita que o iPhone abra o vídeo em tela cheia do nada
      */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover filter grayscale-[80%] opacity-40"
      >
        <source src="/videos/VideoBackground.mp4" type="video/mp4" />
        Seu navegador não suporta vídeos de fundo.
      </video>

       {/* brilhos de fundo pro vídeo */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.05%22/%3E%3C/svg%3E')] pointer-events-none"></div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-neutral-950 pointer-events-none"></div>

      <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[30%] bg-[#C2AE82] mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>
    </div>
  );
}