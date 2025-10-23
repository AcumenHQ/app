import type { Prediction, PredictionOption } from '@/types/types';

// This will be replaced with API calls when backend is ready
export const generateDemoPredictions = (): Prediction[] => {
  const categories = ['token', 'politics', 'entertainment', 'sports'];
  const difficulties = ['easy', 'medium', 'hard'] as const;

  const predictions: Prediction[] = [];

  // Token predictions (15)
  const tokenPredictions = [
    {
      title: "Bitcoin will reach $100,000 by end of 2024",
      description: "Will Bitcoin's price hit $100,000 before December 31, 2024?",
      tags: ["bitcoin", "crypto", "price", "bullrun"]
    },
    {
      title: "Ethereum will implement EIP-4844 by Q2 2024",
      description: "Will Ethereum successfully implement EIP-4844 (proto-danksharding) by June 30, 2024?",
      tags: ["ethereum", "upgrade", "scaling", "danksharding"]
    },
    {
      title: "Solana will process 1M TPS by end of 2024",
      description: "Will Solana achieve 1 million transactions per second by December 31, 2024?",
      tags: ["solana", "tps", "performance", "blockchain"]
    },
    {
      title: "USDC will maintain $1 peg throughout 2024",
      description: "Will USDC maintain its $1 peg without depegging below $0.99 in 2024?",
      tags: ["usdc", "stablecoin", "peg", "defi"]
    },
    {
      title: "Chainlink will launch 100+ price feeds by Q3 2024",
      description: "Will Chainlink add 100 or more new price feeds by September 30, 2024?",
      tags: ["chainlink", "oracle", "price-feeds", "defi"]
    },
    {
      title: "Uniswap V4 will launch on mainnet by Q2 2024",
      description: "Will Uniswap V4 be deployed to Ethereum mainnet by June 30, 2024?",
      tags: ["uniswap", "dex", "v4", "amm"]
    },
    {
      title: "Polygon will process 1B transactions in 2024",
      description: "Will Polygon process 1 billion or more transactions in 2024?",
      tags: ["polygon", "scaling", "transactions", "l2"]
    },
    {
      title: "Avalanche will reach 10K TPS by end of 2024",
      description: "Will Avalanche achieve 10,000 transactions per second by December 31, 2024?",
      tags: ["avalanche", "tps", "performance", "subnet"]
    },
    {
      title: "Arbitrum will have 50% of L2 volume by Q4 2024",
      description: "Will Arbitrum capture 50% or more of all L2 transaction volume by Q4 2024?",
      tags: ["arbitrum", "l2", "volume", "optimistic-rollup"]
    },
    {
      title: "Optimism will launch OP Stack by Q3 2024",
      description: "Will Optimism successfully launch OP Stack for other chains by September 30, 2024?",
      tags: ["optimism", "op-stack", "modular", "l2"]
    },
    {
      title: "Cosmos IBC will connect 100+ chains by end of 2024",
      description: "Will Cosmos IBC connect 100 or more blockchain networks by December 31, 2024?",
      tags: ["cosmos", "ibc", "interoperability", "blockchain"]
    },
    {
      title: "Polkadot will have 100 parachains by Q4 2024",
      description: "Will Polkadot have 100 or more active parachains by Q4 2024?",
      tags: ["polkadot", "parachains", "parachain", "substrate"]
    },
    {
      title: "Cardano will implement Hydra scaling by Q2 2024",
      description: "Will Cardano successfully implement Hydra layer-2 scaling by June 30, 2024?",
      tags: ["cardano", "hydra", "scaling", "l2"]
    },
    {
      title: "Near Protocol will reach 1M TPS by end of 2024",
      description: "Will Near Protocol achieve 1 million transactions per second by December 31, 2024?",
      tags: ["near", "tps", "performance", "sharding"]
    },
    {
      title: "Algorand will process 10K TPS by Q3 2024",
      description: "Will Algorand achieve 10,000 transactions per second by September 30, 2024?",
      tags: ["algorand", "tps", "performance", "pure-proof-stake"]
    }
  ];

  // Politics predictions (15)
  const politicsPredictions = [
    {
      title: "New York City Mayoral Election",
      description: "Who will win the New York City Mayoral Election?",
      tags: ["nyc", "mayor", "election", "politics"]
    },
    {
      title: "Will any Louvre heist robbers be arrested by...?",
      description: "Will any robbers from the Louvre heist be arrested by the specified dates?",
      tags: ["louvre", "heist", "arrest", "crime"]
    },
    {
      title: "Trump will win the 2024 US Presidential Election",
      description: "Will Donald Trump be elected President of the United States in 2024?",
      tags: ["trump", "election", "president", "2024"]
    },
    {
      title: "Biden will serve full second term if re-elected",
      description: "If Joe Biden is re-elected in 2024, will he serve his full second term?",
      tags: ["biden", "election", "president", "term"]
    },
    {
      title: "UK will hold general election in 2024",
      description: "Will the United Kingdom hold a general election in 2024?",
      tags: ["uk", "election", "general-election", "politics"]
    },
    {
      title: "EU will expand to 30+ member states by end of 2024",
      description: "Will the European Union have 30 or more member states by December 31, 2024?",
      tags: ["eu", "expansion", "membership", "europe"]
    },
    {
      title: "China will invade Taiwan in 2024",
      description: "Will China launch a military invasion of Taiwan in 2024?",
      tags: ["china", "taiwan", "invasion", "military"]
    },
    {
      title: "Russia will withdraw from Ukraine by Q2 2024",
      description: "Will Russia withdraw all military forces from Ukraine by June 30, 2024?",
      tags: ["russia", "ukraine", "war", "withdrawal"]
    },
    {
      title: "India will become world's 3rd largest economy in 2024",
      description: "Will India overtake Japan to become the world's 3rd largest economy in 2024?",
      tags: ["india", "economy", "gdp", "ranking"]
    },
    {
      title: "Brazil will re-elect Lula in 2024",
      description: "Will Luiz Inácio Lula da Silva be re-elected as President of Brazil in 2024?",
      tags: ["brazil", "lula", "election", "president"]
    },
    {
      title: "Mexico will elect first female president in 2024",
      description: "Will Mexico elect its first female president in 2024?",
      tags: ["mexico", "election", "female-president", "history"]
    },
    {
      title: "Canada will hold federal election in 2024",
      description: "Will Canada hold a federal election in 2024?",
      tags: ["canada", "election", "federal", "politics"]
    },
    {
      title: "Australia will change government in 2024",
      description: "Will Australia's federal government change hands in 2024?",
      tags: ["australia", "government", "change", "election"]
    },
    {
      title: "South Korea will reunify with North Korea by 2030",
      description: "Will South Korea and North Korea begin reunification process by 2030?",
      tags: ["korea", "reunification", "north-korea", "south-korea"]
    },
    {
      title: "Israel will establish peace with Palestine in 2024",
      description: "Will Israel and Palestine reach a comprehensive peace agreement in 2024?",
      tags: ["israel", "palestine", "peace", "agreement"]
    },
    {
      title: "Iran will develop nuclear weapons in 2024",
      description: "Will Iran successfully develop nuclear weapons in 2024?",
      tags: ["iran", "nuclear", "weapons", "development"]
    },
    {
      title: "Saudi Arabia will normalize relations with Israel in 2024",
      description: "Will Saudi Arabia establish full diplomatic relations with Israel in 2024?",
      tags: ["saudi-arabia", "israel", "normalization", "diplomacy"]
    }
  ];

  // Entertainment predictions (10)
  const entertainmentPredictions = [
    {
      title: "Elon Musk # tweets October 14 - October 21, 2025?",
      description: "How many tweets will Elon Musk post between October 14-21, 2025?",
      tags: ["elon-musk", "twitter", "tweets", "social-media"]
    },
    {
      title: "Taylor Swift will release 3+ albums in 2024",
      description: "Will Taylor Swift release 3 or more albums in 2024?",
      tags: ["taylor-swift", "music", "albums", "2024"]
    },
    {
      title: "Netflix will reach 300M subscribers by end of 2024",
      description: "Will Netflix reach 300 million or more subscribers by December 31, 2024?",
      tags: ["netflix", "subscribers", "streaming", "growth"]
    },
    {
      title: "Disney+ will overtake Netflix in subscribers by Q4 2024",
      description: "Will Disney+ have more subscribers than Netflix by Q4 2024?",
      tags: ["disney", "netflix", "streaming", "subscribers"]
    },
    {
      title: "Marvel will release 4+ movies in 2024",
      description: "Will Marvel Studios release 4 or more movies in 2024?",
      tags: ["marvel", "movies", "mcu", "2024"]
    },
    {
      title: "Avatar 3 will be the highest grossing movie of 2024",
      description: "Will Avatar 3 be the highest grossing movie worldwide in 2024?",
      tags: ["avatar", "movies", "box-office", "james-cameron"]
    },
    {
      title: "Spotify will reach 600M users by end of 2024",
      description: "Will Spotify reach 600 million or more monthly active users by December 31, 2024?",
      tags: ["spotify", "music", "users", "growth"]
    },
    {
      title: "TikTok will be banned in the US in 2024",
      description: "Will TikTok be officially banned in the United States in 2024?",
      tags: ["tiktok", "ban", "us", "social-media"]
    },
    {
      title: "OpenAI will release GPT-5 in 2024",
      description: "Will OpenAI release GPT-5 to the public in 2024?",
      tags: ["openai", "gpt-5", "ai", "release"]
    },
    {
      title: "Tesla will release Cybertruck in 2024",
      description: "Will Tesla begin deliveries of the Cybertruck to customers in 2024?",
      tags: ["tesla", "cybertruck", "delivery", "electric-vehicles"]
    },
    {
      title: "Apple will release AR headset in 2024",
      description: "Will Apple release its AR/VR headset to consumers in 2024?",
      tags: ["apple", "ar", "vr", "headset", "vision-pro"]
    }
  ];

  // Sports predictions (10)
  const sportsPredictions = [
    {
      title: "Lakers will win NBA Championship in 2024",
      description: "Will the Los Angeles Lakers win the NBA Championship in 2024?",
      tags: ["lakers", "nba", "championship", "basketball"]
    },
    {
      title: "Chiefs will win Super Bowl in 2024",
      description: "Will the Kansas City Chiefs win Super Bowl LVIII in 2024?",
      tags: ["chiefs", "super-bowl", "nfl", "championship"]
    },
    {
      title: "Messi will win Ballon d'Or in 2024",
      description: "Will Lionel Messi win the Ballon d'Or award in 2024?",
      tags: ["messi", "ballon-dor", "soccer", "award"]
    },
    {
      title: "Real Madrid will win Champions League in 2024",
      description: "Will Real Madrid win the UEFA Champions League in 2024?",
      tags: ["real-madrid", "champions-league", "soccer", "uefa"]
    },
    {
      title: "Djokovic will win Wimbledon in 2024",
      description: "Will Novak Djokovic win the Wimbledon men's singles title in 2024?",
      tags: ["djokovic", "wimbledon", "tennis", "grand-slam"]
    },
    {
      title: "Hamilton will win F1 Championship in 2024",
      description: "Will Lewis Hamilton win the Formula 1 World Championship in 2024?",
      tags: ["hamilton", "f1", "formula-1", "championship"]
    },
    {
      title: "Warriors will make NBA playoffs in 2024",
      description: "Will the Golden State Warriors qualify for the NBA playoffs in 2024?",
      tags: ["warriors", "nba", "playoffs", "basketball"]
    },
    {
      title: "Yankees will win World Series in 2024",
      description: "Will the New York Yankees win the World Series in 2024?",
      tags: ["yankees", "world-series", "mlb", "baseball"]
    },
    {
      title: "Barcelona will win La Liga in 2024",
      description: "Will FC Barcelona win the La Liga title in 2024?",
      tags: ["barcelona", "la-liga", "soccer", "spain"]
    },
    {
      title: "Olympics will be held in Paris in 2024",
      description: "Will the 2024 Summer Olympics be held in Paris as scheduled?",
      tags: ["olympics", "paris", "2024", "summer-games"]
    }
  ];

  // Combine all predictions
  const allPredictions = [
    ...tokenPredictions.map((p, i) => ({ ...p, category: 'token' })),
    ...politicsPredictions.map((p, i) => ({ ...p, category: 'politics' })),
    ...entertainmentPredictions.map((p, i) => ({ ...p, category: 'entertainment' })),
    ...sportsPredictions.map((p, i) => ({ ...p, category: 'sports' }))
  ];

  // Generate predictions with random data
  allPredictions.forEach((prediction, index) => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 365) + 30); // 30-395 days from now

    const yesPrice = 0.3 + Math.random() * 0.4; // 30-70%
    const noPrice = 1 - yesPrice;
    const totalVolume = Math.floor(Math.random() * 1000000) + 10000; // 10K - 1M
    const liquidity = totalVolume * (0.5 + Math.random() * 0.5); // 50-100% of volume

    // Determine card type based on prediction content
    let cardType: 'simple' | 'multiple-options' | 'date-based' | 'range-based' = 'simple';
    let options: PredictionOption[] = [];
    let overallChance: number | undefined = undefined;

    // Check for specific patterns to determine card type
    if (prediction.title.includes('Mayoral Election') || prediction.title.includes('Championship')) {
      cardType = 'multiple-options';
      // Generate candidate options for mayoral election
      const candidates = [
        { name: 'Zohran Mamdani', percentage: 92 },
        { name: 'Andrew Cuomo', percentage: 6 },
        { name: 'Curtis Sliwa', percentage: 1 },
        { name: 'Eric Adams', percentage: 0.5 },
        { name: 'Zellnor Myrie', percentage: 0.3 },
        { name: 'Brad Lander', percentage: 0.2 }
      ];
      options = candidates.map((candidate, i) => ({
        id: `option-${i}`,
        label: candidate.name,
        percentage: candidate.percentage,
        yesPrice: candidate.percentage / 100,
        noPrice: 1 - (candidate.percentage / 100),
        volume: Math.floor(totalVolume * (candidate.percentage / 100))
      }));
    } else if (prediction.title.includes('heist') || prediction.title.includes('by...')) {
      cardType = 'date-based';
      // Generate date options
      const dates = ['October 24', 'October 31', 'December 31'];
      options = dates.map((date, i) => ({
        id: `date-${i}`,
        label: date,
        percentage: [7, 23, 53][i],
        yesPrice: [0.07, 0.23, 0.53][i],
        noPrice: [0.93, 0.77, 0.47][i],
        volume: Math.floor(totalVolume * (0.1 + Math.random() * 0.3))
      }));
    } else if (prediction.title.includes('tweets') || prediction.title.includes('range')) {
      cardType = 'range-based';
      // Generate range options
      const ranges = ['240-259', '260-279', '280-299', '300-319', '320-339'];
      options = ranges.map((range, i) => ({
        id: `range-${i}`,
        label: range,
        percentage: [1, 57, 36, 7, 1][i],
        yesPrice: [0.01, 0.57, 0.36, 0.07, 0.01][i],
        noPrice: [0.99, 0.43, 0.64, 0.93, 0.99][i],
        volume: Math.floor(totalVolume * (0.1 + Math.random() * 0.2))
      }));
    } else {
      // Simple card with overall chance
      overallChance = yesPrice;
    }

    predictions.push({
      id: `prediction-${index + 1}`,
      title: prediction.title,
      description: prediction.description,
      category: prediction.category,
      subcategory: prediction.category === 'token' ? 'crypto' :
        prediction.category === 'politics' ? 'election' :
          prediction.category === 'entertainment' ? 'music' : 'basketball',
      endDate,
      outcome: 'pending',
      cardType,
      yesPrice: cardType === 'simple' ? yesPrice : undefined,
      noPrice: cardType === 'simple' ? noPrice : undefined,
      options: cardType !== 'simple' ? options : undefined,
      overallChance,
      totalVolume,
      liquidity,
      creator: `0x${Math.random().toString(16).substr(2, 40)}`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
      tags: prediction.tags,
      imageUrl: undefined,
      resolutionSource: undefined,
      isResolved: false,
      resolutionDate: undefined,
      marketCap: totalVolume * (0.8 + Math.random() * 0.4),
      volume24h: Math.floor(totalVolume * (0.01 + Math.random() * 0.1)),
      priceChange24h: (Math.random() - 0.5) * 0.2, // -10% to +10%
      participants: Math.floor(Math.random() * 1000) + 10,
      isFeatured: Math.random() > 0.8, // 20% chance
      isVerified: Math.random() > 0.7, // 30% chance
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)]
    });
  });

  return predictions;
};

// API-ready functions (to be implemented when backend is ready)
export const fetchPredictions = async (): Promise<Prediction[]> => {
  // TODO: Replace with actual API call
  // return await api.get('/predictions');
  return generateDemoPredictions();
};

export const fetchPredictionById = async (id: string): Promise<Prediction | null> => {
  // TODO: Replace with actual API call
  // return await api.get(`/predictions/${id}`);
  const predictions = generateDemoPredictions();
  return predictions.find(p => p.id === id) || null;
};

export const createPrediction = async (prediction: Omit<Prediction, 'id' | 'createdAt'>): Promise<Prediction> => {
  // TODO: Replace with actual API call
  // return await api.post('/predictions', prediction);
  throw new Error('API not implemented yet');
};

export const placeBet = async (predictionId: string, side: 'yes' | 'no', amount: number): Promise<void> => {
  // TODO: Replace with actual API call
  // return await api.post('/bets', { predictionId, side, amount });
  throw new Error('API not implemented yet');
};
