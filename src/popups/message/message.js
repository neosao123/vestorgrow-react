
// <div className={`textArea chatInput ${expend == 1 ? "textAreaLarge" : ""} textAreaCustom`}>
//   <textarea
//     className="form-control gray-color-custom input-group-custom input-group-msg-custom allFeedUser"
//     rows={message.content.length < 25 ? "1" : message.content.length < 60 ? "2" : "3"}
//     type="text"
//     placeholder="Type your message..."
//     onChange={(e) => setMessage({ ...message, content: e.target.value })}
//     value={message.content}
//   />
//   <div className="input-group-custom-child">
//     <span className="input-group-text gray-color-custom emoji">
//       <a href="javascript:void(0);" onClick={() => setShowEmoji(!showEmoji)}>
//         <img src="/images/icons/smile.svg" alt className="img-fluid" />
//       </a>
//     </span>
//     {/* <span className="input-group-text gray-color-custom emoji"><a href="javascript:void(0);" ><img src="/images/icons/smile.svg" alt className="img-fluid" /></a></span> */}
//     <span className="input-group-text file-upload gray-color-custom">
//       <a href="javascript:void(0);">
//         <label htmlFor={`imagess`}>
//           <img src="/images/icons/img-upload.svg" alt="file-upload" className="img-fluid" />
//         </label>
//       </a>
//     </span>
//     <div className="sendBtn sendBtnCustom message-btn-resize-custom">
//       <button type="button" className="btn p-0" onClick={sendMessage}>
//         {/* <button type="button" className="btn p-0" > */}
//         <img src="/images/icons/send.svg" alt="send" className="img-fluid" />
//       </button>
//     </div>
//   </div>
//   <input
//     style={{ display: "none" }}
//     type="file"
//     name="images"
//     id={`imagess`}
//     accept="image/*"
//     multiple={true}
//     onChange={(event) => {
//       setMessage({ ...message, file: [...message.file, ...event.currentTarget.files] });
//       event.target.value = null;
//     }}
//   />
// </div>