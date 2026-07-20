"use client";

interface ProfileStatsPanelProps {
  recordsCount?: number;
  averageRank?: number | null;
}

export default function ProfileStatsPanel({ recordsCount = 0, averageRank = null }: ProfileStatsPanelProps) {
  // Mantive a sua lógica de divisão e arredondamento
  const rank = averageRank !== null ? Math.round(averageRank / 10000) : 0;
  
  // O ponteiro gira de 0 a 180 graus
  const rotation = (rank / 100) * 180;

  // Determinar a categoria baseada no rank
  let category = "Sem dados";
  let categoryColor = "text-gray-400";

  if (averageRank !== null) {
    if (rank <= 33) {
      category = "UNDERGROUND";
      categoryColor = "text-blue-500";
    } else if (rank <= 66) {
      category = "NORMIE";
      categoryColor = "text-purple-500";
    } else {
      category = "MAINSTREAM";
      categoryColor = "text-pink-500";
    }
  }

  return (
    <div className="flex flex-col w-full bg-background-light p-8 rounded-2xl border border-gray-700/50 justify-between">
      <div className="flex flex-col items-center gap-2 mb-8">
        <span className="text-4xl font-black text-white">{recordsCount}</span>
        <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">Músicas Logadas</span>
      </div>

      <div className="flex flex-col items-center">
        {/*<span className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-4">Medidor de Perfil</span>*/}
        
        {/* Velocímetro em SVG */}
        <div className="relative w-full max-w-[240px] aspect-[2/1] overflow-hidden">
          <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible drop-shadow-md">
            {/* Zona Underground (0 - 33) */}
            <path 
              d="M 20 100 A 80 80 0 0 1 60 30.72" 
              fill="none" 
              stroke="#2b7fff" 
              strokeWidth="14" 
              strokeLinecap="round"
            />
            {/* Zona Normal (34 - 66) */}
            <path 
              d="M 60 30.72 A 80 80 0 0 1 140 30.72" 
              fill="none" 
              stroke="#ad46ff" 
              strokeWidth="14" 
            />
            {/* Zona Mainstream (67 - 100) */}
            <path 
              d="M 140 30.72 A 80 80 0 0 1 180 100" 
              fill="none" 
              stroke="#f6339a" 
              strokeWidth="14" 
              strokeLinecap="round"
            />

            <g 
              style={{ 
                transform: `rotate(${rotation}deg)`, 
                transformOrigin: '100px 100px',
                transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {/* 
                x="32": distância do início da agulha até a borda esquerda
                y="97": centraliza verticalmente no eixo (100 - metade da altura)
                width="68": comprimento do retângulo até o centro (100 - 32)
                height="10": espessura da agulha
                rx="3": deixa as pontas perfeitamente arredondadas (metade da altura)
              */}
              <rect x="20" y="95" width="80" height="10" rx="5" fill="#f3f4f6" />
              
              <circle cx="100" cy="100" r="6" fill="#f3f4f6" />
              <circle cx="100" cy="100" r="2" fill="#1f2937" />
            </g>
          </svg>
        </div>

        <div className="text-center mt-2">
          {averageRank !== null ? (
            <>
              <p className="text-2xl font-bold text-white">{rank}</p>
              <p className={`text-lg font-bold ${categoryColor}`}>{category}</p>
            </>
          ) : (
            <p className="text-lg font-bold text-gray-500 mt-2">Nenhum record ainda</p>
          )}
        </div>
      </div>
    </div>
  );
}