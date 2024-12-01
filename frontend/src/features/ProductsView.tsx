import { useAppSelector } from "../store/hooks";

function ProductsView() {
  const products = useAppSelector((state) => state.products.items);

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.productId} className="product-card">
          <ul>
            <li>
              <strong>Product ID:</strong> {product.productId}
            </li>
            <li>
              <strong>Product Name:</strong> {product.productName}
            </li>
            <li>
              <strong>Discount:</strong> {product.discount}%
            </li>
            <li>
              <strong>Tax:</strong> {product.tax}%
            </li>
            <li>
              <strong>Price After Tax:</strong>{" "}
              {product.priceAfterTax.toFixed(2)}
            </li>
            <li>
              <strong>Quantity:</strong> {product.quantity}
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ProductsView;
