interface DeckTrackerProps {
  deckState: { [key: string]: number };
}

export default function DeckTracker({ deckState }: DeckTrackerProps) {
  const numberCards = Array.from({ length: 13 }, (_, i) => i.toString());
  const modifierCards = ["+2", "+4", "+6", "+8", "+10", "X2"];
  const actionCards = ["Freeze", "Flip3", "2ndChance"];

  const getCardCountColor = (count: number, maxCount: number) => {
    const ratio = count / maxCount;
    if (ratio === 0) return "text-red-600 bg-red-100";
    if (ratio < 0.5) return "text-orange-600 bg-orange-100";
    return "text-green-600 bg-green-100";
  };

  const getTotalCards = () => {
    return Object.values(deckState).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Deck Tracker</h3>
        <div className="text-sm text-gray-600">
          Total cards remaining:{" "}
          <span className="font-bold">{getTotalCards()}</span>
        </div>
      </div>

      {/* Number Cards */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Number Cards (0-12):
        </h4>
        <div className="grid grid-cols-7 md:grid-cols-13 gap-1">
          {numberCards.map((card) => {
            const count = deckState[card] || 0;
            const maxCount = card === "0" ? 1 : parseInt(card);
            return (
              <div
                key={card}
                className={`text-center text-xs font-bold py-1 px-1 rounded ${getCardCountColor(
                  count,
                  maxCount
                )}`}
              >
                <div>{card}</div>
                <div className="text-xs">
                  {count}/{maxCount}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modifier Cards */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Modifier Cards:
        </h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
          {modifierCards.map((card) => {
            const count = deckState[card] || 0;
            const maxCount = 1;
            return (
              <div
                key={card}
                className={`text-center text-xs font-bold py-1 px-1 rounded ${getCardCountColor(
                  count,
                  maxCount
                )}`}
              >
                <div>{card}</div>
                <div className="text-xs">
                  {count}/{maxCount}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Cards */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Action Cards:
        </h4>
        <div className="grid grid-cols-3 gap-1">
          {actionCards.map((card) => {
            const count = deckState[card] || 0;
            const maxCount = 3;
            return (
              <div
                key={card}
                className={`text-center text-xs font-bold py-1 px-1 rounded ${getCardCountColor(
                  count,
                  maxCount
                )}`}
              >
                <div>{card}</div>
                <div className="text-xs">
                  {count}/{maxCount}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
