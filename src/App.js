import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./routers/AllRoutes";
import { SideButtons } from "./components/SideButtons/SideButtons"

function App() {
  return (
    <BrowserRouter>
      <AllRoutes />
    </BrowserRouter>
  );
}

export default App;
