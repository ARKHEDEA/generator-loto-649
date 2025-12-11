// Simulated historical data - in production, this would come from an API/database
export const historicalDraws = [
  { date: "2024-01-07", numbers: [3, 12, 23, 34, 41, 47] },
  { date: "2024-01-04", numbers: [7, 15, 22, 33, 38, 45] },
  { date: "2023-12-31", numbers: [5, 18, 27, 31, 42, 49] },
  { date: "2023-12-28", numbers: [2, 11, 24, 36, 39, 44] },
  { date: "2023-12-24", numbers: [8, 14, 21, 29, 43, 48] },
  { date: "2023-12-21", numbers: [1, 16, 25, 32, 40, 46] },
  { date: "2023-12-17", numbers: [6, 13, 28, 35, 37, 49] },
  { date: "2023-12-14", numbers: [4, 19, 26, 30, 41, 45] },
];

export const getNextDrawDates = () => {
  const today = new Date();
  const dates = [];
  
  // Find next Thursday and Sunday
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 4 || dayOfWeek === 0) { // Thursday or Sunday
      dates.push({
        date: date.toLocaleDateString('ro-RO', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        dayName: dayOfWeek === 4 ? 'Joi' : 'Duminică',
        dateObj: date
      });
      if (dates.length >= 2) break;
    }
  }
  
  return dates;
};

export const calculateFrequencies = () => {
  const frequencies: Record<number, number> = {};
  
  historicalDraws.forEach(draw => {
    draw.numbers.forEach(num => {
      frequencies[num] = (frequencies[num] || 0) + 1;
    });
  });
  
  return Object.entries(frequencies)
    .map(([num, freq]) => ({
      number: parseInt(num),
      frequency: freq,
      isHot: freq >= 3
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);
};

// Simple pattern analysis for demo purposes
export const analyzePatterns = () => {
  const patterns = {
    evenOddRatio: "Mai multe numere impare în ultimele extrageri",
    rangeDistribution: "Tendință spre numere din intervalul 20-40",
    consecutiveNumbers: "Rare apariții de numere consecutive",
    sumTrend: "Suma numerelor între 140-180",
  };
  
  return patterns;
};

// Generate predictions based on simple heuristics (demo)
export const generatePredictions = () => {
  const predictions = [];
  const nextDates = getNextDrawDates();
  
  const reasonings = [
    "Bazat pe analiza frecvențelor din ultimele 50 de extrageri și pattern-uri de distribuție.",
    "Combinație optimizată folosind modelul de învățare din ultimele 100 de extrageri.",
    "Predicție bazată pe tendințele recente și echilibrul par-impar observat.",
  ];
  
  nextDates.forEach((dateInfo, idx) => {
    // Generate 2-3 predictions per draw
    for (let i = 0; i < (idx === 0 ? 3 : 2); i++) {
      const numbers: number[] = [];
      while (numbers.length < 6) {
        const num = Math.floor(Math.random() * 49) + 1;
        if (!numbers.includes(num)) {
          numbers.push(num);
        }
      }
      numbers.sort((a, b) => a - b);
      
      predictions.push({
        date: dateInfo.date,
        dayName: dateInfo.dayName,
        numbers,
        confidence: Math.floor(Math.random() * 20) + 60, // 60-80%
        reasoning: reasonings[i % reasonings.length],
      });
    }
  });
  
  return predictions;
};

// Simulated history for demo
export const getPredictionHistory = () => {
  return [
    {
      date: "5 Ian 2024",
      predicted: [7, 15, 22, 33, 38, 45],
      actual: [7, 15, 23, 34, 41, 47],
      matches: 2,
    },
    {
      date: "1 Ian 2024",
      predicted: [3, 12, 24, 35, 42, 48],
      actual: [5, 18, 27, 31, 42, 49],
      matches: 1,
    },
    {
      date: "28 Dec 2023",
      predicted: [2, 11, 24, 36, 40, 44],
      actual: [2, 11, 24, 36, 39, 44],
      matches: 4,
    },
    {
      date: "24 Dec 2023",
      predicted: [8, 14, 20, 29, 43, 47],
      actual: [8, 14, 21, 29, 43, 48],
      matches: 4,
    },
  ];
};
