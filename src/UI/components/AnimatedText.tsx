import { useInView } from "react-intersection-observer";
import { ReactNode, useEffect, useRef } from "react";
import styled from "styled-components";
import usePath from "../../hooks/usePath";

interface Props {
  width: string;
  height: string;
  viewBox: string;
  fileName: string;
  children?: ReactNode;
  duration: number;
  stroke: string;
  isPositionAbsolute: boolean;
  top?: string;
  left?: string;
}

const Div = styled.div`
  width: fit-content;
`;

const AnimatedText = ({
  width,
  height,
  viewBox,
  fileName,
  children,
  duration,
  stroke,
  top,
  left,
  isPositionAbsolute,
}: Props) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const { data, error } = usePath(fileName);
  
  useEffect(() => {
    if (svgRef.current !== null && pathRef.current !== null) {
      svgRef.current.style.strokeDasharray = pathRef.current
        .getTotalLength()
        .toString();

      svgRef.current.animate(
        [
          {
            strokeDashoffset: pathRef.current.getTotalLength(),
          },
          {
            strokeDashoffset: 0,
          },
        ],
        {
          duration: duration,
          easing: "linear",
        }
      );
    }
  }, [inView, data, duration, fileName]);

  if (error) throw error;

  return (
    <Div
      className={isPositionAbsolute ? `position-absolute` : undefined}
      style={{ left: left, top: top }}
      ref={ref}
    >
      {inView ? (
        <svg
          ref={svgRef}
          width={width}
          height={height}
          viewBox={viewBox}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={data}
            ref={pathRef}
            stroke={stroke}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <defs>{children}</defs>
        </svg>
      ) : null}
    </Div>
  );
};

export default AnimatedText;
