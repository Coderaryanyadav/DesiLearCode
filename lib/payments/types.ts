export type PaymentStatus = 
  | 'NOT_CONFIGURED' 
  | 'PLEDGED' 
  | 'PENDING' 
  | 'SUCCESS' 
  | 'FAILED' 
  | 'CANCELLED' 
  | 'REFUNDED';

export interface PaymentOrderParams {
  amountInRupees: number;
  projectId: string;
  donorEmail: string;
  donorName?: string;
  allocatedNeedType?: string;
  notes?: string;
  idempotencyKey?: string;
}

export interface PaymentOrderResult {
  orderId: string;
  amountInRupees: number;
  currency: string;
  status: PaymentStatus;
  provider: 'razorpay' | 'none';
  clientSecretOrKey?: string;
  message: string;
}

export interface PaymentVerificationParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface PaymentVerificationResult {
  verified: boolean;
  orderId: string;
  paymentId?: string;
  settledAmount?: number;
  status: PaymentStatus;
  errorMessage?: string;
}

export interface PaymentWebhookEvent {
  eventId: string;
  eventType: string;
  payload: Record<string, any>;
  signature: string;
}

export interface PaymentWebhookResult {
  processed: boolean;
  actionTaken: string;
  idempotentIgnored?: boolean;
}

export interface PaymentRefundParams {
  paymentId: string;
  amountInRupees: number;
  reason: string;
}

export interface PaymentProvider {
  createPayment(params: PaymentOrderParams): Promise<PaymentOrderResult>;
  verifyPayment(params: PaymentVerificationParams): Promise<PaymentVerificationResult>;
  handleWebhook(event: PaymentWebhookEvent): Promise<PaymentWebhookResult>;
  refundPayment(params: PaymentRefundParams): Promise<{ success: boolean; refundId?: string; error?: string }>;
  getPaymentStatus(orderId: string): Promise<{ status: PaymentStatus; settledAmount?: number }>;
}
