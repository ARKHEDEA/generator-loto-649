import { LotteryBall } from "./LotteryBall";
import { Calendar, Sparkles, TrendingUp } from "lucide-react";
import { Card } from "./ui/card";

interface PredictionCardProps {
  date: string;
  dayName: string;
  numbers: number[];
  confidence: number;
  reasoning: string;
  index: number;
}

export const PredictionCard = ({ 
  date, 
  dayName, 
  numbers, 
  confidence, 
  reasoning,
  index 
}: PredictionCardProps) => {
  return (
    <Card 
      className="card-gradient border-border/50 p-6 hover:border-primary/30 transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{dayName}</p>
            <p className="text-sm text-muted-foreground">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">{confidence}%</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        {numbers.map((num, idx) => (
          <LotteryBall 
            key={idx} 
            number={num} 
            delay={idx * 100} 
          />
        ))}
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50">
        <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          {reasoning}
        </p>
      </div>
    </Card>
  );
};
