import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, Mail, UserPlus, XCircle } from "lucide-react";

const Signup = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "employee", // Default user type
  });
  const [message, setMessage] = useState({ type: "", text: "" }); // State for custom message box
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to show custom messages (success/error)
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showMessage("error", "Passwords do not match!");
      return;
    }

    // Only send fields that exist in your SignupRequest DTO (name and email)
    const payload = {
      name: formData.name,
      email: formData.email,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_PORT}/api/employees`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        // Attempt to parse error message from response, or use default
        const errorText = await res.text();
        let errorMessage = "Signup failed. Please try again.";
        try {
          const errorData = JSON.parse(errorText);
          if (
            res.status === 400 &&
            errorData.message === "Email already exists"
          ) {
            errorMessage = "Email already exists. Please login.";
          } else {
            errorMessage = errorData.message || res.statusText || errorMessage;
          }
        } catch (parseError) {
          // If response is not JSON, use the raw text or default message
          errorMessage = errorText || res.statusText || errorMessage;
        }
        showMessage("error", errorMessage);
        return;
      }

      const user = await res.json();
      console.log("Signup successful:", user);

      // Store user data in localStorage consistently with login
      localStorage.setItem("employeeId", user.id);
      localStorage.setItem("userType", formData.userType);
      localStorage.setItem("employeeName", user.name);
      // localStorage.setItem("userEmail", user.email);
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          type: formData.userType,
        })
      );

      setUser({ ...user, type: formData.userType }); // Update parent component state

      // Navigate based on user type
      if (formData.userType === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
      showMessage("success", "Account created successfully!");
    } catch (err) {
      console.error("Signup failed", err);
      showMessage(
        "error",
        "Signup failed. Network error or server unreachable. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 font-sans">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Join EvalEase
          </h2>
          <p className="mt-2 text-sm text-gray-600">Create your account</p>
        </div>

        {/* Custom Message Box */}
        {message.text && (
          <div
            className={`p-4 rounded-lg flex items-center justify-between ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            <p className="text-sm font-medium">{message.text}</p>
            <button
              onClick={() => setMessage({ type: "", text: "" })}
              className="ml-4"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150 ease-in-out"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150 ease-in-out"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Type
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="userType"
                    value="employee"
                    checked={formData.userType === "employee"}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700 text-sm">Employee</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="userType"
                    value="admin"
                    checked={formData.userType === "admin"}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700 text-sm">Admin</span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150 ease-in-out"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150 ease-in-out"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Create Account
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-600 hover:text-green-500 font-medium transition duration-150 ease-in-out"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
