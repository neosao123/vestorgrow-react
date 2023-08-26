import React from 'react';
import moment from 'moment';

const ChatMsgTimeStamp = (props) => {
    var stamp = "";
    if (props.onlyTime) {
        stamp = moment(props.dateTime).format("HH:mm");
    } else {
        const now = moment(new Date()).format("MM/DD/yyyy");
        const msgDate = moment(props.dateTime).format("MM/DD/yyyy"); 
        var d1 = new Date(msgDate);
        var d2 = new Date(now);
        var diffDays = parseInt((d2 - d1) / (1000 * 60 * 60 * 24), 10); 
        if (diffDays === 0) {
            stamp = moment(props.dateTime).format("HH:mm");
        } else if (diffDays === 1) {
            stamp = "Yesterday";
        } else {
            stamp = moment(props.dateTime).format("MMM DD yy");
        }
    }
    return <span>{stamp}</span>;
}

export default ChatMsgTimeStamp;