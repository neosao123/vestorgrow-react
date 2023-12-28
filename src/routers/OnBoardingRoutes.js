import React, { useContext, useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Screen5 from '../pages/onboarding/Screen5'
import Screen6 from '../pages/onboarding/Screen6'
import Srceen7 from '../pages/onboarding/Srceen7'
import Screen8 from '../pages/onboarding/Screen8'
import Describe from '../pages/onboarding/Describe'
import UserSuggestion1 from '../pages/onboarding/userSuggestion1'
import GroupSuggestion1 from '../pages/onboarding/groupSuggestion1'
import GlobalContext from '../context/GlobalContext'
import Loader from '../components/Loader'
import { useState } from 'react'
import { Children } from 'react'

const OnBoardingRoutes = ({ children }) => {
    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    console.log("CHildren:", children)

    let path;
    if (user.usernameUpdate === false) {
        setLoading(false)
        path = "/add_username"
        // navigate("/add_username", { replace: true })
    }
    else if (user.profilepictureUpdate === false && user.usernameUpdate === true) {
        setLoading(false)
        path = "/update_profile"
        // navigate("/update_profile", { replace: true })
    }
    else if (user.bioUpdate === false && user.profilepictureUpdate === true && user.usernameUpdate === true) {
        setLoading(false)
        path = "/bio"
        // navigate("/bio", { replace: true })
    }
    else if (user.UserSuggestions === false && user.bioUpdate === true && user.profilepictureUpdate === true && user.usernameUpdate === true) {
        setLoading(false)
        path = "/usersuggestions1"
        // navigate("/usersuggestions1", { replace: true })
    }
    else if (user.groupSuggestion === false && user.UserSuggestions === true && user.bioUpdate === true && user.profilepictureUpdate === true && user.usernameUpdate === true) {
        setLoading(false)
        path = "/groupsuggestion1"
        // navigate("/groupsuggestion1", { replace: true })
    }
    return path !== "/add_username" && path !== "/groupsuggestion1" && path !== "/usersuggestions1" && path !== "/bio" && path !== "/update_profile" ? children : <Navigate to={path} replace={true} />
}

export default OnBoardingRoutes