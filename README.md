# MovieGuesser

A Wordle-style game where players guess movie titles based on progressively revealed movie posters.

## Features

- Progressive poster reveal using canvas-based pixelation and blur effects
- Wordle-style input interface
- 3-attempt guessing mechanic
- Confetti animation for successful guesses
- Shake animation for invalid inputs
- Futuristic pink UI theme with glassmorphism effects
- Responsive design

## Tech Stack

- Next.js with App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Query for data fetching
- Server Actions for secure API calls
- canvas-confetti for celebration animations
- OMDB API for movie data

## Getting Started

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a `.env.local` file with your OMDB API key:
   \`\`\`
   NEXT_PUBLIC_OMDB_API_KEY=your_api_key_here
   \`\`\`
   (You can get a free API key from [OMDB API](https://www.omdbapi.com/apikey.aspx))

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Play

1. A movie poster will be partially revealed (30% visibility)
2. Guess the movie title in the input field
3. If your guess is incorrect, the poster will be revealed more (50%, then 70%)
4. You have 3 attempts to guess correctly
5. If you guess correctly, confetti will celebrate your win!

## Future Enhancements

- Daily challenge mode
- User statistics tracking
- Difficulty levels
- Social sharing functionality
# vibe-2.0
