export default function LampSvg({ kelvin = 4000, size = 100 }) {
  const color = kelvin <= 3000 ? '#ffcc66'
              : kelvin <= 4500 ? '#ffe899'
              : '#e8f4ff';
  const glow  = kelvin <= 3000 ? '#ffaa00'
              : kelvin <= 4500 ? '#ffd700'
              : '#a0d8ff';

  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`g${kelvin}`} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="1"/>
          <stop offset="100%" stopColor={glow} stopOpacity="0.6"/>
        </radialGradient>
      </defs>
      {/* glow */}
      <ellipse cx="50" cy="52" rx="38" ry="38" fill={glow} opacity="0.15"/>
      {/* bulb */}
      <path d="M28 52 Q28 22 50 22 Q72 22 72 52 Q72 68 60 78 L60 90 L40 90 L40 78 Q28 68 28 52Z"
            fill={`url(#g${kelvin})`} stroke="#ccc" strokeWidth="1.5"/>
      {/* base rings */}
      <rect x="38" y="90" width="24" height="6" rx="2" fill="#bbb"/>
      <rect x="40" y="97" width="20" height="6" rx="2" fill="#aaa"/>
      <rect x="42" y="104" width="16" height="6" rx="2" fill="#999"/>
      {/* filament */}
      <path d="M44 70 Q46 60 50 58 Q54 60 56 70" stroke={glow} strokeWidth="2" fill="none" opacity="0.8"/>
    </svg>
  );
}
