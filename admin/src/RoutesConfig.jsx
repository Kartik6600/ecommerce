import {
  FiHome,
  FiMonitor,
  FiUsers,
  FiPlusCircle,
  FiShoppingCart,
  FiGift,
  FiTag,
  FiPackage
} from 'react-icons/fi'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ListUsers from './pages/ListUsers'
import AddProduct from './pages/AddProduct'
import ListProducts from './pages/ListProducts'
import ListOrders from './pages/ListOrders'
import AddCoupon from './pages/AddCoupon'
import ListCoupons from './pages/ListCoupons'
export const routesConfig = [
  { path: '/', label: 'Home', icon: <FiHome />, element: Home },
  { path: '/dashboard', label: 'Dashboard', icon: <FiMonitor />, element: Dashboard },
  { path: '/users', label: 'Users', icon: <FiUsers />, element: ListUsers },
  { path: '/orders', label: 'Orders', icon: <FiPackage />, element: ListOrders },
  { path: '/addproducts', label: 'Add Product', icon: <FiPlusCircle />, element: AddProduct },
  { path: '/products', label: 'Products', icon: <FiShoppingCart />, element: ListProducts },
  { path: '/addcoupon', label: 'Add Coupons', icon: <FiGift />, element: AddCoupon },
  { path: '/coupons', label: 'Coupons', icon: <FiTag />, element: ListCoupons },
]
