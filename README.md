# Emoji Guesser

**Think you can decode emoji puzzles? Put your skills to the test!**

![Emoji Guesser Game](/public/emoji-banner.svg)

## What is Emoji Guesser?

Emoji Guesser is a brain-teasing game that challenges your emoji interpretation skills! In a world where emojis have become their own language, can you decode what combinations of them mean?

Here's the deal:

- We show you emoji combinations like 🧍‍♂️ + 💻
- You try to guess what they represent ("hacker" or "coder")
- Earn points for correct answers
- Use hints when you're stumped
- But watch out! You have limited attempts

It's simple, addictive, and surprisingly challenging!

## Prompts Examples

Write **[10]** questions about **[popular movies about superheroes]** that have a one-word title. Price is **[1]**. Attempts are **[5]**. ETH wallet is **[0x]**. If the title contains non-letter symbols, exclude them. Each answer must be a single word. Each question should use 4 emojis as a hint. Title must be engaging, bright, and describe the whole set of questions; it can be multiple words. Include an engaging description. Emojis must describe the thing without revealing the answer directly.

Examples:  
🌞 🕶️       sunglasses  
🍎 🥧       applepie  
🌊 🏄‍♂️       surfing  
🎂 🎊 🎉     birthday

---
Write **10** questions about **popular accessories** that have a one-word name. Price is **1**. Attempts are **5**. ETH wallet is **0x**. If the name contains non-letter symbols, exclude them. Each answer must be a single word. Each question should use **2 emojis** as a hint. Title must be engaging, bright, and describe the whole set of questions; it can be multiple words. Include an engaging description. Emojis must describe the accessory without revealing the answer directly.

Examples:  
🕶️ 🌞       sunglasses  
👜 👛       handbag  
⌚ 📱       smartwatch

---
Write **10** questions about **popular desserts** that have a one-word name. Price is **1**. Attempts are **5**. ETH wallet is **0x**. If the name contains non-letter symbols, exclude them. Each answer must be a single word. Each question should use **2 emojis** as a hint. Title must be engaging, bright, and describe the whole set of questions; it can be multiple words. Include an engaging description. Emojis must hint at the dessert without directly revealing the answer.

Examples:  
🌰 🍫       brownie
🥕 🍰       cheesecake
🍋 🍮       tart
🥥 🍨       sorbet

---
Write **10** questions about **popular YouTubers** that have a one-word channel name. Price is **1**. Attempts are **5**. ETH wallet is **0x**. If the name contains non-letter symbols, exclude them. Each answer must be a single word. Each question should use **3 emojis** as a hint. Title must be engaging, bright, and describe the whole set of questions; it can be multiple words. Include an engaging description. Emojis must hint at the YouTuber or their content without directly revealing the answer.

Examples:  
🎮 🎧 😂       pewdiepie  
🧪 🧠 📊       vsauce  
🎭 🎨 💭       dream  
📸 ✈️ 💰       mrbeast


## Why Play Emoji Guesser?

- **Train Your Brain**: Enhance your lateral thinking and creative interpretation skills
- **Social Fun**: Share your high scores on Farcaster and challenge friends
- **Quick Entertainment**: Perfect for short breaks or commutes - each puzzle takes just seconds to solve
- **Web3 Integration**: Uses your crypto wallet for optional in-game purchases
- **Mobile-Friendly**: Play on any device, anywhere

## Examples

Here are some emoji puzzles you might encounter:

| Emoji Combo | Possible Answers |
| ----------- | ---------------- |
| 🌞 + 🕶️     | sunglasses       |
| 🍎 + 🥧     | applepie         |
| 🌊 + 🏄‍♂️     | surfing          |
| 🎂 + 🎊🎉   | birthday         |

## How to Play

1. **Start the Game**: Hit that big attractive "Start Playing Now" button
2. **Examine the Emoji Puzzle**: Look carefully at the emoji combination displayed
3. **Type Your Answer**: What do these emojis represent together?
4. **Use Hints Wisely**: Stuck? Use a hint, but they're limited!
5. **Track Your Progress**: Watch your score grow as you solve more puzzles
6. **Need More Attempts?**: Purchase additional attempts if you run out
7. **Share Your Results**: Brag about your emoji decoding skills on Farcaster

## Tips & Tricks

- Answers are always a single word
- Look for common meanings between the emojis
- Think of how the emojis might combine to form a concept
- If you're down to your last few attempts, consider using hints
- The game remembers your progress, so take your time with each puzzle

## Technical Details

Emoji Guesser is built with modern web technologies:

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Web3**: Wagmi/Viem for wallet connections
- **Social**: Farcaster Frame SDK integration
- **Styling**: Responsive design with gradient themes and animations
- **Performance**: Optimized for both desktop and mobile

### Tech Stack Highlights:

- Turbopack for lightning-fast development
- Server components for improved performance
- Gradient animations and interactive UI elements
- Dark mode support with seamless transitions
- Mobile-first design approach

### Schema and Data Validation

The project's `schema.json` follows the [Web4 Apps Specification](https://github.com/DappyKit/web4-apps-specification) standard, which is designed for decentralized AI-powered applications. This specification ensures:

- Standardized data validation across the application
- Consistent structure for emoji puzzles and user interactions
- Type safety and input validation for all game features
- Seamless integration with Web3 and AI capabilities

## Getting Started

### Playing Online

### Development Setup

Want to run your own instance or contribute?

1. Clone the repository

```bash
git clone https://github.com/bash-hash-run/emoji-guesser.git
cd emoji-guesser
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

```bash
cp .env.example .env.local
# Edit .env.local with your settings
```

4. Start the development server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Customizing Emoji Puzzles

Add your own emoji puzzles by modifying `/public/data.json`:

```json
{
  "guesses": [
    {
      "emojis": "🌞🕶️",
      "answer": "sunglasses",
      "hint": "Eyewear for bright days",
      "result_description": "Sun + Glasses = Sunglasses!"
    }
  ]
}
```

## Contributing

Contributions are welcome! Feel free to:

- Add new emoji puzzles
- Improve the UI/UX
- Fix bugs or optimize performance
- Add new features

## Future Plans

- Multiplayer mode for live competitions
- Themed puzzle packs (movies, food, sports, etc.)
- Timed challenges for extra difficulty
- Achievement system for puzzle masters
- More integration with web3 ecosystems

---

Made with love and puzzles by the Emoji Guesser team
