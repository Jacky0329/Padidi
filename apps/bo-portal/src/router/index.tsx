import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';
import CategoriesPage from '../pages/CategoriesPage';
import AdsPage from '../pages/AdsPage';
import OrdersPage from '../pages/OrdersPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import BoLayout from '../components/BoLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const token = localStorage.getItem('bo_jwt');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <BoLayout>{children}</BoLayout>;
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/products"
                    element={<ProtectedRoute><ProductsPage /></ProtectedRoute>}
                />
                <Route
                    path="/categories"
                    element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>}
                />
                <Route
                    path="/ads"
                    element={<ProtectedRoute><AdsPage /></ProtectedRoute>}
                />
                <Route
                    path="/orders"
                    element={<ProtectedRoute><OrdersPage /></ProtectedRoute>}
                />
                <Route
                    path="/admin-users"
                    element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>}
                />
                <Route path="/" element={<Navigate to="/products" replace />} />
                <Route path="*" element={<Navigate to="/products" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
