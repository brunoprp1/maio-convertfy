import { Timestamp } from 'firebase/firestore';

// Base interface for common fields
interface BaseModel {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface User extends BaseModel {
  email: string;
  name: string;
  role: 'admin' | 'client';
  status: 'active' | 'inactive';
  phone?: string;
  lastLoginAt?: Timestamp;
  klaviyoApiKey?: string;
  klaviyoPublicKey?: string;
  reportanaClientId?: string;
  reportanaClientSecret?: string;
}

export interface Integration {
  apiKey?: string;
  publicKey?: string;
  clientId?: string;
  clientSecret?: string;
  enabled: boolean;
  updatedAt: Timestamp;
}

export interface Store extends BaseModel {
  clientId: string;
  name: string;
  url: string;
  platform: string;
  status: 'active' | 'inactive';
  settings: {
    notificationEmail: boolean;
    notificationWhatsapp: boolean;
    notificationSystem: boolean;
  };
  integrations: {
    klaviyo?: Integration;
    reportana?: Integration;
    shopify?: {
      shopId: string;
      accessToken: string;
    };
    vtex?: {
      accountName: string;
      apiKey: string;
    };
    woocommerce?: {
      siteUrl: string;
      consumerKey: string;
    };
  };
}

export interface Client extends BaseModel {
  userId: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  cnpj?: string;
  address?: string;
  plan: 'partner' | 'premium';
  subscriptionStatus: 'active' | 'pending' | 'cancelled';
  contractStartDate: Timestamp;
  contractEndDate?: Timestamp;
  settings: {
    notificationEmail: boolean;
    notificationWhatsapp: boolean;
    notificationSystem: boolean;
  };
}

export interface Subscription extends BaseModel {
  clientId: string;
  value: number;
  status: 'active' | 'pending' | 'cancelled';
  dueDate: Timestamp;
  isRecurring: boolean;
  planType: 'partner' | 'premium';
  paymentMethod?: string;
  lastPaymentDate?: Timestamp;
  nextPaymentDate?: Timestamp;
  asaasId?: string;
}

export interface Commission extends BaseModel {
  clientId: string;
  value: number;
  status: 'paid' | 'pending';
  dueDate: Timestamp;
  referenceMonth: number;
  referenceYear: number;
  paymentDate?: Timestamp;
  paymentMethod?: string;
  asaasId?: string;
}

export interface Revenue extends BaseModel {
  clientId: string;
  totalRevenue: number;
  convertfyRevenue: number;
  referenceMonth: number;
  referenceYear: number;
  source: {
    email: number;
    whatsapp: number;
    sms: number;
  };
  metrics: {
    averageTicket: number;
    conversionRate: number;
    roiGeneral: number;
  };
}

export interface Campaign extends BaseModel {
  clientId: string;
  name: string;
  channel: 'email' | 'whatsapp' | 'sms';
  status: 'draft' | 'scheduled' | 'running' | 'completed';
  startDate: Timestamp;
  endDate?: Timestamp;
  results: {
    reach: number;
    openRate?: number;
    clickRate?: number;
    conversions: number;
    revenue: number;
    roi: number;
  };
  settings: {
    segmentation: string[];
    template: string;
    scheduledTime?: Timestamp;
  };
}

export interface Activity extends BaseModel {
  type: 'client_created' | 'subscription_updated' | 'commission_paid' | 'campaign_sent';
  description: string;
  userId: string;
  clientId?: string;
  metadata?: Record<string, any>;
}

export interface FinancialGoal extends BaseModel {
  type: 'mrr' | 'revenue' | 'clients';
  targetValue: number;
  currentValue: number;
  period: {
    month: number;
    year: number;
  };
  status: 'pending' | 'achieved' | 'failed';
}

export interface Integration extends BaseModel {
  clientId: string;
  platform: 'asaas' | 'klaviyo' | 'shopify';
  status: 'active' | 'inactive';
  credentials: {
    apiKey?: string;
    apiSecret?: string;
    accessToken?: string;
    webhookUrl?: string;
  };
  settings: Record<string, any>;
  lastSyncAt?: Timestamp;
}

export interface Notification extends BaseModel {
  userId: string;
  clientId?: string;
  type: 'system' | 'payment' | 'campaign' | 'alert';
  title: string;
  message: string;
  status: 'unread' | 'read';
  priority: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
}