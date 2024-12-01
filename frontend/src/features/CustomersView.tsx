import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { updateCustomer } from "../store/slices/customerSlice";

function CustomersView() {
  const dispatch = useAppDispatch();
  const customers = useAppSelector((state) => state.customers.items);

  // Local state to manage individual form data
  const [formStates, setFormStates] = useState<
    Record<string, Partial<(typeof customers)[0]>>
  >(() =>
    customers.reduce(
      (acc, customer) => ({
        ...acc,
        [customer.customerId]: {
          customerName: customer.customerName,
          phoneNumber: customer.phoneNumber,
          totalAmount: customer.totalAmount.toString(),
        },
      }),
      {}
    )
  );

  const handleInputChange = (
    customerId: string,
    name: string,
    value: string
  ) => {
    setFormStates((prevState) => ({
      ...prevState,
      [customerId]: {
        ...prevState[customerId],
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent, customerId: string) => {
    e.preventDefault();
    const updatedData = formStates[customerId];
    dispatch(
      updateCustomer({
        customerId,
        changes: {
          ...updatedData,
          // totalAmount: parseInt(updatedData?.totalAmount || 0),
        },
      })
    );
  };

  return (
    <div>
      <h1>Customers</h1>
      {customers.map((customer) => (
        <form
          key={customer.customerId}
          onSubmit={(e) => handleSubmit(e, customer.customerId)}
        >
          <ul>
            <li>
              <label>Customer Id:</label> {customer.customerId}
            </li>
            <li>
              <label>Customer Name:</label>
              <input
                name="customerName"
                value={formStates[customer.customerId]?.customerName || ""}
                onChange={(e) =>
                  handleInputChange(
                    customer.customerId,
                    "customerName",
                    e.target.value
                  )
                }
              />
            </li>
            <li>
              <label>Phone Number:</label>
              <input
                name="phoneNumber"
                value={formStates[customer.customerId]?.phoneNumber || ""}
                onChange={(e) =>
                  handleInputChange(
                    customer.customerId,
                    "phoneNumber",
                    e.target.value
                  )
                }
              />
            </li>
            <li>
              <label>Total Amount:</label>
              <input
                name="totalAmount"
                value={formStates[customer.customerId]?.totalAmount || ""}
                onChange={(e) =>
                  handleInputChange(
                    customer.customerId,
                    "totalAmount",
                    e.target.value
                  )
                }
              />
            </li>
          </ul>
          <button type="submit">Submit changes</button>
        </form>
      ))}
    </div>
  );
}

export default CustomersView;
