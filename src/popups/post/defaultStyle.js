
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    control: {
        backgroundColor: "#fff",
        fontSize: "14px",
        left: "2%",
        margin: "none",
        fontWeight: "normal",
        color: "white",
        outline: "none"
    },
    "&multiLine": {
        control: {
            color: "white",
            minHeight: 100,
            maxHeight: 300,
            overflowY: "auto",
            outline: "none"
        },
        highlighter: {
            padding: 9,
        },
        input: {
            padding: "9px",
        },
    },
    suggestions: {
        zIndex: 2,
        list: {
            backgroundColor: "white",
            border: "1px solid rgba(0,0,0,0.15)",
            borderRadius: "2%",
            fontSize: "12px",
            maxHeight: "200px",
            width: "250px",
            overflowY: "scroll",
            scrollbarColor: "inherit",
            zIndex: "2"
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
