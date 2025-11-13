// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import StaffLogin from "./pages/StaffLogin";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminStaffCustomers from "./pages/Admin/AdminStaffCustomers";
import StaffDashboard from "./pages/Staff/StaffDashboard";
import StaffProducts from "./pages/Staff/StaffProducts";
import AddProduct from "./pages/Shared/AddProduct";
import EditProduct from "./pages/Shared/EditProduct";
import AddStock from "./pages/Shared/AddStock";
import EditUser from "./pages/Shared/EditUser";
import EditCustomer from "./pages/Admin/EditCustomer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import CustomerProtectedRoute from "./components/CustomerProtectedRoute";
import { CartProvider } from "./context/CartContext";
import CustomerAuth from "./pages/CustomerAuth";
import CartPage from "./pages/CartPage";
import CartCheckout from "./pages/CartCheckout";
import BuyNowCheckout from "./pages/BuyNowCheckout";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import StaffOrdersPage from "./pages/Shared/StaffOrdersPage";
import AddProductsJson from "./pages/Admin/AddProductsJson";
import ResetPassword from "./pages/Admin/ResetPassword";
import AdminReports from "./pages/Admin/AdminReports";
import FAQs from "./pages/FAQs";
import Returns from "./pages/Returns";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./pages/About";
import StaffProfile from "./pages/Staff/StaffProfile";
import ChangePassword from "./pages/Shared/ChangePassword";
import CusResetPassword from "./pages/CusResetPassword";
import EditAdmin from "./pages/Admin/EditAdmin";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={
              <Products />
            } />
            <Route path="/staff/login" element={<StaffLogin />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<CustomerAuth />} />
            <Route
              path="/checkout"
              element={
                <CustomerProtectedRoute>
                  <CartCheckout />
                </CustomerProtectedRoute>
              }
            />
            <Route
              path="/buy-now"
              element={
                <CustomerProtectedRoute>
                  <BuyNowCheckout />
                </CustomerProtectedRoute>
              }
            />
            <Route
              path="/order-success"
              element={
                <CustomerProtectedRoute>
                  <OrderSuccess />
                </CustomerProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <CustomerProtectedRoute>
                  <Profile />
                </CustomerProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <CustomerProtectedRoute>
                  <CartPage />
                </CustomerProtectedRoute>
              }
            />
            <Route
              path="/cuspassword-reset"
              element={
                <CustomerProtectedRoute>
                  <CusResetPassword />
                </CustomerProtectedRoute>
              }
            />


            <Route
              path="/staff/dashboard"
              element={
                <ProtectedRoute allowedRoles={["staff"]}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/products"
              element={
                <ProtectedRoute allowedRoles={["staff"]}>
                  <StaffProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff-profile"
              element={
                <ProtectedRoute allowedRoles={["staff"]}>
                  <StaffProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/staff-customers"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminStaffCustomers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-profile"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <StaffProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-editprofile"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <EditAdmin />
                </ProtectedRoute>
              }
            />
            <Route path="/product/add" element={
              <ProtectedRoute allowedRoles={["admin", "staff"]}>
                <AddProduct />
              </ProtectedRoute>
            } />

            <Route path="/product/edit/:id" element={
              <ProtectedRoute allowedRoles={["admin", "staff"]}>
                <EditProduct />
              </ProtectedRoute>
            } />

            <Route
              path="/add-stock"
              element={
                <ProtectedRoute allowedRoles={["admin", "staff"]}>
                  <AddStock />
                </ProtectedRoute>
              }
            />

            <Route
              path="/manage-orders"
              element={
                <ProtectedRoute allowedRoles={["admin", "staff"]}>
                  <StaffOrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-user/:type/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "staff"]}>
                  <EditUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-customer/:id"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <EditCustomer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-product-json"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AddProductsJson />
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute allowedRoles={["admin", "staff"]}>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resetPassword/:id"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={<ProtectedRoute
                allowedRoles={['admin']}>
                <AdminReports />
              </ProtectedRoute>}
            />
            <Route path="/faq" element={<FAQs />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<div>404 Not Found</div>} />

          </Routes>
        </CartProvider >
      </AuthProvider >
    </BrowserRouter>

  );
}

export default App;
