import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { faqs, fruitLayers, journey, products, reviews, stats } from "../data/pomData";

gsap.registerPlugin(ScrollTrigger);

const SectionTitle = ({ eyebrow, title, body }) => (
  <div className="section-title reveal-item">
    <p>{eyebrow}</p>
    <h2>{title}</h2>
    {body && <span>{body}</span>}
  </div>
);

export const InsideFruit = () => (
  <section className="story-section inside-fruit" id="inside">
    <SectionTitle
      eyebrow="Inside The Fruit"
      title="Every layer earns its place."
      body="Hover the callouts to explore the protective shell, membrane, and fresh arils."
    />

    <div className="inside-fruit__stage reveal-item">
      <img src="/motion/ezgif-frame-040.jpg" alt="Exploded pomegranate reveal" loading="lazy" />
      <div className="inside-fruit__halo" />
      {fruitLayers.map((layer) => (
        <motion.article
          className="layer-pin"
          key={layer.name}
          style={{ left: layer.x, top: layer.y }}
          whileHover={{ scale: 1.08, y: -8 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <b>{layer.name}</b>
          <small>{layer.detail}</small>
        </motion.article>
      ))}
    </div>
  </section>
);

export const WhyPomegranate = () => (
  <section className="story-section stats-section">
    <SectionTitle
      eyebrow="Why Pomegranate"
      title="Freshness with measurable depth."
      body="Premium nutrition storytelling without inflated health claims."
    />

    <div className="stats-grid">
      {stats.map((item) => (
        <motion.article
          className="stat-card reveal-item"
          key={item.label}
          whileHover={{ y: -10, borderColor: "rgba(255, 77, 96, 0.55)" }}
        >
          <strong>{item.value}</strong>
          <h3>{item.label}</h3>
          <p>{item.detail}</p>
        </motion.article>
      ))}
    </div>
  </section>
);

export const ProductShowcase = () => (
  <section className="story-section product-showcase" id="products">
    <SectionTitle
      eyebrow="Product Showcase"
      title="Four ways to bring the blast home."
      body="Glass-like premium cards with real product actions."
    />

    <div className="product-grid">
      {products.map((product) => (
        <motion.article
          className="product-card reveal-item"
          key={product.name}
          whileHover={{ y: -12, rotateX: 3, rotateY: -3 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
        >
          <div className="product-card__image">
            <img src={product.image} alt={product.name} loading="lazy" />
          </div>
          <p>{product.variant}</p>
          <h3>{product.name}</h3>
          <span>{product.description}</span>
          <footer>
            <strong>${product.price}</strong>
            <a href="#store">Shop</a>
          </footer>
        </motion.article>
      ))}
    </div>
  </section>
);

export const FruitBreakdown = () => (
  <section className="story-section fruit-breakdown">
    <div className="fruit-breakdown__visual reveal-item">
      <motion.img
        src="/motion/ezgif-frame-090.jpg"
        alt="Pomegranate internal layer reveal"
        loading="lazy"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />
    </div>
    <div className="fruit-breakdown__copy reveal-item">
      <p>Interactive Fruit Breakdown</p>
      <h2>Shell, membrane, arils, and juice in one continuous story.</h2>
      <span>
        The visual language shifts from whole fruit to internal structure, using
        scroll depth, glow, and soft rotation to keep the product dominant.
      </span>
    </div>
  </section>
);

export const Journey = () => (
  <section className="story-section journey-section" id="journey">
    <SectionTitle
      eyebrow="Farm To Bottle"
      title="A premium cold-chain journey."
      body="From harvest to doorstep, each step is designed for freshness and trust."
    />

    <div className="journey-line">
      {journey.map(([name, detail], index) => (
        <article className="journey-step reveal-item" key={name}>
          <b>{String(index + 1).padStart(2, "0")}</b>
          <h3>{name}</h3>
          <p>{detail}</p>
        </article>
      ))}
    </div>
  </section>
);

export const Reviews = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % reviews.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="story-section review-section">
      <SectionTitle eyebrow="Customer Reviews" title="A ritual people remember." />
      <div className="review-stage reveal-item">
        <AnimatePresence mode="wait">
          <motion.article
            key={reviews[active].name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.45 }}
          >
            <p>"{reviews[active].quote}"</p>
            <strong>{reviews[active].name}</strong>
            <span>{reviews[active].location}</span>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
};

export const Store = ({ onCartChange }) => {
  const [selected, setSelected] = useState(products[0]);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);

  const total = useMemo(() => selected.price * quantity, [selected, quantity]);

  const addToCart = () => {
    onCartChange(quantity);
  };

  return (
    <section className="story-section store-section" id="store">
      <SectionTitle
        eyebrow="Ecommerce Store"
        title="Build your Pom Blast box."
        body="Choose a variant, set quantity, wishlist, add to cart, or go straight to checkout."
      />

      <div className="store-shell reveal-item">
        <div className="store-media">
          <img src={selected.image} alt={selected.name} />
        </div>

        <div className="store-panel">
          <p>{selected.variant}</p>
          <h3>{selected.name}</h3>
          <span>{selected.description}</span>

          <div className="variant-list" aria-label="Product variants">
            {products.map((product) => (
              <button
                className={product.name === selected.name ? "is-active" : ""}
                key={product.name}
                onClick={() => setSelected(product)}
              >
                {product.name}
              </button>
            ))}
          </div>

          <div className="store-controls">
            <div className="quantity-control">
              <button onClick={() => setQuantity((value) => Math.max(1, value - 1))}>-</button>
              <strong>{quantity}</strong>
              <button onClick={() => setQuantity((value) => value + 1)}>+</button>
            </div>
            <button className={wishlist ? "wishlist is-active" : "wishlist"} onClick={() => setWishlist((value) => !value)}>
              Wishlist
            </button>
          </div>

          <div className="checkout-row">
            <strong>${total}</strong>
            <button onClick={addToCart}>Add to Cart</button>
            <button className="buy-now" onClick={addToCart}>Buy Now</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const FAQ = () => {
  const [open, setOpen] = useState(0);

  return (
    <section className="story-section faq-section">
      <SectionTitle eyebrow="FAQ" title="Simple answers before checkout." />
      <div className="faq-list reveal-item">
        {faqs.map(([question, answer], index) => (
          <article className={open === index ? "faq-item is-open" : "faq-item"} key={question}>
            <button onClick={() => setOpen(open === index ? -1 : index)}>
              {question}
              <span>{open === index ? "-" : "+"}</span>
            </button>
            <AnimatePresence>
              {open === index && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  {answer}
                </motion.p>
              )}
            </AnimatePresence>
          </article>
        ))}
      </div>
    </section>
  );
};

export const Footer = () => (
  <footer className="footer-section">
    <div>
      <p>Pom Blast</p>
      <h2>Fresh pomegranate, elevated for modern rituals.</h2>
    </div>
    <form>
      <label htmlFor="newsletter">Newsletter</label>
      <div>
        <input id="newsletter" type="email" placeholder="you@example.com" />
        <button type="submit">Join</button>
      </div>
    </form>
    <nav aria-label="Footer links">
      <a href="#inside">Instagram</a>
      <a href="#products">YouTube</a>
      <a href="mailto:hello@pomblast.example">Contact</a>
    </nav>
  </footer>
);

export const useRevealAnimations = () => {
  useEffect(() => {
    const items = gsap.utils.toArray(".reveal-item");

    items.forEach((item) => {
      gsap.fromTo(
        item,
        { autoAlpha: 0, y: 48 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 84%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (!trigger.vars.pin) trigger.kill();
      });
    };
  }, []);
};
