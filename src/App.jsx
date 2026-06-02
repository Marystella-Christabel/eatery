import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { validateToken } from './store/authSlice'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Services from './pages/Services'
import Order from './pages/Order'
import Contact from './pages/Contact'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import MyOrders from './pages/MyOrders'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const dispatch = useDispatch()

  // Validate stored JWT token on app load
  useEffect(() => {
    dispatch(validateToken())
  }, [dispatch])

  return (
    <div className="page">
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/services" element={<Services />} />
          <Route path="/order" element={<Order />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
