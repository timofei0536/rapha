import * as React from "react";
const SvgSelect = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="select_svg__a"
      width={24}
      height={24}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha",
      }}
    >
      <path fill="#D9D9D9" d="M0 0h24v24H0z" />
    </mask>
    <g mask="url(#select_svg__a)">
      <path fill="#213B65" d="m12 15.4-6-6L7.4 8l4.6 4.6L16.6 8 18 9.4z" />
    </g>
  </svg>
);
export default SvgSelect;
