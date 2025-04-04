# Emoji Guesser

**Think you can decode emoji puzzles? Put your skills to the test!**

![Emoji Guesser Game](https://placehold.co/600x400/indigo/white?text=Emoji+Guesser)

## What is Emoji Guesser?

Emoji Guesser is a brain-teasing game that challenges your emoji interpretation skills! In a world where emojis have become their own language, can you decode what combinations of them mean?

Here's the deal:

- We show you emoji combinations like 🐱 + 💻
- You try to guess what they represent ("computer cat" or "laptop cat")
- Earn points for correct answers
- Use hints when you're stumped
- But watch out! You have limited attempts

It's simple, addictive, and surprisingly challenging!

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
| 🏃‍♀️ + 🏠     | runhome          |
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

## Getting Started

### Playing Online

Simply visit [emoji-guesser.example.com](https://emoji-guesser.example.com) to start playing immediately!

### Development Setup

Want to run your own instance or contribute?

1. Clone the repository

```bash
git clone https://github.com/your-username/emoji-guesser.git
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

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT - See [LICENSE](LICENSE) for details.

## Future Plans

- Multiplayer mode for live competitions
- Themed puzzle packs (movies, food, sports, etc.)
- Timed challenges for extra difficulty
- Achievement system for puzzle masters
- More integration with web3 ecosystems

---

Made with love and puzzles by the Emoji Guesser team
