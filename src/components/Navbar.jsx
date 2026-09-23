import { useState } from "react";

export default function Navbar({ cartCount }) {
    const [count, setCount] = useState(0);

    let derivedCount;

    const productCount = () => {
        return "Something I don't know"
    }

    return (
        <nav className="navbar" id="top">
            <a href="#top">🛒 MyStore</a>
            <div>
                <a href="#description">Product Description</a>
                <a href="#products">All Products</a>
                <a href="#cart">Cart ({cartCount})</a>
            </div>
        </nav>
    );
}