import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import WhatWeDo from "./pages/WhatWeDo.jsx";
import Services from "./pages/Services.jsx";
import Products from "./pages/Products.jsx";
import Careers from "./pages/Careers.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import CollectiveIntelligence from "./pages/CollectiveIntelligence.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import PlatformLayout from "./components/PlatformLayout.jsx";
import MasterConsultant from "./pages/platform/MasterConsultant.jsx";
import ProjectsList from "./pages/platform/ProjectsList.jsx";
import ProjectPage from "./pages/platform/ProjectPage.jsx";
import Fellows from "./pages/platform/Fellows.jsx";
import Profile from "./pages/platform/Profile.jsx";

export default function App() {
  const { pathname } = useLocation();
  const appMode = pathname.startsWith("/platform");

  return (
    <div className="site">
      <ScrollToTop />
      {appMode ? null : <Nav />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/what-we-do" element={<WhatWeDo />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/collective-intelligence" element={<CollectiveIntelligence />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/platform"
            element={
              <ProtectedRoute>
                <PlatformLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="chat" replace />} />
            <Route path="chat" element={<MasterConsultant />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/:projectId" element={<ProjectPage />} />
            <Route path="fellows" element={<Fellows />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </main>
      {appMode ? null : <Footer />}
    </div>
  );
}
