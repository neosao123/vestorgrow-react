import React from 'react'
import "./news.css"

const NewsComp = () => {
  return (
    <div className='grid_item'>
      <img src='https://kchanews.com/wp-content/uploads/2014/09/bigstock-Breaking-News-Screen-36237841.jpg' className='img_news' />
      <div>
        <span>
          Tab Value
        </span>
      </div>
      <p className='new_comp_headline'>Asian Games 2023: The Indian team of Anush Agarwalla, Hriday Vipul and rajesh.</p>
      <p className='news_date'>26 sep 23</p>
    </div>
  )
}

export default NewsComp