import React, { useEffect, useState, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   LUXURY BLACK & GOLD — TRAVEL JOURNAL
═══════════════════════════════════════════════════════════════ */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@200;300;400;500&display=swap');

  :root {
    --black:   #080705;
    --black2:  #0f0d0a;
    --black3:  #161310;
    --gold:    #c9a84c;
    --gold2:   #e8c97a;
    --gold3:   #a07832;
    --gold-glow: rgba(201,168,76,0.35);
    --gold-dim:  rgba(201,168,76,0.12);
    --cream:   #f5eed8;
    --text:    #e8e0cc;
    --muted:   rgba(232,224,204,0.45);
    --border:  rgba(201,168,76,0.18);
    --border-h:rgba(201,168,76,0.55);
    --card-bg: rgba(15,13,10,0.85);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .bl-root {
    min-height: 100vh;
    background: var(--black);
    color: var(--text);
    font-family: "Jost", sans-serif;
    font-weight: 300;
    overflow-x: hidden;
    cursor: default;
  }

  /* ── GOLD DUST CANVAS ── */
  .bl-dust-canvas {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    opacity: 0.55;
  }

  /* ── NOISE OVERLAY ── */
  .bl-noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 1;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 180px;
  }

  /* ── HERO ── */
  .bl-hero {
    position: relative; z-index: 2;
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
    padding: 6rem 1.5rem 4rem;
    overflow: hidden;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 60% 40% at 80% 100%, rgba(201,168,76,0.04) 0%, transparent 60%),
      var(--black);
  }

  /* Art deco lines */
  .bl-hero::before, .bl-hero::after {
    content: ""; position: absolute; pointer-events: none;
  }
  .bl-hero::before {
    top: 0; left: 50%; transform: translateX(-50%);
    width: 1px; height: 120px;
    background: linear-gradient(to bottom, transparent, var(--gold), transparent);
    animation: lineGrow 2s ease 0.5s both;
  }
  .bl-hero::after {
    bottom: 0; left: 50%; transform: translateX(-50%);
    width: 1px; height: 80px;
    background: linear-gradient(to top, transparent, var(--gold3), transparent);
  }

  @keyframes lineGrow {
    from { transform: translateX(-50%) scaleY(0); opacity: 0; }
    to   { transform: translateX(-50%) scaleY(1); opacity: 1; }
  }

  /* Diagonal accent lines */
  .bl-hero-lines {
    position: absolute; inset: 0; pointer-events: none; overflow: hidden;
  }
  .bl-hero-lines span {
    position: absolute; display: block;
    width: 1px; height: 45%;
    background: linear-gradient(to bottom, transparent, rgba(201,168,76,0.15), transparent);
    animation: riseUp 3s ease both;
  }
  .bl-hero-lines span:nth-child(1) { left: 15%; top: 10%; animation-delay: 0.2s; }
  .bl-hero-lines span:nth-child(2) { left: 28%; top: 20%; animation-delay: 0.4s; height: 30%; }
  .bl-hero-lines span:nth-child(3) { right: 15%; top: 5%;  animation-delay: 0.6s; }
  .bl-hero-lines span:nth-child(4) { right: 30%; top: 25%; animation-delay: 0.8s; height: 25%; }

  @keyframes riseUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .bl-hero-inner { position: relative; z-index: 2; max-width: 820px; }

  /* Ornament */
  .bl-ornament {
    display: flex; align-items: center; justify-content: center;
    gap: 14px; margin-bottom: 2rem;
    animation: fadeSlide 1s ease 0.3s both;
  }
  .bl-ornament-line {
    height: 1px; width: 60px;
    background: linear-gradient(to right, transparent, var(--gold));
  }
  .bl-ornament-line.r { background: linear-gradient(to left, transparent, var(--gold)); }
  .bl-ornament-diamond {
    width: 8px; height: 8px; background: var(--gold);
    transform: rotate(45deg);
    box-shadow: 0 0 12px var(--gold-glow);
  }
  .bl-ornament-text {
    font-size: 0.65rem; font-weight: 500; letter-spacing: 0.35em;
    text-transform: uppercase; color: var(--gold);
  }

  .bl-hero-title {
    font-family: "Playfair Display", serif;
    font-size: clamp(3.5rem, 11vw, 8rem);
    font-weight: 400; line-height: 0.95;
    letter-spacing: -0.01em;
    margin-bottom: 0.3em;
    animation: fadeSlide 1.1s ease 0.5s both;
  }
  .bl-hero-title .line1 { display: block; color: var(--text); }
  .bl-hero-title .line2 {
    display: block; font-style: italic;
    background: linear-gradient(135deg, var(--gold3), var(--gold), var(--gold2), var(--gold));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    background-size: 200% auto;
    animation: fadeSlide 1.1s ease 0.5s both, shimmerText 5s linear 1.5s infinite;
  }
  @keyframes shimmerText {
    0%   { background-position: 0% center; }
    100% { background-position: 200% center; }
  }

  .bl-hero-sub {
    font-size: clamp(0.85rem, 1.5vw, 1rem); font-weight: 300;
    color: var(--muted); line-height: 1.9; letter-spacing: 0.06em;
    margin: 1.6rem auto 2.8rem; max-width: 520px;
    animation: fadeSlide 1.1s ease 0.7s both;
  }

  /* Deco divider */
  .bl-deco {
    display: flex; align-items: center; justify-content: center;
    gap: 10px; margin: 0.5rem 0 2.5rem;
    animation: fadeSlide 1.1s ease 0.9s both;
  }
  .bl-deco-bar { height: 1px; width: 40px; background: var(--border); }
  .bl-deco-gem {
    width: 6px; height: 6px; background: var(--gold3);
    transform: rotate(45deg);
  }

  @keyframes fadeSlide {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* SEARCH */
  .bl-search-wrap {
    position: relative; max-width: 500px; margin: 0 auto;
    animation: fadeSlide 1.1s ease 1s both;
  }
  .bl-search-icon {
    position: absolute; left: 20px; top: 50%;
    transform: translateY(-50%); color: var(--gold3); pointer-events: none;
    font-size: 0.9rem;
  }
  .bl-search {
    width: 100%; padding: 15px 20px 15px 50px;
    border-radius: 0; /* sharp luxury */
    border: 1px solid var(--border);
    border-left: 3px solid var(--gold3);
    background: rgba(201,168,76,0.04);
    color: var(--text); font-family: "Jost", sans-serif;
    font-size: 0.88rem; font-weight: 300; letter-spacing: 0.05em;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
  }
  .bl-search::placeholder { color: var(--muted); }
  .bl-search:focus {
    border-color: var(--gold);
    border-left-color: var(--gold);
    background: rgba(201,168,76,0.07);
    box-shadow: 0 0 0 1px rgba(201,168,76,0.2), 0 8px 32px rgba(0,0,0,0.4);
  }

  /* SCROLL HINT */
  .bl-scroll-hint {
    position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    animation: fadeSlide 1.5s ease 1.5s both;
  }
  .bl-scroll-text { font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--muted); }
  .bl-scroll-track { width: 1px; height: 50px; background: var(--border); position: relative; overflow: hidden; }
  .bl-scroll-track::after {
    content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 40%;
    background: var(--gold);
    animation: scrollDrop 1.8s ease-in-out infinite;
  }
  @keyframes scrollDrop {
    0%   { top: -40%; } 100% { top: 140%; }
  }

  /* CATEGORIES */
  .bl-section-label {
    text-align: center; padding: 4rem 1.5rem 0;
  }
  .bl-section-label-inner {
    display: inline-flex; align-items: center; gap: 14px;
    font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase;
    color: var(--gold);
  }
  .bl-section-label-line { height: 1px; width: 32px; background: var(--gold3); }

  .bl-cats {
    position: relative; z-index: 2;
    padding: 1.5rem 1.5rem 0.5rem;
    display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;
    max-width: 900px; margin: 0 auto;
  }
  .bl-cat-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 22px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted); font-family: "Jost", sans-serif;
    font-size: 0.75rem; font-weight: 400; letter-spacing: 0.1em;
    text-transform: uppercase; cursor: pointer;
    transition: all 0.3s;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  }
  .bl-cat-btn:hover {
    border-color: var(--gold3); color: var(--gold2);
    background: rgba(201,168,76,0.06);
  }
  .bl-cat-btn.active {
    border-color: var(--gold);
    background: linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.08));
    color: var(--gold2);
    box-shadow: 0 0 20px rgba(201,168,76,0.15), inset 0 1px 0 rgba(201,168,76,0.2);
  }

  /* META BAR */
  .bl-meta-bar {
    position: relative; z-index: 2;
    max-width: 1260px; margin: 0 auto;
    padding: 1.5rem 1.5rem 1rem;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
    border-bottom: 1px solid var(--border);
  }
  .bl-count { font-size: 0.75rem; color: var(--muted); letter-spacing: 0.08em; }
  .bl-count strong { color: var(--gold); font-weight: 500; }
  .bl-sort { display: flex; align-items: center; gap: 10px; font-size: 0.72rem; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }
  .bl-sort select {
    background: rgba(201,168,76,0.05); border: 1px solid var(--border);
    color: var(--text); font-family: "Jost", sans-serif; font-size: 0.72rem;
    padding: 7px 12px; outline: none; cursor: pointer; letter-spacing: 0.05em;
  }
  .bl-sort select:focus { border-color: var(--gold3); }

  /* GRID */
  .bl-grid {
    position: relative; z-index: 2;
    max-width: 1260px; margin: 0 auto;
    padding: 2.5rem 1.5rem 6rem;
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;
  }
  @media (max-width: 1100px) { .bl-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 640px)  { .bl-grid { grid-template-columns: 1fr; gap: 1.2rem; } }

  /* FEATURED CARD */
  .bl-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    display: flex; flex-direction: column;
    cursor: pointer; position: relative; overflow: hidden;
    transition: transform 0.45s cubic-bezier(0.22,1,0.36,1),
                box-shadow 0.45s ease,
                border-color 0.3s;
    animation: cardReveal 0.7s ease both;
  }
  .bl-card::before {
    content: ""; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold3), var(--gold), var(--gold3), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .bl-card::after {
    content: ""; position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.4s;
  }
  .bl-card:hover { transform: translateY(-8px); border-color: var(--border-h); box-shadow: 0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(201,168,76,0.08); }
  .bl-card:hover::before { opacity: 1; }
  .bl-card:hover::after  { opacity: 1; }

  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .bl-card.featured {
    grid-column: 1 / -1; flex-direction: row; min-height: 380px;
  }
  .bl-card.featured .bl-card-img { flex: 1.2; }
  .bl-card.featured .bl-card-body { flex: 1; padding: clamp(2rem,4vw,3rem); justify-content: center; }
  .bl-card.featured .bl-card-title { font-size: clamp(1.4rem, 3vw, 2.2rem); }
  @media (max-width: 860px) { .bl-card.featured { flex-direction: column; grid-column: 1; } }

  /* CARD IMAGE */
  .bl-card-img {
    position: relative; height: 240px; overflow: hidden; flex-shrink: 0;
  }
  .bl-card.featured .bl-card-img { height: auto; min-height: 280px; }

  .bl-card-img img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.7s cubic-bezier(0.22,1,0.36,1), filter 0.5s;
    filter: brightness(0.75) saturate(0.8);
  }
  .bl-card:hover .bl-card-img img {
    transform: scale(1.1);
    filter: brightness(0.85) saturate(0.9);
  }

  /* Gold scan line on hover */
  .bl-card-img::after {
    content: ""; position: absolute;
    top: -100%; left: 0; right: 0; height: 40%;
    background: linear-gradient(to bottom, transparent, rgba(201,168,76,0.08), transparent);
    transition: none; pointer-events: none;
  }
  .bl-card:hover .bl-card-img::after {
    animation: scanLine 1.2s ease 0.1s both;
  }
  @keyframes scanLine {
    from { top: -40%; } to { top: 140%; }
  }

  .bl-card-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top,
      rgba(8,7,5,0.85) 0%,
      rgba(8,7,5,0.3) 50%,
      transparent 100%);
    pointer-events: none;
  }

  .bl-card-badge {
    position: absolute; top: 14px; left: 0;
    font-size: 0.6rem; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--gold2); background: var(--black);
    border-top: 1px solid var(--gold3); border-bottom: 1px solid var(--gold3);
    border-right: 1px solid var(--gold3);
    padding: 5px 14px 5px 12px;
    display: flex; align-items: center; gap: 6px;
  }

  .bl-featured-tag {
    position: absolute; top: 14px; right: 14px;
    font-size: 0.58rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--black); background: var(--gold);
    padding: 5px 14px;
    clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);
  }

  /* CARD BODY */
  .bl-card-body { padding: 1.6rem; display: flex; flex-direction: column; flex: 1; }

  .bl-card-meta {
    display: flex; align-items: center; gap: 10px;
    font-size: 0.68rem; color: var(--muted);
    letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 0.85rem; flex-wrap: wrap;
  }
  .bl-card-location { color: var(--gold3); font-weight: 500; display: flex; align-items: center; gap: 4px; }

  .bl-card-title {
    font-family: "Playfair Display", serif;
    font-size: 1.2rem; font-weight: 400; line-height: 1.35;
    color: var(--cream); margin-bottom: 0.75rem;
    transition: color 0.25s;
  }
  .bl-card:hover .bl-card-title { color: var(--gold2); }

  .bl-card-excerpt {
    font-size: 0.82rem; color: var(--muted); line-height: 1.75;
    display: -webkit-box; -webkit-line-clamp: 3;
    -webkit-box-orient: vertical; overflow: hidden;
    margin-bottom: 1.4rem; flex: 1;
  }

  .bl-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 1rem; margin-top: auto;
    border-top: 1px solid rgba(201,168,76,0.12);
  }
  .bl-card-author { display: flex; align-items: center; gap: 10px; }
  .bl-avatar {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, var(--gold3), var(--black3));
    border: 1px solid var(--gold3);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.65rem; font-weight: 600; color: var(--gold2);
    flex-shrink: 0; letter-spacing: 0.05em;
  }
  .bl-author-name { font-size: 0.75rem; font-weight: 400; color: var(--text); letter-spacing: 0.04em; }
  .bl-read-time { font-size: 0.68rem; color: var(--muted); letter-spacing: 0.08em; }

  .bl-read-btn {
    display: inline-flex; align-items: center; gap: 8px;
    margin-top: 1.4rem; padding: 10px 22px;
    border: 1px solid var(--gold3); background: transparent;
    color: var(--gold); font-family: "Jost", sans-serif;
    font-size: 0.72rem; font-weight: 400; letter-spacing: 0.18em; text-transform: uppercase;
    cursor: pointer; transition: all 0.3s; align-self: flex-start;
    clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
    position: relative; overflow: hidden;
  }
  .bl-read-btn::before {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--gold3), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .bl-read-btn:hover { border-color: var(--gold); color: var(--black); background: var(--gold); box-shadow: 0 4px 24px rgba(201,168,76,0.3); }
  .bl-read-btn:hover::before { opacity: 0; }
  .bl-read-btn span { position: relative; z-index: 1; }

  /* SKELETON */
  .bl-skeleton {
    background: var(--card-bg); border: 1px solid var(--border);
    animation: skeletonPulse 2s ease-in-out infinite;
  }
  .bl-skeleton-img { height: 240px; background: rgba(201,168,76,0.05); }
  .bl-skeleton-body { padding: 1.6rem; display: flex; flex-direction: column; gap: 12px; }
  .bl-skeleton-line { height: 10px; background: rgba(201,168,76,0.07); }
  @keyframes skeletonPulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.5; }
  }

  /* EMPTY */
  .bl-empty { grid-column: 1 / -1; text-align: center; padding: 6rem 1rem; }
  .bl-empty-icon { font-size: 3.5rem; opacity: 0.25; margin-bottom: 1rem; }
  .bl-empty-title {
    font-family: "Playfair Display", serif;
    font-size: 1.8rem; font-weight: 400; color: var(--muted); margin-bottom: 0.5rem;
  }
  .bl-empty-sub { font-size: 0.82rem; color: rgba(232,224,204,0.3); letter-spacing: 0.08em; }

  /* LOAD MORE */
  .bl-load-wrap { position: relative; z-index: 2; text-align: center; padding: 0 1.5rem 5rem; }
  .bl-load-btn {
    padding: 14px 48px; border: 1px solid var(--border);
    background: transparent; color: var(--muted); font-family: "Jost", sans-serif;
    font-size: 0.75rem; font-weight: 400; letter-spacing: 0.2em; text-transform: uppercase;
    cursor: pointer; transition: all 0.3s;
    clip-path: polygon(14px 0%, 100% 0%, calc(100% - 14px) 100%, 0% 100%);
  }
  .bl-load-btn:hover { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,0.06); box-shadow: 0 0 30px rgba(201,168,76,0.1); }

  /* MODAL BACKDROP */
  .bl-modal-backdrop {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(4,3,2,0.88); backdrop-filter: blur(10px);
    display: flex; align-items: flex-start; justify-content: center;
    padding: 3rem 1rem 2rem; overflow-y: auto;
    animation: backdropIn 0.3s ease;
  }
  @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }

  .bl-modal {
    background: var(--black2);
    border: 1px solid var(--border);
    width: 100%; max-width: 820px; margin: auto;
    box-shadow: 0 60px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.08);
    animation: modalUp 0.4s cubic-bezier(0.22,1,0.36,1);
    position: relative;
  }
  .bl-modal::before {
    content: ""; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold3), var(--gold), var(--gold2), var(--gold), var(--gold3), transparent);
  }
  @keyframes modalUp {
    from { opacity: 0; transform: translateY(50px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .bl-modal-hero { position: relative; height: 320px; overflow: hidden; }
  .bl-modal-hero img { width: 100%; height: 100%; object-fit: cover; display: block; filter: brightness(0.6) saturate(0.7); }
  .bl-modal-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(8,7,5,0.95) 0%, rgba(8,7,5,0.3) 60%, transparent 100%);
  }

  .bl-modal-close {
    position: absolute; top: 16px; right: 16px;
    width: 38px; height: 38px; border: 1px solid rgba(201,168,76,0.3);
    background: rgba(8,7,5,0.8); backdrop-filter: blur(8px);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 1rem; color: var(--gold); transition: all 0.2s;
  }
  .bl-modal-close:hover { border-color: var(--gold); background: rgba(201,168,76,0.12); }

  .bl-modal-hero-content {
    position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem 2.5rem;
  }
  .bl-modal-cat {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.62rem; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--gold); border: 1px solid rgba(201,168,76,0.3);
    padding: 4px 14px; margin-bottom: 0.75rem;
    background: rgba(8,7,5,0.5); backdrop-filter: blur(6px);
  }
  .bl-modal-title-hero {
    font-family: "Playfair Display", serif;
    font-size: clamp(1.4rem, 3.5vw, 2.2rem); font-weight: 400;
    color: #fff; line-height: 1.2;
    text-shadow: 0 2px 20px rgba(0,0,0,0.5);
  }

  .bl-modal-body { padding: clamp(1.5rem,5vw,2.5rem); }

  .bl-modal-byline {
    display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
    padding-bottom: 1.5rem; margin-bottom: 2rem;
    border-bottom: 1px solid var(--border);
  }
  .bl-modal-author { display: flex; align-items: center; gap: 10px; }
  .bl-modal-author-name { font-size: 0.82rem; font-weight: 400; color: var(--text); letter-spacing: 0.04em; }
  .bl-modal-date { font-size: 0.75rem; color: var(--muted); letter-spacing: 0.06em; }
  .bl-modal-location {
    font-size: 0.7rem; color: var(--gold3); letter-spacing: 0.12em;
    text-transform: uppercase; display: flex; align-items: center; gap: 5px;
  }
  .bl-modal-readtime {
    margin-left: auto; font-size: 0.72rem; color: var(--muted);
    border: 1px solid var(--border); padding: 4px 14px; letter-spacing: 0.06em;
  }

  /* AI Content */
  .bl-ai-loading {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 20px; padding: 4rem 1rem; text-align: center;
  }
  .bl-ai-spinner {
    width: 44px; height: 44px; border-radius: 50%;
    border: 2px solid rgba(201,168,76,0.2); border-top-color: var(--gold);
    animation: spin 0.9s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .bl-ai-loading-text { font-size: 0.8rem; color: var(--muted); letter-spacing: 0.12em; text-transform: uppercase; }

  .bl-ai-badge {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 0.62rem; color: var(--gold3);
    border: 1px solid rgba(201,168,76,0.2);
    padding: 5px 16px; margin-bottom: 2rem; letter-spacing: 0.15em; text-transform: uppercase;
    background: rgba(201,168,76,0.04);
  }

  .bl-ai-text {
    font-size: 0.94rem; color: rgba(232,224,204,0.82); line-height: 1.9; font-weight: 300;
  }
  .bl-ai-text h2 {
    font-family: "Playfair Display", serif; font-size: 1.4rem; font-weight: 400;
    color: var(--cream); margin: 2.2rem 0 0.9rem; padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(201,168,76,0.15);
  }
  .bl-ai-text h3 {
    font-family: "Playfair Display", serif; font-size: 1.1rem; font-weight: 400;
    color: var(--gold2); margin: 1.8rem 0 0.7rem;
  }
  .bl-ai-text p { margin-bottom: 1.2rem; }
  .bl-ai-text ul, .bl-ai-text ol { margin: 0.8rem 0 1.2rem 1.6rem; }
  .bl-ai-text li { margin-bottom: 0.5rem; }
  .bl-ai-text strong { color: var(--cream); font-weight: 500; }
  .bl-ai-text em { color: var(--gold); font-style: italic; }

  .bl-ai-error { text-align: center; padding: 3rem; color: var(--muted); font-size: 0.88rem; letter-spacing: 0.08em; }
  .bl-ai-error-icon { font-size: 2.5rem; opacity: 0.3; margin-bottom: 1rem; }

  /* FOOTER DECO */
  .bl-footer-deco {
    position: relative; z-index: 2; text-align: center;
    padding: 3rem 1.5rem 5rem;
    border-top: 1px solid var(--border);
  }
  .bl-footer-deco-inner {
    display: inline-flex; align-items: center; gap: 16px;
  }
  .bl-footer-line { height: 1px; width: 80px; background: linear-gradient(to right, transparent, var(--gold3)); }
  .bl-footer-line.r { background: linear-gradient(to left, transparent, var(--gold3)); }
  .bl-footer-mark { font-size: 0.6rem; color: var(--gold3); letter-spacing: 0.3em; text-transform: uppercase; }
`;

/* ── DATA ── */
const blogData = [
  {
    id: 1,
    location: "Belize",
    country: "Central America",
    date: "2025-02-15",
    title: "Top 10 Picks for the Best Hotels in Belize",
    excerpt:
      "From beachfront resorts to jungle lodges, our guide covers unforgettable stays across this Central American gem.",
    query: "Belize luxury hotels beach",
    category: "hotels",
    readTime: "8 min",
    author: "Sarah Johnson",
  },
  {
    id: 2,
    location: "Belgrade",
    country: "Serbia",
    date: "2025-02-10",
    title: "The 10 Best Hotels in Belgrade",
    excerpt:
      "Comfort and convenience in the heart of Serbia's vibrant capital — the perfect base for city exploration.",
    query: "Belgrade Serbia architecture",
    category: "hotels",
    readTime: "6 min",
    author: "Michael Chen",
  },
  {
    id: 3,
    location: "Basel",
    country: "Switzerland",
    date: "2025-02-05",
    title: "10 Best Hotels in Basel",
    excerpt:
      "Art museums, the Rhine River, and cultural charm — stay where Basel shines brightest.",
    query: "Basel Switzerland Rhine river",
    category: "hotels",
    readTime: "7 min",
    author: "Emma Schmidt",
  },
  {
    id: 4,
    location: "Kyoto",
    country: "Japan",
    date: "2025-01-28",
    title: "A Complete Guide to Cherry Blossom Season in Kyoto",
    excerpt:
      "Insider tips on the best sakura viewing spots, traditional tea houses, and cultural events during peak season.",
    query: "Kyoto cherry blossom Japan",
    category: "guides",
    readTime: "10 min",
    author: "Yuki Tanaka",
  },
  {
    id: 5,
    location: "Santorini",
    country: "Greece",
    date: "2025-01-20",
    title: "Island Hopping in the Greek Islands: Ultimate Itinerary",
    excerpt:
      "The best route through Santorini, Mykonos, and Crete for a comprehensive Greek islands adventure.",
    query: "Santorini Greece sunset caldera",
    category: "guides",
    readTime: "12 min",
    author: "Maria Papadopoulos",
  },
  {
    id: 6,
    location: "Iceland",
    country: "Iceland",
    date: "2025-01-15",
    title: "Budget Travel Tips for Iceland",
    excerpt:
      "Explore Iceland's waterfalls, glaciers, and geothermal pools without breaking the bank.",
    query: "Iceland northern lights aurora",
    category: "tips",
    readTime: "9 min",
    author: "Lars Andersson",
  },
  {
    id: 7,
    location: "Marrakech",
    country: "Morocco",
    date: "2025-01-10",
    title: "Essential Travel Tips for First-Time Morocco Visitors",
    excerpt:
      "Navigate the souks, enjoy tagines, and dive into authentic Moroccan culture with our expert advice.",
    query: "Marrakech Morocco medina market",
    category: "tips",
    readTime: "11 min",
    author: "Amina Hassan",
  },
  {
    id: 8,
    location: "New Zealand",
    country: "New Zealand",
    date: "2025-01-05",
    title: "Adventure Travel: Skydiving & Bungee Jumping in NZ",
    excerpt:
      "The ultimate thrill-seekers guide to New Zealand's most exhilarating adventure activities.",
    query: "New Zealand adventure mountains",
    category: "adventure",
    readTime: "8 min",
    author: "Jake Wilson",
  },
  {
    id: 9,
    location: "Patagonia",
    country: "Argentina",
    date: "2024-12-28",
    title: "Hiking the W Trek in Torres del Paine",
    excerpt:
      "Trail tips, packing lists, and breathtaking viewpoints for one of South America's most iconic national parks.",
    query: "Patagonia Torres del Paine hiking",
    category: "adventure",
    readTime: "15 min",
    author: "Carlos Rodriguez",
  },
  {
    id: 10,
    location: "Maldives",
    country: "Maldives",
    date: "2024-12-20",
    title: "Overwater Bungalows: The Ultimate Maldives Experience",
    excerpt:
      "Luxurious overwater retreats, crystal-clear lagoons, and private snorkeling reefs await in paradise.",
    query: "Maldives overwater bungalow ocean",
    category: "hotels",
    readTime: "9 min",
    author: "Priya Sharma",
  },
  {
    id: 11,
    location: "Amalfi",
    country: "Italy",
    date: "2024-12-15",
    title: "Driving the Amalfi Coast: A Scenic Road Trip Guide",
    excerpt:
      "Wind through cliffside villages, turquoise bays, and lemon groves on one of the world's most breathtaking drives.",
    query: "Amalfi coast Italy sea cliffs",
    category: "guides",
    readTime: "11 min",
    author: "Giulia Rossi",
  },
  {
    id: 12,
    location: "Petra",
    country: "Jordan",
    date: "2024-12-08",
    title: "Lost City: Exploring Petra Beyond the Treasury",
    excerpt:
      "Venture past the iconic Treasury into Petra's lesser-known canyons, high places, and ancient rock-cut tombs.",
    query: "Petra Jordan ancient ruins desert",
    category: "adventure",
    readTime: "13 min",
    author: "Omar Al-Rashid",
  },
];

const CATEGORY_MAP = {
  all: { name: "All Articles", icon: "◈" },
  hotels: { name: "Hotels", icon: "⬡" },
  guides: { name: "Travel Guides", icon: "◎" },
  tips: { name: "Travel Tips", icon: "◇" },
  adventure: { name: "Adventure", icon: "△" },
};

const FALLBACK_IMGS = {
  "Belize luxury hotels beach":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85&auto=format&fit=crop",
  "Belgrade Serbia architecture":
    "https://images.unsplash.com/photo-1555990793-da11153b2473?w=900&q=85&auto=format&fit=crop",
  "Basel Switzerland Rhine river":
    "https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=900&q=85&auto=format&fit=crop",
  "Kyoto cherry blossom Japan":
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=85&auto=format&fit=crop",
  "Santorini Greece sunset caldera":
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=900&q=85&auto=format&fit=crop",
  "Iceland northern lights aurora":
    "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900&q=85&auto=format&fit=crop",
  "Marrakech Morocco medina market":
    "https://images.unsplash.com/photo-1539020140153-e479b8ce2e40?w=900&q=85&auto=format&fit=crop",
  "New Zealand adventure mountains":
    "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=900&q=85&auto=format&fit=crop",
  "Patagonia Torres del Paine hiking":
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=85&auto=format&fit=crop",
  "Maldives overwater bungalow ocean":
    "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=900&q=85&auto=format&fit=crop",
  "Amalfi coast Italy sea cliffs":
    "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=900&q=85&auto=format&fit=crop",
  "Petra Jordan ancient ruins desert":
    "https://images.unsplash.com/photo-1562979314-bee7453e911c?w=900&q=85&auto=format&fit=crop",
};

/* ── UTILS ── */
const formatDate = (ds) =>
  new Date(ds).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
const initials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
function mdToHtml(md) {
  return md
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]+?<\/li>)/g, "<ul>$1</ul>")
    .replace(/\n\n+/g, "</p><p>")
    .replace(/^(?!<[hul])(.+)$/gm, "<p>$1</p>")
    .replace(/<p><\/p>/g, "");
}

/* ── GOLD DUST CANVAS ── */
function GoldDust() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.15 - 0.1,
      alpha: Math.random() * 0.6 + 0.1,
      flicker: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.flicker += 0.02;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.flicker));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="bl-dust-canvas" />;
}

/* ── ARTICLE MODAL ── */
function ArticleModal({ blog, onClose }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const cat = CATEGORY_MAP[blog.category];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const generate = async () => {
      setLoading(true);
      setError(false);
      setContent("");
      try {
        const prompt = `Write a detailed, engaging travel article about: "${blog.title}"
Location: ${blog.location}, ${blog.country}
Category: ${cat.name}
Context: ${blog.excerpt}

Write a full travel article (600-800 words) with:
- A compelling introduction paragraph
- 3-4 sections with ## headings covering: best time to visit, highlights and must-sees, local culture/food, practical tips
- Specific authentic details about ${blog.location}
- A conclusion with final recommendations

Use a warm, authoritative travel writer tone. Markdown headings and paragraphs only.`;

        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }],
          }),
        });
        const data = await res.json();
        const text = (data.content || []).map((c) => c.text || "").join("");
        if (text) setContent(text);
        else setError(true);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    generate();
  }, [blog.id]);

  return (
    <div
      className="bl-modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bl-modal">
        <div className="bl-modal-hero">
          <img src={blog.img} alt={blog.title} />
          <div className="bl-modal-hero-overlay" />
          <button className="bl-modal-close" onClick={onClose}>
            ✕
          </button>
          <div className="bl-modal-hero-content">
            <div className="bl-modal-cat">
              {cat.icon} {cat.name}
            </div>
            <h1 className="bl-modal-title-hero">{blog.title}</h1>
          </div>
        </div>

        <div className="bl-modal-body">
          <div className="bl-modal-byline">
            <div className="bl-modal-author">
              <div className="bl-avatar">{initials(blog.author)}</div>
              <span className="bl-modal-author-name">{blog.author}</span>
            </div>
            <span className="bl-modal-date">{formatDate(blog.date)}</span>
            <span className="bl-modal-location">
              ◎ {blog.location}, {blog.country}
            </span>
            <span className="bl-modal-readtime">⏱ {blog.readTime} read</span>
          </div>

          {loading ? (
            <div className="bl-ai-loading">
              <div className="bl-ai-spinner" />
              <div className="bl-ai-loading-text">
                Crafting article · {blog.location}
              </div>
            </div>
          ) : error ? (
            <div className="bl-ai-error">
              <div className="bl-ai-error-icon">✦</div>
              <p>Could not generate content. Please try again.</p>
            </div>
          ) : (
            <>
              <div className="bl-ai-badge">
                ✦ AI-Generated · {blog.location}, {blog.country}
              </div>
              <div
                className="bl-ai-text"
                dangerouslySetInnerHTML={{ __html: mdToHtml(content) }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════ */
export default function Blogs() {
  const ACCESS_KEY =
    typeof import.meta !== "undefined"
      ? import.meta.env?.VITE_UNSPLASH_KEY
      : undefined;

  const [blogs, setBlogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [selectedCat, setSelectedCat] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [openBlog, setOpenBlog] = useState(null);

  /* Load images */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const enriched = await Promise.all(
        blogData.map(async (blog) => {
          if (ACCESS_KEY) {
            try {
              const res = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(blog.query)}&per_page=1&orientation=landscape`,
                { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } },
              );
              const data = await res.json();
              const img = data.results?.[0]?.urls?.regular;
              if (img) return { ...blog, img };
            } catch {}
          }
          return {
            ...blog,
            img:
              FALLBACK_IMGS[blog.query] ||
              "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=85&auto=format&fit=crop",
          };
        }),
      );
      setBlogs(enriched);
      setLoading(false);
    };
    load();
  }, [ACCESS_KEY]);

  /* Filter / sort */
  useEffect(() => {
    let list = [...blogs];
    if (selectedCat !== "all")
      list = list.filter((b) => b.category === selectedCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.location.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q),
      );
    }
    if (sortBy === "newest")
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortBy === "oldest")
      list.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sortBy === "read")
      list.sort((a, b) => parseInt(b.readTime) - parseInt(a.readTime));
    setFiltered(list);
    setVisibleCount(9);
  }, [selectedCat, search, sortBy, blogs]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="bl-root">
      <style>{css}</style>
      <GoldDust />
      <div className="bl-noise" />

      {/* ── HERO ── */}
      <section className="bl-hero">
        <div className="bl-hero-lines">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="bl-hero-inner">
          <div className="bl-ornament">
            <span className="bl-ornament-line" />
            <span className="bl-ornament-diamond" />
            <span className="bl-ornament-text">Travel Stories & Insights</span>
            <span className="bl-ornament-diamond" />
            <span className="bl-ornament-line r" />
          </div>

          <h1 className="bl-hero-title">
            <span className="line1">Travel</span>
            <span className="line2">Journal</span>
          </h1>

          <div className="bl-deco">
            <span className="bl-deco-bar" />
            <span className="bl-deco-gem" />
            <span className="bl-deco-bar" />
          </div>

          <p className="bl-hero-sub">
            Expert guides, insider stories, and curated discoveries
            <br />
            from the world's most extraordinary destinations.
          </p>

          <div className="bl-search-wrap">
            <span className="bl-search-icon">✦</span>
            <input
              className="bl-search"
              type="text"
              placeholder="Search destinations, stories, authors…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bl-scroll-hint">
          <span className="bl-scroll-text">Scroll</span>
          <div className="bl-scroll-track" />
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <div className="bl-section-label">
        <span className="bl-section-label-inner">
          <span className="bl-section-label-line" />
          Curated Collections
          <span className="bl-section-label-line" />
        </span>
      </div>

      <div className="bl-cats">
        {Object.entries(CATEGORY_MAP).map(([id, { name, icon }]) => (
          <button
            key={id}
            className={`bl-cat-btn ${selectedCat === id ? "active" : ""}`}
            onClick={() => setSelectedCat(id)}
          >
            <span>{icon}</span> {name}
          </button>
        ))}
      </div>

      {/* ── META BAR ── */}
      <div className="bl-meta-bar">
        <p className="bl-count">
          {loading ? (
            "Loading…"
          ) : (
            <>
              <strong>{filtered.length}</strong>{" "}
              {filtered.length === 1 ? "article" : "articles"} found
            </>
          )}
        </p>
        <div className="bl-sort">
          Sort by:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="read">Longest read</option>
          </select>
        </div>
      </div>

      {/* ── GRID ── */}
      <div className="bl-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bl-skeleton"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="bl-skeleton-img" />
              <div className="bl-skeleton-body">
                <div className="bl-skeleton-line" style={{ width: "35%" }} />
                <div className="bl-skeleton-line" style={{ width: "85%" }} />
                <div className="bl-skeleton-line" style={{ width: "70%" }} />
                <div
                  className="bl-skeleton-line"
                  style={{ width: "50%", marginTop: 8 }}
                />
              </div>
            </div>
          ))
        ) : visible.length === 0 ? (
          <div className="bl-empty">
            <div className="bl-empty-icon">◈</div>
            <div className="bl-empty-title">No Articles Found</div>
            <div className="bl-empty-sub">
              Try a different category or clear your search
            </div>
          </div>
        ) : (
          visible.map((blog, idx) => {
            const cat = CATEGORY_MAP[blog.category];
            const isFeatured = idx === 0 && selectedCat === "all" && !search;
            return (
              <article
                key={blog.id}
                className={`bl-card ${isFeatured ? "featured" : ""}`}
                style={{ animationDelay: `${(idx % 9) * 0.08}s` }}
                onClick={() => setOpenBlog(blog)}
              >
                <div className="bl-card-img">
                  <img src={blog.img} alt={blog.title} loading="lazy" />
                  <div className="bl-card-img-overlay" />
                  <span className="bl-card-badge">
                    <span>{cat.icon}</span> {cat.name}
                  </span>
                  {isFeatured && (
                    <span className="bl-featured-tag">✦ Featured</span>
                  )}
                </div>

                <div className="bl-card-body">
                  <div className="bl-card-meta">
                    <span className="bl-card-location">◎ {blog.location}</span>
                    <span>·</span>
                    <span>{formatDate(blog.date)}</span>
                  </div>
                  <h2 className="bl-card-title">{blog.title}</h2>
                  <p className="bl-card-excerpt">{blog.excerpt}</p>
                  <div className="bl-card-footer">
                    <div className="bl-card-author">
                      <div className="bl-avatar">{initials(blog.author)}</div>
                      <span className="bl-author-name">{blog.author}</span>
                    </div>
                    <span className="bl-read-time">⏱ {blog.readTime}</span>
                  </div>
                  <button
                    className="bl-read-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenBlog(blog);
                    }}
                  >
                    <span>Read Article</span> <span>→</span>
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* LOAD MORE */}
      {!loading && visibleCount < filtered.length && (
        <div className="bl-load-wrap">
          <button
            className="bl-load-btn"
            onClick={() => setVisibleCount((v) => v + 6)}
          >
            Load More Articles
          </button>
        </div>
      )}

      {/* FOOTER DECO */}
      <div className="bl-footer-deco">
        <div className="bl-footer-deco-inner">
          <span className="bl-footer-line" />
          <span className="bl-footer-mark">
            Travel Journal · {new Date().getFullYear()}
          </span>
          <span className="bl-footer-line r" />
        </div>
      </div>

      {/* MODAL */}
      {openBlog && (
        <ArticleModal blog={openBlog} onClose={() => setOpenBlog(null)} />
      )}
    </div>
  );
}
