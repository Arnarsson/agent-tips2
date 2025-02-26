export function AgentTipsLogo(props: any) {
  return (
    <svg
      fill="none"
      viewBox="0 0 260 260"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Simple agent icon with a tip/hint symbol */}
      <path
        d="M130 20c-60.75 0-110 49.25-110 110s49.25 110 110 110 110-49.25 110-110S190.75 20 130 20zm0 20c49.71 0 90 40.29 90 90s-40.29 90-90 90-90-40.29-90-90 40.29-90 90-90z"
        fill="currentColor"
      />
      <path
        d="M130 80c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 60c-16.57 0-30 13.43-30 30v20h60v-20c0-16.57-13.43-30-30-30z"
        fill="currentColor"
      />
      <path
        d="M190 120l30 30-30 30"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
} 