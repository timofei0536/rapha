import * as React from "react";
const SvgArrow = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 22 22"
    {...props}
  >
    <mask
      id="arrow_svg__a"
      width={22}
      height={22}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha",
      }}
    >
      <path fill="#D9D9D9" d="M22 0H0v22h22z" />
    </mask>
    <g mask="url(#arrow_svg__a)">
      <path
        fill="currentColor"
        d="M14.827 11.917 9.694 17.05 11 18.334 18.334 11 11 3.667 9.694 4.95l5.133 5.134H3.667v1.833z"
      />
    </g>
  </svg>
);
export default SvgArrow;
