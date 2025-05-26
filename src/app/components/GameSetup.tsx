interface GameSetupProps {
  onStartGame: (players: number) => void;
}

export default function GameSetup({ onStartGame }: GameSetupProps) {
  const playerOptions = [3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-md mx-auto shadow-2xl">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
        Game Setup
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-4">
            Number of Players:
          </label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {playerOptions.map((num) => (
              <button
                key={num}
                onClick={() => onStartGame(num)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
          <p className="font-semibold mb-1">🎯 Game Rules:</p>
          <p>• Draw cards without getting duplicates</p>
          <p>• Get 7 different cards for bonus points</p>
          <p>• First to 200 points wins!</p>
        </div>
      </div>
    </div>
  );
}
