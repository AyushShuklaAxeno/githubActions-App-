export default function Navbar({ cartCount }) {
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