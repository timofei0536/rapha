import * as React from "react";
const SvgArrowLeft = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="arrow--left_svg__a"
      width={24}
      height={24}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha",
      }}
    >
      <path fill="#D9D9D9" d="M24 0v24H0V0z" />
    </mask>
    <g mask="url(#arrow--left_svg__a)">
      <path
        fill="currentColor"
        d="m8.6 12 6-6L16 7.4 11.4 12l4.6 4.6-1.4 1.4z"
      />
    </g>
  </svg>
);
export default SvgArrowLeft;
