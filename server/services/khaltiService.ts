import axios from 'axios';
import crypto from 'crypto-js';

// Khalti API Configuration - Production Environment
// Using live production endpoints for production credentials
const KHALTI_BASE_URL = 'https://khalti.com/api/v2';
const KHALTI_GATEWAY_URL = 'https://khalti.com/api/v2/epayment';

export interface KhaltiConfig {
  publicKey: string;
  secretKey: string;
  returnUrl: string;
  websiteUrl: string;
}

export interface PaymentRequest {
  return_url: string;
  website_url: string;
  amount: number; // in paisa (1 NPR = 100 paisa)
  purchase_order_id: string;
  purchase_order_name: string;
  customer_info?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  amount_breakdown?: Array<{
    label: string;
    amount: number;
  }>;
  product_details?: Array<{
    identity: string;
    name: string;
    total_price: number;
    quantity: number;
    unit_price: number;
  }>;
}

export interface PaymentResponse {
  pidx: string;
  payment_url: string;
  expires_at: string;
  expires_in: number;
}

export interface PaymentLookupResponse {
  pidx: string;
  total_amount: number;
  status: 'Completed' | 'Pending' | 'Initiated' | 'Refunded' | 'Partially Refunded' | 'Expired' | 'User canceled';
  transaction_id: string;
  fee: number;
  refunded_amount: number;
  purchase_order_id: string;
  purchase_order_name: string;
  extra_merchant_params?: any;
}

export class KhaltiService {
  private config: KhaltiConfig;

  constructor(config: KhaltiConfig) {
    this.config = config;
  }

  // Initialize payment
  async initiatePayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await axios.post(
        `${KHALTI_GATEWAY_URL}/initiate/`,
        paymentData,
        {
          headers: {
            'Authorization': `Key ${this.config.secretKey}`,
            'Content-Type': 'application/json',
            'X-Khalti-Environment': 'production',
            'X-Khalti-Version': 'v2',
            'User-Agent': 'ReArt-Events-Production/1.0'
          },
          timeout: 30000,
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Khalti payment initiation failed:', error.response?.data || error.message);
      throw new Error(`Payment initiation failed: ${error.response?.data?.detail || error.message}`);
    }
  }

  // Lookup payment status
  async lookupPayment(pidx: string): Promise<PaymentLookupResponse> {
    try {
      const response = await axios.post(
        `${KHALTI_GATEWAY_URL}/lookup/`,
        { pidx },
        {
          headers: {
            'Authorization': `Key ${this.config.secretKey}`,
            'Content-Type': 'application/json',
            'X-Khalti-Environment': 'production',
            'X-Khalti-Version': 'v2',
          },
          timeout: 30000,
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Khalti payment lookup failed:', error.response?.data || error.message);
      throw new Error(`Payment lookup failed: ${error.response?.data?.detail || error.message}`);
    }
  }

  // Verify payment (webhook signature verification)
  verifyWebhook(data: string, signature: string): boolean {
    try {
      const hash = crypto.HmacSHA256(data, this.config.secretKey).toString();
      return hash === signature;
    } catch (error) {
      console.error('Webhook verification failed:', error);
      return false;
    }
  }

  // Generate payment reference
  generatePaymentReference(): string {
    return `REART-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Convert NPR to paisa
  nprToPaisa(amount: number): number {
    return Math.round(amount * 100);
  }

  // Convert paisa to NPR
  paisaToNpr(amount: number): number {
    return amount / 100;
  }

  // Format amount for display
  formatAmount(amount: number, inPaisa: boolean = false): string {
    const nprAmount = inPaisa ? this.paisaToNpr(amount) : amount;
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 2,
    }).format(nprAmount);
  }
}

// Default configuration (will be overridden by environment variables)
export const createKhaltiService = () => {
  // Use test keys for development if environment variables are not set
  const config: KhaltiConfig = {
    publicKey: process.env.KHALTI_PUBLIC_KEY || 'test_public_key_dc74e0fd57cb46cd93832aee0a390234',
    secretKey: process.env.KHALTI_SECRET_KEY || 'test_secret_key_f59e8b7c6a8f4b5c9d6e7f8g9h0i1j2k',
    returnUrl: process.env.KHALTI_RETURN_URL || `${process.env.BASE_URL || 'http://localhost:5000'}/payment/callback`,
    websiteUrl: process.env.BASE_URL || 'http://localhost:5000',
  };

  // Only require keys in production
  if (process.env.NODE_ENV === 'production' && (!config.publicKey || !config.secretKey)) {
    throw new Error('Khalti API keys are required. Please set KHALTI_PUBLIC_KEY and KHALTI_SECRET_KEY environment variables.');
  }

  return new KhaltiService(config);
};