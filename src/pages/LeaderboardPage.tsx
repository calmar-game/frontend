import React, { useEffect, useState } from "react";
import { Trophy, Crown, Medal } from "lucide-react";
import { getTopPlayers, Player } from "../api";


export function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    getTopPlayers()
      .then((res) => setPlayers(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen w-full p-4 md:p-6 pb-32 bg-black grid-pattern">
      <div className="max-w-xl mx-auto">
        <div className="glass-effect pixel-corners p-4 md:p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm md:text-base text-[#00ff00] tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
              RANKS
            </h2>
            <select className="bg-black/30 glass-effect pixel-corners text-[#00ff00] px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-sm tracking-wider">
              <option>GLOBAL</option>
              <option>FRIENDS</option>
            </select>
          </div>

          <div className="space-y-2 md:space-y-3">
            {players.length === 0 ? (
              <p className="text-center text-[#00ff00] text-sm md:text-base">
                You can be first 
              </p>
            ) : (
              players.map((player, idx) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 md:p-4 pixel-corners
                  ${
                    idx === 3
                      ? "bg-[#00ff00]/10 glass-effect"
                      : idx === 0
                      ? "bg-yellow-400/10 glass-effect"
                      : "glass-effect"
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex items-center gap-2">
                      {idx === 0 ? (
                        <Crown
                          className="w-5 h-5 text-yellow-400 animate-pulse-fast"
                          fill="currentColor"
                        />
                      ) : idx === 1 ? (
                        <Medal className="w-5 h-5 text-gray-400" />
                      ) : idx === 2 ? (
                        <Medal className="w-5 h-5 text-yellow-700" />
                      ) : (
                        <span className="text-sm md:text-base text-[#00ff00]">
                          #{idx + 1}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs md:text-sm ${
                        idx === 3 ? "text-[#00ff00]" : "text-white"
                      }`}
                    >
                      {player.username}
                    </span>
                  </div>
                  <span
                    className={`text-xs md:text-sm font-bold ${
                      idx === 0
                        ? "text-yellow-400 neon-text"
                        : idx === 3
                        ? "text-[#00ff00]"
                        : "text-white"
                    }`}
                  >
                    {player.score.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
