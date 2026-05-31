import React, { useEffect, useRef } from 'react'
import './Cards.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cardData = [
  {
    id: 1,
    image: '/images/one.webp',
    label: 'THE ORIGIN',
    title: 'Arils of Antiquity',
    body: "Grown in sun-drenched orchards where soil and climate conspire to produce the world's most jewel-like fruit. Each pomegranate is hand-selected at the exact peak of ripeness.",
    btn: 'Explore Origins',
  },
  {
    id: 2,
    image: '/images/two.jpeg',
    label: 'THE CRAFT',
    title: 'Cold-Pressed Purity',
    body: "No heat. No shortcuts. Our cold-press process extracts every drop of flavor and antioxidant from the aril — preserving the full spectrum of nature's intention.",
    btn: 'See the Process',
  },
  {
    id: 3,
    image: '/images/three.webp',
    label: 'THE RITUAL',
    title: 'Pour. Sip. Feel Alive.',
    body: 'Make it your morning ritual or your evening indulgence. One glass of Fresh Pomegranate delivers more polyphenols than a full glass of red wine — without compromise.',
    btn: 'Order Now',
  },
]

const Cards = () => {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    // ── SCROLL TRIGGERS FOR CARDS ──────────────────────────────────────────
    // Since Hero no longer pins the page, we can register card animations
    // immediately without needing to wait for pin spacer injection.
    // ─────────────────────────────────────────────────────────────────────

    ScrollTrigger.refresh()

    // Section heading fade-up
    gsap.fromTo(headingRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      }
    )

    // Each card slides in from the left, one by one
    cardRefs.current.forEach((card, i) => {
      gsap.fromTo(card,
        { x: -160, opacity: 0, rotate: -3 },
        {
          x: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.9,
          ease: 'power4.out',
          delay: i * 0.15,
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <section className="cards-section" ref={sectionRef}>
      {/* Background grain texture */}
      <div className="cards-section__grain" />

      {/* Section heading */}
      <div className="cards-section__header" ref={headingRef}>
        <p className="cards-section__eyebrow">Why Pomegranate</p>
        <h2 className="cards-section__title">
          The Fruit.<br />
          <em>The Legend.</em>
        </h2>
        <div className="cards-section__rule" />
      </div>

      {/* Cards grid */}
      <div className="cards-grid">
        {cardData.map((card, i) => (
          <article
            key={card.id}
            className="pom-card"
            ref={el => cardRefs.current[i] = el}
          >
            {/* Image */}
            <div className="pom-card__image-wrap">
              <img
                src={card.image}
                alt={card.title}
                className="pom-card__image"
              />
              <div className="pom-card__image-overlay" />
              <span className="pom-card__number">0{card.id}</span>
            </div>

            {/* Body */}
            <div className="pom-card__body">
              <p className="pom-card__label">{card.label}</p>
              <h3 className="pom-card__title">{card.title}</h3>
              <p className="pom-card__text">{card.body}</p>
              <a href="#" className="pom-card__btn">
                <span>{card.btn}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Decorative corner accent */}
            <div className="pom-card__corner" />
          </article>
        ))}
      </div>
    </section>
  )
}

export default Cards