import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UploadCloud, Sparkles, Loader2, MapPin, Calendar, AlertCircle } from 'lucide-react';

export default function PostItemPage({ type }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    itemType: '',
    customItemType: '',
    brand: '',
    color: '',
    customColor: '',
    description: '',
    location: '',
    date: '',
    email: '',
    phone: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const token = localStorage.getItem('token');

  const CATEGORY_TYPES = {
    'Electronics': ['Earbuds', 'Laptop', 'Phone', 'Smartwatch', 'Tablet', 'Charger', 'Power Bank', 'Other'],
    'Wallets & Cards': ['Wallet', 'Debit Card', 'Credit Card', 'ID Card', 'Driving License', 'Other'],
    'Bags': ['Backpack', 'Laptop Bag', 'Handbag', 'Duffel Bag', 'Other'],
    'Keys': ['Room Key', 'Bike Key', 'Car Key', 'Keychain', 'Other'],
    'Other': []
  };

  // JWT Authentication Guard
  useEffect(() => {
    if (!token) {
      navigate('/login', { state: { message: 'Please login to report an item', from: location.pathname } });
    }
  }, [navigate, token, location.pathname]);

  if (!token) return null; // Prevent UI flashing before redirect

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      // Reset itemType when category changes
      setFormData({ ...formData, category: value, itemType: '', customItemType: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIAutoFill = async () => {
    setError(null);
    if (!imageFile) {
      setError('Please upload an image first for the AI to analyze!');
      return;
    }

    setIsAnalyzing(true);
    try {
      const data = new FormData();
      data.append('image', imageFile);

      const response = await fetch('http://localhost:5000/api/ai/analyze-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (response.ok) {
        const result = await response.json();
        setFormData(prev => ({
          ...prev,
          title: result.title || prev.title,
          category: result.category || prev.category,
          itemType: result.itemType || prev.itemType,
          brand: result.brand || prev.brand,
          color: result.color || prev.color,
          description: result.description || prev.description
        }));
      } else {
        const errorData = await response.json();
        setError('AI Analysis failed: ' + (errorData.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to AI service');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const finalItemType = (formData.category === 'Other' || formData.itemType === 'Other') ? formData.customItemType : formData.itemType;
      const finalColor = formData.color === 'Other' ? formData.customColor : formData.color;

      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('itemType', finalItemType);
      data.append('brand', formData.brand);
      data.append('color', finalColor);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('date', formData.date);
      data.append('type', type); // 'lost' or 'found'
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        setError('Error: ' + (errorData.message || 'Failed to post item'));
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 relative">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 pointer-events-none"></div>

      <div className="glass-card rounded-3xl p-8 relative z-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
          Report {type === 'lost' ? 'Lost' : 'Found'} Item
        </h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 mb-6">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* AI Image Upload Section */}
          <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 p-6 rounded-2xl border border-blue-100/50 flex flex-col md:flex-row items-center gap-6 shadow-inner">
            <div className="relative w-full md:w-32 h-32 bg-white rounded-xl border-2 border-dashed border-blue-200 flex flex-col items-center justify-center text-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <UploadCloud size={32} />
                  <span className="text-xs font-semibold mt-2 text-center text-gray-500">Upload<br/>Image</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <div className="flex-grow text-center md:text-left">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center justify-center md:justify-start gap-2 text-lg">
                <Sparkles size={20} className="text-[#00B4D8]" /> 
                AI Auto-Extraction
              </h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                Upload a photo of the item and let our AI automatically detect the category, color, and generate a description for you.
              </p>
              <button 
                type="button"
                onClick={handleAIAutoFill}
                disabled={isAnalyzing}
                className="bg-gradient-brand text-white px-6 py-2.5 rounded-xl font-bold text-[14px] hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center md:justify-start gap-2 disabled:opacity-70 disabled:hover:translate-y-0 mx-auto md:mx-0 shadow-sm cursor-pointer hover:scale-105 transition-all duration-300"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Scanning image...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Auto-Fill Form
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0052FF] outline-none transition-all text-[15px]" required />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0052FF] outline-none transition-all text-[15px]">
                  <option>Electronics</option>
                  <option>Wallets & Cards</option>
                  <option>Bags</option>
                  <option>Keys</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Item Type *</label>
                {formData.category === 'Other' ? (
                  <input type="text" name="customItemType" value={formData.customItemType} onChange={handleChange} className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0052FF] outline-none transition-all text-[15px]" placeholder="Please specify item type *" required />
                ) : (
                  <div className="space-y-3">
                    <select name="itemType" value={formData.itemType} onChange={handleChange} className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0052FF] outline-none transition-all text-[15px]" required>
                      <option value="" disabled>Select a type...</option>
                      {CATEGORY_TYPES[formData.category]?.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {formData.itemType === 'Other' && (
                      <input type="text" name="customItemType" value={formData.customItemType} onChange={handleChange} className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0052FF] outline-none transition-all text-[15px]" placeholder="Please specify item type *" required />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} list="brand-suggestions" className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0052FF] outline-none transition-all text-[15px]" placeholder="e.g. Apple, OnePlus" />
                <datalist id="brand-suggestions">
                  <option value="OnePlus" />
                  <option value="Apple" />
                  <option value="Samsung" />
                  <option value="HP" />
                  <option value="Dell" />
                  <option value="Boat" />
                  <option value="Lenovo" />
                </datalist>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                <div className="space-y-3">
                  <select name="color" value={formData.color} onChange={handleChange} className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0052FF] outline-none transition-all text-[15px]">
                    <option value="">Select a color...</option>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    <option value="Silver">Silver</option>
                    <option value="Blue">Blue</option>
                    <option value="Red">Red</option>
                    <option value="Green">Green</option>
                    <option value="Gray">Gray</option>
                    <option value="Other">Other</option>
                  </select>
                  {formData.color === 'Other' && (
                    <input type="text" name="customColor" value={formData.customColor} onChange={handleChange} className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0052FF] outline-none transition-all text-[15px]" placeholder="Please specify color *" required />
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0052FF] outline-none transition-all text-[15px]" placeholder="Be specific - it helps AI match your item..."></textarea>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Location & Date */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{type === 'lost' ? 'Last Seen Location' : 'Found Location'} *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <MapPin size={18} />
                </span>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0052FF] outline-none transition-all text-[15px]" placeholder="e.g. Main Library" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date {type === 'lost' ? 'Lost' : 'Found'} *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <Calendar size={18} />
                </span>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0052FF] outline-none transition-all text-[15px]" required />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-5">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0052FF] outline-none transition-all text-[15px]" placeholder="user@khoj.com" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0052FF] outline-none transition-all text-[15px]" placeholder="+1 (555) 123-4567" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6">
            <button type="button" onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 font-bold px-4 py-2 cursor-pointer hover:scale-105 transition-all duration-300">
              Cancel
            </button>
            <button type="submit" className="bg-gradient-brand text-white px-8 py-3.5 rounded-xl font-bold text-[15px] hover:shadow-lg hover:opacity-90 cursor-pointer hover:scale-105 transition-all duration-300">
              Post 
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
