import React from 'react';
import GroupImage from "../../assets/images/groups.svg";
import PersonalChat from "../../assets/images/messaging.svg"
import { useContext } from 'react';
import GlobalContext from '../../context/GlobalContext';
import "./sidebar.css"


const ChatSidebar = () => {
    const globalCtx = useContext(GlobalContext);
    const [shotChatlist, setShowChatList] = globalCtx.showChatList;
    const [groupChat, setgroupChat] = globalCtx.isThisGroupChat;
    const [personalUnreadCount, setPersonalUnreadCount] = globalCtx.unreadPersonalCount;
    const [groupUnreadCount, setGroupUnreadCount] = globalCtx.unreadGroupCount;

    const handlePersonalChat = () => {
        setgroupChat(false)
        setShowChatList(true)
    }

    const handleGroupChat = () => {
        setgroupChat(true)
        setShowChatList(true)
    }


    return (
        <div className='chatsidebardiv'>
            <div className='chatsidebar_subdiv' onClick={handlePersonalChat}>
                <img src={PersonalChat} alt='logo' />
                <div className='count_div'>{personalUnreadCount}</div>
            </div>
            <div className='chatsidebar_subdiv' onClick={handleGroupChat}>
                <img src={GroupImage} logo="logo" />
                <div className='count_div'>{groupUnreadCount}</div>
            </div>
        </div>
    )
}

export default ChatSidebar