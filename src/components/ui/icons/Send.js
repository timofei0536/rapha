import * as React from "react";
const SvgSend = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 53 53"
    {...props}
  >
    <mask
      id="send_svg__a"
      width={53}
      height={53}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha",
      }}
    >
      <path fill="#D9D9D9" d="M0 0h53v53H0z" />
    </mask>
    <g mask="url(#send_svg__a)">
      <path
        fill="currentColor"
        d="M8.834 40.854V12.146L42.893 26.5zm2.208-3.312L37.21 26.5 11.04 15.458v8.579L21.745 26.5l-10.702 2.463z"
      />
    </g>
  </svg>
);
export default SvgSend;
