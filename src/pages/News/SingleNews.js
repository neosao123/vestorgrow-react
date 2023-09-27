import React from 'react'
import "./singlenews.css"
import Comment from '../../shared/Comment'
import { MdKeyboardArrowDown } from "react-icons/md"
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const SingleNews = () => {
    return (
        <div className='single_news_main_box'>
            <div className='single_news_box'>
                <div className='news_img'>
                    <div className='single_news_headline'>
                        <div className='single_news_headline_title' >
                            <div className='vestogrow_title' >VestorGrow News</div>
                            <div className='share_btn'>
                                <div className='share_icon'></div>
                                <div className='share_text'>share</div>
                            </div>
                        </div>
                        <div className='news_headline'>
                            Warren Buffett in Contact With Biden Team on Banking Crisis
                        </div>
                    </div>
                </div>
                <div className='news_data'>
                    <div className='tags_comment_div'>
                        <span className='news_tag'>Bussiness</span>
                        <span className='date'>2 April 2023</span>
                        <span className='divider' ></span>
                        <span className='comments'>208 Comments</span>
                        <span className='shares'>107 Shares</span>
                    </div>
                    <div className='description'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris id vehicula sem. Etiam volutpat facilisis porta. Nunc et mollis mi. Nam auctor ipsum eu felis rhoncus eleifend. Integer luctus, tellus a bibendum finibus, odio nunc ultricies elit, sed commodo purus libero posuere tortor. Donec non lacinia massa, a auctor orci. Nulla commodo elementum sodales. Morbi nisi ligula, pulvinar quis turpis fermentum, mattis tempor ex.

                        Donec efficitur vulputate tellus. Aliquam sed magna sapien. Mauris molestie nibh id dui rutrum molestie. Sed suscipit condimentum dolor, eu convallis tortor iaculis id. Donec ac nibh tincidunt ex pulvinar suscipit quis et neque. Nulla sit amet libero libero. Curabitur in mi id ante semper vulputate.

                        Curabitur dignissim sem gravida sem convallis vestibulum. In hac habitasse platea dictumst. Mauris tincidunt ex id ligula bibendum, congue ultrices erat facilisis. Vestibulum eleifend vitae arcu at aliquam. Donec fringilla hendrerit augue, vitae porttitor neque hendrerit quis. Mauris dictum lacus nec justo convallis, vel efficitur turpis congue. Pellentesque sollicitudin vitae lorem a hendrerit.

                        Morbi ac iaculis mauris, a hendrerit dui. Donec ac turpis orci. Pellentesque pharetra, augue ut blandit ultrices, nulla lectus dignissim purus, eget lobortis sapien nulla nec ligula. Sed id viverra nulla, ut condimentum sapien.
                    </div>
                    <div style={{ border: "1px solid red", marginLeft: "20px", marginRight: "20px", marginTop: "20px", padding: "50px 20px" }}>Comments section</div>
                    <div className='showmore_btn'>
                        <button className='show_more'>Show More <span><MdKeyboardArrowDown /></span></button>
                    </div>
                    <div className='show_more_box'>
                        <p className='more_from_vestorgrow'>More from VestorGrow</p>
                        {/* <div className='sell_all_news'>
                            <div className='news_div'>
                                <img src={'https://kchanews.com/wp-content/uploads/2014/09/bigstock-Breaking-News-Screen-36237841.jpg'} alt='image' />
                                <div className='news_head'>Curabitur dignissim sem gravida sem convallis vestibulum.</div>
                            </div>
                            <div className='news_div'>
                                <img src={'https://kchanews.com/wp-content/uploads/2014/09/bigstock-Breaking-News-Screen-36237841.jpg'} alt='image' />
                                <div className='news_head'>Curabitur dignissim sem gravida sem convallis vestibulum.</div>
                            </div>
                            <div className='news_div'>
                                <img src={'https://kchanews.com/wp-content/uploads/2014/09/bigstock-Breaking-News-Screen-36237841.jpg'} alt='image' />
                                <div className='news_head'>Curabitur dignissim sem gravida sem convallis vestibulum.</div>
                            </div>
                            <div className='news_div'>
                                <img src={'https://kchanews.com/wp-content/uploads/2014/09/bigstock-Breaking-News-Screen-36237841.jpg'} alt='image' />
                                <div className='news_head'>Curabitur dignissim sem gravida sem convallis vestibulum.</div>
                            </div>
                            <div className='news_div'>
                                <img src={'https://kchanews.com/wp-content/uploads/2014/09/bigstock-Breaking-News-Screen-36237841.jpg'} alt='image' />
                                <div className='news_head'>Curabitur dignissim sem gravida sem convallis vestibulum.</div>
                            </div>
                            <div className='news_div'>
                                <img src={'https://kchanews.com/wp-content/uploads/2014/09/bigstock-Breaking-News-Screen-36237841.jpg'} alt='image' />
                                <div className='news_head'>Curabitur dignissim sem gravida sem convallis vestibulum.</div>
                            </div>
                        </div> */}
                        {/* <OwlCarousel nav margin={1}>
                            <div className='news_div'>
                                <img style={{ width: "100%", height: "160px" }} src={'https://kchanews.com/wp-content/uploads/2014/09/bigstock-Breaking-News-Screen-36237841.jpg'} alt='image' />
                                <div className='news_head'>Curabitur dignissim sem gravida sem convallis vestibulum.</div>
                            </div>
                            <div className='news_div'>
                                <img style={{ width: "100%" }} src={'https://kchanews.com/wp-content/uploads/2014/09/bigstock-Breaking-News-Screen-36237841.jpg'} alt='image' />
                                <div className='news_head'>Curabitur dignissim sem gravida sem convallis vestibulum.</div>
                            </div>
                            <div className='news_div'>
                                <img style={{ width: "100%" }} src={'https://kchanews.com/wp-content/uploads/2014/09/bigstock-Breaking-News-Screen-36237841.jpg'} alt='image' />
                                <div className='news_head'>Curabitur dignissim sem gravida sem convallis vestibulum.</div>
                            </div>
                            <div className='news_div'>
                                <img style={{ width: "100%" }} src={'https://kchanews.com/wp-content/uploads/2014/09/bigstock-Breaking-News-Screen-36237841.jpg'} alt='image' />
                                <div className='news_head'>Curabitur dignissim sem gravida sem convallis vestibulum.</div>
                            </div>

                        </OwlCarousel> */}
                    </div>
                    <div className='sell_all_btn_box'>
                        <button className='sell_all_btn'>See all news</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleNews