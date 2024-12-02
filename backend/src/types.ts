export interface InvoiceType {
  invoiceNumber: string;
  customer: CustomerType;
  products: ProductType[];
  quantity: number;
  totalAmount: number;
  tax: number;
  priceAfterTax: number;
  date: string;
}

export interface CustomerType {
  customerId: string;
  customerName: string;
  phoneNumber: string;
  totalAmount: number;
}

export interface ProductType {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount: number;
  priceAfterTax: number;
  priceAfterDiscount: number;
}
export interface ResultType {
  success: boolean;
  data?: {
    invoices: InvoiceType[];
    products: ProductType[];
    customers: CustomerType[];
  };
  error?: string;
}
