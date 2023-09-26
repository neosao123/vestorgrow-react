import React, { useState } from 'react'
import "./news.css"
import { IoIosArrowForward } from "react-icons/io"
import { VscChevronLeft, VscChevronRight } from "react-icons/vsc"
import NewsComp from './NewsComp'
const NewsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function News() {


  return (
    <div className='new_box'>
      <div className='main_news_box'>
        <p className='news-heading'>VestorGrow News</p>
        <div className='tabs_box' >
          <div className='news_tabs'>
            <div className='news_tabs_text active_tab'>VestorGrow</div>
            <div className='news_tabs_text'>Economics</div>
            <div className='news_tabs_text'>Politics</div>
            <div className='news_tabs_text'>Bussiness</div>
            <div className='news_tabs_text'>Maharashatra</div>
            <div className='news_tabs_text'>India</div>
            <div className='news_tabs_text'>Kolhapur</div>
            <div className='news_tabs_text'>Technology</div>
            <div className='news_tabs_text'>Health</div>
            <div className='news_tabs_text'>Automotive</div>
          </div>
          <div>
            <button className='forward_btn'>
              <IoIosArrowForward style={{ color: "#040404" }} />
            </button>
          </div>

        </div>
        <div className='grid'>
          {
            NewsArray.length > 0 && NewsArray?.map((el, i) => {
              return <NewsComp />
            })
          }
        </div>
        <div className='grid_pagination'>
          <button>
            <VscChevronLeft />
          </button>
          <button><span className='page_name'>1</span>/4</button>
          <button>
            <VscChevronRight />
          </button>
        </div>
      </div>
    </div>
  )
}

export default News