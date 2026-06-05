import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Sparkles, Search } from 'lucide-react';

const ItemCard = ({ item }) => {
  return (
    <Link to={`/item/${item.id}`} className="block bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 hover:border-cyan-200 duration-500 group cursor-pointer h-full flex flex-col">
      <div className="aspect-[4/3] bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden relative border border-gray-100 dark:border-gray-700 m-2 mt-2 w-[calc(100%-16px)] shrink-0">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" />
        <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-[11px] font-bold text-white shadow-lg backdrop-blur-md flex items-center gap-1.5 uppercase tracking-wider ${item.type === 'Lost' ? 'bg-blue-600/90 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-green-600/90 shadow-[0_0_15px_rgba(22,163,74,0.4)]'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-gray-800 animate-ping relative"><span className="absolute inset-0 rounded-full bg-white dark:bg-gray-800"></span></span>
          {item.type}
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-extrabold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-cyan-600 transition-colors capitalize line-clamp-1">{item.title.replace(/One\s*Plus/i, 'OnePlus')}</h3>
        
        {item.matchScore && (
          <div className="flex items-center gap-1.5 mb-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-[#0F172A] dark:to-[#0B1120] border border-blue-100 px-2.5 py-1 rounded-md w-max">
            <Sparkles size={14} className="text-[#00B4D8]" />
            <span className="text-xs font-bold text-gradient">AI Match — {item.matchScore}% Similarity</span>
          </div>
        )}

        <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
        
        <div className="flex flex-col gap-2 mt-auto">
          <div className="text-sm text-slate-500 flex items-center gap-2 font-medium">
            <MapPin size={16} className="text-slate-400" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="text-sm text-slate-500 flex items-center gap-2 font-medium">
            <Calendar size={16} className="text-slate-400" />
            <span>{item.date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type');
  const defaultFilter = initialType 
    ? initialType.charAt(0).toUpperCase() + initialType.slice(1).toLowerCase() 
    : 'All';
  const [filterType, setFilterType] = useState(defaultFilter);
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [items, setItems] = useState([]);
  
  React.useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items');
        const data = await response.json();
        // Capitalize type for UI display (lost -> Lost)
        const formattedData = data.map(item => ({
          ...item,
          id: item._id,
          type: item.type.charAt(0).toUpperCase() + item.type.slice(1)
        }));
        setItems(formattedData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter(item => {
    const matchType = filterType === 'All' || item.type === filterType;
    const matchCategory = categoryFilter === 'All Categories' || item.category === categoryFilter;
    return matchType && matchCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      {/* Decorative Glow Orbs */}
      <div className="absolute top-0 right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-40 left-20 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>

      {/* Semantic Search Bar */}
      <div className="glass-card p-2 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row items-center relative z-10">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-[#0F172A] dark:to-[#0B1120] p-3 rounded-xl mx-2 hidden sm:block">
          <Sparkles className="text-[#00B4D8]" size={24} />
        </div>
        <div className="flex-grow w-full px-4 py-3 sm:py-0 flex items-center">
          <Search className="text-gray-400 sm:hidden mr-3" size={20} />
          <input 
            type="text" 
            placeholder="Describe what you lost in natural language... (e.g. 'black wallet near the library')" 
            className="w-full text-gray-700 dark:text-gray-300 focus:outline-none text-[15px] bg-transparent"
          />
        </div>
        <button className="w-full sm:w-auto bg-gradient-brand text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:opacity-90 sm:mr-1 mt-2 sm:mt-0 whitespace-nowrap cursor-pointer hover:scale-105 transition-all duration-300">
          AI Search
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 flex flex-col sm:flex-row gap-6 items-center justify-between relative z-10">
        
        <div className="flex-1 w-full">
          <label className="block text-sm text-gray-500 font-medium mb-2">Item Type</label>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['All', 'Lost', 'Found'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all cursor-pointer hover:scale-105 duration-300 ${
                  filterType === type 
                    ? (type === 'All' ? 'bg-gradient-brand text-white shadow-sm' : type === 'Lost' ? 'bg-blue-600 text-white shadow-sm' : 'bg-green-600 text-white shadow-sm')
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full">
          <label className="block text-sm text-gray-500 font-medium mb-2">Category</label>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 text-gray-700 dark:text-gray-300 py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all duration-300"
          >
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Wallets & Cards</option>
            <option>Bags</option>
            <option>Keys</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-gray-600 dark:text-gray-400">Showing <span className="font-bold text-gray-900 dark:text-white">{filteredItems.length}</span> items</h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => <ItemCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
