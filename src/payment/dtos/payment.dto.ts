export class PaymentResponseDto {
  orderId: number;
  items: {
    productId: number;
    quantity: number;
    title: string;
    price: number;
  }[];
  buyerName: string;
  buyerEmail: string;
  buyerCpf: string;
  paymentMethod: string;
  checkoutUrl: string;
}
