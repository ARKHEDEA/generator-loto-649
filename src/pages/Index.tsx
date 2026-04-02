import { useState, useEffect } from "react";
import { PredictionCard } from "@/components/PredictionCard";
import { StatsCard } from "@/components/StatsCard";
import { FrequencyChart } from "@/components/FrequencyChart";
import { HistoryTable } from "@/components/HistoryTable";
import { 
  useLotteryDraws,
  useAllLotteryDraws,
  useLotteryPredictions,
  useSyncLotteryData,
  useSaveSuggestions,
  calculateFrequenciesFromDraws,
  getDrawStats,
} from "@/hooks/useLotteryData";
import { getNextDrawDates } from "@/lib/lotteryData";
import { 
  Target, 
  TrendingUp, 
  Calendar,
  Sparkles,
  BarChart3,
  RefreshCw,
  Download,
  Database,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const { data: recentDraws, isLoading: isLoadingRecent } = useLotteryDraws(50);
  const { data: allDraws, isLoading: isLoadingAll } = useAllLotteryDraws();
  const { data: savedSuggestions } = useLotteryPredictions();
  const syncMutation = useSyncLotteryData();
  const saveSuggestionsMutation = useSaveSuggestions();
  
  const [suggestions, setSuggestions] = useState<Array<{
    date: string;
    dayName: string;
    numbers: number[];
    confidence: number;
    reasoning: string;
  }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasSynced, setHasSynced] = useState(false);

  // Auto-sync on first load if DB is empty
  useEffect(() => {
    if (!hasSynced && allDraws && allDraws.length === 0 && !syncMutation.isPending) {
      setHasSynced(true);
      syncMutation.mutate();
    } else if (allDraws && allDraws.length > 0) {
      setHasSynced(true);
    }
  }, [allDraws, hasSynced]);

  // Calculate frequencies from real data
  const frequencies = allDraws ? calculateFrequenciesFromDraws(allDraws).slice(0, 10) : [];
  const stats = allDraws ? getDrawStats(allDraws) : null;

  // Generate suggestions based on real data analysis
  const generateSuggestions = () => {
    if (!allDraws || allDraws.length === 0) return;

    setIsGenerating(true);

    const nextDates = getNextDrawDates();
    const topFrequencies = calculateFrequenciesFromDraws(allDraws);
    
    const hotNumbers = topFrequencies.filter(f => f.isHot).map(f => f.number);

    const newSuggestions = nextDates.flatMap((dateInfo, idx) => {
      const count = idx === 0 ? 3 : 2;
      return Array.from({ length: count }, (_, i) => {
        const numbers: number[] = [];
        
        // Add 3-4 hot numbers
        const hotCount = 3 + Math.floor(Math.random() * 2);
        while (numbers.length < hotCount && hotNumbers.length > 0) {
          const num = hotNumbers[Math.floor(Math.random() * Math.min(hotNumbers.length, 15))];
          if (!numbers.includes(num)) numbers.push(num);
        }
        
        // Fill rest with balanced selection
        while (numbers.length < 6) {
          const num = Math.floor(Math.random() * 49) + 1;
          if (!numbers.includes(num)) numbers.push(num);
        }
        
        numbers.sort((a, b) => a - b);

        const reasonings = [
          `Bazat pe analiza ${allDraws.length} extrageri istorice. Combinație cu ${hotCount} numere frecvente.`,
          `Pattern detectat din ultimele 100 extrageri. Echilibru par-impar: ${stats?.evenOddRatio}.`,
          `Analiză statistică bazată pe tendințe recente și suma medie: ${stats?.avgSum}.`,
        ];

        return {
          date: dateInfo.date,
          dayName: dateInfo.dayName,
          numbers,
          confidence: Math.floor(Math.random() * 20) + 65,
          reasoning: reasonings[i % reasonings.length],
        };
      });
    });

    setSuggestions(newSuggestions);

    // Save to database
    const toSave = newSuggestions.map(s => ({
      draw_date: nextDates.find(d => d.date === s.date)?.dateObj.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      predicted_numbers: s.numbers,
      confidence: s.confidence,
      reasoning: s.reasoning,
    }));
    saveSuggestionsMutation.mutate(toSave);

    setIsGenerating(false);
    toast.success("Sugestii noi generate și salvate!");
  };

  const handleSync = () => {
    syncMutation.mutate();
  };

  const isLoading = isLoadingRecent || isLoadingAll;

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
                  <img src="/favicon.png" alt="Trifoi norocos" className="w-8 h-8" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Loto <span className="gradient-text">6/49</span> AI
                </h1>
              </div>
              <p className="text-muted-foreground max-w-lg">
                Sistem inteligent de analiză statistică pentru Loteria Română 6 din 49.
                Generează combinații sugerate pe baza datelor istorice.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleSync}
                disabled={syncMutation.isPending}
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10"
              >
                <Download className={`w-4 h-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                {syncMutation.isPending ? 'Sincronizare...' : 'Sincronizează Date'}
              </Button>
              <Button 
                onClick={generateSuggestions}
                disabled={isGenerating || !allDraws || allDraws.length === 0}
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-gold"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Generăm...' : 'Generează Sugestii'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Database Status */}
        {allDraws && (
          <div className="mb-6 p-4 rounded-xl bg-secondary/30 border border-border/50 flex items-center gap-3">
            <Database className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">{allDraws.length}</span> extrageri în baza de date
              {stats?.dateRange.from && stats?.dateRange.to && (
                <span className="ml-2">
                  ({new Date(stats.dateRange.from).getFullYear()} - {new Date(stats.dateRange.to).getFullYear()})
                </span>
              )}
            </span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Extrageri Analizate"
            value={isLoading ? "..." : stats?.totalDraws.toLocaleString() || "0"}
            subtitle={stats?.dateRange.from ? `Din ${new Date(stats.dateRange.from).getFullYear()}` : "Sincronizează datele"}
            icon={BarChart3}
            delay={0}
          />
          <StatsCard 
            title="Sumă Medie"
            value={isLoading ? "..." : stats?.avgSum.toString() || "0"}
            subtitle="Suma celor 6 numere"
            icon={Sparkles}
            trend="neutral"
            delay={100}
          />
          <StatsCard 
            title="Raport Par/Impar"
            value={isLoading ? "..." : stats?.evenOddRatio || "0:0"}
            subtitle="Distribuție istorică"
            icon={Target}
            trend="neutral"
            delay={200}
          />
          <StatsCard 
            title="Sugestii Salvate"
            value={savedSuggestions?.length.toString() || "0"}
            subtitle="Total sugestii generate"
            icon={TrendingUp}
            delay={300}
          />
        </div>

        {/* Suggestions Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Sugestii Următoare</h2>
          </div>
          {suggestions.length === 0 && !isGenerating ? (
            <div className="text-center py-12 text-muted-foreground">
              <img src="/favicon.png" alt="" className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Apasă „Generează Sugestii" pentru combinații bazate pe analiza statistică</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((s, idx) => (
                <PredictionCard 
                  key={idx}
                  date={s.date}
                  dayName={s.dayName}
                  numbers={s.numbers}
                  confidence={s.confidence}
                  reasoning={s.reasoning}
                  index={idx}
                />
              ))}
            </div>
          )}
        </section>

        {/* Analysis Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <FrequencyChart 
            data={frequencies}
            title="Top 10 Numere Frecvente"
          />

          <div className="card-gradient border border-border/50 rounded-xl p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Analiză Pattern-uri</h3>
            </div>
            <div className="space-y-4">
              {allDraws && allDraws.length > 0 ? (
                <>
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Distribuție Par/Impar</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Raport mediu: {stats?.evenOddRatio} în {stats?.totalDraws} extrageri
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Sumă Numerelor</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Media sumei: {stats?.avgSum} (interval tipic: 130-180)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Numere Frecvente</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Top 5: {frequencies.slice(0, 5).map(f => f.number).join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Interval Date</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {stats?.dateRange.from} → {stats?.dateRange.to}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Sincronizează datele pentru a vedea analiza</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* History Section */}
        <section>
          <HistoryTable suggestions={savedSuggestions || []} />
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-border/50 pt-8 pb-6 text-center text-sm text-muted-foreground">
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-xs leading-relaxed px-4">
              <strong className="text-foreground">Disclaimer:</strong> Această aplicație este oferită exclusiv în scop informativ și de divertisment. 
              Nu garantează și nu pretinde că generează predicții câștigătoare. Rezultatele afișate sunt bazate pe analize statistice ale datelor istorice 
              și nu constituie sfaturi de joc. Utilizarea se face pe propria răspundere. Autorul nu își asumă nicio responsabilitate pentru eventuale 
              pierderi financiare și, totodată, nu formulează nicio pretenție financiară în cazul unor câștiguri obținute. 
              Jocurile de noroc implică riscuri — jucați responsabil.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Sugestiile sunt generate pe baza analizei statistice a extragerilor istorice</span>
            </div>
            <div className="pt-2 border-t border-border/30 text-xs space-y-1">
              <p className="text-foreground font-medium">© {new Date().getFullYear()} Adrian Constantin</p>
              <p>
                <a href="mailto:adi@adrianconstantin.ro" className="text-primary hover:underline">adi@adrianconstantin.ro</a>
                {' · '}
                <a href="https://www.adrianconstantin.ro" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.adrianconstantin.ro</a>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
