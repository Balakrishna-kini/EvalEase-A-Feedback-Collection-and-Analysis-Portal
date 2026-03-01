import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users,
  FileText,
  BarChart3,
  Plus,
  TrendingUp,
  LogOut,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import ThemeSwitcher from "../ThemeSwitcher";
import { API_BASE_URL } from "../../config";

const AdminDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [recentForms, setRecentForms] = useState([]); // Changed here
  const [stats, setStats] = useState({
    totalForms: 0,
    responses: 0,
    avgRating: 0,
  });

  const colorBgMap = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    purple: "bg-purple-100",
    orange: "bg-orange-100",
  };

  const colorTextMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const statsData = [
    {
      title: "Total Forms",
      value: stats.totalForms,
      icon: FileText,
      color: "blue",
    },
    {
      title: "Responses",
      value: stats.responses,
      icon: Users,
      color: "purple",
    },
    {
      title: "Avg Rating",
      value: stats.avgRating.toFixed(1),
      icon: TrendingUp,
      color: "orange",
    },
  ];

  useEffect(() => {
    const apiBaseUrl = API_BASE_URL;
    const token = localStorage.getItem('token');
    if (!apiBaseUrl) {
      console.error("API_BASE_URL is not defined in config.ts");
      return;
    }
    axios
      .get(`${apiBaseUrl}/api/forms/recent`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setRecentForms(res.data))
      .catch((err) => console.error("Error fetching forms:", err));
  }, []);

  useEffect(() => {
    const apiBaseUrl = API_BASE_URL;
    const token = localStorage.getItem('token');
    if (!apiBaseUrl) {
      console.error("API_BASE_URL is not defined in config.ts");
      return;
    }
    axios
      .get(`${apiBaseUrl}/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setStats({
          totalForms: res.data.totalForms,
          responses: res.data.responses,
          avgRating: res.data.avgRating,
        });
      })
      .catch((err) => console.error("Error fetching dashboard stats:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user?.name || "Admin"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${colorBgMap[stat.color]} dark:bg-opacity-20 p-3 rounded-full`}>
                  <stat.icon
                    className={`${colorTextMap[stat.color]} h-6 w-6`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/admin/forms"
            className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition duration-200"
          >
            <div className="flex items-center space-x-3">
              <Plus className="h-6 w-6" />
              <span className="font-semibold">Create Form</span>
            </div>
            <p className="text-blue-100 text-sm mt-2">
              Build new feedback forms
            </p>
          </Link>

          <Link
            to="/admin/analytics"
            className="bg-purple-600 text-white p-6 rounded-xl hover:bg-purple-700 transition duration-200"
          >
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-6 w-6" />
              <span className="font-semibold">View Analytics</span>
            </div>
            <p className="text-purple-100 text-sm mt-2">
              Analyze feedback data
            </p>
          </Link>
        </div>

        {/* Recent Forms */}
        <h1 className="text-2xl font-bold text-gray-600 dark:text-gray-400 pb-2">Recent Forms</h1>
        {recentForms.length > 0 ? (
          recentForms.map((form, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{form.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Created on {new Date(form.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {form.responseCount}{" "}
                  {form.responseCount === 1 ? "response" : "responses"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total submissions</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No forms available</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
