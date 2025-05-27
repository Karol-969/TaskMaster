import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, CreditCard, PieChart, Download } from 'lucide-react';

export function FinancialManagement() {
  const financialStats = {
    totalRevenue: 142650,
    monthlyRevenue: 28900,
    commissions: 15600,
    refunds: 2400
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-green-400">${financialStats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Monthly Revenue</p>
                <p className="text-2xl font-bold text-blue-400">${financialStats.monthlyRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Commissions</p>
                <p className="text-2xl font-bold text-purple-400">${financialStats.commissions.toLocaleString()}</p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Refunds</p>
                <p className="text-2xl font-bold text-red-400">${financialStats.refunds.toLocaleString()}</p>
              </div>
              <PieChart className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Financial Management</span>
            </CardTitle>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <DollarSign className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Financial Management System</h3>
            <p className="text-slate-400">Advanced revenue tracking, commission management, and financial analytics</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}