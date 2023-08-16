import React, { useState, useEffect } from 'react';
import ChatService from '../../services/chatService';
import "./grouplist.css";

const MyGroupList = ({ ...props }) => {
  const { userData } = props;
  const serv = new ChatService();
  const [chatList, setChatList] = useState([]);
  const [invitationList, setInvitationList] = useState([]);

  const getChatList = async () => {
    try {
      let obj = {
        filter: {
          isGroupChat: true,
          user: userData._id,
        },
      };
      await serv.listAllChat(obj).then((resp) => {
        if (resp.data) {
          setChatList([...resp.data]);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getInvitationList = async () => {
    try {
      let obj = {
        filter: {
          isGroupChat: true,
        },
      };
      await serv.listAllInvitation(obj).then((resp) => {
        if (resp.data) {
          setInvitationList([...resp.data]);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      let obj = {
        groupId: groupId,
      };
      await serv.joinGroup(obj).then((resp) => {
        if (resp.message) {
          getChatList();
          getInvitationList();
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getChatList();
    getInvitationList();
  }, []);

  return (
    <div className='row group-list'>
      {
        chatList.map((item, idx) => {
          let inUserList = item.users.map((i) => i._id);
          return (
            <div className='col-6 col-ms-6 col-md-4 col-lg-3 bd-left'>
              <div className="group" key={"oth" + idx}>
                <div className='group-logo'>
                  <img src={item.chatLogo} alt="" />
                </div>
                <div>
                  <h5 className="group-title">{item.chatName}</h5>
                </div>
                <div>
                  {
                    item.createdBy === userData._id ? (
                      <button className='group-btn member-btn'>Admin</button>
                    ) :
                      inUserList.includes(userData._id) ? (
                        <button className='group-btn member-btn'>Member</button>
                      ) : (
                        <button className='group-btn join-btn' onClick={() => handleJoinGroup(item?._id)}>Join</button>
                      )
                  }
                </div>
              </div>
            </div>
          );
        })
      }
      {
        invitationList.map((item, idx) => {
          return (
            <div className='col-6 col-ms-6 col-md-4 col-lg-3 bd-left'>
              <div className="group" key={"invite" + idx}>
                <div className='group-logo'>
                  <img src={item.groupId?.chatLogo} alt="" />
                </div>
                <div>
                  <h5 className="group-title">{item.groupId?.chatName}</h5>
                </div>
                <div>
                  <button className='group-btn join-btn' onClick={() => handleJoinGroup(item.groupId?._id)}>Join</button>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  )
}

export default MyGroupList;