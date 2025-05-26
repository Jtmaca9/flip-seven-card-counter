interface DeckTrackerProps {
  deckState: { [key: string]: number };
  discardPile?: { [key: string]: number };
  onDiscardCard?: (card: string) => void;
}

export default function DeckTracker({
  deckState,
  discardPile,
  onDiscardCard,
}: DeckTrackerProps) {
  const numberCards = Array.from({ length: 13 }, (_, i) => i.toString());
  const modifierCards = ["+2", "+4", "+6", "+8", "+10", "X2"];
  const actionCards = ["Freeze", "Flip3", "2ndChance"];

  const getCardCountColor = (count: number, maxCount: number) => {
    const ratio = count / maxCount;
    if (ratio === 0) return "text-red-700 bg-red-100 border-red-300";
    if (ratio < 0.5) return "text-orange-700 bg-orange-100 border-orange-300";
    return "text-green-700 bg-green-100 border-green-300";
  };

  const getTotalCards = () => {
    return Object.values(deckState).reduce((sum, count) => sum + count, 0);
  };

  const getTotalDiscarded = () => {
    if (!discardPile) return 0;
    return Object.values(discardPile).reduce((sum, count) => sum + count, 0);
  };

  const getDrawProbability = (count: number) => {
    const totalCards = getTotalCards();
    if (totalCards === 0) return 0;
    return (count / totalCards) * 100;
  };

  const getProbabilityColor = (probability: number) => {
    if (probability === 0) return "text-red-600";
    if (probability < 2) return "text-orange-600";
    if (probability < 5) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2 lg:mb-0">
          🃏 Deck Tracker
        </h3>
        <div className="flex gap-6 text-sm">
          <div className="text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Cards in Deck
            </div>
            <div className="text-2xl font-bold text-green-600">
              {getTotalCards()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Discarded
            </div>
            <div className="text-2xl font-bold text-red-600">
              {getTotalDiscarded()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Total Cards
            </div>
            <div className="text-2xl font-bold text-gray-600">
              {getTotalCards() + getTotalDiscarded()}
            </div>
          </div>
        </div>
      </div>

      {/* Number Cards */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
            0-12
          </span>
          Number Cards
        </h4>
        <div className="grid grid-cols-7 md:grid-cols-13 gap-2">
          {numberCards.map((card) => {
            const count = deckState[card] || 0;
            const discarded = discardPile?.[card] || 0;
            const maxCount = card === "0" ? 1 : parseInt(card);
            const probability = getDrawProbability(count);

            return (
              <div
                key={card}
                className={`text-center text-xs font-bold p-2 rounded border-2 ${getCardCountColor(
                  count,
                  maxCount
                )}`}
              >
                <div className="text-lg font-black">{card}</div>
                <div className="text-xs font-bold border-t border-current mt-1 pt-1">
                  <div>
                    {count}/{maxCount}
                  </div>
                  <div
                    className={`${getProbabilityColor(probability)} font-black`}
                  >
                    {probability.toFixed(1)}%
                  </div>
                </div>
                {discarded > 0 && (
                  <div className="text-xs text-red-600 font-bold bg-red-50 rounded px-1 mt-1">
                    -{discarded}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modifier Cards */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs">
            MOD
          </span>
          Modifier Cards
        </h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {modifierCards.map((card) => {
            const count = deckState[card] || 0;
            const discarded = discardPile?.[card] || 0;
            const maxCount = 1;
            const probability = getDrawProbability(count);

            return (
              <div
                key={card}
                className={`text-center text-xs font-bold p-2 rounded border-2 ${getCardCountColor(
                  count,
                  maxCount
                )}`}
              >
                <div className="text-sm font-black">{card}</div>
                <div className="text-xs font-bold border-t border-current mt-1 pt-1">
                  <div>
                    {count}/{maxCount}
                  </div>
                  <div
                    className={`${getProbabilityColor(probability)} font-black`}
                  >
                    {probability.toFixed(1)}%
                  </div>
                </div>
                {discarded > 0 && (
                  <div className="text-xs text-red-600 font-bold bg-red-50 rounded px-1 mt-1">
                    -{discarded}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Cards */}
      <div>
        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span className="bg-indigo-500 text-white px-2 py-1 rounded text-xs">
            ACT
          </span>
          Action Cards
          <span className="text-xs text-gray-500 ml-2">
            (Click 🗑️ to discard)
          </span>
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {actionCards.map((card) => {
            const count = deckState[card] || 0;
            const discarded = discardPile?.[card] || 0;
            const maxCount = 3;
            const probability = getDrawProbability(count);

            return (
              <div
                key={card}
                className={`text-center text-xs font-bold p-2 rounded border-2 ${getCardCountColor(
                  count,
                  maxCount
                )} relative`}
              >
                <div className="text-sm font-black">{card}</div>
                <div className="text-xs font-bold border-t border-current mt-1 pt-1">
                  <div>
                    {count}/{maxCount}
                  </div>
                  <div
                    className={`${getProbabilityColor(probability)} font-black`}
                  >
                    {probability.toFixed(1)}%
                  </div>
                </div>
                {discarded > 0 && (
                  <div className="text-xs text-red-600 font-bold bg-red-50 rounded px-1 mt-1">
                    -{discarded}
                  </div>
                )}
                {/* Discard Button */}
                {onDiscardCard && count > 0 && (
                  <button
                    onClick={() => onDiscardCard(card)}
                    className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                    title={`Discard ${card}`}
                  >
                    🗑️
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
