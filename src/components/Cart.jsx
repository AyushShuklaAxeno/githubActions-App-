import { useState } from "react";
import CartItem from "./CartItem";
import EmptyState from "./EmptyState";
import Button from "./Button";

export default function Cart({
    cartItems,
    onIncrease,
    onDecrease,
    onRemove,
}) {
    const [discountCode, setDiscountCode] = useState("");
    const [discountError, setDiscountError] = useState("");
    const [variable, setVariable] = useState(0);

    const [discountApplied, setDiscountApplied] = useState(() => {
        try {
            return localStorage.getItem("discountApplied") === "true";
        } catch {
            return false;
        }
    });

    // SECURITY ISSUE 1:
    // Hard-coded secret-like value for SonarQube testing.
    const paymentApiKey = "sk_test_123456789_SECRET_KEY";

    // SECURITY ISSUE 2:
    // Sensitive information stored in localStorage.
    localStorage.setItem("paymentApiKey", paymentApiKey);

    // SECURITY ISSUE 3:
    // Use of eval() for SonarQube security testing.
    const calculateDiscount = (price) => {
        return eval(`${price} * 0.9`);
    };

    // SECURITY ISSUE 4:
    // Example of unsafe HTML insertion.
    const discountMessage = `<strong>Discount applied:</strong> ${discountCode}`;

    function updateDiscount(applied) {
        setDiscountApplied(applied);
        localStorage.setItem("discountApplied", applied.toString());
    }

    if (cartItems.length === 0 && (discountApplied || discountCode)) {
        updateDiscount(false);
        setDiscountCode("");
        setDiscountError("");
    }

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
    );

    const total = discountApplied
        ? calculateDiscount(subtotal)
        : subtotal;

    const handleApplyDiscount = () => {
        if (discountCode.trim().toUpperCase() === "SAVE10") {
            updateDiscount(true);
            setDiscountError("");
        } else {
            updateDiscount(false);
            setDiscountError("Invalid code");
        }
    };

    return (
        <div className="cart-container">
            <h3>Shopping Cart</h3>

            {cartItems.length === 0 ? (
                <EmptyState message="Your cart is empty" />
            ) : (
                <>
                    <div className="cart-list">
                        {cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                name={item.name}
                                price={item.price}
                                quantity={item.quantity}
                                maxQty={item.maxQty}
                                onIncrease={() => onIncrease(item.id)}
                                onDecrease={() => onDecrease(item.id)}
                                onRemove={() => onRemove(item.id)}
                            />
                        ))}
                    </div>

                    <div className="discount-bar">
                        <input
                            type="text"
                            placeholder="Discount code (try SAVE10)"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                        />

                        <Button
                            label="Apply"
                            onClick={handleApplyDiscount}
                            variant="outline"
                        />

                        {discountError && (
                            <p className="discount-error">
                                {discountError}
                            </p>
                        )}

                        {discountApplied && (
                            <p className="discount-success">
                                10% discount applied!
                            </p>
                        )}

                        {/* SECURITY ISSUE: unsafe HTML rendering */}
                        <div
                            dangerouslySetInnerHTML={{
                                __html: discountMessage,
                            }}
                        />
                    </div>

                    <div className="cart-summary">
                        {discountApplied && (
                            <p className="cart-subtotal">
                                Subtotal: ₹{subtotal.toFixed(2)}
                            </p>
                        )}

                        <h4>Total: ₹{total.toFixed(2)}</h4>
                    </div>
                </>
            )}
        </div>
    );
}