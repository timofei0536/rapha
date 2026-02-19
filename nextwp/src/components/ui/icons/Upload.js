import * as React from "react";
const SvgUpload = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="upload_svg__a"
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
    <g mask="url(#upload_svg__a)">
      <path
        fill="#213B65"
        d="M11 16V7.85l-2.6 2.6L7 9l5-5 5 5-1.4 1.45-2.6-2.6V16zm-5 4q-.824 0-1.412-.587A1.93 1.93 0 0 1 4 18v-3h2v3h12v-3h2v3q0 .824-.587 1.413A1.93 1.93 0 0 1 18 20z"
      />
    </g>
  </svg>
);
export default SvgUpload;
