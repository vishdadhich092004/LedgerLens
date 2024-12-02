import { useEffect, useState } from "react";
import { CustomerType } from "../types";
import { useAppSelector } from "../app/hooks";

function CustomersView() {
  const [allCustomers, setAllCustomers] = useState<CustomerType[]>([]);
  const { customers, loading } = useAppSelector((state) => state.customers);

  useEffect(() => {
    setAllCustomers(customers);
  }, [customers]);
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div>
      <h1>Customers</h1>
      {allCustomers.map((customer) => (
        <ul>
          <li>Customer ID : {customer.customerId}</li>
          <li>Customer Name : {customer.customerName}</li>
          <li>Phone NUmber : {customer.phoneNumber}</li>
          <li>Total Amount : {customer.totalAmount}</li>
        </ul>
      ))}
    </div>
  );
}

export default CustomersView;
