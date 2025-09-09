import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { addDonation, getUserDonations } from "../services/donationService";
import { useNavigate } from "react-router-dom";

const UserDonations = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    size: "",
    condition: "",
    quantity: 1,
    description: "",
    imageUrl: "",
    gender: "", // Added gender field
  });

  // Check if user is authenticated
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
      navigate('/login');
      return;
    }
    fetchDonations();
  }, [navigate]);

  const fetchDonations = async () => {
    try {
      setRefreshing(true);
      const data = await getUserDonations();
      setDonations(data);
    } catch (err) {
      console.error("Error fetching donations", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Function to get status color classes
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setForm({
      title: "",
      category: "",
      size: "",
      condition: "",
      quantity: 1,
      description: "",
      imageUrl: "",
      gender: "", // Reset gender field
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Math.max(1, Number(value || 1)) : value,
    }));
  };

  // Convert chosen file to base64 for quick backend storage
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm((p) => ({ ...p, imageUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDonation(form);
      await fetchDonations(); // Refresh donations after submission
      closeModal();
      alert("Donation submitted successfully!");
    } catch (err) {
      console.error("Error submitting donation", err);
      alert(err.message || "Failed to submit donation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Add refresh button functionality
  const handleRefresh = () => {
    fetchDonations();
  };

  return (
    <div className="bg-white p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Donations</h2>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-3 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition disabled:opacity-50"
            >
              {refreshing ? "Refreshing..." : "🔄 Refresh"}
            </button>
            <button
              onClick={openModal}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition"
            >
              + Donate Now
            </button>
          </div>
        </div>

        {refreshing && (
          <div className="text-center mb-4">
            <p className="text-blue-600">Refreshing donations...</p>
          </div>
        )}

        {/* Donation Cards */}
        {donations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((item) => (
              <div key={item._id} className="border rounded-lg shadow p-4">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded-md"
                  />
                )}

                <div className="mt-3 flex items-start justify-between">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full h-fit ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                {/* Gender display */}
                {item.gender && (
                  <p className="text-sm text-gray-600 mt-1 capitalize">
                    Gender: {item.gender}
                  </p>
                )}

                {/* line under title */}
                <p className="text-sm text-gray-600 mt-1">{item.condition}</p>

                <div className="flex justify-between text-sm mt-2">
                  <span>Size: {item.size}</span>
                  <span>Qty: {item.quantity}</span>
                </div>

                <div className="flex justify-between text-sm mt-1">
                  <span className="capitalize">{item.category}</span>
                  <span className="text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center mt-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-500 text-4xl font-bold">+</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mt-6">
              No donations yet
            </h3>
            <p className="text-gray-500 mt-2 text-center max-w-sm">
              Start making a difference by donating your first item!
            </p>
            <button
              onClick={openModal}
              className="mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition"
            >
              Donate Now
            </button>
          </div>
        )}
      </div>

      {/* Donation Form Modal */}
      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-semibold">
                Donate Clothing Item
              </Dialog.Title>
              <button onClick={closeModal}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., Blue Denim Jacket"
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select category</option>
                    <option>Shirt</option>
                    <option>Tops</option>
                    <option>Bottoms</option>
                    <option>Winter Wear</option>
                    <option>Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Gender</label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="boys">Boys</option>
                    <option value="girls">Girls</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Size</label>
                  <select
                    name="size"
                    value={form.size}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select size</option>
                    <option>XS</option>
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                    <option>XXL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Condition</label>
                  <select
                    name="condition"
                    value={form.condition}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select condition</option>
                    <option>New</option>
                    <option>Gently Used</option>
                    <option>Worn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={form.quantity}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe the item, condition, special features..."
                  className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 w-full text-sm"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-green-500 text-white font-medium hover:bg-green-600 disabled:opacity-60"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Donation"}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default UserDonations;