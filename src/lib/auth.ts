import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri && process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
  console.warn('WARNING: MONGODB_URI is not set. Using local database placeholder for compilation.');
}

const client = new MongoClient(mongoUri || 'mongodb://localhost:27017/novalibrary_placeholder');
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || 'placeholder_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder_client_secret',
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});
