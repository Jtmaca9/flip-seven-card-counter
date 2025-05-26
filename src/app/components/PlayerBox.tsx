import { Player } from "./GameBoard";

interface PlayerBoxProps {
  player: Player;
  bustProbability: number;
  onDrawCard: (playerId: number, card: string) => void;
  onStay: (playerId: number) => void;
}

export default function PlayerBox({
  player,
  bustProbability,
  onDrawCard,
  onStay,
}: PlayerBoxProps) {
  const numberCards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const modifierCards = ["+2", "+4", "+6", "+8", "+10", "X2"];
  const actionCards = ["Freeze", "Flip3", "2ndChance"];

  const getCardButtonClass = (card: string | number) => {
    const baseClass =
      "text-xs font-bold py-1 px-2 rounded transition-colors duration-200";
    const isNumberCard = !isNaN(Number(card));

    if (isNumberCard) {
      return `${baseClass} bg-blue-500 hover:bg-blue-600 text-white`;
    } else {
      // Modifier or action cards - check if already used
      const hasCard = player.currentRoundModifiers.includes(card.toString());
      if (hasCard) {
        return `${baseClass} bg-green-500 text-white cursor-not-allowed`;
      }
      return `${baseClass} bg-purple-500 hover:bg-purple-600 text-white`;
    }
  };

  const isCardDisabled = (card: string | number) => {
    // Only disable if player has busted or stayed
    if (player.hasBusted || player.hasStayed) return true;

    const isNumberCard = !isNaN(Number(card));
    if (isNumberCard) {
      // Number cards can always be drawn (duplicates cause bust)
      return false;
    } else {
      // Modifier/action cards can only be used once per round
      return player.currentRoundModifiers.includes(card.toString());
    }
  };

  const getPlayerStatusClass = () => {
    if (player.hasBusted) return "border-red-500 bg-red-50/50";
    if (player.hasStayed) return "border-green-500 bg-green-50/50";
    return "border-gray-300 bg-white/90";
  };

  const getBustProbabilityDisplay = () => {
    if (
      player.hasBusted ||
      player.hasStayed ||
      player.currentRoundCards.length === 0
    ) {
      return null;
    }

    let bgColor, textColor, riskText;
    if (bustProbability === 0) {
      bgColor = "bg-gray-200";
      textColor = "text-gray-600";
      riskText = "SAFE";
    } else if (bustProbability < 15) {
      bgColor = "bg-green-100";
      textColor = "text-green-700";
      riskText = "LOW RISK";
    } else if (bustProbability < 30) {
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-700";
      riskText = "MEDIUM RISK";
    } else if (bustProbability < 50) {
      bgColor = "bg-orange-100";
      textColor = "text-orange-700";
      riskText = "HIGH RISK";
    } else {
      bgColor = "bg-red-100";
      textColor = "text-red-700";
      riskText = "DANGER";
    }

    return (
      <div
        className={`${bgColor} ${textColor} p-3 rounded-lg border-2 border-dashed border-current`}
      >
        <div className="text-center">
          <div className="text-lg font-black">
            {bustProbability.toFixed(1)}%
          </div>
          <div className="text-xs font-bold tracking-wide">{riskText}</div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${getPlayerStatusClass()} backdrop-blur-sm rounded-xl p-4 border-2 shadow-lg`}
    >
      {/* Player Header */}
      <div className="text-center mb-3">
        <h3 className="text-lg font-bold text-gray-800">{player.name}</h3>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">
            Round: {player.currentRoundScore}
          </span>
          <span className="font-bold">Total: {player.totalScore}</span>
        </div>

        {/* Status indicators */}
        {player.hasBusted && (
          <div className="bg-red-500 text-white text-sm font-bold py-2 px-3 rounded-lg mt-2">
            💥 BUSTED
          </div>
        )}
        {player.hasStayed && (
          <div className="bg-green-500 text-white text-sm font-bold py-2 px-3 rounded-lg mt-2">
            ✓ STAYED
          </div>
        )}
      </div>

      {/* Bust Probability - Prominent Display */}
      {getBustProbabilityDisplay() && (
        <div className="mb-4">
          <div className="text-xs font-semibold text-gray-600 mb-1 text-center">
            🎯 BUST PROBABILITY
          </div>
          {getBustProbabilityDisplay()}
        </div>
      )}

      {/* Current Cards Display */}
      <div className="mb-3">
        <div className="text-xs font-semibold text-gray-600 mb-1">
          Cards in Hand: ({player.currentRoundCards.length}/7)
        </div>
        <div className="min-h-[20px] text-xs">
          {player.currentRoundCards.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {player.currentRoundCards.map((card, index) => (
                <span
                  key={index}
                  className="bg-blue-600 text-white px-2 py-1 rounded font-bold text-sm"
                >
                  {card}
                </span>
              ))}
            </div>
          )}
          {player.currentRoundModifiers.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {player.currentRoundModifiers.map((mod, index) => (
                <span
                  key={index}
                  className="bg-purple-600 text-white px-2 py-1 rounded font-bold text-sm"
                >
                  {mod}
                </span>
              ))}
            </div>
          )}
          {player.currentRoundCards.length === 0 &&
            player.currentRoundModifiers.length === 0 && (
              <div className="text-gray-400 italic text-xs">No cards drawn</div>
            )}
        </div>
      </div>

      {/* Number Cards */}
      <div className="mb-3">
        <div className="text-xs font-semibold text-gray-600 mb-1">
          Number Cards:
        </div>
        <div className="grid grid-cols-7 gap-1">
          {numberCards.map((card) => (
            <button
              key={card}
              onClick={() => onDrawCard(player.id, card.toString())}
              disabled={isCardDisabled(card)}
              className={getCardButtonClass(card)}
            >
              {card}
            </button>
          ))}
        </div>
      </div>

      {/* Modifier Cards */}
      <div className="mb-3">
        <div className="text-xs font-semibold text-gray-600 mb-1">
          Modifiers:
        </div>
        <div className="grid grid-cols-3 gap-1">
          {modifierCards.map((card) => (
            <button
              key={card}
              onClick={() => onDrawCard(player.id, card)}
              disabled={isCardDisabled(card)}
              className={getCardButtonClass(card)}
            >
              {card}
            </button>
          ))}
        </div>
      </div>

      {/* Action Cards */}
      <div className="mb-3">
        <div className="text-xs font-semibold text-gray-600 mb-1">Actions:</div>
        <div className="grid grid-cols-3 gap-1">
          {actionCards.map((card) => (
            <button
              key={card}
              onClick={() => onDrawCard(player.id, card)}
              disabled={isCardDisabled(card)}
              className={getCardButtonClass(card)}
              title={card === "Freeze" ? "Auto-stays when drawn" : undefined}
            >
              {card === "Freeze" ? "Freeze ⏸️" : card}
            </button>
          ))}
        </div>
      </div>

      {/* Pass/Stay Button */}
      <button
        onClick={() => onStay(player.id)}
        disabled={player.hasBusted || player.hasStayed}
        className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        {player.hasStayed ? "Stayed" : "Pass / Stay"}
      </button>
    </div>
  );
}
