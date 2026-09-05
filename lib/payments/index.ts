import { 
  PaymentProvider, 
  PaymentOrderParams, 
  PaymentOrderResult, 
  PaymentVerificationParams, 
  PaymentVerificationResult, 
  PaymentWebhookEvent, 
  PaymentWebhookResult, 
  PaymentRefundParams,
  PaymentStatus 
} from './types';

/**
 * Disabled / Unconfigured Payment Provider implementation.
 * Ensures that until live banking/merchant credentials (e.g. Razorpay merchant keys)
 * are configured via verified server-side environment secrets:
 * - NO fake payment success is emitted.
 * - NO fake settled receipt is claimed.
 * - Transactions are clearly categorized as NOT_CONFIGURED or PLEDGED.
 */
export class UnconfiguredPaymentProvider implements PaymentProvider {
  async createPayment(params: PaymentOrderParams): Promise<PaymentOrderResult> {
    return {
      orderId: `DLC-PENDING-${Date.now()}`,
      amountInRupees: params.amountInRupees,
      currency: 'INR',
      status: 'NOT_CONFIGURED',
      provider: 'none',
      message: 'Direct online payment gateway is currently awaiting statutory merchant approval. Please submit your support intent as a project pledge.',
    };
  }

  async verifyPayment(_params: PaymentVerificationParams): Promise<PaymentVerificationResult> {
    return {
      verified: false,
      orderId: _params.orderId,
      status: 'FAILED',
      errorMessage: 'Payment verification unavailable: Live merchant provider is not configured.',
    };
  }

  async handleWebhook(_event: PaymentWebhookEvent): Promise<PaymentWebhookResult> {
    return {
      processed: false,
      actionTaken: 'Payment webhook rejected: Merchant provider unconfigured.',
      idempotentIgnored: false,
    };
  }

  async refundPayment(_params: PaymentRefundParams): Promise<{ success: boolean; error?: string }> {
    return {
      success: false,
      error: 'Refunds unavailable: No settled gateway transactions.',
    };
  }

  async getPaymentStatus(orderId: string): Promise<{ status: PaymentStatus; settledAmount?: number }> {
    return {
      status: 'NOT_CONFIGURED',
      settledAmount: 0,
    };
  }
}

// Export singleton instance
export const paymentService: PaymentProvider = new UnconfiguredPaymentProvider();
