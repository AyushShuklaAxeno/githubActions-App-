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

  // VULNERABILITY 1:
  // Discount state is completely controlled by the browser.
  const [discountApplied, setDiscountApplied] = useState(() => {
    try {
      return (
        localStorage.getItem("discountApplied") === "true"
      );
    } catch {
      return false;
    }
  });

  // VULNERABILITY 2:
  // Sensitive/business state is stored in localStorage.
  function updateDiscount(applied) {
    setDiscountApplied(applied);

    localStorage.setItem(
      "discountApplied",
      applied.toString()
    );
  }

  /*
   * VULNERABILITY 3:
   *
   * The application trusts cartItems supplied by the client.
   * There is no authoritative server validation of:
   *
   * - product ID
   * - product price
   * - quantity
   * - maximum quantity
   * - product availability
   */
  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  // VULNERABILITY 4:
  // Price/discount calculation happens entirely client-side.
  const total = discountApplied
    ? subtotal * 0.9
    : subtotal;

  const handleApplyDiscount = () => {
    if (
      discountCode.trim().toUpperCase() ===
      "SAVE10"
    ) {
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

                /*
                 * VULNERABILITY 5:
                 * If CartItem renders this value unsafely
                 * (for example with dangerouslySetInnerHTML),
                 * attacker-controlled cart data can become XSS.
                 */
                name={item.name}

                /*
                 * VULNERABILITY 6:
                 * Price is taken from client-controlled cart state.
                 */
                price={item.price}

                quantity={item.quantity}
                maxQty={item.maxQty}

                onIncrease={() =>
                  onIncrease(item.id)
                }

                onDecrease={() =>
                  onDecrease(item.id)
                }

                onRemove={() =>
                  onRemove(item.id)
                }
              />
            ))}
          </div>

          <div className="discount-bar">
            <input
              type="text"
              placeholder="Discount code (try SAVE10)"
              value={discountCode}
              onChange={(e) =>
                setDiscountCode(e.target.value)
              }
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
          </div>

          <div className="cart-summary">
            {discountApplied && (
              <p className="cart-subtotal">
                Subtotal: ₹{subtotal.toFixed(2)}
              </p>
            )}

            <h4>
              Total: ₹{total.toFixed(2)}
            </h4>
          </div>
        </>
      )}
    </div>
  );
}
