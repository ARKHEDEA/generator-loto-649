import { LotteryBall } from "./LotteryBall";

interface FrequencyData {
  number: number;
  frequency: number;
  isHot: boolean;
}

interface FrequencyChartProps {
  data: FrequencyData[];
  title: string;
}

export const FrequencyChart = ({ data, title }: FrequencyChartProps) => {
  const maxFrequency = Math.max(...data.map(d => d.frequency));

  return (
    <div className="card-gradient border border-border/50 rounded-xl p-6 animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={item.number} className="flex items-center gap-4">
            <LotteryBall 
              number={item.number} 
              variant={item.isHot ? "primary" : "dim"}
              size="sm"
              delay={idx * 50}
            />
            <div className="flex-1">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ 
                    width: `${(item.frequency / maxFrequency) * 100}%`,
                    background: item.isHot 
                      ? 'linear-gradient(90deg, hsl(45 93% 58%), hsl(35 90% 50%))' 
                      : 'hsl(var(--muted-foreground))',
                    animationDelay: `${idx * 100}ms`
                  }}
                />
              </div>
            </div>
            <span className="text-sm font-mono text-muted-foreground w-12 text-right">
              {item.frequency}x
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
