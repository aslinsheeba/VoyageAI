import { useState } from "react";
import { generateTrip } from "../api/tripsService";
import { useAuth } from "../context/AuthContext";

export default function NewTripModal({ isOpen, onClose, onTripCreated }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    city: "",
    budget: "",
    travelers: 1,
    startDate: "",
    endDate: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        userId: user.uid,
        city: formData.city,
        budget: Number(formData.budget),
        travelers: Number(formData.travelers),
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      const response = await generateTrip(payload);

      if (response.success) {
        onTripCreated(); // Refresh the list in App
        onClose(); // Close modal
        setFormData({ city: "", budget: "", travelers: 1, startDate: "", endDate: "" });
      } else {
        setError(response.error || "Failed to generate trip");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Plan a New Trip</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Destination</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Goa" className="mt-1 block w-full border border-gray-300 rounded p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget (INR)</label>
            <input type="number" name="budget" value={formData.budget} onChange={handleChange} placeholder="20000" className="mt-1 block w-full border border-gray-300 rounded p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Travelers</label>
            <input type="number" name="travelers" value={formData.travelers} onChange={handleChange} min="1" className="mt-1 block w-full border border-gray-300 rounded p-2" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded p-2" required />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600" disabled={loading}>Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300">{loading ? "Generating..." : "Create Trip"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}