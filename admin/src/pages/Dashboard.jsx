import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import {FiUsers, FiPackage, FiShoppingCart, FiDollarSign, FiTag,} from 'react-icons/fi';
import {PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom'
import { routesConfig } from '../RoutesConfig'
import Loader from '../components/Loader';
const Dashboard = ({ token }) => {
  const location = useLocation()
  const currentRoute = routesConfig.find(route => route.path === location.pathname)
  const title = currentRoute?.label || 'Page'
  const Icon = currentRoute?.icon || null
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    users: [],
    products: [],
    coupons: [],
    orders: []
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    activeCoupons: 0,
    categoryDistribution: [],
    salesByCategory: [],
    salesOverTime: [],
    inventoryStatus: [],
    topProducts: [],
    userActivity: []
  });
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/user/dashboard`, {
        headers: { token }
      });
      if (response.data.success) {
        const allOrders = response.data.users.flatMap(user =>
          user.orders.map(order => ({
            ...order.orderId,
            user: {
              id: user._id,
              name: user.name,
              email: user.email
            }
          }))
        );
        setDashboardData({
          users: response.data.users,
          products: response.data.products,
          coupons: response.data.coupons,
          orders: allOrders
        });
        calculateStats(response.data, allOrders);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };
  const calculateStats = (data, orders) => {
  const totalSales = orders.reduce((sum, order) => sum + order.amount, 0);
  const activeCoupons = data.coupons.filter(coupon => new Date(coupon.expiry) > new Date()).length;
  const categoryData = data.products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  const salesByCategory = {};
  const salesOverTime = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + order.amount;
    order.items.forEach(item => {
      const product = data.products.find(p => p._id === item.productId);
      if (product) {
        salesByCategory[product.category] = (salesByCategory[product.category] || 0) + item.quantity;
      }
    });
    return acc;
  }, {});
  const processedSalesOverTime = Object.entries(salesOverTime)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);
  const inventoryStatus = [
    { name: 'Available', value: data.products.filter(p => p.available).length },
    { name: 'Out of Stock', value: data.products.filter(p => !p.available).length }
  ];
  const topProducts = [...data.products]
    .sort((a, b) => {
      const aScore = (a.viewCount || 0) + (a.purchaseCount || 0);
      const bScore = (b.viewCount || 0) + (b.purchaseCount || 0);
      return bScore - aScore;
    })
    .slice(0, 5);

  const userActivity = data.users
    .sort((a, b) => b.loginCount - a.loginCount)
    .slice(0, 5)
    .map(user => ({
      name: user.name,
      logins: user.loginCount,
      orders: user.orders.length
    }));

  setStats({
    totalUsers: data.users.length,
    totalProducts: data.products.length,
    totalOrders: orders.length,
    totalSales,
    activeCoupons,
    categoryDistribution: Object.entries(categoryData).map(([name, value]) => ({ name, value })),
    salesByCategory: Object.entries(salesByCategory).map(([name, value]) => ({ name, value })),
    salesOverTime: processedSalesOverTime,
    inventoryStatus,
    topProducts,
    userActivity
  });
};
  useEffect(() => {
    fetchDashboardData();
  }, []);
  const chartColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c'];
  if (loading) {
     return <Loader message="Preparing Dashboard" />;
  }
  return (
    <div className="px-4 md:p-8 py-4 space-y-10 bg-gradient-to-br from-gray-50 to-white min-h-screen mt-10 sm:mt-0">
      <h1 className="text-4xl font-extrabold text-[#191973] mb-2 flex items-center gap-2 border-b pb-2">
       {Icon && <span className="text-pink-500">{Icon}</span>}
        {title}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Link to="/users">
          <StatCard icon={<FiUsers size={24} />} title="Total Users" value={stats.totalUsers} color="blue" />
        </Link>
        <Link to="/products">
          <StatCard icon={<FiPackage size={24} />} title="Products" value={stats.totalProducts} color="green" />
        </Link>
        <Link to="/orders">
          <StatCard icon={<FiShoppingCart size={24} />} title="Orders" value={stats.totalOrders} color="yellow" />
        </Link>
        <Link to="/dashboard">
          <StatCard icon={<FiDollarSign size={24} />} title="Sales" value={`₹${stats.totalSales.toLocaleString()}`} color="purple" />
        </Link>
        <Link to="/coupons">
          <StatCard icon={<FiTag size={24} />} title="Active Coupons" value={stats.activeCoupons} color="orange" />
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Sales Trend">
          <LineChart data={stats.salesOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ChartCard>
        <ChartCard title="Product Distribution">
          <PieChart>
            <Pie
              data={stats.categoryDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {stats.categoryDistribution.map((_, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChartCard title="Inventory Status">
          <PieChart>
            <Pie
              data={stats.inventoryStatus}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
            >
              {stats.inventoryStatus.map((_, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>
        <motion.div className="bg-white p-6 rounded-2xl shadow col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Product</th>
                  <th className="p-3">Views</th>
                  <th className="p-3">Purchase</th>
                  <th className="p-3">Category</th>
                </tr>
              </thead>
              <tbody>
                {stats.topProducts.map(product => (
                  <tr key={product._id} className="hover:bg-gray-100 transition-colors duration-200">
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{product.viewCount || 0}</td>
                    <td className="p-3">{product.purchaseCount || 0}</td>
                    <td className="p-3">{product.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <ChartCard title="Top Users">
        <BarChart data={stats.userActivity}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="logins" fill="#8884d8" name="Login Count" />
          <Bar dataKey="orders" fill="#82ca9d" name="Orders Placed" />
        </BarChart>
      </ChartCard>
    </div>
  );
};
const ChartCard = ({ title, children }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white p-6 rounded-2xl shadow">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
    <div className="h-[20rem]">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </motion.div>
);
const colorMap = {
  blue: { bg: "bg-blue-100", text: "text-blue-600", hover: "group-hover:text-blue-700" },
  green: { bg: "bg-green-100", text: "text-green-600", hover: "group-hover:text-green-700" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-600", hover: "group-hover:text-yellow-700" },
  purple: { bg: "bg-purple-100", text: "text-purple-600", hover: "group-hover:text-purple-700" },
  orange: { bg: "bg-orange-100", text: "text-orange-600", hover: "group-hover:text-orange-700" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-600", hover: "group-hover:text-indigo-700" },
};
const StatCard = ({ icon, title, value, color = "indigo" }) => {
  const { bg, text, hover } = colorMap[color] || colorMap.indigo;
  return (
    <div className={`p-5 rounded-2xl shadow hover:shadow-md transition-shadow duration-300 flex items-center justify-between group ${bg} ${text}`}>
      <div>
        <p className={`text-sm text-opacity-80 ${hover} transition-colors`}>{title}</p>
        <p className={`text-2xl font-bold transition-colors ${hover}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-xl transition-all duration-300 bg-white ${text}`}>
        {icon}
      </div>
    </div>
  );
};
export default Dashboard;
