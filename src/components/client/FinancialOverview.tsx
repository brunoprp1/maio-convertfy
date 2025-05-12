import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import PaymentModal from '../ui/PaymentModal';
import { CreditCard, FileText, Clock, DollarSign } from 'lucide-react';
import { FinancialTransaction } from '../../types';
import { Period } from '../../types';
import TimeFilter from '../ui/TimeFilter';

type FinancialOverviewProps = {
  totalPaid: number;
  pendingPayments: number;
  nextDueDate: string;
  planType: string;
  subscriptionValue: number;
  commissionPercentage: number;
  startDate: string;
  renewalDate: string;
  totalInvestment: number;
  generatedRevenue: number;
  roi: number;
  transactions: FinancialTransaction[];
};

const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  totalPaid,
  pendingPayments,
  nextDueDate,
  planType,
  subscriptionValue,
  commissionPercentage,
  startDate,
  renewalDate,
  totalInvestment,
  generatedRevenue,
  roi,
  transactions,
}) => {
  const [timeFilter, setTimeFilter] = useState('30days');
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePayNow = (transaction: FinancialTransaction) => {
    setSelectedTransaction(transaction);
    setShowPaymentModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Visão Geral Financeira</h2>
        <TimeFilter value={timeFilter} onChange={setTimeFilter} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <div className="text-sm text-gray-500">Total Pago</div>
          </div>
          <div className="text-xl font-semibold">
            R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </Card>
        
        <Card className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div className="text-sm text-gray-500">Pagamentos Pendentes</div>
          </div>
          <div className="text-xl font-semibold">
            R$ {pendingPayments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </Card>
        
        <Card className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CreditCard size={20} className="text-blue-600" />
            </div>
            <div className="text-sm text-gray-500">Próximo Vencimento</div>
          </div>
          <div className="text-xl font-semibold">{nextDueDate}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Cobranças</h3>
              <Button variant="outline" size="sm">
                Exportar
              </Button>
            </div>
            
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'subscription' 
                          ? 'bg-blue-100' 
                          : 'bg-green-100'
                      }`}>
                        {transaction.type === 'subscription' ? (
                          <CreditCard size={20} className="text-blue-600" />
                        ) : (
                          <DollarSign size={20} className="text-green-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {transaction.type === 'subscription' 
                            ? 'Assinatura Mensal Plano Parceiro' 
                            : `Comissão ${transaction.dueDate.substring(3, 10)}`}
                        </h4>
                        
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <span>Vencimento: {transaction.dueDate}</span>
                          {transaction.status === 'paid' && transaction.paymentDate && (
                            <span className="ml-3">
                              • Pago em: {transaction.paymentDate}
                            </span>
                          )}
                        </div>
                        
                        {transaction.status === 'paid' && transaction.paymentMethod && (
                          <div className="mt-1 text-sm text-gray-500">
                            {transaction.paymentMethod}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="text-right mr-4">
                        <div className="font-medium">
                          R$ {transaction.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="mt-1">
                          {transaction.status === 'paid' ? (
                            <span className="text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                              Pago
                            </span>
                          ) : (
                            <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                              Pendente
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {transaction.status === 'pending' && (
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handlePayNow(transaction)}
                        >
                          Pagar Agora
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h3 className="text-lg font-medium mb-4">Informações do Plano</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Tipo do Plano</span>
                <span className="font-medium">{planType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Valor da Assinatura</span>
                <span className="font-medium">
                  R$ {subscriptionValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Percentual de Comissão</span>
                <span className="font-medium">{commissionPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Data de Início</span>
                <span className="font-medium">{startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Data de Renovação</span>
                <span className="font-medium">{renewalDate}</span>
              </div>
            </div>
          </Card>
          
          <Card className="bg-gray-50">
            <h3 className="text-lg font-medium mb-4">ROI Calculado</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Investimento Total (30 dias)</span>
                <span className="font-medium">
                  R$ {totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Receita Gerada (30 dias)</span>
                <span className="font-medium">
                  R$ {generatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="border-t border-gray-200 my-2 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">ROI</span>
                  <span className="text-green-600 text-3xl font-bold">{roi.toFixed(1)}x</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Para cada R$ 1,00 investido, você recebeu R$ {roi.toFixed(2).replace('.', ',')} de retorno
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {selectedTransaction && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
};

export default FinancialOverview;