import React from "react";

const Header = ({ cartCount }) => (
  <header className="site-header">
    <a className="site-header__brand" href="#top" aria-label="Pom Blast home">
      <span />
      Pom Blast
    </a>

    <nav className="site-header__nav" aria-label="Primary navigation">
      <a href="#inside">Inside</a>
      <a href="#products">Products</a>
      <a href="#journey">Journey</a>
      <a href="#store">Store</a>
    </nav>

    <a className="site-header__cart" href="#store">
      Cart <strong>{cartCount}</strong>
    </a>
  </header>
);

export default Header;
