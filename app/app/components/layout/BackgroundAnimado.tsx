'use client';

export default function BackgroundAnimado() {
  const formas = [
    { id: 1, tipo: 'quadrado', left: '10%', size: 40, delay: '0s', duration: '12s' },
    { id: 2, tipo: 'triangulo', left: '25%', size: 60, delay: '2s', duration: '18s' },
    { id: 3, tipo: 'quadrado', left: '45%', size: 30, delay: '5s', duration: '10s' },
    { id: 4, tipo: 'triangulo', left: '60%', size: 50, delay: '1s', duration: '15s' },
    { id: 5, tipo: 'quadrado', left: '80%', size: 45, delay: '4s', duration: '14s' },
    { id: 6, tipo: 'triangulo', left: '90%', size: 35, delay: '7s', duration: '19s' },
  ];

  return (
    // pointer-events-none garante que o usuário consiga clicar nos botões que ficarem por cima da animação
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">

      {/* O motor da animação em CSS puro */}
      <style>{`
        @keyframes flutuar {
          0% {
            transform: translateY(100px) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 0.2; /* Fica levemente transparente para não atrapalhar a leitura do site */
          }
          80% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-800px) rotate(360deg);
            opacity: 0;
          }
        }
        .animacao-flutuar {
          position: absolute;
          bottom: -100px;
          animation-name: flutuar;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>

      {formas.map((forma) => (
        <div
          key={forma.id}
          className="animacao-flutuar"
          style={{
            left: forma.left,
            animationDuration: forma.duration,
            animationDelay: forma.delay,
          }}
        >
          {forma.tipo === 'quadrado' ? (
            <svg width={forma.size} height={forma.size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* O stroke="#C2AE82" puxa a cor dourada que você já usa */}
              <rect x="5" y="5" width="90" height="90" stroke="#C2AE82" strokeWidth="3" />
            </svg>
          ) : (
            <svg width={forma.size} height={forma.size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,5 95,95 5,95" stroke="#C2AE82" strokeWidth="3" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}