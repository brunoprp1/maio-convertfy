import { collection } from 'firebase/firestore';
import { db } from '../../config/firebase';

// Collection references
export const usersCollection = collection(db, 'users');
export const clientsCollection = collection(db, 'clients');
export const subscriptionsCollection = collection(db, 'subscriptions');
export const commissionsCollection = collection(db, 'commissions');
export const revenuesCollection = collection(db, 'revenues');
export const campaignsCollection = collection(db, 'campaigns');
export const activitiesCollection = collection(db, 'activities');
export const financialGoalsCollection = collection(db, 'financial_goals');
export const integrationsCollection = collection(db, 'integrations');
export const notificationsCollection = collection(db, 'notifications');