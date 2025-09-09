import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaTwitter, FaGithub } from "react-icons/fa";
import { loginAdmin } from "../services/authService";
import { loginUser } from "../services/authService";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

// Login.jsx - Update the admin login section
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log("📤 Login attempt:", formData);

    // Admin Login
    if (formData.email === "admin@threadlink.com") {
      const res = await loginAdmin(formData);      
      console.log("✅ Admin login response:", res);
      if (res?.token) {
        const adminUser = {
          userType: "Admin", // ✅ Make sure this is set to "Admin"
          email: formData.email,
          fullName: "Admin", // ✅ Use fullName instead of name
          token: res.token,
          isAdmin: true, // ✅ Add isAdmin flag
        };
        localStorage.setItem("user", JSON.stringify(adminUser));    
        localStorage.setItem("token", res.token);
        alert("Admin login successful!");
        navigate("/admin-dashboard");
        return;
      } else {     
        alert("Invalid admin credentials");
        return;
      }
    }

    // Regular User Login
    const res = await loginUser(formData);
    console.log("✅ User login response:", res);
    const token = res?.token;
    const user = res?.user || res;
    
    if (!token) {
      alert("Invalid login response from server - no token received");
      return;
    }
    
    // Store both token and user data properly
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({
      ...user,
      token: token
    }));
    
    alert("Login successful!");
    switch (user.userType) {
      case "Individual Donor":
        navigate("/dashboard");
        break;
      case "Orphanage":
        navigate("/orphanage-dashboard");
        break;
      default:
        navigate("/");
    }
  } catch (err) {
    console.error("❌ Login error:", err);
    alert(err.response?.data?.message || "Login failed");
  }
};
  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-gradient-to-b from-green-50 to-blue-50 px-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Login to Your Account
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>

            <label className="text-sm font-medium text-gray-700">Password</label>

            <div className="relative">

              <input

                type={showPassword ? "text" : "password"}

                name="password"

                value={formData.password}

                onChange={handleChange}

                placeholder="••••••••"

                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 pr-10 focus:outline-none focus:ring-2 focus:ring-green-400"

                required

              />

              <button

                type="button"

                onClick={() => setShowPassword(!showPassword)}

                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"

                tabIndex={-1}

              >

                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}

              </button>

            </div>

          </div>


          <div className="flex justify-between items-center text-sm">

            <label className="flex items-center gap-2">

              <input type="checkbox" className="form-checkbox text-green-500" />

              <span className="text-gray-600">Remember me</span>

            </label>

            <Link to="/forgot-password" className="text-green-600 hover:underline">

              Forgot your password?

            </Link>

          </div>


          <button

            type="submit"

            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-md font-semibold hover:opacity-90 transition"

          >

            Sign In

          </button>

        </form>


        <div className="flex items-center gap-2 my-4">

          <div className="flex-grow border-t border-gray-300" />

          <span className="text-sm text-gray-500">Or continue with</span>

          <div className="flex-grow border-t border-gray-300" />

        </div>


        <div className="flex justify-center gap-4">

          <button className="border border-gray-300 p-2 rounded-md hover:bg-gray-100 transition">

            <FaGoogle size={20} />

          </button>

          <button className="border border-gray-300 p-2 rounded-md hover:bg-gray-100 transition">

            <FaTwitter size={20} />

          </button>

          <button className="border border-gray-300 p-2 rounded-md hover:bg-gray-100 transition">

            <FaGithub size={20} />

          </button>

        </div>


        <p className="text-center text-sm text-gray-600">

          Don’t have an account?{" "}

          <Link to="/register" className="text-green-600 font-medium hover:underline">

            Sign up

          </Link>

        </p>

      </div>

    </div>

  );

};


export default Login;
