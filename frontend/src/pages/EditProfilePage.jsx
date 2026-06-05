import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Camera, User, UploadCloud } from 'lucide-react';

export default function EditProfilePage() {
  const { state, dispatch } = useAppContext();
  const user = state.user || {};
  const [name, setName] = useState(user.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(user.avatarUrl || '');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
      setAvatarUrl(''); // clear url if file is selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('name', name);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      } else if (avatarUrl) {
        formData.append('avatarUrl', avatarUrl);
      }

      const res = await fetch('http://localhost:5000/api/auth/me', {
        method: 'PUT',
        headers: { 'x-auth-token': token }, // No Content-Type header so browser sets multipart boundary
        body: formData
      });
      
      if (!res.ok) throw new Error('Failed to update profile');
      const updated = await res.json();
      dispatch({ type: 'SET_USER', payload: updated });
      navigate('/profile');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#fafcff] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0052FF] to-cyan-500 p-6 sm:p-8 text-center text-white">
          <h2 className="text-3xl font-extrabold tracking-tight">Edit Profile</h2>
          <p className="text-blue-100 mt-2 font-medium">Update your personal details and avatar</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6">
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400">
                {preview ? (
                  <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} />
                )}
              </div>
              
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <Camera size={24} className="mb-1" />
                  <span className="text-xs font-bold">Change Photo</span>
                </div>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg" 
                  onChange={handleImageChange} 
                  className="hidden" 
                />
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-3 font-medium">JPG, PNG or JPEG. Max size 5MB.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
              <input 
                value={name} 
                onChange={e=>setName(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#0052FF] focus:border-transparent transition-shadow outline-none font-medium" 
                placeholder="Enter your full name"
                required
              />
            </div>
            
            {/* Fallback URL Input just in case */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Or Paste Avatar URL</label>
              <input 
                value={avatarUrl} 
                onChange={e=>{
                  setAvatarUrl(e.target.value);
                  if(!avatarFile) setPreview(e.target.value);
                }} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#0052FF] focus:border-transparent transition-shadow outline-none text-gray-500" 
                placeholder="https://example.com/avatar.jpg"
                disabled={!!avatarFile}
              />
              {avatarFile && <p className="text-xs text-blue-600 mt-1 font-semibold">URL input disabled while a local file is selected.</p>}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold border border-red-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-100 dark:border-gray-700 mt-8">
            <button 
              disabled={loading} 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-[#0052FF] to-blue-600 text-white py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white dark:border-gray-800/30 border-t-white rounded-full animate-spin"></div> Saving...</>
              ) : (
                <><UploadCloud size={18} /> Save Profile</>
              )}
            </button>
            <button 
              type="button" 
              onClick={()=>navigate('/profile')} 
              className="w-full sm:w-auto px-8 py-3.5 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
