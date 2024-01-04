import { useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();
  return (
    <>
      <div className="socialContant main_container">
        <div className="learningPageSec">
          <h5>This page can't be loaded for some reason :( Please try again)</h5>
        </div>
      </div>
    </>
  );
}
