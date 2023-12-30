import React, { useContext, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "./slider.css";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import GlobalContext from '../../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import OnboardingService from '../../../services/onBoardingService';
import { toast } from 'react-toastify';

const sliderImages = [
  {
    id: 0,
    src1: "https://testapi.vestorgrow.com/uploads/av/17035910973853278.jpg",
    src2: "https://testapi.vestorgrow.com/uploads/av/17035911291688010.jpg",
    src3: "https://testapi.vestorgrow.com/uploads/av/17035911391833796.jpg",
    text: "Cryptocurrency"
  },
  {
    id: 1,
    src1: "https://testapi.vestorgrow.com/uploads/av/17035918189624225.jpg",
    src2: "https://testapi.vestorgrow.com/uploads/av/17035918255913851.jpg",
    src3: "https://testapi.vestorgrow.com/uploads/av/17035918311252288.jpg",
    text: "Meditation"
  },
  {
    id: 2,
    src1: "https://testapi.vestorgrow.com/uploads/av/17035913408857937.jpg",
    src2: "https://testapi.vestorgrow.com/uploads/av/17035913475494043.jpg",
    src3: "https://testapi.vestorgrow.com/uploads/av/17035913546076104.jpg",
    text: "Commodities"
  },
  {
    id: 3,
    src1: "https://testapi.vestorgrow.com/uploads/av/17035913827097317.jpg",
    src2: "https://testapi.vestorgrow.com/uploads/av/17035913926089455.jpg",
    src3: "https://testapi.vestorgrow.com/uploads/av/17035913998098134.jpg",
    text: "Fitness"
  },
  {
    id: 4,
    src1: "https://testapi.vestorgrow.com/uploads/av/17035912637189033.jpg",
    src2: "https://testapi.vestorgrow.com/uploads/av/17035912713399209.jpg",
    src3: "https://testapi.vestorgrow.com/uploads/av/17035912804691306.jpg",
    text: "Art"
  },
  {
    id: 5,
    src1: "https://testapi.vestorgrow.com/uploads/av/17035912979266726.jpg",
    src2: "https://testapi.vestorgrow.com/uploads/av/17035913073871004.jpg",
    src3: "https://testapi.vestorgrow.com/uploads/av/17035913152643601.jpg",
    text: "Cars"
  },
  {
    id: 6,
    src1: "https://testapi.vestorgrow.com/uploads/av/17035916097084571.jpg",
    src2: "https://testapi.vestorgrow.com/uploads/av/17035916157997334.jpg",
    src3: "https://testapi.vestorgrow.com/uploads/av/17035916222329158.jpg",
    text: "Forex"
  },
  {
    id: 7,
    src1: "https://testapi.vestorgrow.com/uploads/av/17035917407865433.jpg",
    src2: "https://testapi.vestorgrow.com/uploads/av/17035917468861872.jpg",
    src3: "https://testapi.vestorgrow.com/uploads/av/17035917534603643.jpg",
    text: "Goal Setting"
  },
  {
    id: 8,
    src1: "https://testapi.vestorgrow.com/uploads/av/17035917831386638.jpg",
    src2: "https://testapi.vestorgrow.com/uploads/av/17035917906026634.jpg",
    src3: "https://testapi.vestorgrow.com/uploads/av/17035917971062406.jpg",
    text: "Healthy Food"
  },
  {
    id: 9,
    src1: "https://testapi.vestorgrow.com/uploads/av/17035919122058968.jpg",
    src2: "https://testapi.vestorgrow.com/uploads/av/17035919183852995.jpg",
    src3: "https://testapi.vestorgrow.com/uploads/av/17035919243892796.jpg",
    text: "Property"
  },
  {
    id: 10,
    src1: "https://testapi.vestorgrow.com/uploads/av/17035920228012249.jpg",
    src2: "https://testapi.vestorgrow.com/uploads/av/17035920300264941.jpg",
    src3: "https://testapi.vestorgrow.com/uploads/av/17035920359533982.jpg",
    text: "Watches"
  },
  {
    id: 11,
    src1: "https://testapi.vestorgrow.com/uploads/av/17035920639864145.jpg",
    src2: "https://testapi.vestorgrow.com/uploads/av/17035920639864145.jpg",
    src3: "https://testapi.vestorgrow.com/uploads/av/17035920639864145.jpg",
    text: "Wine"
  },
  {
    id: 12,
    src1: "https://testapi.vestorgrow.com/uploads/av/17035919517945207.jpg",
    src2: "https://testapi.vestorgrow.com/uploads/av/17035919589877327.jpg",
    src3: "https://testapi.vestorgrow.com/uploads/av/17035919656988759.jpg",
    text: "Self Help"
  },
  {
    id: 13,
    src1: "https://testapi.vestorgrow.com/uploads/av/17035919901528320.jpg",
    src2: "https://testapi.vestorgrow.com/uploads/av/17035919965992170.jpg",
    src3: "https://testapi.vestorgrow.com/uploads/av/17035920030022536.jpg",
    text: "Stocks Shares"
  }
];

const SimpleSlider = () => {
  const onBoardServ = new OnboardingService();
  const globalCtx = useContext(GlobalContext);
  const [currentSlide, setCurrentSlide] = globalCtx.currentSlide;
  const [tempUser, setTempUser] = globalCtx.tempUser;
  const [user, setUser] = globalCtx.user;
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
    // let obj = {
    //   id: tempUser._id,
    //   profile_img: src
    // }
    // onBoardServ.updateProfileImage(obj)
    //   .then((res) => {
    //     toast.success("Avatar updated successfully!")
    //     localStorage.setItem("user", JSON.stringify(res.user));
    //     setTempUser(res.user);
    //     setUser(res.user);
    //     navigate("/avatar", { replace: true });
    //   })
    //   .catch((error) => console.log(error));
    let user = tempUser;
    user.profile_img = src;
    setTempUser(user);
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/avatar")
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
