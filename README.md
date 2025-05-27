# 🃏 Flip Seven Card Counter

A sophisticated web application for playing and tracking cards in the **Flip Seven** card game. This React/Next.js app provides real-time card counting, bust probability calculations, and a complete game simulation experience.

## ⚠️ Important Disclaimer

**This project is created purely for fun and educational purposes.** It is not intended to encourage or condone cheating in real card games. Please play responsibly and follow the rules of any actual game you participate in.

**Code Quality Notice:** This app was "vibe coded" as a fun project, so expect some code smell, quick-and-dirty implementations, and areas that could use refactoring. Contributions to improve code quality are welcome!

## 🎮 About Flip Seven

Flip Seven is a strategic card game where players draw cards trying to get exactly 7 cards without drawing duplicates (which cause a bust). The goal is to be the first player to reach 200 points.

### Game Rules

**Deck Composition (94 cards total):**

- **Number Cards (0-12):** Cards numbered 0-12 with quantities matching their numbers
  - 0: 1 card, 1: 1 card, 2: 2 cards, 3: 3 cards... 12: 12 cards
- **Action Cards (3 each):**
  - **Freeze:** Auto-stay and bank current points
  - **Flip3:** Special action card
  - **2nd Chance:** Protects from one bust per round
- **Modifier Cards (1 each):** +2, +4, +6, +8, +10, X2

**Gameplay:**

- Players take turns drawing cards from a shared deck
- Drawing a duplicate number = BUST (lose all points for the round)
- Players can choose to "stay" and bank their points
- Reaching exactly 7 cards gives a bonus
- First player to 200 total points wins

## ✨ Features

### 🎯 Core Gameplay

- **Multi-player support** (1-8 players)
- **Real-time game simulation** with proper turn management
- **Accurate card deck management** with discard pile
- **Point calculation** and round tracking
- **Mobile-responsive design** for play anywhere

### 📊 Advanced Card Counting

- **Live probability calculations** for bust risk
- **Visual risk indicators** (SAFE/LOW/MEDIUM/HIGH/DANGER)
- **Complete deck tracking** showing remaining cards
- **Draw percentage calculations** for every card type
- **Categorized card display** (numbers, actions, modifiers)

### 🛠️ Smart Features

- **Undo functionality** - click cards in hand to undo draws
- **Auto-actions** - Freeze cards automatically make you stay
- **Duplicate action handling** - duplicate actions auto-discard instead of busting
- **2nd Chance protection** - automatically uses 2nd Chance to prevent busts
- **Manual discard** for action cards when needed

### 🎨 User Experience

- **Intuitive player boxes** with clear card displays
- **Color-coded probability warnings**
- **Professional card counting interface**
- **Responsive design** optimized for mobile and desktop
- **Visual feedback** for all game actions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/FlipSevenCardCounter.git
cd FlipSevenCardCounter/flip-seven-card-counter
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to start playing!

### Production Build

```bash
npm run build
npm run start
```

## 🎲 How to Play

1. **Setup:** Choose the number of players (1-8)
2. **Game Start:** Players take turns drawing cards
3. **Decision Making:** After each draw, choose to draw another card or stay
4. **Risk Management:** Watch the bust probability indicator
5. **Card Counting:** Use the deck tracker to make informed decisions
6. **Banking Points:** Stay to bank your current points for the round
7. **Win Condition:** First to 200 points wins!

### 💡 Pro Tips

- Use the card counter to track what's been played
- Pay attention to the bust probability warnings
- Remember that getting exactly 7 cards gives bonus points
- 2nd Chance cards are valuable - they protect from one bust per round
- Action cards can be powerful - Freeze cards auto-bank your points

## 🛠️ Technology Stack

- **Frontend:** React 19, Next.js 15.3
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Build Tool:** Turbopack (Next.js)
- **Deployment Ready:** Vercel, Netlify, or any static host

## 📁 Project Structure

```
flip-seven-card-counter/
├── src/
│   └── app/
│       ├── components/
│       │   ├── GameSetup.tsx      # Player selection screen
│       │   ├── GameBoard.tsx      # Main game logic and state
│       │   ├── PlayerBox.tsx      # Individual player interface
│       │   └── DeckTracker.tsx    # Card counting display
│       ├── page.tsx               # Main app entry point
│       ├── layout.tsx             # App layout and metadata
│       └── globals.css            # Global styles
├── public/                        # Static assets
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## 🤝 Contributing

This is an open-source project! Contributions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Future Enhancements

- [ ] Online multiplayer support
- [ ] Game statistics and analytics
- [ ] Custom rule variations
- [ ] Tournament mode
- [ ] AI opponent
- [ ] Sound effects and animations
- [ ] Game replay system

## 🐛 Issues & Support

Found a bug or have a feature request? Please [open an issue](https://github.com/yourusername/FlipSevenCardCounter/issues) on GitHub.

---

**Enjoy playing Flip Seven! 🎲✨**
