import Link from 'next/link';

const Cart = ({ cartItems, removeFromCart, slug }) => {
  // Calculate the total price
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // If the cart is empty, show a message
  if (cartItems.length === 0) {
    return <p>Your cart is currently empty.</p>;
  }

  return (
    <div className="cart-container">
      <h3 className="text-lg font-semibold mb-2">Shopping Cart</h3>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id} className="flex justify-between items-center mb-2">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
              <p className="text-gray-500 text-sm">${item.price} each</p>
            </div>
            <div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Total Price */}
      <div className="mt-4">
        <p className="text-lg font-semibold">Total: ${totalPrice.toFixed(2)}</p>
        {/* Checkout button wrapped in Link */}
        <Link href={`/checkout/${slug}`}>
          <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md w-full">
            Checkout (${totalPrice.toFixed(2)})
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
