import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./routers/AllRoutes";

function App() {
  return (
    <BrowserRouter>
      <AllRoutes />
    </BrowserRouter>
  );
}

export default App;
