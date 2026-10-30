/** Decorative animated backdrop: drifting aurora blobs, a dotted flight arc and a moving plane. */
export default function HeroSky() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="aurora aurora-c" />
      <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:26px_26px]" />
      <svg
        className="absolute left-1/2 top-6 hidden w-[1100px] max-w-none -translate-x-1/2 md:block"
        viewBox="0 0 1100 220"
        fill="none"
      >
        {/* Runways: take-off strip on the left, landing strip on the right */}
        <g stroke="white" strokeLinecap="round">
          <line x1="20" y1="195" x2="160" y2="195" strokeOpacity="0.35" strokeWidth="2" />
          <line x1="20" y1="195" x2="160" y2="195" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="10 8" />
          <line x1="940" y1="195" x2="1080" y2="195" strokeOpacity="0.35" strokeWidth="2" />
          <line x1="940" y1="195" x2="1080" y2="195" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="10 8" />
        </g>
        <path
          id="hero-arc"
          d="M30 195 L150 195 C 330 195, 340 25, 550 25 C 760 25, 770 195, 950 195 L1070 195"
          stroke="white"
          strokeOpacity="0.18"
          strokeWidth="1.5"
          strokeDasharray="2 9"
          strokeLinecap="round"
        />
        <g>
          {/* Top-down plane silhouette, nose pointing +x so rotate="auto" banks it along the arc */}
          <path
            d="M12 0 L9 -1.6 L3 -1.6 L-3 -11 L-6 -11 L-3.5 -1.6 L-8 -1.6 L-10 -5 L-12 -5 L-11 -1 L-11 1 L-12 5 L-10 5 L-8 1.6 L-3.5 1.6 L-6 11 L-3 11 L3 1.6 L9 1.6 Z"
            fill="#f8b94f"
            transform="scale(1.5)"
          >
            <animateMotion dur="20s" repeatCount="indefinite" rotate="auto">
              <mpath href="#hero-arc" />
            </animateMotion>
          </path>
        </g>
      </svg>
    </div>
  );
}
