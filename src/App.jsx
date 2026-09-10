import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import Products from "./pages/Products.jsx";
import Careers from "./pages/Careers.jsx";
import Contact from "./pages/Contact.jsx";
import CollectiveIntelligence from "./pages/CollectiveIntelligence.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Platform from "./pages/Platform.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";

export default function App() {
  const { pathname } = useLocation();
  const appMode = pathname.startsWith("/platform");

  return (
    <div className="site">
      {appMode ? null : <Nav />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/collective-intelligence" element={<CollectiveIntelligence />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/platform"
            element={
              <ProtectedRoute>
                <Platform />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {appMode ? null : <Footer />}
    </div>
  );
}
