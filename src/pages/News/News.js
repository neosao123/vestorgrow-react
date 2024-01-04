import React, { useEffect, useState } from 'react'
import "./news.css"
import { IoIosArrowForward } from "react-icons/io"
import { VscChevronLeft, VscChevronRight } from "react-icons/vsc"
import NewsComp from './NewsComp'
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { useNavigate } from 'react-router-dom'
const NewsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const tabs = ["All", "VestorGrow", "Economics", "Politics", "Bussiness", "Maharashatra", "India", "Kolhapur", "Technology", "Health", "Automotive"]

function News() {
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState("All")
  const [tabValue, setTabValue] = useState(null)
  const navigate = useNavigate()
  const handleClick = (el) => {
    setActiveTab(el)
  }
  useEffect(() => {
    setTabValue(activeTab)
  }, [activeTab])

  return (
    <div className='new_box'>
      <div className='main_news_box'>
        <p className='news-heading'>VestorGrow News</p>
        <div className='tabs_box' >
          <OwlCarousel className='news_tabs' loop autoWidth nav mouseDrag>
            {
              tabs.length > 0 && tabs.map((el, i) => {
                return <div key={el} id={el} className={`news_tabs_text  ${activeTab === el ? `active_tab` : ""}`} onClick={() => handleClick(el)}>{el}</div>
              })
            }
          </OwlCarousel>
          {/* <div className='news_tabs' id="carousel">
            <div className={`news_tabs_text item ${activeTab === "all" && "active_tab"}`} onClick={() => setActiveTab("all")}>All</div>
            {
              tabs.length > 0 && tabs.map((el, i) => {
                return <div className={`news_tabs_text item ${activeTab === el && "active_tab"}`} onClick={() => setActiveTab(el)}>{el}</div>
              })
            }
          </div>
          <div>
            <button className='forward_btn'>
              <IoIosArrowForward style={{ color: "#040404" }} />
            </button>
          </div> */}

        </div>
        <div className='grid'>
          {
            NewsArray.length > 0 && NewsArray?.map((el, i) => {
              return <NewsComp key={el._id} id={i} />
            })
          }
        </div>
        <div className='grid_pagination'>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <VscChevronLeft />
          </button>
          <button><span className='page_name'>{page}</span>/4</button>
          <button disabled={page >= 4} onClick={() => setPage(page + 1)}>
            <VscChevronRight />
          </button>
        </div>
      </div>
    </div>
  )
}

export default News