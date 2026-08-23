import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentCode: {
    type: String,
    required: true,
    unique: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  orderCode: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  amountReceived: {
    type: Number,
    required: true,
    default: 0.0
  },
  method: {
    type: String,
    required: true,
    default: 'SePay'
  },
  provider: {
    type: String,
    required: true,
    default: 'SePay'
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'PARTIALLY_PAID', 'OVERPAID', 'FAILED', 'EXPIRED'],
    default: 'PENDING',
    required: true
  },
  transactionId: {
    type: String
  },
  transactionContent: {
    type: String
  },
  paidAt: {
    type: Date
  }
}, {
  timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
