import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, LogIn, XCircle, Mail } from "lucide-react"; // Import XCircle and Mail

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Retain password for UI, even if not used by backend for employee login
  const [userType, setUserType] = useState("employee");
  const [message, setMessage] = useState({ type: "", text: "" }); // State for custom message box
  const navigate = useNavigate();

  // Function to show custom messages (success/error)
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000); // Clear message after 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userType === "employee") {
      try {
        // For employee login, fetch user by email (GET request)
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_PORT}/api/employees/email/${email}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!res.ok) {
          // If response is not OK (e.g., 404 Not Found)
          const errorText = await res.text();
          let errorMessage =
            "Login failed. Employee not found or network error.";
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || res.statusText || errorMessage;
          } catch (parseError) {
            errorMessage = errorText || res.statusText || errorMessage;
          }
          showMessage("error", errorMessage);
          return;
        }

        const user = await res.json();
        console.log("Employee login successful:", user);

        // Store user data in localStorage consistently
        localStorage.setItem("employeeId", user.id);
        localStorage.setItem("userType", userType); // Store the selected userType
        localStorage.setItem("employeeName", user.name);
        // localStorage.setItem("userEmail", user.email); // Store email
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            type: userType, // Use the selected userType
          })
        );

        setUser({ ...user, type: userType }); // Update parent component state
        navigate("/employee/dashboard");
        showMessage("success", "Employee login successful!");
      } catch (error) {
        console.error("Error during Employee Login:", error);
        showMessage(
          "error",
          "Login failed. Please check your credentials and try again."
        );
      }
    } else {
      // Mock admin login
      // In a real app, this would involve a separate API call to an admin authentication service
      const adminUser = {
        id: "admin-id-001", // A mock ID for admin
        email: email, // Use the entered email for mock admin
        type: "admin",
        name: "Admin User", // Mock name
      };

      // Basic mock authentication check (e.g., specific email/password)
      if (email === "admin@evalease.com" && password === "adminpass") {
        setUser(adminUser);
        localStorage.setItem("loggedInUser", JSON.stringify(adminUser));
        localStorage.setItem("userType", "admin");
        localStorage.setItem("userEmail", adminUser.email);
        localStorage.setItem("employeeName", adminUser.name); // Storing admin name in employeeName for simplicity
        navigate("/admin/dashboard");
        showMessage("success", "Admin login successful!");
      } else {
        showMessage("error", "Invalid admin credentials.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">EvalEase</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Type
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="employee"
                    checked={userType === "employee"}
                    onChange={(e) => setUserType(e.target.value)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700 text-sm">Employee</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="admin"
                    checked={userType === "admin"}
                    onChange={(e) => setUserType(e.target.value)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700 text-sm">Admin</span>
                </label>
              </div>
            </div>

            {/* Removed name field from Login as it's not needed for employee lookup by email */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div> */}

            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Sign In
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-500 font-medium transition duration-150 ease-in-out"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
