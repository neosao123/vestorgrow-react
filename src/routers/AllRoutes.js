import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate, useMatch, useLocation, useParams } from "react-router-dom";
import UserService from "../services/UserService";
import uuid from "react-uuid";
import DefaultLayout from "../containers/DefaultLayout";
import DefaultLayoutWithoutLogin from "../containers/DefaultLayoutWithoutLogin";
import HomePage from "../pages/home/HomePage";
import Learning from "../pages/learning/Learning";
import Login from "../pages/login/Login";
import Signup from "../pages/signup/Signup";
import SignupInactiveLink from "../pages/signup/SignupInactive";
import SignupProfile from "../pages/signup/SignupProfile";
import UserSuggestion from "../pages/signup/UserSuggestion";
import ForgotPassword from "../pages/forgotPassword/ForgotPassword";
import { GlobalContext } from "../context/GlobalContext";
import ResetPassword from "../pages/forgotPassword/ResetPassword";
import LearningLocked from "../pages/learning/LearningLocked";
import Lesson from "../pages/learning/Lesson";
import CourseViewAll from "../pages/learning/CourseViewAll";
import MaterialViewAll from "../pages/learning/MaterialViewAll";
import WebinarViewAll from "../pages/learning/WebinarViewAll";
import Material from "../pages/learning/Material";
import Discover from "../pages/discover/Discover";
import Profile from "../pages/profile/Profile";
import UserProfile from "../pages/profile/UserProfile";
import Setting from "../pages/setting/Setting";
import CreatePostMobile from "../pages/post/CreatePostMobile";
import NotFound from "../pages/notFound/NotFound";
import PostDetail from "../pages/post/PostDetail";
import Message from "../pages/message/Message";
import GlobalMessage from "../pages/home/chatType/GlobalMessage";
import StripeContainer from "../containers/paymentGateway/StripeContainer";
import GroupChat from "../pages/home/chatType/GroupChat";
import GlobalMessageMobile from "../pages/home/chatType/GlobalMessageMobile";
import GroupChatMobile from "../pages/home/chatType/GroupChatMobile";
import GroupInvite from "../pages/group/GroupInvite";
import GroupSuggestion from "../pages/signup/GroupSuggestion";
import LoginInactive from "../pages/login/LoginInactive";
import LoadingData from "../pages/login/LoadingData";
import Loginsteps from "../pages/steps/Loginsteps";
import News from "../pages/News/News";
import SingleNews from "../pages/News/SingleNews";
import Screen1 from "../pages/onboarding/Screen1";
import Screen2 from "../pages/onboarding/Screen2";
import Screen3 from "../pages/onboarding/Screen3";
import Screen4 from "../pages/onboarding/Screen4";
import Screen5 from "../pages/onboarding/Screen5";
import Screen6 from "../pages/onboarding/Screen6";
import Describe from "../pages/onboarding/Describe";
import Srceen7 from "../pages/onboarding/Srceen7";
import Screen8 from "../pages/onboarding/Screen8";
import ChangeEmail from "../pages/onboarding/ChangeEmail";
import UserSuggestion1 from "../pages/onboarding/userSuggestion1";
import GroupSuggestion1 from "../pages/onboarding/groupSuggestion1";
import Signup2 from "../pages/onboarding/Signup2";

function AllRoutes() {
  const serv = new UserService();
  const globalCtx = useContext(GlobalContext);
  const [isAuthentiCated, setIsAuthentiCated] = globalCtx.auth;
  const [user, setUser] = globalCtx.user;
  const match = useMatch("/groupinvite/:id");
  const location = useLocation();

  const updateOnlineStatus = async () => {
    await serv.updateOnlineStatus({}).then((resp) => {
    });
  };

  useEffect(() => {
    let device_id = localStorage.getItem("device_id");
    if (!device_id) {
      localStorage.setItem("device_id", uuid());
    }
    if (!isAuthentiCated) {
      localStorage.removeItem("group_invite");
      const isMatchingPath = !!match;
      if (isMatchingPath) {
        localStorage.setItem("group_invite", location.pathname);
      }
    }
    const interval = setInterval(updateOnlineStatus, 30000);
    return () => clearInterval(interval);
  }, [isAuthentiCated, location.pathname, match]);

  return isAuthentiCated ? (
    <DefaultLayout>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/dashboard" element={<HomePage />} />
        <Route exact path="/learning" element={<Learning />} />
        <Route exact path="/learning/locked" element={<LearningLocked />} />
        <Route exact path="/learning/lesson/:id" element={<Lesson />} />
        <Route exact path="/learning/course/viewall" element={<CourseViewAll />} />
        <Route exact path="/learning/material/:id" element={<Material />} />
        <Route exact path="/learning/material/viewall" element={<MaterialViewAll />} />
        <Route exact path="/learning/webinar/viewall" element={<WebinarViewAll />} />
        <Route exact path="/discover" element={<Discover />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/userprofile/:id" element={<UserProfile />} />
        <Route exact path="/setting" element={<Setting />} />
        <Route exact path="/setting/:page" element={<Setting />} />
        <Route exact path="/createpost" element={<CreatePostMobile />} />
        <Route exact path="/post/:id" element={<PostDetail />} />
        <Route exact path="/message" element={<Message />} />
        <Route exact path="/message/:id" element={<Message />} />
        <Route exact path="/message/show/:chat_id/:message_id" element={<Message />} />
        <Route exact path="/globalmessage" element={<GlobalMessageMobile />} />
        <Route exact path="/groupmessage" element={<GroupChatMobile />} />
        <Route exact path="/notfound" element={<NotFound />} />
        <Route exact path="/payment" element={<StripeContainer />} />
        <Route exact path="/usersuggestion" element={<UserSuggestion />} />
        <Route exact path="/groupsuggestion" element={<GroupSuggestion />} />
        <Route exact path="/groupinvite/:id" element={<GroupInvite />} />
        <Route exact path="/signin/inactive" element={<LoginInactive />} />
        <Route exact path="/signin/active/:id" element={<Loginsteps />} />
        <Route exact path="/signup/active/:id" element={<SignupProfile />} />
        <Route exact path="/news" element={<News />} />
        <Route exact path="/news/:id" element={<SingleNews />} />


        <Route exact path="/add_username" element={<Screen5 />} />
        <Route exact path="/update_profile" element={<Screen6 />} />
        <Route exact path="/avatar" element={<Srceen7 />} />
        <Route exact path="/profile_picture" element={<Screen8 />} />
        <Route exact path="/bio" element={<Describe />} />
        <Route exact path="/usersuggestions1" element={<UserSuggestion1 />} />
        <Route exact path="/groupsuggestion1" element={<GroupSuggestion1 />} />


        <Route path="*" element={<Navigate to="/notfound" replace={true} />} />
      </Routes>
    </DefaultLayout>
  ) : (
    <DefaultLayoutWithoutLogin>
      <Routes>
        <Route exact path="/join" element={<Screen1 />} />
        <Route exact path="/create_account" element={<Screen2 />} />
        <Route exact path="/email_verification" element={<Screen3 />} />
        <Route exact path="/update_password" element={<Screen4 />} />
        <Route exact path="/add_username" element={<Screen5 />} />
        <Route exact path="/update_profile" element={<Screen6 />} />
        <Route exact path="/avatar" element={<Srceen7 />} />
        <Route exact path="/profile_picture" element={<Screen8 />} />
        <Route exact path="/bio" element={<Describe />} />
        <Route exact path="/usersuggestions1" element={<UserSuggestion1 />} />
        <Route exact path="/groupsuggestion1" element={<GroupSuggestion1 />} />
        <Route exact path="/changeemail" element={<ChangeEmail />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/signup_auth" element={<Signup2 />} />
        <Route exact path="/signup/inactive" element={<SignupInactiveLink />} />
        <Route exact path="/signup/active/:id" element={<SignupProfile />} />
        <Route exact path="/forgotpassword" element={<ForgotPassword />} />
        <Route exact path="/resetpassword" element={<ResetPassword />} />
        <Route exact path="/post/:id" element={<PostDetail />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </DefaultLayoutWithoutLogin>
  );
}
export default AllRoutes;
