import React from "react";
import styled from "styled-components";

interface Props {
  onClick: React.MouseEventHandler<HTMLAnchorElement>;
}

const CloseButton: React.FC<Props> = (props) => {
  const crossIcon = (
    <svg
      version="1.1"
      id="icons"
      x="0px"
      y="0px"
      width="33.841px"
      height="33.669px"
      viewBox="0 0 33.841 33.669"
      enableBackground="new 0 0 33.841 33.669"
    >
      <line
        fill="none"
        stroke="#50BC93"
        strokeWidth="4"
        strokeLinecap="round"
        strokeMiterlimit="10"
        x1="2"
        y1="2"
        x2="31.841"
        y2="31.669"
      />

      <line
        fill="none"
        stroke="#50BC93"
        strokeWidth="4"
        strokeLinecap="round"
        strokeMiterlimit="10"
        x1="31.841"
        y1="2"
        x2="2"
        y2="31.669"
      />
    </svg>
  );
  return <a onClick={props.onClick}>{crossIcon}</a>;
};

const A = styled.a`
  position: absolute;
`;

export default CloseButton;
