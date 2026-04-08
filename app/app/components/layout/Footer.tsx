import { MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black/60 backdrop-blur-md border-t border-neutral-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          <div className="space-y-4">
            <h3 className="text-[#C2AE82] text-xl font-extrabold tracking-widest">
              MIRLLE FITNESS
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Moda Fitness. Conforto, qualidade e estilo para o seu treino e os seus momentos de lazer.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-sm">Atendimento</h4>
            <ul className="space-y-4">


              <li>
                <a
                  href="https://wa.me/5583999223662"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-[#C2AE82] transition-colors group"
                >
                  <span className="bg-neutral-900 p-2 rounded-lg group-hover:bg-[#C2AE82]/10 transition-colors flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                    </svg>
                  </span>
                  (83) 9 9922-3662
                </a>
              </li>

              <li className="flex items-start gap-3 text-gray-400">
                <a
                  href="https://share.google/b2xep7UNWYb5BCsJh"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 text-gray-400 hover:text-[#C2AE82] transition-colors group"
                >
                  <span className="bg-neutral-900 p-2 rounded-lg mt-0.5 group-hover:bg-[#C2AE82]/10 transition-colors">
                    <MapPin size={18} className="text-gray-400 group-hover:text-[#C2AE82] transition-colors" />
                  </span>
                  <span className="text-sm leading-relaxed">
                    Rua Josefa Taveira, 901 - Mangabeira,<br />
                    João Pessoa, Brazil 58055-000
                  </span>
                </a>
              </li>
            </ul>
          </div>


          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-sm">Siga-nos</h4>
            <a
              href="https://www.instagram.com/mirllefitness/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 text-gray-400 hover:text-[#C2AE82] transition-colors group"
            >
             <span className="bg-neutral-900 p-2 rounded-lg group-hover:bg-[#C2AE82]/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </span>
              <span className="text-sm font-medium">@mirllefitness</span>
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800/50 flex flex-col items-center justify-center gap-6 text-center">
          <div className="max-w-3xl px-4">
            <p className="text-[13px] text-gray-500 italic leading-relaxed">
              “Mas os que esperam no Senhor renovarão as forças, subirão com asas como águias;
              correrão, e não se cansarão; caminharão, e não desfalecerão.”
            </p>
            <span className="text-[10px] text-[#C2AE82] font-bold tracking-[0.2em] uppercase block mt-2">
              Isaías 40:31
            </span>
          </div>
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} MirlleFitness. Todos os direitos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}