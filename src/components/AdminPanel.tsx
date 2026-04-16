import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { PlusCircle, Save } from 'lucide-react';
import { Match } from '../types';
import { toast } from 'sonner';

interface AdminPanelProps {
  onAddMatch: (match: Match) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onAddMatch }) => {
  const [formData, setFormData] = useState({
    homeTeam: '',
    awayTeam: '',
    sport: 'Soccer',
    league: '',
    homeOdds: '',
    drawOdds: '',
    awayOdds: '',
    startTime: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.homeTeam || !formData.awayTeam || !formData.homeOdds || !formData.startTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newMatch: Match = {
      id: Math.random().toString(36).substr(2, 9),
      homeTeam: formData.homeTeam,
      awayTeam: formData.awayTeam,
      sport: formData.sport,
      league: formData.league || 'Standard League',
      startTime: new Date(formData.startTime).toISOString(),
      status: 'upcoming',
      odds: {
        home: parseFloat(formData.homeOdds),
        draw: parseFloat(formData.drawOdds || '3.0'),
        away: parseFloat(formData.awayOdds)
      }
    };

    onAddMatch(newMatch);
    toast.success('Match added successfully!');
    setFormData({
      homeTeam: '',
      awayTeam: '',
      sport: 'Soccer',
      league: '',
      homeOdds: '',
      drawOdds: '',
      awayOdds: '',
      startTime: ''
    });
  };

  return (
    <Card className="bg-slate-900 border-slate-800 text-white">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-yellow-500" />
          Add New Match (Admin)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Home Team</Label>
            <Input 
              value={formData.homeTeam}
              onChange={(e) => setFormData({...formData, homeTeam: e.target.value})}
              placeholder="e.g. Arsenal" 
              className="bg-slate-800 border-slate-700"
            />
          </div>
          <div className="space-y-2">
            <Label>Away Team</Label>
            <Input 
              value={formData.awayTeam}
              onChange={(e) => setFormData({...formData, awayTeam: e.target.value})}
              placeholder="e.g. Man City" 
              className="bg-slate-800 border-slate-700"
            />
          </div>
          <div className="space-y-2">
            <Label>League</Label>
            <Input 
              value={formData.league}
              onChange={(e) => setFormData({...formData, league: e.target.value})}
              placeholder="e.g. Premier League" 
              className="bg-slate-800 border-slate-700"
            />
          </div>
          <div className="space-y-2">
            <Label>Start Time</Label>
            <Input 
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              className="bg-slate-800 border-slate-700"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 col-span-1 md:col-span-2">
            <div className="space-y-2">
              <Label>Home Odds</Label>
              <Input 
                type="number" step="0.01"
                value={formData.homeOdds}
                onChange={(e) => setFormData({...formData, homeOdds: e.target.value})}
                placeholder="1.50" 
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Draw Odds</Label>
              <Input 
                type="number" step="0.01"
                value={formData.drawOdds}
                onChange={(e) => setFormData({...formData, drawOdds: e.target.value})}
                placeholder="3.20" 
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Away Odds</Label>
              <Input 
                type="number" step="0.01"
                value={formData.awayOdds}
                onChange={(e) => setFormData({...formData, awayOdds: e.target.value})}
                placeholder="2.80" 
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </div>
          <Button type="submit" className="col-span-1 md:col-span-2 bg-yellow-600 hover:bg-yellow-700 text-black font-bold mt-2">
            <Save className="w-4 h-4 mr-2" />
            Add Match to Live Board
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};