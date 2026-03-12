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
  Edit,
  Trash2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import ThemeSwitcher from "../ThemeSwitcher";
import { API_BASE_URL } from "../../config";

const AdminDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [recentForms, setRecentForms] = useState([]);
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
    if (!apiBaseUrl || !token) {
      return;
    }
    axios
      .get(`${apiBaseUrl}/api/forms/recent`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setRecentForms(res.data))
      .catch((err) => console.error("Error fetching forms:", err));

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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Forms</h2>
          <Link to="/admin/forms" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {recentForms.length > 0 ? (
            recentForms.map((form) => (
              <div
                key={form.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                        {form.title}
                      </h3>
                      <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                        {form.category || "General"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>Created: {new Date(form.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1" />
                        <span>{form.responseCount} {form.responseCount === 1 ? "response" : "responses"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 border-t md:border-t-0 pt-3 md:pt-0">
                    <Link
                      to={`/admin/analytics/${form.id}`}
                      className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                      title="View Analytics"
                    >
                      <BarChart3 className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/admin/forms/edit/${form.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit Form"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={async () => {
                        if (window.confirm(`Are you sure you want to delete "${form.title}"?`)) {
                          try {
                            const apiBaseUrl = API_BASE_URL;
                            const token = localStorage.getItem('token');
                            const res = await fetch(`${apiBaseUrl}/api/forms/${form.id}`, {
                              method: 'DELETE',
                              headers: { 'Authorization': `Bearer ${token}` }
                            });
                            if (res.ok) {
                              setRecentForms(recentForms.filter(f => f.id !== form.id));
                              toast.success("Form deleted successfully");
                            } else {
                              toast.error("Failed to delete form");
                            }
                          } catch (err) {
                            console.error("Error deleting form:", err);
                            toast.error("Error deleting form");
                          }
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete Form"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No forms available yet.</p>
              <Link to="/admin/forms" className="text-blue-600 hover:underline text-sm font-medium mt-2 inline-block">Create your first form</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
