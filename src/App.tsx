import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPageV2'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import TouristDashboard from './pages/TouristDashboard'
import BusinessDashboard from './pages/BusinessDashboard'
import AdminDashboard from './pages/AdminDashboard'
import UsersPage from './pages/UsersPage'
import ListingsPage from './pages/ListingsPage'
import BookingsPage from './pages/BookingsPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import OnboardingQuiz from './pages/OnboardingQuiz'
import ItineraryBuilder from './pages/ItineraryBuilder'
import BusinessListingsPage from './pages/BusinessListingsPage'
import BusinessBookingsPage from './pages/BusinessBookingsPage'
import BusinessEarningsPage from './pages/BusinessEarningsPage'
import BusinessReviewsPage from './pages/BusinessReviewsPage'
import BusinessSettingsPage from './pages/BusinessSettingsPage'
import MyTripsPage from './pages/MyTripsPage'
import SavedPlacesPage from './pages/SavedPlacesPage'
import TouristBookingsPage from './pages/TouristBookingsPage'
import TouristReviewsPage from './pages/TouristReviewsPage'
import TouristFollowingPage from './pages/TouristFollowingPage'
import DestinationDetailPage from './pages/DestinationDetailPage'
import TouristSettingsPage from './pages/TouristSettingsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/quiz" element={<OnboardingQuiz />} />
        <Route path="/tourist" element={<TouristDashboard />} />
        <Route path="/tourist/trips" element={<MyTripsPage />} />
        <Route path="/tourist/saved" element={<SavedPlacesPage />} />
        <Route path="/tourist/bookings" element={<TouristBookingsPage />} />
        <Route path="/tourist/reviews" element={<TouristReviewsPage />} />
        <Route path="/tourist/following" element={<TouristFollowingPage />} />
        <Route path="/tourist/settings" element={<TouristSettingsPage />} />
        <Route path="/destination/:id" element={<DestinationDetailPage />} />
        <Route path="/itinerary" element={<ItineraryBuilder />} />
        <Route path="/business" element={<BusinessDashboard />} />
        <Route path="/business/listings" element={<BusinessListingsPage />} />
        <Route path="/business/bookings" element={<BusinessBookingsPage />} />
        <Route path="/business/earnings" element={<BusinessEarningsPage />} />
        <Route path="/business/reviews" element={<BusinessReviewsPage />} />
        <Route path="/business/settings" element={<BusinessSettingsPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/listings" element={<ListingsPage />} />
        <Route path="/admin/bookings" element={<BookingsPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
