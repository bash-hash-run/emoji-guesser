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

## Try It Online

**[Play Emoji Guesser now at emoji-guesser.vercel.app](https://emoji-guesser.vercel.app/)**

The live demo features:

- Full game experience with emoji puzzles
- Mobile-friendly responsive design
- Web3 wallet integration
- IPFS data storage via Pinata

No installation needed - just visit the URL and start playing!

## Prompts Examples

Write **[10]** questions about **[popular movies about superheroes]** that have a one-word title. Price is **[1]**. Attempts are **[5]**. ETH wallet is **[0x]**. If the title contains non-letter symbols, exclude them. Each answer must be a single word. Each question should use 4 emojis as a hint. Title must be engaging, bright, and describe the whole set of questions; it can be multiple words. Include an engaging description. Emojis must describe the thing without revealing the answer directly.

Examples:  
🌞 🕶️ sunglasses  
🍎 🥧 applepie  
🌊 🏄‍♂️ surfing  
🎂 🎊 🎉 birthday

---

Write **10** questions about **popular accessories** that have a one-word name. Price is **1**. Attempts are **5**. ETH wallet is **0x**. If the name contains non-letter symbols, exclude them. Each answer must be a single word. Each question should use **2 emojis** as a hint. Title must be engaging, bright, and describe the whole set of questions; it can be multiple words. Include an engaging description. Emojis must describe the accessory without revealing the answer directly.

Examples:  
🕶️ 🌞 sunglasses  
👜 👛 handbag  
⌚ 📱 smartwatch

---

Write **10** questions about **popular desserts** that have a one-word name. Price is **1**. Attempts are **5**. ETH wallet is **0x**. If the name contains non-letter symbols, exclude them. Each answer must be a single word. Each question should use **2 emojis** as a hint. Title must be engaging, bright, and describe the whole set of questions; it can be multiple words. Include an engaging description. Emojis must hint at the dessert without directly revealing the answer.

Examples:  
🌰 🍫 brownie
🥕 🍰 cheesecake
🍋 🍮 tart
🥥 🍨 sorbet

---

Write **10** questions about **popular YouTubers** that have a one-word channel name. Price is **1**. Attempts are **5**. ETH wallet is **0x**. If the name contains non-letter symbols, exclude them. Each answer must be a single word. Each question should use **3 emojis** as a hint. Title must be engaging, bright, and describe the whole set of questions; it can be multiple words. Include an engaging description. Emojis must hint at the YouTuber or their content without directly revealing the answer.

Examples:  
🎮 🎧 😂 pewdiepie  
🧪 🧠 📊 vsauce  
🎭 🎨 💭 dream  
📸 ✈️ 💰 mrbeast

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

## Data Storage with DappyKit and IPFS

Emoji Guesser uses a combination of DappyKit and IPFS for permanent and decentralized data storage, with results stored on Base Chain mainnet:

### How It Works

1. **DappyKit SDK Integration**

   - User game history is stored using DappyKit's file system changes API
   - The app creates a smart account for each user with their wallet
   - Game results are saved on-chain via Base Chain mainnet
   - This allows data ownership to remain with the user, not the application

2. **IPFS Storage**

   - Game results and history are uploaded to IPFS via Pinata
   - A Content Identifier (CID) is generated for each upload
   - The CID is converted to a hex digest and stored on Base Chain mainnet through DappyKit
   - This ensures your game achievements remain permanently accessible
   - Data remains accessible even if the app is no longer maintained

3. **Fault Tolerance**
   - The system includes a fallback mechanism if IPFS upload fails
   - Data can still be stored directly in DappyKit's multihash format on Base Chain

### Setting Up IPFS Storage

1. Get your Pinata API keys from [https://app.pinata.cloud/developers/keys](https://app.pinata.cloud/developers/keys)
2. Add the API keys to your `.env.local` file (you can use either JWT or API key + Secret):

   ```
   # Using JWT (recommended)
   NEXT_PUBLIC_PINATA_JWT="your_pinata_jwt_token_here"

   # OR using API key + Secret combination
   NEXT_PUBLIC_PINATA_API_KEY="your_pinata_api_key_here"
   NEXT_PUBLIC_PINATA_API_SECRET="your_pinata_api_secret_here"
   ```

3. The app will automatically use Pinata for permanent storage and Base Chain for on-chain persistence

### Testing IPFS Integration

You can test the IPFS and Base Chain integration with the included test scripts:

```bash
npm run test:ipfs
npm run test:cid
```

These scripts:

1. Upload test data to IPFS via Pinata
2. Convert CIDs to hex digests (and back) for Base Chain storage
3. Verify that retrieved data matches the original

### Data Persistence

- Data stored this way is permanent on Base Chain mainnet and tied to the user's wallet address
- The hex digest format ensures efficient and reliable storage on-chain
- Users maintain full ownership of their game history through their crypto wallet
- The app provides seamless UI for users to view their previous plays

This architecture follows Web3 principles by ensuring user data ownership on Base Chain while providing a Web2-like user experience.

---

Made with love and puzzles by the Emoji Guesser team
