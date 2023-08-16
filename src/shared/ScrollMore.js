import { useRef, useEffect, useState } from "react";

function ScrollMore({ children, className, id, reachedBottomCall, useWindowScroll }) {
  const d = new Date();
  let time = d.getSeconds();
  const [scrolledToBottom, setScrolledToBottom] = useState(time);
  const [firstRender, setFirstRender] = useState(true);
  useEffect(() => {
    if (useWindowScroll) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [useWindowScroll]);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
    } else {
      reachedBottomCall();
    }
  }, [scrolledToBottom]);

  const listInnerRef = useRef();
  const handleScroll = (e) => {
    let scrollTop, scrollHeight, clientHeight, adjustment;
    if (useWindowScroll) {
      scrollTop = window.scrollY;
      scrollHeight = document.body.offsetHeight;
      clientHeight = window.innerHeight;
      adjustment = 10;
    } else {
      scrollTop = listInnerRef.current.scrollTop;
      scrollHeight = listInnerRef.current.scrollHeight;
      clientHeight = listInnerRef.current.clientHeight;
      adjustment = 50;
    }
    if (scrollTop + clientHeight >= scrollHeight - adjustment) {
      const d = new Date();
      let time = d.getSeconds();
      setScrolledToBottom(time);
    }
  };

  return (
    <div
      className={className}
      id={id}
      onScroll={handleScroll} // this onScroll is useless if useWindowScroll is set to true
      // as we will be using window event listener in that case
      ref={listInnerRef}
    >
      {children}
    </div>
  );
}
export default ScrollMore;
