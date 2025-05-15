import { useEffect, useState } from "react";
import $ from "jquery";
import styled, { keyframes } from "styled-components";

interface Props {
  texts: string[];
}

const blink = keyframes`
    50% {
        opacity: 0;
    }
`;
const Div = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Span = styled.span`
  padding-top: 12px;

  &:before {
    content: url(./text-cursor.png);
  }
  animation: ${blink} 1s infinite;
`;
const Span2 = styled.span`
  padding-top: 12px;

  &:before {
    content: url(./text-cursor.png);
  }
`;
const TextChange = ({ texts }: Props) => {
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const el = $("#onChange");

    const typingEffect = (
      element: JQuery<HTMLElement>,
      text: string,
      i = 0
    ) => {
      element.append(text[i]);

      if (text[i + 1] !== undefined) {
        setTimeout(() => typingEffect(element, text, i + 1), 150);
      } else {
        const index = texts.findIndex((t) => t === text);
        setShowCursor(false);
        setTimeout(() => {
          removingEffect(element, texts[index], texts[index].length);
        }, 3000);
      }
    };

    const removingEffect = (
      element: JQuery<HTMLElement>,
      text: string,
      i: number
    ) => {
      element.html(text.slice(0, i));

      if (text[i - 1] !== undefined) {
        setTimeout(() => removingEffect(element, text, i - 1), 150);
      } else {
        let index = texts.findIndex((t) => t === text) + 1;
        if (index === texts.length) index = 0;

        setTimeout(() => {
          setShowCursor(true);
          typingEffect(element, texts[index]);
        }, 1000);
      }
    };
    setTimeout(() => removingEffect(el, texts[0], texts[0].length), 2000);
  }, [texts]);

  return (
    <>
      <Div>
        <span style={{ marginRight: "5px" }} id="onChange">
          Školní projekty
        </span>
      </Div>
    </>
  );
};

export default TextChange;
