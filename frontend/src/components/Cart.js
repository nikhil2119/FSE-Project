import { useState } from "react";
import "../assets/css/Cart.css"; // Importing CSS file
import { FaTrash } from "react-icons/fa";

const Cart = () => {
    // Sample cart items (This will come from Redux or Context API later)
    const [cartItems, setCartItems] = useState([
        { id: 1, name: "Smartphone", price: 499.99, quantity: 1, image: "/assets/smartphone.jpg" },
        { id: 2, name: "Laptop", price: 899.99, quantity: 1, image: "/assets/laptop.jpg" },
        { id: 3, name: "Shoes", price: 59.99, quantity: 1, image: "/assets/shoes.jpg" },
    ]);

    // Increase quantity
    const increaseQuantity = (id) => {
        setCartItems(
            cartItems.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    // Decrease quantity
    const decreaseQuantity = (id) => {
        setCartItems(
            cartItems.map((item) =>
                item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };

    // Remove item from cart
    const removeItem = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
    };

    // Calculate total price
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <div className="cart">
            <h1>Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <p className="cart-empty">Your cart is empty.</p>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-info">
                                    <img src={item.image} alt={item.name} />
                                    <div>
                                        <p className="cart-item-name">{item.name}</p>
                                        <p className="cart-item-price">${item.price.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="cart-actions">
                                    <button className="btn-quantity" onClick={() => decreaseQuantity(item.id)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button className="btn-quantity" onClick={() => increaseQuantity(item.id)}>+</button>
                                </div>

                                <button className="btn-remove" onClick={() => removeItem(item.id)}>
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    <p className="cart-total">Total: ${getTotalPrice()}</p>
                    <button className="btn-checkout">Proceed to Checkout</button>
                </>
            )}
        </div>
    );
};

export default Cart;
