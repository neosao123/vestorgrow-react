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
import Check from "../../../assets/images/checkmark.svg"
import { useEffect } from 'react';
import AvatarService from '../../../services/AvatarService';

const sliderImages = [
  {
    id: 0,
    src1: "https://testapi.vestorgrow.com/uploads/av/17042787853149798.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17042787975778626.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17042788165036225.png",
    text: "Cryptocurrency"
  },
  {
    id: 1,
    src1: "https://testapi.vestorgrow.com/uploads/av/17042789751984491.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17042789855947286.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17042789962633350.png",
    text: "Meditation"
  },
  {
    id: 2,
    src1: "https://testapi.vestorgrow.com/uploads/av/17042791256554757.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17042791330254143.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17042791409026891.png",
    text: "Commodities"
  },
  {
    id: 3,
    src1: "https://testapi.vestorgrow.com/uploads/av/17042792667041524.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17042792734195531.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17042792810463721.png",
    text: "Fitness"
  },
  {
    id: 4,
    src1: "https://testapi.vestorgrow.com/uploads/av/17042794423676242.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17042794487606967.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17042794552547051.png",
    text: "Art"
  },
  {
    id: 5,
    src1: "https://testapi.vestorgrow.com/uploads/av/17042806191992645.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17042806256368269.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17042806317629639.png",
    text: "Cars"
  },
  {
    id: 6,
    src1: "https://testapi.vestorgrow.com/uploads/av/17042798318301640.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17042798414055717.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17042798482337120.png",
    text: "Forex"
  },
  {
    id: 7,
    src1: "https://testapi.vestorgrow.com/uploads/av/17042805304489747.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17042805421611375.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17042805516685016.png",
    text: "Goal Setting"
  },
  {
    id: 8,
    src1: "https://testapi.vestorgrow.com/uploads/av/17042803867508008.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17042803931319506.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17042803994052834.png",
    text: "Healthy Food"
  },
  {
    id: 9,
    src1: "https://testapi.vestorgrow.com/uploads/av/17042800244986142.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17042800303282667.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17042800363604033.png",
    text: "Property"
  },
  {
    id: 10,
    src1: "https://testapi.vestorgrow.com/uploads/av/17042801332945025.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17042801393532455.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17042801456574150.png",
    text: "Watches"
  },
  {
    id: 11,
    src1: "https://testapi.vestorgrow.com/uploads/av/17042802036936999.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17042802094494896.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17042802166368861.png",
    text: "Wine"
  },
  {
    id: 12,
    src1: "https://testapi.vestorgrow.com/uploads/av/17042802915979615.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17042802975747196.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17042803041098682.png",
    text: "Self Help"
  },
  {
    id: 13,
    src1: "https://testapi.vestorgrow.com/uploads/av/17042799419909292.png",
    src2: "https://testapi.vestorgrow.com/uploads/av/17042799476206151.png",
    src3: "https://testapi.vestorgrow.com/uploads/av/17042799546462136.png",
    text: "Stocks Shares"
  }
];

const SimpleSlider = () => {
  const onBoardServ = new OnboardingService();
  const avatarServ = new AvatarService();
  const globalCtx = useContext(GlobalContext);
  const [currentSlide, setCurrentSlide] = globalCtx.currentSlide;
  const [tempUser, setTempUser] = globalCtx.tempUser;
  const [user, setUser] = globalCtx.user;
  const navigate = useNavigate();
  const [Imagesrc, setImageSrc] = globalCtx.Imagesrc;
  // const [sliderImages, setSliderImages] = useState([]);


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
    justifyContent: "space-around",
    alignItems: "center",
    padding: "10px",
    height: "150px",
    maxHeight: "150px",
  }

  const maindivstyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    // let user = tempUser;
    // user.profile_img = src;
    // setTempUser(user);
    // setUser(user);
    // localStorage.setItem("user", JSON.stringify(user));
    // navigate("/avatar")
    setImageSrc(src)
  }

  // const getAllAvatar = async () => {
  //   await avatarServ.getAllAvatar()
  //     .then((res) => {
  //       console.log("DATA:", res?.data)
  //       setSliderImages(res?.data)
  //     })
  //     .catch((error) => {
  //       console.log("error:", error)
  //     })
  // }

  // useEffect(() => {
  //   getAllAvatar()
  // }, [])

  console.log("IMAGESRC:", Imagesrc)


  return (
    <div style={{ maxHeight: "150px", height: "150px" }}>
      {sliderImages.length > 0 && <Slider {...settings} style={sliderStyle}>
        {
          sliderImages?.map((el) => {
            return <div key={el.id} style={maindivstyle}>
              <div style={divStyle}>
                <div onClick={() => handleClick(el.src1)} id='avatar_div1'>
                  <img src={el.src1} className='image_height' style={{ opacity: `${Imagesrc !== "" ? (Imagesrc === el.src1 ? "1" : "0.4") : "1"}` }} alt="Slide 1" />
                  {Imagesrc !== "" && Imagesrc === el.src1 && <div id='checkmark'><img src={Check} alt='check' className='checkmark_img' /></div>}
                </div>
                <div onClick={() => handleClick(el.src2)} id='avatar_div1'>
                  <img src={el.src2} className='image_height' style={{ opacity: `${Imagesrc !== "" ? (Imagesrc === el.src2 ? "1" : "0.4") : "1"}` }} alt="Slide 1" />
                  {Imagesrc !== "" && Imagesrc === el.src2 && <div id='checkmark'><img src={Check} alt='check' className='checkmark_img' /></div>}
                </div>
                <div onClick={() => handleClick(el.src3)} id='avatar_div1'>
                  <img src={el.src3} className='image_height' style={{ opacity: `${Imagesrc !== "" ? (Imagesrc === el.src3 ? "1" : "0.4") : "1"}` }} alt="Slide 1" />
                  {Imagesrc !== "" && Imagesrc === el.src3 && <div id='checkmark'><img src={Check} alt='check' className='checkmark_img' /></div>}
                </div>
              </div>
            </div>
          })
        }
      </Slider>}
    </div>
  );
};

export default SimpleSlider;
