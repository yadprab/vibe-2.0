"use server"

// Get API key from environment variable - this will only run on the server
const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY

// Popular movies to randomly select from when we don't have an API key
const FALLBACK_MOVIES = [
  {
    Title: "Inception",
    Year: "2010",
    Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    Plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  },
  {
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    Plot: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
  },
  {
    Title: "Interstellar",
    Year: "2014",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    Plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  },
  {
    Title: "Avatar",
    Year: "2009",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmNjg3Nzk5MzRiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",
    Plot: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
  },
  {
    Title: "Blade Runner",
    Year: "1982",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    Plot: "A blade runner must pursue and terminate four replicants who stole a ship in space and have returned to Earth to find their creator.",
  },
  {
    Title: "The Shawshank Redemption",
    Year: "1994",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg",
    Plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
  },
  {
    Title: "Pulp Fiction",
    Year: "1994",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    Plot: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
  },
  {
    Title: "The Godfather",
    Year: "1972",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    Plot: "The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.",
  },
  {
    Title: "Fight Club",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    Plot: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
  },
  {
    Title: "Forrest Gump",
    Year: "1994",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    Plot: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
  },
]

// Function to fetch a random movie
export async function fetchRandomMovie() {
  // If we don't have an API key, use fallback movies
  if (!API_KEY) {
    const randomIndex = Math.floor(Math.random() * FALLBACK_MOVIES.length)
    return FALLBACK_MOVIES[randomIndex]
  }

  // List of popular movie IDs to randomly select from
  const popularMovieIds = [
    "tt0111161",
    "tt0068646",
    "tt0071562",
    "tt0468569",
    "tt0050083",
    "tt0108052",
    "tt0167260",
    "tt0110912",
    "tt0060196",
    "tt0120737",
    "tt0109830",
    "tt0137523",
    "tt0080684",
    "tt1375666",
    "tt0167261",
    "tt0073486",
    "tt0099685",
    "tt0133093",
    "tt0047478",
    "tt0114369",
  ]

  try {
    const randomId = popularMovieIds[Math.floor(Math.random() * popularMovieIds.length)]
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${randomId}&plot=short`)

    if (!response.ok) {
      throw new Error("Failed to fetch movie data")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching movie:", error)
    // Fallback to local data if API fails
    const randomIndex = Math.floor(Math.random() * FALLBACK_MOVIES.length)
    return FALLBACK_MOVIES[randomIndex]
  }
}
