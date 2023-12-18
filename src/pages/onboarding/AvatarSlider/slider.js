import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "./slider.css";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";


const CustomPrevArrow = (props) => (
  <div className="custom-arrow custom-prev" onClick={props.onClick}>
    <FaChevronLeft color='#00808b' />
  </div>
);

// Custom arrow component
const CustomNextArrow = (props) => (
  <div className="custom-arrow custom-next" onClick={props.onClick}>
    <FaChevronRight color='#00808b' />
  </div>
);

const SimpleSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    centeeMode: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
      <div className="custom-slide custom-slide1">
        <img src={"https://clipartspub.com/images/people-clipart-symbol-7.jpg"} width={"100%"} maxHeight={"5em"} alt="image" />
      </div>
      <div className="custom-slide custom-slide1">
        <img src={"https://clipartspub.com/images/people-clipart-symbol-7.jpg"} width={"100%"} maxHeight={"5em"} alt="image" />
      </div>
      <div className="custom-slide custom-slide1">
        <img src={"https://clipartspub.com/images/people-clipart-symbol-7.jpg"} width={"100%"} maxHeight={"5em"} alt="image" />
      </div>
      <div className="custom-slide custom-slide1">
        <img src={"https://clipartspub.com/images/people-clipart-symbol-7.jpg"} width={"100%"} maxHeight={"5em"} alt="image" />
      </div>
      <div className="custom-slide custom-slide1">
        <img src={"https://clipartspub.com/images/people-clipart-symbol-7.jpg"} width={"100%"} maxHeight={"5em"} alt="image" />
      </div>
      <div className="custom-slide custom-slide1">
        <img src={"https://clipartspub.com/images/people-clipart-symbol-7.jpg"} width={"100%"} maxHeight={"5em"} alt="image" />
      </div>
      <div className="custom-slide custom-slide1">
        <img src={"https://clipartspub.com/images/people-clipart-symbol-7.jpg"} width={"100%"} maxHeight={"5em"} alt="image" />
      </div>
      <div className="custom-slide custom-slide1">
        <img src={"https://clipartspub.com/images/people-clipart-symbol-7.jpg"} width={"100%"} maxHeight={"5em"} alt="image" />
      </div>
    </Slider>
  );
};

export default SimpleSlider;
