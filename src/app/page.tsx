"use client";

import { useState } from "react";
import GameSetup from "./components/GameSetup";
import GameBoard from "./components/GameBoard";

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [numPlayers, setNumPlayers] = useState(3);

  const startGame = (players: number) => {
    setNumPlayers(players);
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameStarted(false);
    setNumPlayers(3);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-6 md:mb-8">
          🃏 Flip Seven Card Counter
        </h1>

        {!gameStarted ? (
          <GameSetup onStartGame={startGame} />
        ) : (
          <GameBoard numPlayers={numPlayers} onReset={resetGame} />
        )}
      </div>
    </main>
  );
}
