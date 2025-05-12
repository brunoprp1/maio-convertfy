import React from 'react';
import FinancialOverview from '../../components/client/FinancialOverview';
import { dashboardData, financialTransactions } from '../../data/mockData';

const ClientFinancials: React.FC = () => {
  const data = dashboardData.clientDashboard.financialData;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <FinancialOverview
        totalPaid={data.totalPaid}
        pendingPayments={data.pendingPayments}
        nextDueDate={data.nextDueDate}
        planType={data.planType}
        subscriptionValue={data.subscriptionValue}
        commissionPercentage={data.commissionPercentage}
        startDate={data.startDate}
        renewalDate={data.renewalDate}
        totalInvestment={data.totalInvestment}
        generatedRevenue={data.generatedRevenue}
        roi={data.roi}
        transactions={financialTransactions}
      />
    </div>
  );
};

export default ClientFinancials;