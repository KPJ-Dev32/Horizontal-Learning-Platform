import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import CreateAccount from './pages/CreateAccount/CreateAccount'
import ThankYou from './pages/ThankYou/ThankYou'
import ErrorPage from './pages/ErrorPage/ErrorPage'
import Home from './pages/Home/Home'
import Training from './pages/Training/Training'
import ContactUs from './pages/ContactUs/ContactUs'
import Profile from './pages/Profile/Profile'
import EditProfile from './pages/EditProfile/EditProfile'
import ChangePassword from './pages/ChangePassword/ChangePassword'
import Certification from './pages/Certification/Certification'
import FrontendCertifications from './pages/Certification/FrontendCertifications'
import BackendCertifications from './pages/Certification/BackendCertifications'
import DevopsCertifications from './pages/Certification/DevopsCertifications'
import CertificationDetails from './pages/Certification/CertificationDetails'
import CourseDetails from './pages/CategoryListing/CourseDetails'
import FrontendSolutions from './pages/CategoryListing/FrontendSolutions'
import BackendSolutions from './pages/CategoryListing/BackendSolutions'
import DevopsSolutions from './pages/CategoryListing/DevopsSolutions'
import QASolutions from './pages/CategoryListing/QASolutions'
import DesignSolutions from './pages/CategoryListing/DesignSolutions'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/home" element={<Home />} />
        <Route path="/training" element={<Training />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/certification" element={<Certification />} />
        <Route path="/frontend-certifications" element={<FrontendCertifications />} />
        <Route path="/backend-certifications" element={<BackendCertifications />} />
        <Route path="/devops-certifications" element={<DevopsCertifications />} />
        <Route path="/certification-details" element={<CertificationDetails />} />
        <Route path="/course-details" element={<CourseDetails />} />
        <Route path="/frontend-solutions" element={<FrontendSolutions />} />
        <Route path="/backend-solutions" element={<BackendSolutions />} />
        <Route path="/devops-solutions" element={<DevopsSolutions />} />
        <Route path="/qa-solutions" element={<QASolutions />} />
        <Route path="/design-solutions" element={<DesignSolutions />} />
        <Route path="/404" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  )
}

export default App
