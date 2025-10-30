import { useEffect, useState } from "react";
import { Trophy, Crown, Medal } from "lucide-react";
import { getTopPlayers, Player } from "../api";
import { useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";


export function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const location = useLocation();
  const showNavbar = !['/', '/setup'].includes(location.pathname);

  
  useEffect(() => {
    getTopPlayers()
      .then((res) => setPlayers(res))
      .catch((err) => console.error(err));
  }, []);

  return <>
      {showNavbar && <Navbar />}

    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-32">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-4 md:p-6">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-xl">
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
            
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200">
                Leaderboard
              </span>
            </h1>
            
            <p className="text-sm text-gray-400">
              Top players of the game
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-400" />
                Ranking
              </h2>
              {/* <select className="bg-slate-800/50 backdrop-blur-xl rounded-lg border border-slate-700 text-white px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all">
                <option>Global</option>
                <option>Friends</option>
              </select> */}
            </div>

            <div className="space-y-3">
              {players.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-slate-800/50 border border-slate-700">
                    <Trophy className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-sm">
                    No players yet. Be the first!
                  </p>
                </div>
              ) : (
                players.map((player, idx) => {
                  // Define styles for top 3 players
                  const isFirst = idx === 0;
                  const isSecond = idx === 1;
                  const isThird = idx === 2;
                  
                  return (
                    <div
                      key={player.id}
                      className={`relative overflow-hidden rounded-xl p-4 border transition-all duration-300 hover:scale-[1.02]
                        ${isFirst 
                          ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30 shadow-lg shadow-yellow-500/20" 
                          : isSecond
                          ? "bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-slate-500/30"
                          : isThird
                          ? "bg-gradient-to-r from-orange-700/20 to-yellow-700/20 border-orange-600/30"
                          : "bg-slate-800/50 border-slate-700/50 hover:border-purple-500/30"
                        }`}
                    >
                      {/* Glow effect for top 3 */}
                      {isFirst && (
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 animate-pulse"></div>
                      )}
                      
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Rank indicator */}
                          <div className="flex items-center justify-center w-10 h-10">
                            {isFirst ? (
                              <Crown
                                className="w-7 h-7 text-yellow-400 animate-pulse"
                                fill="currentColor"
                              />
                            ) : isSecond ? (
                              <Medal className="w-6 h-6 text-slate-400" fill="currentColor" />
                            ) : isThird ? (
                              <Medal className="w-6 h-6 text-orange-600" fill="currentColor" />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center border border-slate-600">
                                <span className="text-sm font-bold text-gray-400">
                                  {idx + 1}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Username */}
                          <span
                            className={`text-sm md:text-base font-semibold ${
                              isFirst
                                ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400"
                                : isSecond
                                ? "text-slate-300"
                                : isThird
                                ? "text-orange-400"
                                : "text-white"
                            }`}
                          >
                            {player.username}
                          </span>
                        </div>
                        
                        {/* Score */}
                        <span
                          className={`text-sm md:text-base font-bold ${
                            isFirst
                              ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400"
                              : isSecond
                              ? "text-slate-300"
                              : isThird
                              ? "text-orange-400"
                              : "text-gray-300"
                          }`}
                        >
                          {player.rank.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>;
}
