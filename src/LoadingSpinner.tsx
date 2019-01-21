import { css, jsx, keyframes } from "@emotion/core"
import styled from "@emotion/styled"
import * as React from "react"
const duration = "1.4s"
const offset = 187
const rotator = keyframes`
    0%    { transform: rotate(0deg); }
    100%  { transform: rotate(270deg); }
`
const dash = keyframes` 
 0% { stroke-dashoffset: ${offset}; }
 50% {
   stroke-dashoffset: ${offset / 4};
   transform:rotate(135deg);
 }
 100% {
   stroke-dashoffset: ${offset};
   transform:rotate(450deg);
 }
`

const LoadingSpinner = () => (
    <LoadingSvg width="65px" height="65px" viewBox="0 0 66 66">
        <Circle
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            stroke="#000"
            cx="33"
            cy="33"
            r="30"
        />
    </LoadingSvg>
)

const LoadingSvg = styled.svg`
    animation: ${rotator} ${duration} linear infinite;
`
const Circle = styled.circle`
    stroke-dasharray: ${offset};
    stroke-dashoffset: 0;
    transform-origin: center;
    animation: ${dash} ${duration} ease-in-out infinite;
`

export default LoadingSpinner
