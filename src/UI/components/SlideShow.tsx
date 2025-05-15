import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { ReactNode } from "react";
import styled from "styled-components";

interface Props {
  children: ReactNode;
  slidesToShow: number;
  speed: number;
}

const Div = styled.div`
  max-width: 100%;
  & > div {
    max-width: calc(90% - 10vw);
    display: flex;
    align-items: center;
    margin: 0 auto;
  }
  & > div > .slick-arrow {
    position: relative;
    &::before {
      content: url("./arrow.png");
    }
  }
  & > div > .slick-prev {
    &::before {
      content: url("./arrow.png");
      display: block;
      transform: rotate(180deg);
    }
  }
  & .slick-track div {
    padding-left: 5px;
    padding-right: 5px;
  }
  & .slick-track div: first-child {
    padding-left: 0px;
  }
  & .slick-track div: last-child {
    padding-right: 0px;
  }
`;

const SlideShow = ({ children, slidesToShow, speed }: Props) => {
  const options = {
    dots: true,
    slidesToShow: slidesToShow,
    infinite: true,
    speed: speed,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ]
  };

  return (
    <Div>
      <Slider {...options}>{children}</Slider>
    </Div>
  );
};

export default SlideShow;
