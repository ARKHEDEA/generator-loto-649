import { CheckCircle2, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LotteryPrediction } from "@/hooks/useLotteryData";

interface HistoryTableProps {
  suggestions: LotteryPrediction[];
}

export const HistoryTable = ({ suggestions }: HistoryTableProps) => {
  if (suggestions.length === 0) {
    return (
      <div className="card-gradient border border-border/50 rounded-xl p-8 text-center text-muted-foreground animate-slide-up">
        <p>Nicio sugestie generată încă. Apasă „Generează Sugestii" pentru a începe.</p>
      </div>
    );
  }

  return (
    <div className="card-gradient border border-border/50 rounded-xl overflow-hidden animate-slide-up">
      <div className="p-4 border-b border-border/50">
        <h3 className="text-lg font-semibold text-foreground">Istoric Sugestii</h3>
        <p className="text-sm text-muted-foreground">Sugestiile generate anterior, salvate automat</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Data Extragere</TableHead>
              <TableHead className="text-muted-foreground">Numere Sugerate</TableHead>
              <TableHead className="text-muted-foreground">Încredere</TableHead>
              <TableHead className="text-muted-foreground">Rezultat Real</TableHead>
              <TableHead className="text-muted-foreground text-right">Potriviri</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suggestions.map((entry) => (
              <TableRow key={entry.id} className="border-border/50">
                <TableCell className="font-medium text-foreground">
                  {new Date(entry.draw_date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' })}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5 flex-wrap">
                    {entry.predicted_numbers.map((num, i) => {
                      const isMatch = entry.actual_numbers?.includes(num);
                      return (
                        <div 
                          key={i}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-medium ${
                            isMatch 
                              ? 'bg-success/20 text-success border border-success/30' 
                              : 'bg-secondary text-muted-foreground'
                          }`}
                        >
                          {num}
                        </div>
                      );
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-primary">{entry.confidence}%</span>
                </TableCell>
                <TableCell>
                  {entry.actual_numbers ? (
                    <div className="flex gap-1.5 flex-wrap">
                      {entry.actual_numbers.map((num, i) => (
                        <div 
                          key={i}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-medium bg-primary/20 text-primary border border-primary/30"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">În așteptare</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {entry.matches !== null ? (
                    <div className="flex items-center justify-end gap-2">
                      {entry.matches > 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className={`font-mono font-medium ${
                        entry.matches >= 3 ? 'text-success' : 
                        entry.matches > 0 ? 'text-primary' : 
                        'text-muted-foreground'
                      }`}>
                        {entry.matches}/6
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
