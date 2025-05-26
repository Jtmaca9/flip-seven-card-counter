"use client";

import { useState, useEffect } from "react";
import PlayerBox from "./PlayerBox";
import DeckTracker from "./DeckTracker";

export interface Player {
  id: number;
  name: string;
  currentRoundCards: number[];
  currentRoundModifiers: string[];
  currentRoundScore: number;
  totalScore: number;
  hasBusted: boolean;
  hasStayed: boolean;
}

interface GameBoardProps {
  numPlayers: number;
  onReset: () => void;
}

export default function GameBoard({ numPlayers, onReset }: GameBoardProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [deckState, setDeckState] = useState<{ [key: string]: number }>({});
  const [round, setRound] = useState(1);

  // Initialize deck state with correct card quantities
  const initializeDeck = () => {
    const deck: { [key: string]: number } = {};

    // Number cards: 0 has 1, 1 has 1, 2 has 2, 3 has 3, etc.
    for (let i = 0; i <= 12; i++) {
      deck[i.toString()] = i === 0 ? 1 : i;
    }

    // Modifier cards
    deck["+2"] = 1;
    deck["+4"] = 1;
    deck["+6"] = 1;
    deck["+8"] = 1;
    deck["+10"] = 1;
    deck["X2"] = 1;

    // Action cards
    deck["Freeze"] = 3;
    deck["Flip3"] = 3;
    deck["2ndChance"] = 3;

    return deck;
  };

  // Initialize players
  useEffect(() => {
    const initialPlayers: Player[] = [];
    for (let i = 1; i <= numPlayers; i++) {
      initialPlayers.push({
        id: i,
        name: `Player ${i}`,
        currentRoundCards: [],
        currentRoundModifiers: [],
        currentRoundScore: 0,
        totalScore: 0,
        hasBusted: false,
        hasStayed: false,
      });
    }
    setPlayers(initialPlayers);
    setDeckState(initializeDeck());
  }, [numPlayers]);

  // Check if round is complete
  const isRoundComplete = () => {
    if (players.length === 0) return false;
    return players.every((player) => player.hasBusted || player.hasStayed);
  };

  // Calculate bust probability for a player
  const calculateBustProbability = (player: Player) => {
    if (
      player.hasBusted ||
      player.hasStayed ||
      player.currentRoundCards.length === 0
    ) {
      return 0;
    }

    const cardsInHand = new Set(player.currentRoundCards);
    let bustCards = 0;
    let totalRemainingCards = 0;

    Object.entries(deckState).forEach(([card, count]) => {
      // Only count number cards for bust probability
      if (!isNaN(parseInt(card))) {
        totalRemainingCards += count;
        if (cardsInHand.has(parseInt(card))) {
          bustCards += count;
        }
      }
    });

    return totalRemainingCards > 0
      ? (bustCards / totalRemainingCards) * 100
      : 0;
  };

  // Update deck state when a card is drawn
  const drawCard = (playerId: number, card: string) => {
    setDeckState((prev) => ({
      ...prev,
      [card]: Math.max(0, (prev[card] || 0) - 1),
    }));

    setPlayers((prev) =>
      prev.map((player) => {
        if (player.id === playerId) {
          if (!isNaN(parseInt(card))) {
            // Number card
            const cardNum = parseInt(card);
            const newCards = [...player.currentRoundCards, cardNum];
            const hasBusted = player.currentRoundCards.includes(cardNum);

            return {
              ...player,
              currentRoundCards: newCards,
              hasBusted,
              currentRoundScore: hasBusted
                ? 0
                : calculateRoundScore(newCards, player.currentRoundModifiers),
            };
          } else {
            // Modifier card
            const newModifiers = [...player.currentRoundModifiers, card];
            return {
              ...player,
              currentRoundModifiers: newModifiers,
              currentRoundScore: calculateRoundScore(
                player.currentRoundCards,
                newModifiers
              ),
            };
          }
        }
        return player;
      })
    );
  };

  // Calculate round score
  const calculateRoundScore = (
    cards: number[],
    modifiers: string[]
  ): number => {
    if (cards.length === 0) return 0;

    let baseScore = cards.reduce((sum, card) => sum + card, 0);
    let finalScore = baseScore;

    // Apply X2 modifier first
    if (modifiers.includes("X2")) {
      finalScore *= 2;
    }

    // Add other modifiers
    modifiers.forEach((mod) => {
      if (mod.startsWith("+")) {
        finalScore += parseInt(mod.substring(1));
      }
    });

    // Flip 7 bonus
    if (cards.length === 7) {
      finalScore += 15;
    }

    return finalScore;
  };

  // Player stays (banks points)
  const playerStays = (playerId: number) => {
    setPlayers((prev) =>
      prev.map((player) => {
        if (player.id === playerId) {
          return {
            ...player,
            hasStayed: true,
            totalScore: player.totalScore + player.currentRoundScore,
          };
        }
        return player;
      })
    );
  };

  // Start new round
  const startNewRound = () => {
    setPlayers((prev) =>
      prev.map((player) => ({
        ...player,
        currentRoundCards: [],
        currentRoundModifiers: [],
        currentRoundScore: 0,
        hasBusted: false,
        hasStayed: false,
      }))
    );
    setDeckState(initializeDeck());
    setRound((prev) => prev + 1);
  };

  // Reset entire game
  const resetGame = () => {
    onReset();
  };

  const roundComplete = isRoundComplete();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-2 md:mb-0">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Round {round}
          </h2>
          <p className="text-gray-600">{numPlayers} Players</p>
          {roundComplete && (
            <p className="text-green-600 font-semibold text-sm">
              Round Complete!
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={startNewRound}
            disabled={!roundComplete}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {roundComplete ? "Start Next Round" : "Round In Progress"}
          </button>
          <button
            onClick={resetGame}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Reset Game
          </button>
        </div>
      </div>

      {/* Deck Tracker */}
      <DeckTracker deckState={deckState} />

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {players.map((player) => (
          <PlayerBox
            key={player.id}
            player={player}
            bustProbability={calculateBustProbability(player)}
            onDrawCard={drawCard}
            onStay={playerStays}
          />
        ))}
      </div>
    </div>
  );
}
