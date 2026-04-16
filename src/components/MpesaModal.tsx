import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Wallet, Smartphone, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { toast } from 'sonner';

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransaction: (amount: number, type: 'deposit' | 'withdraw') => void;
  phoneNumber: string;
}

export const MpesaModal: React.FC<MpesaModalProps> = ({ isOpen, onClose, onTransaction, phoneNumber }) => {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAction = async (type: 'deposit' | 'withdraw') => {
    const val = parseFloat(amount);
    if (!val || val < 10) {
      toast.error('Minimum amount is KES 10');
      return;
    }

    setLoading(true);
    // Simulate Mpesa API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (type === 'deposit') {
      toast.success(`Mpesa prompt sent to ${phoneNumber}. Please enter your PIN.`);
    } else {
      toast.success(`Withdrawal of KES ${val} to ${phoneNumber} initiated.`);
    }
    
    onTransaction(val, type);
    setLoading(false);
    setAmount('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-green-500" />
            Mpesa Wallet
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Secure payments via Safaricom M-PESA.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (KES)</Label>
              <Input 
                id="amount" 
                type="number" 
                placeholder="100.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="bg-green-950/30 p-3 rounded-lg border border-green-900/50 flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-green-500 mt-1" />
              <div className="text-xs text-green-200">
                A STK push will be sent to <strong>{phoneNumber}</strong>. 
                Keep your phone ready to enter your Mpesa PIN.
              </div>
            </div>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 font-bold"
              onClick={() => handleAction('deposit')}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'DEPOSIT NOW'}
              <ArrowDownCircle className="ml-2 w-4 h-4" />
            </Button>
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount (KES)</Label>
              <Input 
                id="withdraw-amount" 
                type="number" 
                placeholder="500.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="bg-blue-950/30 p-3 rounded-lg border border-blue-900/50 flex items-start gap-3">
              <Wallet className="w-5 h-5 text-blue-500 mt-1" />
              <div className="text-xs text-blue-200">
                Funds will be sent to the Mpesa registered number: <strong>{phoneNumber}</strong>.
                Usually processed within 5-10 minutes.
              </div>
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 font-bold"
              onClick={() => handleAction('withdraw')}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'WITHDRAW NOW'}
              <ArrowUpCircle className="ml-2 w-4 h-4" />
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};