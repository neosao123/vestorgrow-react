import React, { useContext, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import UserService from "../services/UserService"
const userServ = new UserService();
export default function Tooltip({ anchorId, place, html, arrow, style }) {
    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user
    const [showToolTip, setShowToolTip] = globalCtx.showToolTip
    useEffect(() => {
        if (showToolTip + 1 > 3) {
            handleFirstView()
        }
        document.getElementById("tooltipNext" + showToolTip)?.addEventListener("click", () => setShowToolTip(showToolTip + 1))
        document.getElementById("tooltipSkip")?.addEventListener("click", () => { setShowToolTip(0); handleFirstView() })
    }, [showToolTip])
    const handleFirstView = () => {
        try {
            let obj = {
                first_view: ["home"]
            }
            let resp = userServ.editFirstView(obj)
            if (resp.data) {
                setUser(resp.data.result)
                localStorage.setItem("user", JSON.stringify(resp.data.result))
            }
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <>
            <ReactTooltip
                anchorId={anchorId}
                place={place}
                html={html}
                isOpen={true}
                classNameArrow={arrow}
                clickable={true}
                positionStrategy="fixed"
                style={
                    {
                        padding: "16px",
                        background: "white",
                        color: "#0D1B1D",
                        width: "293px",
                        height: "auto",
                        boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.05)",
                        borderRadius: "15px",
                        opacity: 1,
                        zIndex: 20000,
                        ...style
                    }
                }
            />
            <div className="modal-backdrop show"></div>
        </>
    )
}