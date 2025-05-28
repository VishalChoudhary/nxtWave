import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ThankYou from "./pages/ThankYou";
import ErrorPage from "./pages/ErrorPage";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

const App = () => {
    const user = useSelector(state => state.user.currentUser);
    
    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Navigate to="/" /> : <Login />}  />
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login />}  />
                <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/error" element={<ErrorPage />} />
            </Routes>
        </Router>
    );
};

export default App;