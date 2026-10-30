/** Decorative animated backdrop: drifting aurora blobs, a dotted flight arc and a moving plane. */
export default function HeroSky() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="aurora aurora-c" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:26px_26px]" />
      <svg
        className="absolute left-1/2 top-6 hidden w-[1100px] max-w-none -translate-x-1/2 opacity-40 md:block"
        viewBox="0 0 1100 220"
        fill="none"
      >
        <path
          id="hero-arc"
          d="M40 190 C 320 -30, 780 -30, 1060 170"
          stroke="white"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          strokeDasharray="2 9"
          strokeLinecap="round"
        />
        <g>
          <path
            d="M0 -7 L14 0 L0 7 L3 0 Z"
            fill="#f8b94f"
            transform="scale(1.6)"
          >
            <animateMotion dur="14s" repeatCount="indefinite" rotate="auto">
              <mpath href="#hero-arc" />
            </animateMotion>
          </path>
        </g>
      </svg>
    </div>
  );
}
