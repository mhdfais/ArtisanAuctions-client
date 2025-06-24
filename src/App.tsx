
import { BrowserRouter as Router, Routes } from "react-router-dom";

import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {UserRoutes}
          {AdminRoutes}
          
        </Routes>
      </Router>
    </>
  );
}

export default App;
