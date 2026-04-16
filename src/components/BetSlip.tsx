import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Trash2, TrendingUp, X } from 'lucide-react';
import { Selection } from '../types';
import { toast } from 'sonner';

interface BetSlipProps {
  selections: Selection[];
  onRemove: (matchId: string) => void;
  onClear: () => void;
  onPlaceBet: (stake: number) => void;
  balance: number;
}

export const BetSlip: React.FC<BetSlipProps> = ({ selections, onRemove, onClear, onPlaceBet, balance }) => {
  const [stake, setStake] = useState<string>('');
  
  const totalOdds = selections.reduce((acc, sel) => acc * sel.odds, 1).toFixed(2);
  const potentialWin = (parseFloat(totalOdds) * (parseFloat(stake) || 0)).toFixed(2);

  const handlePlaceBet = () => {
    const stakeNum = parseFloat(stake);
    if (!stakeNum || stakeNum <= 0) {
      toast.error('Please enter a valid stake');
      return;
    }
    if (stakeNum > balance) {
      toast.error('Insufficient balance');
      return;
    }
    onPlaceBet(stakeNum);
    setStake('');
  };

  if (selections.length === 0) {
    return (
      <Card className="bg-slate-900 border-slate-800 text-white">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Bet Slip
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12 text-slate-500">
          <p>Your slip is empty.</p>
          <p className="text-sm">Select some odds to start betting!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900 border-slate-800 text-white sticky top-20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Bet Slip ({selections.length})
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClear} className="text-slate-400 hover:text-white">
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {selections.map((sel) => (
            <div key={sel.matchId} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 relative group">
              <button 
                onClick={() => onRemove(sel.matchId)}
                className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white" />
              </button>
              <div className="text-xs text-slate-400 mb-1">{sel.matchName}</div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">
                  {sel.type === 'home' ? 'Home' : sel.type === 'away' ? 'Away' : 'Draw'}
                </span>
                <span className="text-yellow-500 font-bold">{sel.odds}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Total Odds</span>
            <span className="font-bold text-yellow-500">{totalOdds}</span>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Stake (KES)</label>
            <Input 
              type="number" 
              placeholder="Min 10.00" 
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              className="bg-slate-950 border-slate-700 text-white h-10"
            />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Possible Win</span>
            <span className="font-bold text-green-500">KES {potentialWin}</span>
          </div>

          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg"
            onClick={handlePlaceBet}
          >
            PLACE BET
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};