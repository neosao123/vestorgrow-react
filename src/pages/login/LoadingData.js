import React, { useContext, useEffect } from 'react'
import UserService from '../../services/UserService';
import GlobalContext from '../../context/GlobalContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useState } from 'react';

const LoadingData = () => {
    const serv = new UserService();
    const globalCtx = useContext(GlobalContext);
    const [isAuthentiCated, setIsAuthentiCated] = globalCtx.auth;
    const [user, setUser] = globalCtx.user;

    const navigate = useNavigate();
    const location = useLocation();
    const [errorMsg, setErrorMsg] = useState("");

    const setActivated = async () => {
        let pathName = location.pathname.split("/");
        if (pathName.length === 4) {
            const token = pathName[pathName.length - 1];
            if (token !== "") {
                const resp = await serv.updateAccountActivated(token);
                if (resp.status === true) {
                    setTimeout(() => {
                        setErrorMsg("");
                        localStorage.setItem("user", JSON.stringify(resp.data));
                        setUser(resp.data);
                        navigate('/');
                    }, 3000);
                } else {
                    setErrorMsg(resp.message);
                }
            } else {
                setErrorMsg("Token not found or invalid url. Please check your email for valid verification link or login again to receive an valid link");
            }
        } else {
            setErrorMsg("Token not found or invalid url. Please check your email for valid verification link or login again to receive an valid link");
        }
    }

    const handleExit = async (e) => {
        e.preventDefault();
        try {
            let resp = await serv.logout({});
            if (resp) {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/login");
                window.location.reload(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setActivated();
    }, []);


    return (
        <div className='d-flex align-items-center justify-content-center flex-column vh-100'>
            <div className="col-md-4 col-sm-6 col-lg-4">
                <div className="card">
                    <div className="card-body">
                        <div className='text-center mb-3'><img src="/images/profile/logo_image-main.svg" className="img-fluid img-logo" alt="logo" /></div>
                        <div>
                            {
                                (errorMsg !== "") ? (
                                    <div className='text-center'>
                                        <div className='text-danger my-3'>{errorMsg}</div>
                                        <div className="my-3">
                                            <button style={{ border: "none" }} onClick={handleExit}>Back to Login</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='d-flex align-items-center justify-content-center mb-3'>
                                        <i className="fa fa-2x fa-circle-o-notch fa-spin vs-color"></i>
                                        <span className='ms-3'>Activating and loading your profile please wait...</span>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoadingData;