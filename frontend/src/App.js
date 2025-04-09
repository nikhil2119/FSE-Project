import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/partials/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Footer from './components/partials/Footer';
import Products from './components/Products';
import Categories from './components/Categories';
import Cart from './components/Cart';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SellerDashboard from './pages/SellerDashboard';

// Layout component that conditionally renders Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarFooter = [
    '/login', 
    '/register', 
    '/admin/login',
    '/admin',
    '/admin/products',
    '/admin/categories',
    '/admin/orders',
    '/admin/users',
    '/admin/reports',
    '/admin/settings',
    '/seller',
    '/seller/products',
    '/seller/orders',
    '/seller/discounts',
    '/seller/reports'
  ].some(path => location.pathname.startsWith(path));

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      {children}
      {!hideNavbarFooter && <Footer />}
    </>
  );
};

// App component with routes wrapped in Layout
function AppContent() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        
        {/* Seller Routes */}
        <Route path="/seller/*" element={<SellerDashboard />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

// Main App component
function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;
