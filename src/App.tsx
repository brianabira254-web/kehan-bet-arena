import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Menu, 
  X, 
  LogOut, 
  User as UserIcon, 
  History, 
  LayoutDashboard, 
  PlusCircle, 
  ChevronRight,
  TrendingUp,
  Clock,
  Zap,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Toaster, toast } from 'sonner';
import { Match, Bet, User, Selection } from './types';
import { MOCK_MATCHES } from './lib/mockData';
import { BetSlip } from './components/BetSlip';
import { AdminPanel } from './components/AdminPanel';
import { MpesaModal } from './components/MpesaModal';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [activeSelections, setActiveSelections] = useState<Selection[]>([]);
  const [user, setUser] = useState<User | null>({
    id: 'u1',
    name: 'Kibet Kehan',
    phoneNumber: '0712345678',
    balance: 2500.50
  });
  const [bets, setBets] = useState<Bet[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'admin'>('home');
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Constants
  const LOGO_URL = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/57e02eef-ff05-4bc1-acf2-6d9fdcd1bb45/kehanbets-logo-bbd2d50f-1776330117974.webp";
  const HERO_BG = "https://storage.googleapis.com/dala-prod-public-storage/generated-images/57e02eef-ff05-4bc1-acf2-6d9fdcd1bb45/betting-bg-4acf4dfc-1776330119653.webp";

  // Handlers
  const handleToggleSelection = (match: Match, type: 'home' | 'draw' | 'away', odds: number) => {
    if (!user) {
      toast.error('Please login to place bets');
      return;
    }

    setActiveSelections(prev => {
      const exists = prev.find(s => s.matchId === match.id);
      if (exists) {
        if (exists.type === type) {
          return prev.filter(s => s.matchId !== match.id);
        } else {
          return prev.map(s => s.matchId === match.id ? { ...s, type, odds } : s);
        }
      }
      return [...prev, { matchId: match.id, matchName: `${match.homeTeam} vs ${match.awayTeam}`, type, odds }];
    });
  };

  const handlePlaceBet = (stake: number) => {
    if (!user) return;
    
    const totalOdds = activeSelections.reduce((acc, sel) => acc * sel.odds, 1);
    const newBet: Bet = {
      id: Math.random().toString(36).substr(2, 9),
      selections: [...activeSelections],
      stake,
      totalOdds,
      potentialWin: stake * totalOdds,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    setBets([newBet, ...bets]);
    setUser({ ...user, balance: user.balance - stake });
    setActiveSelections([]);
    toast.success('Bet placed successfully!');
  };

  const handleCashout = (bet: Bet) => {
    if (!user) return;
    
    // Simple cashout calculation: 80% of potential win if pending
    const cashoutAmount = bet.potentialWin * 0.75; 
    
    setUser({ ...user, balance: user.balance + cashoutAmount });
    setBets(bets.map(b => b.id === bet.id ? { ...b, status: 'cashed_out', cashoutValue: cashoutAmount } : b));
    toast.success(`Cashed out KES ${cashoutAmount.toFixed(2)}`);
  };

  const handleTransaction = (amount: number, type: 'deposit' | 'withdraw') => {
    if (!user) return;
    if (type === 'deposit') {
      setUser({ ...user, balance: user.balance + amount });
    } else {
      if (user.balance < amount) {
        toast.error('Insufficient balance');
        return;
      }
      setUser({ ...user, balance: user.balance - amount });
    }
  };

  const filteredMatches = useMemo(() => {
    return matches; // Add search/category filtering here if needed
  }, [matches]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-green-500/30">
      <Toaster position="top-center" richColors theme="dark" />
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-400 hover:text-white"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
              <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
                <img src={LOGO_URL} alt="Kehanbets" className="h-10 w-auto rounded" />
                <span className="text-xl font-black tracking-tighter text-white hidden sm:block">
                  KEHAN<span className="text-green-500">BETS</span>
                </span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-6">
              <button 
                onClick={() => setActiveTab('home')}
                className={`text-sm font-semibold transition-colors ${activeTab === 'home' ? 'text-green-500' : 'text-slate-400 hover:text-white'}`}
              >
                SPORTS
              </button>
              <button className="text-sm font-semibold text-slate-400 hover:text-white">LIVE</button>
              <button className="text-sm font-semibold text-slate-400 hover:text-white">CASINO</button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`text-sm font-semibold transition-colors ${activeTab === 'history' ? 'text-green-500' : 'text-slate-400 hover:text-white'}`}
              >
                MY BETS
              </button>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-400 font-medium">BALANCE</span>
                    <span className="text-sm font-bold text-yellow-500">KES {user.balance.toLocaleString()}</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 font-bold hidden sm:flex"
                    onClick={() => setIsMpesaModalOpen(true)}
                  >
                    DEPOSIT
                  </Button>
                  <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                    <UserIcon className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" className="text-white hover:bg-slate-800">LOGIN</Button>
                  <Button className="bg-green-600 hover:bg-green-700 font-bold">JOIN</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-40 bg-[#020617] lg:hidden pt-20"
          >
            <div className="p-4 space-y-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-lg" 
                onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
              >
                <LayoutDashboard className="mr-3" /> Home
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-lg" 
                onClick={() => { setActiveTab('history'); setIsMobileMenuOpen(false); }}
              >
                <History className="mr-3" /> My Bets
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-lg" 
                onClick={() => { setIsAdmin(true); setActiveTab('admin'); setIsMobileMenuOpen(false); }}
              >
                <PlusCircle className="mr-3" /> Admin Panel
              </Button>
              <div className="border-t border-slate-800 pt-4">
                <Button 
                  className="w-full bg-green-600 py-6"
                  onClick={() => { setIsMpesaModalOpen(true); setIsMobileMenuOpen(false); }}
                >
                  DEPOSIT VIA MPESA
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Categories */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Links</h3>
                <button className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-slate-800 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">Live Now</span>
                  </div>
                  <Badge className="bg-red-500/10 text-red-500 border-red-500/20">42</Badge>
                </button>
                <button className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Upcoming</span>
                  </div>
                </button>
                <button className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Leagues</span>
                  </div>
                </button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Popular Sports</h3>
                {['Soccer', 'Basketball', 'Tennis', 'Cricket', 'Ice Hockey', 'Volleyball'].map((sport) => (
                  <button key={sport} className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-slate-800 transition-colors">
                    <span className="text-sm font-medium">{sport}</span>
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                  </button>
                ))}
              </CardContent>
            </Card>

            <Button 
              variant="outline" 
              className="w-full border-slate-800 text-slate-400 hover:text-white"
              onClick={() => { setIsAdmin(true); setActiveTab('admin'); }}
            >
              <PlusCircle className="mr-2 w-4 h-4" />
              Admin: Add Matches
            </Button>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-6 space-y-6">
            
            {activeTab === 'home' && (
              <>
                {/* Hero Banner */}
                <div className="relative rounded-2xl overflow-hidden h-48 bg-slate-800 flex items-center">
                  <img src={HERO_BG} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Hero" />
                  <div className="relative z-10 p-8 space-y-2">
                    <Badge className="bg-green-500 text-[#020617] font-bold">WEEKEND SPECIAL</Badge>
                    <h2 className="text-3xl font-black text-white italic">200% DEPOSIT BONUS</h2>
                    <p className="text-slate-300 text-sm max-w-md">Join Kehanbets today and get up to KES 10,000 in free bets on your first deposit!</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Zap className="text-yellow-500 w-5 h-5 fill-yellow-500" />
                    Live & Upcoming Events
                  </h2>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="cursor-pointer border-slate-700 bg-slate-800">All</Badge>
                    <Badge variant="outline" className="cursor-pointer border-slate-700">Soccer</Badge>
                    <Badge variant="outline" className="cursor-pointer border-slate-700">NBA</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredMatches.map((match) => (
                    <Card key={match.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] text-slate-500 font-bold uppercase">{match.league}</span>
                              {match.status === 'live' && (
                                <span className="flex items-center gap-1 text-[10px] text-red-500 font-bold animate-pulse">
                                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> LIVE
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="font-semibold text-sm sm:text-base">{match.homeTeam}</span>
                              <span className="font-semibold text-sm sm:text-base">{match.awayTeam}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-2">
                              {new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                            {[
                              { label: '1', type: 'home' as const, odds: match.odds.home },
                              { label: 'X', type: 'draw' as const, odds: match.odds.draw },
                              { label: '2', type: 'away' as const, odds: match.odds.away }
                            ].map((o) => (
                              <button
                                key={o.type}
                                onClick={() => handleToggleSelection(match, o.type, o.odds)}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all min-w-[70px] ${
                                  activeSelections.find(s => s.matchId === match.id && s.type === o.type)
                                    ? 'bg-green-600 border-green-500 text-white'
                                    : 'bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-300'
                                }`}
                              >
                                <span className="text-[10px] font-bold opacity-70">{o.label}</span>
                                <span className="text-sm font-black">{o.odds.toFixed(2)}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <History className="text-green-500 w-5 h-5" />
                    My Betting History
                  </h2>
                </div>

                {bets.length === 0 ? (
                  <Card className="bg-slate-900 border-slate-800 py-12">
                    <CardContent className="text-center space-y-4">
                      <div className="mx-auto w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                        <History className="w-8 h-8 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-slate-400">You haven't placed any bets yet.</p>
                        <Button variant="link" className="text-green-500" onClick={() => setActiveTab('home')}>Start Betting</Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {bets.map((bet) => (
                      <Card key={bet.id} className="bg-slate-900 border-slate-800 overflow-hidden">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                          <div>
                            <span className="text-xs text-slate-500">BET ID: #{bet.id.toUpperCase()}</span>
                            <div className="text-[10px] text-slate-600">{new Date(bet.timestamp).toLocaleString()}</div>
                          </div>
                          <Badge className={
                            bet.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                            bet.status === 'won' ? 'bg-green-500/10 text-green-500' :
                            bet.status === 'cashed_out' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-red-500/10 text-red-500'
                          }>
                            {bet.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <CardContent className="p-4 space-y-4">
                          <div className="space-y-2">
                            {bet.selections.map((sel, idx) => (
                              <div key={idx} className="flex justify-between items-start text-sm">
                                <div>
                                  <div className="font-semibold">{sel.matchName}</div>
                                  <div className="text-slate-500 text-xs">Prediction: {sel.type.toUpperCase()}</div>
                                </div>
                                <span className="font-bold text-yellow-500">{sel.odds}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                              <div className="text-[10px] text-slate-500 font-bold">STAKE</div>
                              <div className="font-bold">KES {bet.stake}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-500 font-bold">TOTAL ODDS</div>
                              <div className="font-bold">{bet.totalOdds.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-500 font-bold">POTENTIAL WIN</div>
                              <div className="font-bold text-green-500">KES {bet.potentialWin.toFixed(2)}</div>
                            </div>
                            {bet.status === 'pending' && (
                              <Button 
                                size="sm" 
                                className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold h-10"
                                onClick={() => handleCashout(bet)}
                              >
                                CASHOUT KES {(bet.potentialWin * 0.75).toFixed(0)}
                              </Button>
                            )}
                            {bet.status === 'cashed_out' && (
                              <div>
                                <div className="text-[10px] text-slate-500 font-bold">CASHED OUT</div>
                                <div className="font-bold text-blue-500">KES {bet.cashoutValue?.toFixed(2)}</div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'admin' && isAdmin && (
              <AdminPanel onAddMatch={(m) => {
                setMatches([m, ...matches]);
                setActiveTab('home');
              }} />
            )}
          </div>

          {/* Right Sidebar - Bet Slip */}
          <div className="lg:col-span-3">
            <BetSlip 
              selections={activeSelections} 
              onRemove={(id) => setActiveSelections(prev => prev.filter(s => s.matchId !== id))}
              onClear={() => setActiveSelections([])}
              onPlaceBet={handlePlaceBet}
              balance={user?.balance || 0}
            />
            
            {/* Features Info */}
            <div className="mt-8 space-y-4">
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Instant Mpesa</h4>
                    <p className="text-[10px] text-slate-500">Withdrawals processed in seconds.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <DollarSign className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Early Cashout</h4>
                    <p className="text-[10px] text-slate-500">Take control of your bets anytime.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-800 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src={LOGO_URL} alt="Kehanbets" className="h-8 w-auto rounded" />
                <span className="text-lg font-black text-white">KEHANBETS</span>
              </div>
              <p className="text-sm text-slate-500">The premier sports betting destination in Kenya. Licensed by BCLB. Gamble responsibly.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="text-sm text-slate-500 space-y-2">
                <li>Help Center</li>
                <li>Responsible Gambling</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Sports</h4>
              <ul className="text-sm text-slate-500 space-y-2">
                <li>Soccer</li>
                <li>Basketball</li>
                <li>American Football</li>
                <li>Tennis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Payment Methods</h4>
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded font-bold text-green-500 text-xs">M-PESA</div>
                <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded font-bold text-blue-500 text-xs">VISA</div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-900 text-center text-xs text-slate-600">
            © 2024 Kehanbets. All rights reserved. Must be 18+ to play.
          </div>
        </div>
      </footer>

      <MpesaModal 
        isOpen={isMpesaModalOpen} 
        onClose={() => setIsMpesaModalOpen(false)}
        onTransaction={handleTransaction}
        phoneNumber={user?.phoneNumber || ''}
      />
    </div>
  );
}

export default App;