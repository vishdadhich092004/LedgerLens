import { useEffect, useState } from "react";
import { ProductType } from "../types";
import { useAppSelector } from "../app/hooks";

function ProductsView() {
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const { products, loading } = useAppSelector((state) => state.products);
  useEffect(() => {
    setAllProducts(products);
  }, [products]);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div>
      <h1>Products</h1>
      {allProducts.map((product) => (
        <ul>
          <li>Product ID : {product.productId}</li>
          <li>Product Name : {product.productName}</li>
          <li>Product Qty : {product.quantity}</li>
          <li>Unit Price : {product.unitPrice}</li>
          <li>Discount : {product.discount}</li>
          <li>Price After Discount : {product.priceAfterDiscount}</li>
          <li>Tax : {product.tax}</li>
          <li>Price After Tax : {product.priceAfterTax}</li>
        </ul>
      ))}
    </div>
  );
}

export default ProductsView;
