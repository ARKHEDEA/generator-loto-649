import { LotteryBall } from "./LotteryBall";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HistoryEntry {
  date: string;
  predicted: number[];
  actual: number[];
  matches: number;
}

interface HistoryTableProps {
  history: HistoryEntry[];
}

export const HistoryTable = ({ history }: HistoryTableProps) => {
  return (
    <div className="card-gradient border border-border/50 rounded-xl overflow-hidden animate-slide-up">
      <div className="p-4 border-b border-border/50">
        <h3 className="text-lg font-semibold text-foreground">Istoric Predicții</h3>
        <p className="text-sm text-muted-foreground">Comparație predicții vs rezultate reale</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Data</TableHead>
              <TableHead className="text-muted-foreground">Predicție</TableHead>
              <TableHead className="text-muted-foreground">Rezultat Real</TableHead>
              <TableHead className="text-muted-foreground text-right">Potriviri</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((entry, idx) => (
              <TableRow key={idx} className="border-border/50">
                <TableCell className="font-medium text-foreground">
                  {entry.date}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    {entry.predicted.map((num, i) => {
                      const isMatch = entry.actual.includes(num);
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
                  <div className="flex gap-1.5">
                    {entry.actual.map((num, i) => (
                      <div 
                        key={i}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-medium bg-primary/20 text-primary border border-primary/30"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
