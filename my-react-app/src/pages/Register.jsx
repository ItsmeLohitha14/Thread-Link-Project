import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Phone, Lock, MapPin, User } from "lucide-react";
import { registerUser } from "../services/authService";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    userType: "Orphanage",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      console.log("📤 Sending registration data:", formData);
      const res = await registerUser(formData);
      console.log("✅ Registration response:", res);

      if (res.data?.token) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        alert(res.data?.message || "Registration failed");
      }
    } catch (err) {
      console.error("❌ Registration error:", err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-blue-50 px-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-3xl p-8 space-y-6">
        <div className="text-center col-span-2">
          <h1 className="text-2xl font-bold text-green-600">Create an Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join us and get started today</p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative">
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-10 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-10 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                placeholder="(123) 456-7890"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-10 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium text-gray-700">Address</label>
            <div className="relative">
              <input
                type="text"
                name="address"
                placeholder="123 Main St, City, State"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-10 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-10 py-2 mt-1 pr-10 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-10 py-2 mt-1 pr-10 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* User Type */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">I am a:</label>
            <select
              name="userType"
              required
              value={formData.userType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="Individual Donor">Individual Donor</option>
              <option value="Orphanage">Orphanage</option>
            </select>
          </div>

          {/* Terms */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2">
              <input type="checkbox" required className="form-checkbox h-4 w-4 text-green-600" />
              <label className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-green-600 hover:underline">Terms of Service</a> and{" "}
                <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-md font-semibold hover:opacity-90 transition"
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
