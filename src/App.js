import React from "react";
import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom";
import AuthLayout from "./Layout/AuthLayout";
import BuyPage from "./pages/BuyPage";
import Signup from "./pages/Profile/signup";
import Login from "./pages/Profile/login";
import ProtectedRoute from "./ProtectedRoutes";
import AdminRoute from "./AdminRoute";
import ShopPage from "./pages/Shop/shop"
import ScrollToTop from "./scrollToTop";
import UserProfile  from "./pages/Profile/UserProfile";
import VendorProfile  from "./pages/Profile/VendorProfile";
import AdminProfile from "./pages/Profile/AdminProfile";
import CartDrawer from "./components/Cart/CartDrawer"
import Navbar from "./components/navbar"
import OrderSummary from "./pages/Order/OrderCheckout";
import AdminOrders from "./pages/Order/adminorders";
import VendorOrders from "./pages/Order/VendorOrders";
import UserOrders from "./pages/Order/UserOrders";
import TopBar from "./components/topbar";
import AdminUsers from "./pages/Admin/usersAdmin";
import AdminShops from "./pages/Admin/adminShops";
import AdminVendors from "./pages/Admin/adminVendors";
import Settings from "./pages/Profile/Profilesettings";
import Plans from "./pages/plans";
import LocationModal from "./components/LocatioModal";
import ShopsPage from "./pages/Shop/ShopsPage";
import NotificationsPanel from "./pages/Notifications";
import ReceiptPage from "./pages/Receipt/ReceiptPage";
import Loader from "./components/Loader";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import FAQPage from "./pages/faq";
import VerifyEmail from "./pages/VerifyEmail";



function App() {

  const [loading, setLoading] = useState(true);

  const [cartOpen, setCartOpen] = useState(false);

  const [cartItems, setCartItems] = useState([]);

  const [showLocationModal, setShowLocationModal] =
  useState(false);

  


  // LOADER TIMER
  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500);

    return () => clearTimeout(timer);

  }, []);



  const addToCart = (product) => {

    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);

      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };


  useEffect(() => {

    const savedLocation =
      localStorage.getItem("userLocation");

    if (!savedLocation) {
      setShowLocationModal(true);
    }

  }, []);


  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };


  const saveLocation = (location) => {

    localStorage.setItem(
      "userLocation",
      JSON.stringify(location)
    );

  };


  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };


  const removeItem = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };


  // SHOW LOADER FIRST
  if (loading) {

    return <Loader />;

  }


  return (
   <>
    <ScrollToTop />

    <Navbar
      setCartOpen={setCartOpen}
      cartItems={cartItems}
    />

    <TopBar />

    <CartDrawer
      isOpen={cartOpen}
      setIsOpen={setCartOpen}
      cartItems={cartItems}
      increaseQty={increaseQty}
      decreaseQty={decreaseQty}
      removeItem={removeItem}
    />

    <Routes>

      <Route path="/" element={<BuyPage addToCart={addToCart}/>} />

      <Route
        path="/admin-orders"
        element={<AdminOrders addToCart={addToCart}/>}
      />

      <Route
        path="/receipt/:orderId"
        element={<ReceiptPage />}
      />

      <Route
        path="/shops-page"
        element={<ShopsPage addToCart={addToCart}/>}
      />

      <Route
        path="/admin-users"
        element={<AdminUsers addToCart={addToCart}/>}
      />

      <Route
        path="/admin-shops"
        element={<AdminShops addToCart={addToCart}/>}
      />

      <Route
        path="/notifications"
        element={<NotificationsPanel addToCart={addToCart}/>}
      />

      <Route
        path="/admin-vendors"
        element={<AdminVendors addToCart={addToCart}/>}
      />

      <Route
        path="/vendor-orders"
        element={<VendorOrders addToCart={addToCart}/>}
      />

      <Route
        path="/user-orders"
        element={<UserOrders addToCart={addToCart}/>}
      />

      <Route
        path="/settings"
        element={<Settings addToCart={addToCart}/>}
      />

      <Route
        path="/plans"
        element={<Plans addToCart={addToCart}/>}
      />

      <Route
        path="/about"
        element={<AboutPage addToCart={addToCart}/>}
      />

      <Route
        path="/contact"
        element={<ContactPage addToCart={addToCart}/>}
      />

      <Route
        path="/faq"
        element={<FAQPage addToCart={addToCart}/>}
      />

      <Route
        path="/verify"
        element={<VerifyEmail addToCart={addToCart}/>}
      />

      <Route
        path="/shop/:slug"
        element={
          <ShopPage
            addToCart={addToCart}
            cartItems={cartItems}
          />
        }
      />

      <Route
        path="/order-summary"
        element={
          <OrderSummary
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        }
      />

      <Route
        path="/user-profile"
        element={
          <ProtectedRoute>
            <UserProfile addToCart={addToCart}/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendor-profile"
        element={
          <ProtectedRoute>
            <VendorProfile addToCart={addToCart}/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-profile"
        element={
          <ProtectedRoute>
            <AdminProfile addToCart={addToCart}/>
          </ProtectedRoute>
        }
      />

      <Route element={<AuthLayout />}>

        <Route
          path="/login"
          element={<Login addToCart={addToCart}/>}
        />

        <Route
          path="/signup"
          element={<Signup addToCart={addToCart}/>}
        />

      </Route>

    </Routes>

    {
      showLocationModal && (

        <LocationModal
          closeModal={() =>
            setShowLocationModal(false)
          }

          saveLocation={saveLocation}
        />

      )
    }

   </>
  );
}

export default App;