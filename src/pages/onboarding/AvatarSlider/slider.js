import React, { useContext, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "./slider.css";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import GlobalContext from '../../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';

import Logo1 from "../../../assets/Avatar/cryptoCurrency/c1.jpg";
import Logo2 from "../../../assets/Avatar/cryptoCurrency/c2.jpg";
import Logo3 from "../../../assets/Avatar/cryptoCurrency/c3.jpg";
import Logo4 from "../../../assets/Avatar/Meditation/Art_13-1.jpg";
import Logo5 from "../../../assets/Avatar/Meditation/Art_13.jpg";
import Logo6 from "../../../assets/Avatar/Meditation/Group.jpg";
import Logo7 from "../../../assets/Avatar/Commodities/Art_4-1.jpg";
import Logo8 from "../../../assets/Avatar/Commodities/Art_4.jpg";
import Logo9 from "../../../assets/Avatar/Commodities/Group.jpg";
import Logo10 from "../../../assets/Avatar/Fitness/Group-1.jpg";
import Logo11 from "../../../assets/Avatar/Fitness/Group-2.jpg";
import Logo12 from "../../../assets/Avatar/Fitness/Group.jpg";
import Logo13 from "../../../assets/Avatar/Art/Art_6-1.jpg";
import Logo14 from "../../../assets/Avatar/Art/Art_6.jpg";
import Logo15 from "../../../assets/Avatar/Art/Group.jpg";
import Logo16 from "../../../assets/Avatar/Cars/Art8.jpg";
import Logo17 from "../../../assets/Avatar/Cars/Group.jpg";
import Logo18 from "../../../assets/Avatar/Cars/woman.jpg";
import Logo19 from "../../../assets/Avatar/Forex/f1.jpg";
import Logo20 from "../../../assets/Avatar/Forex/f2.jpg";
import Logo21 from "../../../assets/Avatar/Forex/f3.jpg";
import Logo22 from "../../../assets/Avatar/Goal_setting/Art_12.jpg";
import Logo23 from "../../../assets/Avatar/Goal_setting/Group-1.jpg";
import Logo24 from "../../../assets/Avatar/Goal_setting/Group.jpg";
import Logo25 from "../../../assets/Avatar/Healthy_food/Group-1.jpg";
import Logo26 from "../../../assets/Avatar/Healthy_food/Group-2.jpg";
import Logo27 from "../../../assets/Avatar/Healthy_food/Group.jpg";
import Logo28 from "../../../assets/Avatar/Property/Art_1.jpg";
import Logo29 from "../../../assets/Avatar/Property/Group.jpg";
import Logo30 from "../../../assets/Avatar/Property/woman.jpg";
import Logo31 from "../../../assets/Avatar/Watches/Group-1.jpg";
import Logo32 from "../../../assets/Avatar/Watches/Group-2.jpg";
import Logo33 from "../../../assets/Avatar/Watches/Group.jpg";
import Logo34 from "../../../assets/Avatar/Wine/Art_5.jpg";
import Logo35 from "../../../assets/Avatar/Wine/Group-1.jpg";
import Logo36 from "../../../assets/Avatar/Wine/Group.jpg";
import Logo37 from "../../../assets/Avatar/self_help/Group-1.jpg";
import Logo38 from "../../../assets/Avatar/self_help/Group-2.jpg";
import Logo39 from "../../../assets/Avatar/self_help/Group.jpg";
import Logo40 from "../../../assets/Avatar/stocks_shares/ss1.jpg";
import Logo41 from "../../../assets/Avatar/stocks_shares/ss2.jpg";
import Logo42 from "../../../assets/Avatar/stocks_shares/ss3.jpg";
import OnboardingService from '../../../services/onBoardingService';

const sliderImages = [
  {
    id: 0, src1: Logo1, src2: Logo2, src3: Logo3, text: "Cryptocurrency"
  },
  {
    id: 1, src1: Logo4, src2: Logo5, src3: Logo6, text: "Meditation"
  },
  {
    id: 2, src1: Logo7, src2: Logo8, src3: Logo9, text: "Commodities"
  },
  {
    id: 3, src1: Logo10, src2: Logo11, src3: Logo12, text: "Fitness"
  },
  {
    id: 4, src1: Logo13, src2: Logo14, src3: Logo15, text: "Art"
  },
  {
    id: 5, src1: Logo16, src2: Logo17, src3: Logo18, text: "Cars"
  },
  {
    id: 6, src1: Logo19, src2: Logo20, src3: Logo21, text: "Forex"
  },
  {
    id: 7, src1: Logo22, src2: Logo23, src3: Logo24, text: "Goal Setting"
  },
  {
    id: 8, src1: Logo25, src2: Logo26, src3: Logo27, text: "Healthy Food"
  },
  {
    id: 9, src1: Logo28, src2: Logo29, src3: Logo30, text: "Property"
  },
  {
    id: 10, src1: Logo31, src2: Logo32, src3: Logo33, text: "Watches"
  },
  {
    id: 11, src1: Logo34, src2: Logo35, src3: Logo36, text: "Wine"
  },
  {
    id: 12, src1: Logo37, src2: Logo38, src3: Logo39, text: "Self Help"
  },
  {
    id: 13, src1: Logo40, src2: Logo41, src3: Logo42, text: "Stocks Shares"
  }
];

const SimpleSlider = () => {
  const onBoardServ = new OnboardingService();
  const globalCtx = useContext(GlobalContext);
  const [currentSlide, setCurrentSlide] = globalCtx.currentSlide;
  const [tempUser, setTempUser] = globalCtx.tempUser;
  const navigate = useNavigate();

  const CustomPrevArrow = (props) => (
    <div className='custom-prev' onClick={() => { props.onClick() }}>
      <FaChevronLeft color='#00808b' />
    </div >
  );

  // Custom arrow component
  const CustomNextArrow = (props) => (
    <div className='custom-next' onClick={() => { props.onClick() }}>
      <FaChevronRight color='#00808b' />
    </div>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    afterChange: (currentSlide) => {
      setCurrentSlide(currentSlide);
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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



  const sliderStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }

  const divStyle = {
    display: "flex",
    justifyContent: "space-around"
  }

  const handleClick = (src) => {
    let srcArray = src.split("/");
    let obj = {
      id: tempUser._id,
      profile_img: srcArray[srcArray.length - 1]
    }
    onBoardServ.updateProfileImage(obj)
      .then((res) => {  
        localStorage.setItem("user", JSON.stringify(res.user));
        setTempUser(res.user);
        navigate("/avatar");
      })
      .catch((error) => console.log(error));


  }

  return (
    <div>
      <Slider {...settings} style={sliderStyle}>
        {
          sliderImages.map((el) => {
            return <div key={el.id}>
              <div style={divStyle}>
                <img src={el.src1} className='image_height' alt="Slide 1" onClick={() => handleClick(el.src1)} />
                <img src={el.src2} className='image_height' alt="Slide 1" onClick={() => handleClick(el.src2)} />
                <img src={el.src3} className='image_height' alt="Slide 1" onClick={() => handleClick(el.src3)} />
              </div>
            </div>
          })
        }
      </Slider>
    </div>
  );
};

export default SimpleSlider;
