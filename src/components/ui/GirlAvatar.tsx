export function GirlAvatar({ size = 72 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Brown hair — back layer */}
      <ellipse cx="36" cy="30" rx="22" ry="24" fill="#6B3A1F" />
      {/* Face */}
      <circle cx="36" cy="36" r="18" fill="#FDBCB4" />
      {/* Hair top + sides over face */}
      <ellipse cx="36" cy="18" rx="18" ry="10" fill="#6B3A1F" />
      {/* Hair pigtails */}
      <ellipse cx="16" cy="30" rx="5" ry="8" fill="#6B3A1F" />
      <ellipse cx="56" cy="30" rx="5" ry="8" fill="#6B3A1F" />
      {/* Eyes */}
      <circle cx="30" cy="35" r="2.5" fill="#3B2204" />
      <circle cx="42" cy="35" r="2.5" fill="#3B2204" />
      {/* Eye shine */}
      <circle cx="31" cy="34" r="0.8" fill="white" />
      <circle cx="43" cy="34" r="0.8" fill="white" />
      {/* Smile */}
      <path
        d="M30 42 Q36 47 42 42"
        stroke="#3B2204"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Cheeks */}
      <circle cx="26" cy="40" r="4" fill="#F4A0A0" opacity="0.5" />
      <circle cx="46" cy="40" r="4" fill="#F4A0A0" opacity="0.5" />
    </svg>
  );
}
