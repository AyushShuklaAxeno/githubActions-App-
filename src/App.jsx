import { useState } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import { products } from "./data/products";

function App() {
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // single place that keeps state + storage in sync
  function updateCart(newCart) {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  const handleAddToCart = (product) => {
    const itemExists = cartItems.some((item) => item.id === product.id);
    const newCart = itemExists
      ? cartItems.map((item) =>
          item.id === product.id && item.quantity < item.maxQty
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      : [...cartItems, { ...product, quantity: 1 }];
    updateCart(newCart);
  };

  const handleIncrease = (id) => {
    updateCart(
      cartItems.map((item) =>
        item.id === id && item.quantity < item.maxQty
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const handleDecrease = (id) => {
    updateCart(
      cartItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemove = (id) => {
    updateCart(cartItems.filter((item) => item.id !== id));
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const visibleProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "price-low") return a.price - b.price;
      if (sortOrder === "price-high") return b.price - a.price;
      return 0;
    });

  return (
    <>
      <Navbar cartCount={cartCount} />

      <section id="description">
        <h2>Welcome to MyStore</h2>
        <p>
          We sell everyday essentials — electronics, home goods, stationery, and
          accessories, all in one place.
        </p>
      </section>

      <div className="controls-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      <ProductList
        products={visibleProducts}
        onAddToCart={handleAddToCart}
        cartItems={cartItems}
      />

      <div id="cart">
        <Cart
          cartItems={cartItems}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
        />
      </div>
    </>
  );
}

export default App;
