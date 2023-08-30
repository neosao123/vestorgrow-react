import React, { useEffect, useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ChatService from "../../services/chatService";
import GlobalContext from "../../context/GlobalContext";
import InviteMembers from "./InviteMembers";
import TextareaAutosize from 'react-textarea-autosize';
import { Link } from "react-router-dom";
import GroupLogoEdit from "./GroupLogoEdit";
import GroupImage from "../../shared/GroupImage";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const serv = new ChatService();

const ValidateSchema = Yup.object().shape({
  chatName: Yup.string().required("Required"),
  chatLogo: Yup.string().required("Required"),
  chatDesc: Yup.string().required("Required"),
  chatRules: Yup.string().required("Required"),
  // isPrivate: Yup.string().required("Required"),
});

export default function CreateGroup({ onClose, onFinish, groupId }) {
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [groupExecutionSuccess, setGroupExecutionSuccess] = globalCtx.groupExecutionSuccess;
  const [showInviteMembers, setShowInviteMembers] = useState(false);
  const [tempKeyword, setTempKeyword] = useState("");
  const [activeBtn, setActiveBtn] = useState(false);
  const [prevImg, setPrevImg] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [groupData, setGroupData] = useState();
  const [showEditProfileImg, setShowEditProfileImg] = useState(null);

  const [initialValue, setInitialValue] = useState({
    chatName: "",
    chatLogo: "",
    chatDesc: "",
    chatRules: "",
    isPrivate: false,
    chatKeyword: [],
    invitedUser: [],
    users: [user._id],
    groupAdmin: [user._id],
    createdBy: user._id,
    isGroupChat: true,
  });

  useEffect(() => {
    if (groupId !== true) {
      getGroupInfo();
    }
  }, [groupId]);

  const getGroupInfo = async () => {
    try {
      await serv.getChat(groupId).then((resp) => {
        delete resp.data.groupAdmin;
        delete resp.data.users;
        delete resp.data.createdBy;
        setInitialValue({ ...initialValue, ...resp.data });
        setGroupData(resp.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (value) => {
    console.log("handleSubmit")
    setActiveBtn(true);
    try {
      const formData = new FormData();
      for (let i in value) {
        if (i === "chatKeyword") {
          formData.append(i, JSON.stringify(value[i]));
        } else {
          formData.append(i, value[i]);
        }
      }
      if (groupId !== true) {
        await serv.editGroupChat(formData).then((resp) => {
          onFinish("updated");
          setGroupExecutionSuccess(!groupExecutionSuccess);
          // console.log(resp);
        });
      } else {
        
        await serv.createGroupChat(formData).then((resp) => {
          onFinish("created");
          setGroupExecutionSuccess(!groupExecutionSuccess);
          // console.log(resp);
        });
      }
      setActiveBtn(false);
    } catch (err) { }
  };

  const formik = useFormik({
    initialValues: initialValue,
    validateOnBlur: true,
    onSubmit,
    validationSchema: ValidateSchema,
    enableReinitialize: true,
  });

  const handleProfileImage = (img) => {
    formik.setFieldValue("chatLogo", img);
    setShowEditProfileImg(null)
  };

  return (
    <>
      <div className="modal show" style={{ display: "block" }}>
        <div className="vertical-alignment-helper">
          <div className="vertical-align-center vertical-align-center-custom">
            <div className="edit-profile modal-dialog modal-lg modal-lg-custom modal-lg-customMobile">
              <div className="modal-content">
                <div className="modal-header modal-headerCreateGroup-custom">
                  <div className="modal-BackCreateGroup-custom" onClick={onClose}>
                    <img
                      className="arrow"
                      src="/images/icons/left-arrow.svg"
                      alt="Group Icon"
                    />
                  </div>
                  <div className="followesNav createGroup-headingCustom">
                    <h4 className="mb-0"> {(groupId === true) ? "Create" : "Edit"} your group</h4>
                  </div>
                  <div className="createPostRight d-flex align-items-center createPostRight-mobile-close-custom">
                    <div className="createPostDropDown d-flex align-items-center"></div>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={onClose} />
                  </div>
                </div>
                <div style={{ height: "calc(100vh - 150px)", overflowY: "scroll", overflowX: "hidden", margin: "15px" }}>
                  <form onSubmit={formik.handleSubmit} >
                    <div className="groupMainDetail groupMainDetail-customPadding" >
                      <div style={{ position: "relative" }} className="mb-3">
                        <div className="groupLogo2 m-3" >
                          <GroupImage
                            url={
                              typeof formik.values.chatLogo == "string"
                                ? formik.values.chatLogo
                                : URL.createObjectURL(formik.values.chatLogo)
                            }
                          />
                        </div>

                        <div onClick={() => setShowEditProfileImg(formik.values.chatLogo)}>
                          <label htmlFor="chatLogo1" style={{ width: '24px', height: '24px', position: "absolute", bottom: "24px", right: "24px" }}>
                            <img src="/images/profile/Edit.svg" alt="" />
                          </label>
                        </div>

                        {!formik.values.chatLogo && (
                          <input
                            type="file"
                            className="form-control"
                            id="chatLogo1"
                            name="chatLogo1"
                            hidden
                            onChange={(event) => {
                              setShowEditProfileImg(event.currentTarget.files[0]);
                              //setPrevImg(event.currentTarget.files[0]);
                              event.target.value = null;
                            }} />)
                        }
                      </div>
                      <div className="col-sm-8 px-4 mb-3">
                        <input
                          className={
                            "form-control customName" +
                            (formik.touched.chatName && formik.errors.chatName ? " is-invalid" : "")
                          }
                          placeholder="Group name*"
                          name="chatName"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.chatName}
                        />
                        {formik.touched.chatName && formik.errors.chatName ? (
                          <div className="valid_feedbackMsg">{formik.errors.chatName}</div>
                        ) : null}
                      </div>
                    </div>
                    {/* Modal body */}
                    <div className="modal-body px-0">
                      <div className="tabSendContent">
                        <div className="myProfile_sec">
                          <div className="about_profile">
                            <div className="row pofiegrid">
                              <div className="col-sm-12 px-4">
                                <div className="m-4 mb-sm-4 commonform commonformBioCustom">
                                  <label>Description*</label>
                                  <TextareaAutosize
                                    minRows={5}
                                    maxRows={9}
                                    name="chatDesc"
                                    className="modern-text-area"
                                    defaultValue={formik.values.chatDesc}
                                    onChange={formik.handleChange}
                                    placeholder="Please describe your group"
                                    style={{ borderRadius: "5px" }}
                                  />
                                </div>
                                <div className="m-4 mb-sm-4 commonform commonformBioCustom">
                                  <label>Rules*</label>
                                  <TextareaAutosize
                                    minRows={5}
                                    maxRows={9}
                                    name="chatRules"
                                    className="modern-text-area"
                                    defaultValue={formik.values.chatRules}
                                    onChange={formik.handleChange}
                                    placeholder="Lay down some house rules"
                                    style={{ borderRadius: "5px" }}
                                  />
                                </div>
                                <div className="m-4 mb-sm-4 commonform">
                                  <p>
                                    <span>Keywords*</span> (please add up to 3 keywords for your group i.e. investing.
                                    This will allow users to find your group when searching)
                                  </p>
                                  <div className="d-flex align-items-center">
                                    <input
                                      type={"text"}
                                      placeholder="Type keyword"
                                      className=""
                                      value={tempKeyword}
                                      onChange={(e) => setTempKeyword(e.target.value)}
                                    />
                                    <button
                                      type="button"
                                      className={
                                        "add-key-design ms-2 " +
                                        (tempKeyword !== "" && formik.values.chatKeyword.length < 3
                                          ? "active"
                                          : "disabled")
                                      }
                                      disabled={!(tempKeyword !== "" && formik.values.chatKeyword.length < 3)}
                                      onClick={(e) => {
                                        formik.setFieldValue("chatKeyword", [...formik.values.chatKeyword, tempKeyword]);
                                        setTempKeyword("");
                                      }}
                                    >
                                      <img
                                        src="/images/icons/plus-sign.svg"
                                        alt="compose-button"
                                        className="img-fluid composeButton"
                                      />
                                    </button>
                                  </div>
                                  <div className="keyWord mt-3 d-flex">
                                    {formik.values.chatKeyword.map((item, idx) => {
                                      return (
                                        <span className="keywordListItem">
                                          <p>{formik.values.chatKeyword[idx]}</p>
                                          <img
                                            src="/images/icons/white-cross.svg"
                                            alt="compose-button"
                                            classNames="img-fluid composeButton"
                                            style={{ height: "12px", width: "12px" }}
                                            onClick={() => {
                                              let temp = formik.values.chatKeyword;
                                              temp.splice(idx, 1);
                                              formik.setFieldValue("chatKeyword", temp);
                                            }}
                                          />
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div className="m-4 mb-sm-4 commonform d-flex align-items-center justify-content-between">
                                  <p className="privateLabel">Group type*</p>
                                  <label className="switch">
                                    <input
                                      style={{ display: "none" }}
                                      type="checkbox"
                                      name="isPrivate"
                                      onChange={(e) => formik.setFieldValue("isPrivate", e.target.checked)}
                                    // defaultChecked={formik.values.isPrivate}
                                    />
                                    <div className="sliderOuter">
                                      <span className={"sliderInner " + (!formik.values.isPrivate ? "active" : "")}>
                                        Public
                                      </span>
                                      <span className={"sliderInner " + (formik.values.isPrivate ? "active" : "")}>
                                        Private
                                      </span>
                                    </div>
                                  </label>
                                </div>

                                <div className="m-4 mb-sm-4 commonform d-flex align-items-center ">
                                  <a className="add-group-member" onClick={() => setShowInviteMembers(true)}>
                                    <img src="/images/icons/add-people.svg" alt="" />
                                    <p className="m-0">Add members</p>
                                  </a>
                                  {formik.values?.invitedUser?.length > 0 && (
                                    <p className="membersCount m-0 ms-3">
                                      <span className="fw-bold"> {formik.values.invitedUser.length}</span> members
                                      invited
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="postFile mt-3">
                                <div className="postBtn postBtnCustom postBtnCustom-CustomBtnCreate">
                                  <button

                                    type="submit"
                                    className={"btn btnColor "}
                                    disabled={activeBtn}
                                  >
                                    {(groupId !== true) ? "Save" : "Create group"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div >
      </div >
      {showInviteMembers && (
        <InviteMembers
          onClose={() => setShowInviteMembers(false)}
          onConfirm={(data) => {
            formik.setFieldValue("invitedUser", [...data]);
            setShowInviteMembers(false);
          }}
        />
      )
      }
      {!showInviteMembers && <div className="modal-backdrop show"></div>}
      {
        showEditProfileImg && (
          <div className="show modal-backdrop-custom-zindex-bg">
            <GroupLogoEdit
              file={showEditProfileImg}
              onClose={() => setShowEditProfileImg(null)}
              onComplete={handleProfileImage}
            />
          </div>
        )
      }
    </>
  );
}
