import React from 'react'
import "./style.css";

let data = [];
const datalen = 150;

for (let i = 0; i < datalen; i++) {
    data.push({ id: i, text: " box - " + i });
}

const HomePage = () => {

    return (
        <div className="socialContant socialContant_custom main_container pb-0">
            <div className="home-parent-container">
                <div className='box-left'></div>
                <div className='box-center'>
                    {
                        data.map((d, i) => {
                            return <div className='post' key={d.id}>{d.text}</div>
                        })
                    }
                </div>
                <div className='box-right'></div>
            </div>
        </div>
    )
}

export default HomePage