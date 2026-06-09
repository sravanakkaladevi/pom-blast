import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 100;
const FRAME_PATH = "/motion/";
const FRAME_NAME = "ezgif-frame-";
const FRAME_EXTENSION = ".jpg";

const frameSource = (index) => {
  const number = String(index + 1).padStart(3, "0");
  return `${FRAME_PATH}${FRAME_NAME}${number}${FRAME_EXTENSION}`;
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const Hero = () => {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const copyRef = useRef(null);
  const imagesRef = useRef([]);
  const playbackRef = useRef({
    currentFrame: 0,
    targetFrame: 0,
    renderedFrame: -1,
    animationId: 0,
    resizeId: 0,
  });

  const [loadedFrames, setLoadedFrames] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const sources = useMemo(
    () => Array.from({ length: FRAME_COUNT }, (_, index) => frameSource(index)),
    [],
  );

  useEffect(() => {
    let active = true;
    let trigger;

    const drawFrame = (frameIndex) => {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      const image = imagesRef.current[frameIndex];

      if (!canvas || !context || !image?.complete || !image.naturalWidth) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Draw the full clean source frame while preserving its aspect ratio.
      const sourceX = 0;
      const sourceY = 0;
      const sourceWidth = image.naturalWidth;
      const sourceHeight = image.naturalHeight;
      const sourceRatio = sourceWidth / sourceHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth;
      let drawHeight;

      if (canvasRatio > sourceRatio) {
        drawWidth = canvasWidth;
        drawHeight = drawWidth / sourceRatio;
      } else {
        drawHeight = canvasHeight;
        drawWidth = drawHeight * sourceRatio;
      }

      const drawX = (canvasWidth - drawWidth) / 2;
      const drawY = (canvasHeight - drawHeight) / 2;

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        drawX,
        drawY,
        drawWidth,
        drawHeight,
      );

      playbackRef.current.renderedFrame = frameIndex;
    };

    const sizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      contextRef.current = canvas.getContext("2d", { alpha: false });
      drawFrame(Math.max(playbackRef.current.renderedFrame, 0));
    };

    const renderLoop = () => {
      const playback = playbackRef.current;
      const distance = playback.targetFrame - playback.currentFrame;

      // rAF smoothing keeps the canvas render stable even during fast wheel scrolls.
      playback.currentFrame += distance * 0.22;

      if (Math.abs(distance) < 0.01) {
        playback.currentFrame = playback.targetFrame;
      }

      const nextFrame = clamp(Math.round(playback.currentFrame), 0, FRAME_COUNT - 1);
      if (nextFrame !== playback.renderedFrame) {
        drawFrame(nextFrame);
      }

      playback.animationId = window.requestAnimationFrame(renderLoop);
    };

    const onResize = () => {
      window.cancelAnimationFrame(playbackRef.current.resizeId);
      playbackRef.current.resizeId = window.requestAnimationFrame(() => {
        sizeCanvas();
        ScrollTrigger.refresh();
      });
    };

    const preloadFrames = async () => {
      await Promise.all(
        sources.map(
          (src, index) =>
            new Promise((resolve) => {
              const image = new Image();
              image.decoding = "async";
              image.src = src;

              image.onload = async () => {
                try {
                  await image.decode?.();
                } catch {
                  // The image can still be drawn if decode has already resolved internally.
                }

                if (active) {
                  imagesRef.current[index] = image;
                  setLoadedFrames((count) => count + 1);

                  // Paint the first frame immediately so the hero never starts blank.
                  if (index === 0) {
                    drawFrame(0);
                  }
                }

                resolve();
              };

              image.onerror = () => {
                if (active) setLoadedFrames((count) => count + 1);
                resolve();
              };
            }),
        ),
      );

      if (!active) return;

      setIsLoaded(true);
      drawFrame(0);

      gsap.fromTo(
        copyRef.current,
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out" },
      );
    };

    sizeCanvas();
    window.addEventListener("resize", onResize);
    playbackRef.current.animationId = window.requestAnimationFrame(renderLoop);

    trigger = ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: "+=3400",
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        playbackRef.current.targetFrame = self.progress * (FRAME_COUNT - 1);
      },
    });

    preloadFrames();

    return () => {
      active = false;
      trigger?.kill();
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(playbackRef.current.animationId);
      window.cancelAnimationFrame(playbackRef.current.resizeId);
    };
  }, [sources]);

  const loadingPercent = Math.round((loadedFrames / FRAME_COUNT) * 100);

  return (
    <section className={`hero ${isLoaded ? "hero--loaded" : ""}`} ref={heroRef}>
      <canvas
        className="hero__canvas"
        ref={canvasRef}
        aria-label="Scroll-driven pomegranate reveal animation"
      />

      <div className="hero__lighting" />
      <div className="hero__particles" aria-hidden="true">
        {Array.from({ length: 28 }, (_, index) => (
          <span key={index} style={{ "--i": index }} />
        ))}
      </div>

      <div className="hero__content" ref={copyRef}>
        <p className="hero__label">SCROLL REVEAL</p>
        <h1>
          Pure Pomegranate,
          <span>revealed</span>
          <span>frame by</span>
          <span>frame.</span>
        </h1>
        <p className="hero__description">
          Scroll to explore the fruit transformation and ingredient story.
        </p>
      </div>

      {!isLoaded && (
        <div className="hero__loader" role="status" aria-live="polite">
          <span>Loading reveal</span>
          <strong>{loadingPercent}%</strong>
          <div className="hero__loader-track">
            <div style={{ width: `${loadingPercent}%` }} />
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
