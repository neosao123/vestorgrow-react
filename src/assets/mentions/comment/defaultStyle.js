
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    control: {
        zIndex: 0,
        backgroundColor: "#fff",
        fontSize: "14px",
        left: "2%",
        margin: "none",
        fontWeight: "normal",
        color: "white",
        outline: "none"
    },
    "&multiLine": {
        zIndex: 0,
        control: {
            borderRadius: "5px",
            color: "white",
            overflowY: "auto",
            outline: "none",
            maxHeight: 80
        },
        highlighter: {
            padding: 9,
        },
        input: {
            padding: "9px",
        }
    },
    suggestions: { 
        list: {
            backgroundColor: "white",
            border: "1px solid rgba(0,0,0,0.15)",
            borderRadius: "15px",
            fontSize: "12px",
            maxHeight: "200px",
            width: "250px",
            overflowY: "scroll",
            scrollbarColor: "inherit",
        },
        item: {
            padding: "4px 8px",
            borderBottom: "1px solid rgba(0,0,0,0.15)",
            "&focused": {
                backgroundColor: "#dcfaff",
                //color: "white",
                fontWeight: "500",
            }
        },
    },
};
