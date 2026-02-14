import * as React from "react";
const SvgPhone = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <mask
      id="phone_svg__a"
      width={24}
      height={24}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha",
      }}
    >
      <path fill="#D9D9D9" d="M24 0H0v24h24z" />
    </mask>
    <g mask="url(#phone_svg__a)">
      <path
        fill="currentColor"
        d="M19.95 21q.45 0 .75-.3t.3-.75V15.9a.88.88 0 0 0-.225-.588 1.16 1.16 0 0 0-.575-.362l-3.45-.7a1.6 1.6 0 0 0-.712.063 1.4 1.4 0 0 0-.588.337L13.1 17a16 16 0 0 1-1.8-1.213 18 18 0 0 1-1.625-1.437 18 18 0 0 1-1.513-1.662A12 12 0 0 1 6.975 10.9L9.4 8.45q.2-.2.275-.475T9.7 7.3l-.65-3.5a.9.9 0 0 0-.325-.562A.93.93 0 0 0 8.1 3H4.05q-.45 0-.75.3t-.3.75q0 3.125 1.362 6.175t3.863 5.55 5.55 3.862T19.95 21M6.05 9q-.425-.975-.65-1.975A21 21 0 0 1 5.05 5h2.2l.45 2.35zM15 17.9l1.65-1.65 2.35.5v2.2a10.5 10.5 0 0 1-2.025-.35A15 15 0 0 1 15 17.9"
      />
    </g>
  </svg>
);
export default SvgPhone;
