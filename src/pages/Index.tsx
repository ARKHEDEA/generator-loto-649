import { useState, useEffect } from "react";
import { PredictionCard } from "@/components/PredictionCard";
import { StatsCard } from "@/components/StatsCard";
import { FrequencyChart } from "@/components/FrequencyChart";
import { HistoryTable } from "@/components/HistoryTable";
import { 
  generatePredictions, 
  calculateFrequencies, 
  getPredictionHistory,
  analyzePatterns 
} from "@/lib/lotteryData";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Calendar,
  Sparkles,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const [predictions, setPredictions] = useState(generatePredictions());
  const [frequencies] = useState(calculateFrequencies());
  const [history] = useState(getPredictionHistory());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const patterns = analyzePatterns();

  const handleNewAnalysis = () => {
    setIsAnalyzing(true);
    toast.info("Analizăm pattern-urile...", { duration: 2000 });
    
    setTimeout(() => {
      setPredictions(generatePredictions());
      setIsAnalyzing(false);
      toast.success("Predicții noi generate cu succes!");
    }, 2000);
  };

  const totalMatches = history.reduce((sum, h) => sum + h.matches, 0);
  const avgMatches = (totalMatches / history.length).toFixed(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden border-b border-border/50">
        <div 
          className="absolute inset-0 opacity-30"
          style={{ background: 'var(--gradient-hero)' }}
        />
        <div className="relative container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-primary/10 glow-gold animate-pulse-gold">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Loto <span className="gradient-text">6/49</span> AI
                </h1>
              </div>
              <p className="text-muted-foreground max-w-lg">
                Sistem inteligent de analiză și predicție bazat pe pattern-uri istorice 
                pentru Loteria Română 6 din 49.
              </p>
            </div>
            <Button 
              onClick={handleNewAnalysis}
              disabled={isAnalyzing}
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-gold"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Analizăm...' : 'Analiză Nouă'}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Extrageri Analizate"
            value="2,847"
            subtitle="Din 1999 până azi"
            icon={BarChart3}
            delay={0}
          />
          <StatsCard 
            title="Pattern-uri Detectate"
            value="156"
            subtitle="+12 luna aceasta"
            icon={Sparkles}
            trend="up"
            delay={100}
          />
          <StatsCard 
            title="Potriviri Medii"
            value={avgMatches}
            subtitle="Din 6 numere"
            icon={Target}
            trend="neutral"
            delay={200}
          />
          <StatsCard 
            title="Predicții Generate"
            value="1,243"
            subtitle="Acuratețe: 34%"
            icon={TrendingUp}
            delay={300}
          />
        </div>

        {/* Predictions Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Predicții Următoare</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions.map((pred, idx) => (
              <PredictionCard 
                key={idx}
                date={pred.date}
                dayName={pred.dayName}
                numbers={pred.numbers}
                confidence={pred.confidence}
                reasoning={pred.reasoning}
                index={idx}
              />
            ))}
          </div>
        </section>

        {/* Analysis Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* Frequency Chart */}
          <FrequencyChart 
            data={frequencies}
            title="Top 10 Numere Frecvente"
          />

          {/* Pattern Analysis */}
          <div className="card-gradient border border-border/50 rounded-xl p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Analiză Pattern-uri</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(patterns).map(([key, value], idx) => (
                <div 
                  key={key}
                  className="p-4 rounded-lg bg-secondary/50 border border-border/30"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* History Section */}
        <section>
          <HistoryTable history={history} />
        </section>

        {/* Footer Note */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Predicțiile sunt generate automat în fiecare Joi și Duminică
          </p>
          <p className="mt-2 text-xs">
            Acest sistem este doar pentru divertisment. Jocurile de noroc implică riscuri.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
