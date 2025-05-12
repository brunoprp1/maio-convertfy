export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  avatar?: string;
};

export type Store = {
  id: string;
  name: string;
  url: string;
  platform: string;
  logo?: string;
  amsid?: string;
  status: 'active' | 'inactive';
};

export type Client = {
  id: string;
  name: string;
  email: string;
  logo?: string;
  plan: string;
  subscriptionValue: number;
  subscriptionStatus: 'active' | 'inactive';
  commissionValue: number;
  commissionStatus: 'pending' | 'paid';
  dueDate: string;
  nextBillingDate: string;
  stores: Store[];
};

export type Campaign = {
  id: string;
  name: string;
  type: 'email' | 'whatsapp' | 'sms';
  date: string;
  reach: number;
  openRate?: number;
  conversions: number;
  revenue: number;
  roi: number;
};

export type FinancialTransaction = {
  id: string;
  type: 'subscription' | 'commission';
  value: number;
  status: 'paid' | 'pending';
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: string;
};

export type Period = '7 dias' | '30 dias' | '90 dias' | '6 meses' | '1 ano';