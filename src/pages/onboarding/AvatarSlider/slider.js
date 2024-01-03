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
import { BsCheck2 } from "react-icons/bs";

const sliderImages = [
  {
    id: 0,
    src1: "https://testapi.vestorgrow.com/uploads/av/17041754315459340.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17041754420381040.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17041754527815006.png",
    text: "Cryptocurrency"
  },
  {
    id: 1,
    src1: "https://testapi.vestorgrow.com/uploads/av/17041758187852520.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17041782557028360.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17041758362635871.png",
    text: "Meditation"
  },
  {
    id: 2,
    src1: "https://testapi.vestorgrow.com/uploads/av/17041760534976767.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17041760605937234.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17041760687537972.png",
    text: "Commodities"
  },
  {
    id: 3,
    src1: "https://testapi.vestorgrow.com/uploads/av/17041762155429050.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17041762250492309.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17041762315785015.png",
    text: "Fitness"
  },
  {
    id: 4,
    src1: "https://testapi.vestorgrow.com/uploads/av/17041763483398793.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17041763410141459.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17041763564711237.png",
    text: "Art"
  },
  {
    id: 5,
    src1: "https://testapi.vestorgrow.com/uploads/av/17041765273396922.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17041765334145742.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17041765412056637.png",
    text: "Cars"
  },
  {
    id: 6,
    src1: "https://testapi.vestorgrow.com/uploads/av/17041767760273717.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17041767822941283.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17041767892825654.png",
    text: "Forex"
  },
  {
    id: 7,
    src1: "https://testapi.vestorgrow.com/uploads/av/17041769547633061.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17041769612331753.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17041769684951762.png",
    text: "Goal Setting"
  },
  {
    id: 8,
    src1: "https://testapi.vestorgrow.com/uploads/av/17041771438019202.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17041771512934693.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17041771581243562.png",
    text: "Healthy Food"
  },
  {
    id: 9,
    src1: "https://testapi.vestorgrow.com/uploads/av/17041773092246838.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17041773161393760.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17041773232716022.png",
    text: "Property"
  },
  {
    id: 10,
    src1: "https://testapi.vestorgrow.com/uploads/av/17041774614052696.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17041774678702803.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17041774746459085.png",
    text: "Watches"
  },
  {
    id: 11,
    src1: "https://testapi.vestorgrow.com/uploads/av/17041775855386158.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17041775914877166.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17041775988364597.png",
    text: "Wine"
  },
  {
    id: 12,
    src1: "https://testapi.vestorgrow.com/uploads/av/17041777597749879.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17041777667473554.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17041777747834404.png",
    text: "Self Help"
  },
  {
    id: 13,
    src1: "https://testapi.vestorgrow.com/uploads/av/17041779227613265.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17041779331453009.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17041779407421070.png",
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
                <div onClick={() => handleClick(el.src1)} id='avatar_div1'>
                  <img src={el.src1} className='image_height' alt="Slide 1" />
                  <div id='checkmark'><BsCheck2 fontSize={"40px"} fontWeight={700} /></div>
                </div>
                <div onClick={() => handleClick(el.src2)}>
                  <img src={el.src2} className='image_height' alt="Slide 1" />
                </div>
                <div onClick={() => handleClick(el.src3)}>
                  <img src={el.src3} className='image_height' alt="Slide 1" />
                </div>
              </div>
            </div>
          })
        }
      </Slider>
    </div>
  );
};

export default SimpleSlider;
