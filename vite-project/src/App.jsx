import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import {
  FAQ,
  Footer,
  FruitBreakdown,
  InsideFruit,
  Journey,
  ProductShowcase,
  Reviews,
  Store,
  WhyPomegranate,
  useRevealAnimations,
} from "./components/StorySections";

function App() {
  const [cartCount, setCartCount] = useState(0);

  useRevealAnimations();

  return (
    <div className="site-shell" id="top">
      <Header cartCount={cartCount} />
      <main>
        <Hero />
        <InsideFruit />
        <WhyPomegranate />
        <ProductShowcase />
        <FruitBreakdown />
        <Journey />
        <Reviews />
        <Store onCartChange={(quantity) => setCartCount((count) => count + quantity)} />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

export default App;
