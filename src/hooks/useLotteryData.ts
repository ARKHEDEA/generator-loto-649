import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LotteryDraw {
  id: string;
  draw_date: string;
  numbers: number[];
  created_at: string;
}

export interface LotteryPrediction {
  id: string;
  draw_date: string;
  predicted_numbers: number[];
  confidence: number;
  reasoning: string | null;
  actual_numbers: number[] | null;
  matches: number | null;
  created_at: string;
}

export const useLotteryDraws = (limit = 100) => {
  return useQuery({
    queryKey: ['lottery-draws', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lottery_draws')
        .select('*')
        .order('draw_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as LotteryDraw[];
    },
  });
};

export const useAllLotteryDraws = () => {
  return useQuery({
    queryKey: ['all-lottery-draws'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lottery_draws')
        .select('*')
        .order('draw_date', { ascending: false });

      if (error) throw error;
      return data as LotteryDraw[];
    },
  });
};

export const useLotteryPredictions = () => {
  return useQuery({
    queryKey: ['lottery-predictions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lottery_predictions')
        .select('*')
        .order('draw_date', { ascending: false });

      if (error) throw error;
      return data as LotteryPrediction[];
    },
  });
};

export const useSyncLotteryData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('sync-lottery-data');
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Date sincronizate: ${data.message}`);
      queryClient.invalidateQueries({ queryKey: ['lottery-draws'] });
      queryClient.invalidateQueries({ queryKey: ['all-lottery-draws'] });
    },
    onError: (error) => {
      toast.error(`Eroare la sincronizare: ${error.message}`);
    },
  });
};

export const calculateFrequenciesFromDraws = (draws: LotteryDraw[]) => {
  const frequencies: Record<number, number> = {};

  draws.forEach((draw) => {
    draw.numbers.forEach((num) => {
      frequencies[num] = (frequencies[num] || 0) + 1;
    });
  });

  return Object.entries(frequencies)
    .map(([num, freq]) => ({
      number: parseInt(num),
      frequency: freq,
      isHot: freq >= Math.ceil(draws.length * 0.15), // Top 15% frequency
    }))
    .sort((a, b) => b.frequency - a.frequency);
};

export const getRecentDraws = (draws: LotteryDraw[], count = 10) => {
  return draws.slice(0, count);
};

export const getDrawStats = (draws: LotteryDraw[]) => {
  if (draws.length === 0) {
    return {
      totalDraws: 0,
      dateRange: { from: null, to: null },
      avgSum: 0,
      evenOddRatio: '0:0',
    };
  }

  const sums = draws.map((d) => d.numbers.reduce((a, b) => a + b, 0));
  const avgSum = Math.round(sums.reduce((a, b) => a + b, 0) / sums.length);

  let evenCount = 0;
  let oddCount = 0;
  draws.forEach((d) => {
    d.numbers.forEach((n) => {
      if (n % 2 === 0) evenCount++;
      else oddCount++;
    });
  });

  const totalNumbers = draws.length * 6;
  const evenRatio = Math.round((evenCount / totalNumbers) * 100);
  const oddRatio = Math.round((oddCount / totalNumbers) * 100);

  return {
    totalDraws: draws.length,
    dateRange: {
      from: draws[draws.length - 1]?.draw_date,
      to: draws[0]?.draw_date,
    },
    avgSum,
    evenOddRatio: `${evenRatio}:${oddRatio}`,
  };
};
