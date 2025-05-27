"use client";

import { useState, useEffect, useRef } from "react";
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
  hasFlipped: boolean;
}

interface GameBoardProps {
  numPlayers: number;
  onReset: () => void;
}

export default function GameBoard({ numPlayers, onReset }: GameBoardProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [deckState, setDeckState] = useState<{ [key: string]: number }>({});
  const [discardPile, setDiscardPile] = useState<{ [key: string]: number }>({});
  const [round, setRound] = useState(1);
  const reshufflingRef = useRef(false);

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
    deck["2nd Chance"] = 3;

    return deck;
  };

  // Initialize empty discard pile
  const initializeDiscardPile = () => {
    const discard: { [key: string]: number } = {};

    // Initialize all card types to 0
    for (let i = 0; i <= 12; i++) {
      discard[i.toString()] = 0;
    }
    discard["+2"] = 0;
    discard["+4"] = 0;
    discard["+6"] = 0;
    discard["+8"] = 0;
    discard["+10"] = 0;
    discard["X2"] = 0;
    discard["Freeze"] = 0;
    discard["Flip3"] = 0;
    discard["2nd Chance"] = 0;

    return discard;
  };

  // Shuffle discard pile back into deck when deck is empty
  const shuffleDiscardIntoDeck = () => {
    if (reshufflingRef.current) {
      console.log("⚠️ RESHUFFLE ALREADY IN PROGRESS - SKIPPING");
      return;
    }

    reshufflingRef.current = true;
    console.log("🔄 RESHUFFLING: Moving discard pile back to deck");

    const totalInDiscard = Object.values(discardPile).reduce(
      (sum, count) => sum + count,
      0
    );
    console.log(`📦 Cards in discard pile: ${totalInDiscard}`);

    // Debug: Check current deck state
    const currentDeckTotal = Object.values(deckState).reduce(
      (sum, count) => sum + count,
      0
    );
    console.log(`🎯 Current deck total before shuffle: ${currentDeckTotal}`);
    console.log("🔍 Current deck state:", deckState);
    console.log("🔍 Current discard state:", discardPile);

    setDeckState((prev) => {
      console.log("📝 Previous deck state in setter:", prev);
      // Move cards from discard to deck (should be empty deck)
      const newDeck = { ...prev };
      Object.entries(discardPile).forEach(([card, count]) => {
        newDeck[card] = (newDeck[card] || 0) + count;
        console.log(
          `🔀 Moving ${count} of ${card} to deck. New count: ${newDeck[card]}`
        );
      });
      const totalAfterShuffle = Object.values(newDeck).reduce(
        (sum, count) => sum + count,
        0
      );
      console.log(`🎴 Cards in deck after shuffle: ${totalAfterShuffle}`);
      console.log("🔍 New deck state:", newDeck);
      return newDeck;
    });

    setDiscardPile(initializeDiscardPile());

    // Reset the flag after a brief delay
    setTimeout(() => {
      reshufflingRef.current = false;
      console.log("✅ RESHUFFLE COMPLETE - Flag reset");
    }, 100);
  };

  // Check if deck needs reshuffling
  const getTotalCardsInDeck = () => {
    return Object.values(deckState).reduce((sum, count) => sum + count, 0);
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
        hasFlipped: false,
      });
    }
    setPlayers(initialPlayers);
    setDeckState(initializeDeck());
    setDiscardPile(initializeDiscardPile());
  }, [numPlayers]);

  // Check if round is complete
  const isRoundComplete = () => {
    if (players.length === 0) return false;
    return players.every(
      (player) => player.hasBusted || player.hasStayed || player.hasFlipped
    );
  };

  // Calculate bust probability for a player
  const calculateBustProbability = (player: Player) => {
    if (
      player.hasBusted ||
      player.hasStayed ||
      player.hasFlipped ||
      player.currentRoundCards.length === 0
    ) {
      return 0;
    }

    // If player has "2nd Chance" in hand, they can't bust on next draw
    if (player.currentRoundModifiers.includes("2nd Chance")) {
      return 0;
    }

    const cardsInHand = new Set(player.currentRoundCards);
    let bustCards = 0;
    let totalRemainingCards = 0;

    // Count ALL cards in deck for total (to match deck tracker percentages)
    Object.entries(deckState).forEach(([card, count]) => {
      totalRemainingCards += count;
      // Only count bust cards from number cards the player already has
      if (!isNaN(parseInt(card)) && cardsInHand.has(parseInt(card))) {
        bustCards += count;
      }
    });

    return totalRemainingCards > 0
      ? (bustCards / totalRemainingCards) * 100
      : 0;
  };

  // Update deck state when a card is drawn
  const drawCard = (playerId: number, card: string) => {
    // Check if card is available in deck (before any reshuffling)
    const cardCount = deckState[card] || 0;
    if (cardCount <= 0) {
      console.warn(
        `Card ${card} is not available in deck (count: ${cardCount})`
      );
      return; // Exit early if card is not available
    }

    // Remove card from deck
    setDeckState((prev) => {
      const newDeck = {
        ...prev,
        [card]: Math.max(0, (prev[card] || 0) - 1),
      };

      // Check if deck is now empty and trigger reshuffle
      const totalCards = Object.values(newDeck).reduce(
        (sum, count) => sum + count,
        0
      );
      console.log(`🎯 Drew ${card}, deck now has ${totalCards} cards`);

      if (totalCards === 0) {
        console.log("⚠️ DECK NOW EMPTY - Triggering reshuffle");
        // Use setTimeout to ensure state update completes before reshuffling
        setTimeout(() => {
          shuffleDiscardIntoDeck();
        }, 0);
      }

      return newDeck;
    });

    // Check if this would trigger second chance before updating player state
    const player = players.find((p) => p.id === playerId);
    if (player) {
      const numberCards = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
      ];
      const isNumberCard = numberCards.includes(card);

      if (isNumberCard) {
        const cardNum = parseInt(card);
        const wouldBust = player.currentRoundCards.includes(cardNum);
        const hasSecondChance =
          player.currentRoundModifiers.includes("2nd Chance");

        if (wouldBust && hasSecondChance) {
          // Use second chance: discard both cards immediately
          setDiscardPile((prev) => ({
            ...prev,
            [card]: (prev[card] || 0) + 1,
            "2nd Chance": (prev["2nd Chance"] || 0) + 1,
          }));

          // Update player state without adding the card
          setPlayers((prev) =>
            prev.map((p) => {
              if (p.id === playerId) {
                const newModifiers = p.currentRoundModifiers.filter(
                  (mod) => mod !== "2nd Chance"
                );
                return {
                  ...p,
                  currentRoundModifiers: newModifiers,
                  currentRoundScore: calculateRoundScore(
                    p.currentRoundCards,
                    newModifiers
                  ),
                };
              }
              return p;
            })
          );
          return; // Exit early, don't process normal card logic
        }
      }
    }

    // Handle duplicate action cards separately to avoid state update conflicts
    const targetPlayer = players.find((p) => p.id === playerId);
    if (!targetPlayer) return;

    // Check for duplicate action cards that should be auto-discarded
    const singleUseActionCards = ["Freeze"];
    if (
      singleUseActionCards.includes(card) &&
      targetPlayer.currentRoundModifiers.includes(card)
    ) {
      // Auto-discard duplicate single-use action card
      setDiscardPile((prev) => ({
        ...prev,
        [card]: (prev[card] || 0) + 1,
      }));
      return; // Exit early, don't update player state
    }

    // Special handling for 2nd Chance duplicates
    if (
      card === "2nd Chance" &&
      targetPlayer.currentRoundModifiers.includes(card)
    ) {
      // Auto-discard duplicate 2nd Chance
      setDiscardPile((prev) => ({
        ...prev,
        [card]: (prev[card] || 0) + 1,
      }));
      return; // Exit early, don't update player state
    }

    // If we get here, process the card normally
    setPlayers((prev) =>
      prev.map((player) => {
        if (player.id === playerId) {
          // Define card types for proper identification
          const numberCards = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
          ];
          const isNumberCard = numberCards.includes(card);

          if (isNumberCard) {
            // Number card (normal case - second chance already handled above)
            const cardNum = parseInt(card);
            const newCards = [...player.currentRoundCards, cardNum];
            const wouldBust = player.currentRoundCards.includes(cardNum);
            const newScore = wouldBust
              ? 0
              : calculateRoundScore(newCards, player.currentRoundModifiers);

            // Check if player has flipped (7 different number cards without busting)
            const hasFlipped = newCards.length === 7 && !wouldBust;

            return {
              ...player,
              currentRoundCards: newCards,
              hasBusted: wouldBust,
              hasFlipped: hasFlipped,
              hasStayed: hasFlipped, // Auto-stay when flipped (only if not busted)
              currentRoundScore: newScore,
              totalScore: hasFlipped
                ? player.totalScore + newScore
                : player.totalScore, // Auto-bank points when flipped
            };
          } else {
            // Action/Modifier card - add to hand
            const newModifiers = [...player.currentRoundModifiers, card];
            const newScore = calculateRoundScore(
              player.currentRoundCards,
              newModifiers
            );

            // Check if it's a Freeze card - automatically make player stay
            if (card === "Freeze") {
              return {
                ...player,
                currentRoundModifiers: newModifiers,
                currentRoundScore: newScore,
                hasStayed: true,
                totalScore: player.totalScore + newScore,
              };
            } else {
              return {
                ...player,
                currentRoundModifiers: newModifiers,
                currentRoundScore: newScore,
              };
            }
          }
        }
        return player;
      })
    );
  };

  // Undo a card draw (remove from hand and put back in deck)
  const undoCardDraw = (
    playerId: number,
    card: string,
    isModifier: boolean = false
  ) => {
    setPlayers((prev) =>
      prev.map((player) => {
        if (player.id === playerId) {
          if (isModifier) {
            // Remove modifier card
            const newModifiers = [...player.currentRoundModifiers];
            const cardIndex = newModifiers.findIndex((mod) => mod === card);
            if (cardIndex > -1) {
              newModifiers.splice(cardIndex, 1);

              // Put card back in deck
              setDeckState((prevDeck) => ({
                ...prevDeck,
                [card]: (prevDeck[card] || 0) + 1,
              }));

              return {
                ...player,
                currentRoundModifiers: newModifiers,
                currentRoundScore: calculateRoundScore(
                  player.currentRoundCards,
                  newModifiers
                ),
                hasBusted: false, // Reset bust state when undoing
                hasFlipped: false, // Reset flipped state when undoing
                hasStayed: false, // Reset stayed state when undoing
              };
            }
          } else {
            // Remove number card
            const newCards = [...player.currentRoundCards];
            const cardIndex = newCards.findIndex((c) => c === parseInt(card));
            if (cardIndex > -1) {
              newCards.splice(cardIndex, 1);

              // Put card back in deck
              setDeckState((prevDeck) => ({
                ...prevDeck,
                [card]: (prevDeck[card] || 0) + 1,
              }));

              return {
                ...player,
                currentRoundCards: newCards,
                currentRoundScore: calculateRoundScore(
                  newCards,
                  player.currentRoundModifiers
                ),
                hasBusted: false, // Reset bust state when undoing
                hasFlipped: newCards.length === 7, // Check if still flipped after undo
                hasStayed: newCards.length === 7, // Check if still stayed after undo
              };
            }
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

  // Move all used cards to discard pile at end of round
  const discardUsedCards = () => {
    setDiscardPile((prev) => {
      const newDiscard = { ...prev };

      players.forEach((player) => {
        // Add number cards to discard
        player.currentRoundCards.forEach((card) => {
          newDiscard[card.toString()] = (newDiscard[card.toString()] || 0) + 1;
        });

        // Add modifier cards to discard
        player.currentRoundModifiers.forEach((card) => {
          newDiscard[card] = (newDiscard[card] || 0) + 1;
        });
      });

      return newDiscard;
    });
  };

  // Manually discard a card from deck to discard pile
  const discardCard = (card: string) => {
    const currentCount = deckState[card] || 0;
    if (currentCount > 0) {
      setDeckState((prev) => ({
        ...prev,
        [card]: currentCount - 1,
      }));

      setDiscardPile((prev) => ({
        ...prev,
        [card]: (prev[card] || 0) + 1,
      }));
    }
  };

  // Start new round
  const startNewRound = () => {
    // First, discard all used cards
    discardUsedCards();

    // Clear player hands and reset round state
    setPlayers((prev) =>
      prev.map((player) => ({
        ...player,
        currentRoundCards: [],
        currentRoundModifiers: [],
        currentRoundScore: 0,
        hasBusted: false,
        hasStayed: false,
        hasFlipped: false,
      }))
    );

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
      <DeckTracker
        deckState={deckState}
        discardPile={discardPile}
        onDiscardCard={discardCard}
      />

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {players.map((player) => (
          <PlayerBox
            key={player.id}
            player={player}
            bustProbability={calculateBustProbability(player)}
            deckState={deckState}
            onDrawCard={drawCard}
            onStay={playerStays}
            onUndoCard={undoCardDraw}
          />
        ))}
      </div>
    </div>
  );
}
