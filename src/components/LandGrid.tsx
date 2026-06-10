/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SlidersHorizontal, MapPin, Eye, Compass, Phone, User, Check, Scale, BookOpen } from 'lucide-react';
import { LandListing, PropertyType } from '../types';

interface LandGridProps {
  listings: LandListing[];
  onSelectListing: (listing: LandListing | null) => void;
  selectedListing: LandListing | null;
  onInquire: (listing: LandListing) => void;
  searchFilter: { text: string; type: PropertyType | 'all' };
  setSearchFilter: (filter: { text: string; type: PropertyType | 'all' }) => void;
}

export default function LandGrid({
  listings,
  onSelectListing,
  selectedListing,
  onInquire,
  searchFilter,
  setSearchFilter
}: LandGridProps) {
  const [selectedType, setSelectedType] = useState<PropertyType | 'all'>(searchFilter.type);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'size-desc'>('default');
  const [maxPrice, setMaxPrice] = useState<number>(15); // max 15 Billion
  const [selectedListingDetail, setSelectedListingDetail] = useState<LandListing | null>(null);

  // Reset local state if filter coming from Hero changes
  React.useEffect(() => {
    setSelectedType(searchFilter.type);
  }, [searchFilter]);

  // Handle local filter updates
  const handleTypeChange = (type: PropertyType | 'all') => {
    setSelectedType(type);
    setSearchFilter({ ...searchFilter, type });
  };

  // Filter listings
  const filteredListings = listings.filter((item) => {
    // Type Filter
    const matchType = selectedType === 'all' || item.type === selectedType;
    
    // Price Filter
    const matchPrice = item.priceValue <= maxPrice;

    // Search input (by title, location, description, legal status)
    const normalizedSearch = searchFilter.text.toLowerCase();
    const matchSearch =
      !searchFilter.text ||
      item.title.toLowerCase().includes(normalizedSearch) ||
      item.location.toLowerCase().includes(normalizedSearch) ||
      item.description.toLowerCase().includes(normalizedSearch) ||
      item.legalStatus.toLowerCase().includes(normalizedSearch);

    return matchType && matchPrice && matchSearch;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'price-asc') return a.priceValue - b.priceValue;
    if (sortBy === 'price-desc') return b.priceValue - a.priceValue;
    if (sortBy === 'size-desc') return b.size - a.size;
    return 0; // default (order of creation/ID)
  });

  const getTypeName = (type: PropertyType) => {
    switch (type) {
      case 'dat-tho-cu': return 'Đất Thổ Cư';
      case 'dat-biet-thu': return 'Đất Biệt Thự';
      case 'dat-vuon': return 'Đất Vườn Sinh Thái';
      case 'dat-nen': return 'Đất Nền Dự Án';
      default: return 'Đất';
    }
  };

  return (
    <div className="space-y-8" id="listings-grid-section">
      
      {/* Search Header and Filter Menu Controls */}
      <div className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-orange-100/80 shadow-xl shadow-orange-950/5 flex flex-col gap-6">
        {/* Filtering Categories Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(['all', 'dat-tho-cu', 'dat-biet-thu', 'dat-vuon', 'dat-nen'] as const).map((type) => (
              <button
                key={type}
                id={`filter-type-${type}`}
                onClick={() => handleTypeChange(type)}
                className={`px-4.5 py-2 rounded-full text-xs font-bold font-mono tracking-wider transition-all border ${
                  selectedType === type
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white border-transparent shadow-md shadow-orange-500/20'
                    : 'bg-white hover:bg-orange-50/40 text-slate-700 border-orange-100'
                }`}
              >
                {type === 'all' ? 'Tất cả đất đai' : getTypeName(type)}
              </button>
            ))}
          </div>

          {/* Quick Clear Search if active */}
          {searchFilter.text && (
            <div className="text-xs bg-orange-50/40 text-slate-700 px-3.5 py-2 rounded-full border border-orange-100/65 flex items-center gap-2">
              <span>Đang lọc từ khóa: <strong>"{searchFilter.text}"</strong></span>
              <button 
                onClick={() => setSearchFilter({ text: '', type: 'all' })}
                className="font-extrabold underline text-orange-600 hover:text-orange-700 font-mono tracking-wider ml-1 cursor-pointer"
              >
                Xóa lọc
              </button>
            </div>
          )}
        </div>

        {/* Micro filters: sorting & pricing slide limits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t border-orange-50">
          {/* Price Range */}
          <div className="space-y-2 text-left">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span className="tracking-wider">Mức giá tối đa:</span>
              <span className="text-orange-600 font-mono text-sm font-extrabold pb-0.5">{maxPrice} Tỷ VNĐ</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-1.5 bg-orange-100 rounded-full outline-none"
            />
          </div>

          {/* Sort selection */}
          <div className="space-y-2 text-left">
            <span className="text-xs font-bold text-slate-500 block tracking-wider">Sắp xếp theo:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-white border border-orange-100 rounded-xl py-2 px-3.5 text-xs font-bold text-slate-800 transition-all outline-none shadow-sm focus:border-orange-400 font-mono"
            >
              <option value="default">Thứ tự đăng mặc định</option>
              <option value="price-asc">Giá từ thấp đến cao</option>
              <option value="price-desc">Giá từ cao đến thấp</option>
              <option value="size-desc">Diện tích lớn nhất</option>
            </select>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center justify-end">
            <span className="text-xs font-bold text-slate-400 tracking-widest">
              Đang hiển thị: <strong className="text-orange-600 text-sm font-extrabold font-display border-b border-orange-500 pb-0.5">{sortedListings.length}</strong> lô đất tuyển chọn
            </span>
          </div>
        </div>
      </div>

      {/* Grid of properties */}
      {sortedListings.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 text-center border border-orange-100 shadow-xl shadow-orange-950/5 max-w-sm mx-auto">
          <SlidersHorizontal className="w-12 h-12 text-orange-200 mx-auto mb-4 animate-pulse" />
          <h3 className="text-base font-bold text-slate-850 mb-1 font-display">Không tìm thấy lô đất phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4 leading-relaxed font-sans">
            Thử tinh chỉnh phạm vi tìm kiếm, giá bán hoặc xóa bộ lọc từ khóa để khám phá thêm nhiều lựa chọn bất động sản khác.
          </p>
          <button
            onClick={() => {
              setSelectedType('all');
              setSearchFilter({ text: '', type: 'all' });
              setMaxPrice(15);
              setSortBy('default');
            }}
            className="text-xs font-semibold tracking-wider font-mono text-orange-600 hover:text-orange-700 underline cursor-pointer"
          >
            Khôi phục bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedListings.map((item) => (
            <div
              key={item.id}
              id={`listing-card-${item.id}`}
              className="group bg-white rounded-3xl overflow-hidden border border-orange-100/55 shadow-md hover:shadow-xl hover:shadow-orange-950/5 hover:translate-y-[-5px] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image & Price Tag */}
              <div className="relative h-[230px] overflow-hidden bg-slate-100 border-b border-orange-50/40">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual badges over image */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-mono text-xs font-black tracking-wider px-3.5 py-1.5 rounded-full shadow-md shadow-orange-500/25">
                    {item.price}
                  </span>
                  
                  {item.isFeatured && (
                    <span className="bg-slate-950 text-amber-400 font-sans text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      ★ Tin chọn VIP
                    </span>
                  )}
                </div>

                {/* Property Type Badge bottom left */}
                <span className={`absolute bottom-4 left-4 text-[10px] font-bold py-1.5 px-3 rounded-full text-white/95 border border-white/10 ${
                  item.type === 'dat-biet-thu' ? 'bg-indigo-900/90' :
                  item.type === 'dat-tho-cu' ? 'bg-amber-800/90' :
                  item.type === 'dat-vuon' ? 'bg-orange-850/90' : 'bg-slate-900/90'
                }`}>
                  {getTypeName(item.type)}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 text-left flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug font-display group-hover:text-orange-600 transition-colors line-clamp-2 h-[44px] mb-3">
                    {item.title}
                  </h3>

                  {/* Micro stats */}
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-1.5 mb-4 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-1.5 truncate">
                      <Scale className="w-3.5 h-3.5 text-orange-400/80" />
                      <span className="font-mono font-bold text-slate-700">{item.size} m²</span>
                    </div>

                    <div className="flex items-center gap-1.5 truncate">
                      <Compass className="w-3.5 h-3.5 text-orange-400/80" />
                      <span className="font-bold text-slate-700">Hướng: {item.direction}</span>
                    </div>

                    <div className="flex items-center gap-1.5 col-span-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-orange-400/80 shrink-0" />
                      <span className="truncate font-bold text-slate-755">{item.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 font-sans">
                    {item.description}
                  </p>
                </div>

                {/* Card footer details and Button actions */}
                <div className="pt-4 border-t border-orange-50 flex items-center justify-between gap-2 mt-auto">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-450 font-bold tracking-wider block">Người đăng:</span>
                    <span className="text-xs font-bold text-slate-755 flex items-center gap-1 mt-0.5 font-mono">
                      <User className="w-3 h-3 text-orange-500" />
                      {item.contactName}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {/* View full details (Opens detailed dialog) */}
                    <button
                      id={`btn-view-prop-detail-${item.id}`}
                      onClick={() => setSelectedListingDetail(item)}
                      className="p-2.5 rounded-full bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-100 shadow-sm hover:text-orange-600 transition-colors cursor-pointer"
                      title="Xem chi tiết đầy đủ"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Show immediately on integrated Map */}
                    <button
                      id={`btn-locate-prop-${item.id}`}
                      onClick={() => {
                        onSelectListing(item);
                        const mapElement = document.getElementById('map-container-section');
                        if (mapElement) {
                          mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className="p-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all shadow-md shadow-orange-500/10 cursor-pointer"
                      title="Định vị thẳng lên Bản Đồ"
                    >
                      <MapPin className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fully-Featured Land Listing Details Dialog Modal */}
      {selectedListingDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-orange-100 max-h-[88vh] flex flex-col animate-scale-up">
            
            {/* Banner of modal */}
            <div className="relative h-[240px] shrink-0">
              <img
                src={selectedListingDetail.image}
                alt={selectedListingDetail.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent z-10" />
              <button
                id="btn-close-prop-detail"
                onClick={() => setSelectedListingDetail(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-red-500 hover:text-white text-slate-800 rounded-full p-2 shadow-md transition-all cursor-pointer z-20"
              >
                <XIcon className="w-4 h-4 stroke-[2.5]" />
              </button>
              
              <div className="absolute bottom-4 left-6 right-6 text-white text-left z-10">
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-full mb-2 inline-block shadow-md">
                  Giá: {selectedListingDetail.price}
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug drop-shadow-md font-display border-b border-orange-500/40 pb-1">
                  {selectedListingDetail.title}
                </h3>
              </div>
            </div>

            {/* Content Body of Modal */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-left flex-1 bg-gradient-to-b from-white to-[#FFFAF5]">
              
              {/* Info Matrix grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-orange-50/40 border border-orange-100/60 p-4 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-450 font-extrabold tracking-wider font-mono block">Diện tích</span>
                  <span className="text-sm font-black font-mono text-slate-800 mt-1 block">{selectedListingDetail.size} m²</span>
                </div>

                <div className="bg-orange-50/40 border border-orange-100/60 p-4 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-450 font-extrabold tracking-wider font-mono block">Mặt tiền m</span>
                  <span className="text-sm font-black font-mono text-slate-800 mt-1 block">
                    {selectedListingDetail.width ? `${selectedListingDetail.width}m` : 'Đang cập nhật'}
                  </span>
                </div>

                <div className="bg-orange-50/40 border border-orange-100/60 p-4 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-450 font-extrabold tracking-wider font-mono block">Chiều sâu m</span>
                  <span className="text-sm font-black font-mono text-slate-800 mt-1 block">
                    {selectedListingDetail.length ? `${selectedListingDetail.length}m` : 'Đang cập nhật'}
                  </span>
                </div>

                <div className="bg-orange-50/40 border border-orange-100/60 p-4 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-450 font-extrabold tracking-wider font-mono block">Hướng đất</span>
                  <span className="text-xs font-black font-mono text-slate-800 mt-1 block leading-tight">{selectedListingDetail.direction}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold tracking-wider text-slate-500 flex items-center gap-1.5 font-display">
                  <BookOpen className="w-4 h-4 text-orange-500" /> Giới thiệu thửa đất thực tế
                </h4>
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap font-sans bg-white p-4 rounded-2xl border border-orange-50">
                  {selectedListingDetail.description}
                </div>
              </div>

              {/* Location & Legal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-orange-50">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold tracking-wider block">Vị trí quy hoạch:</span>
                  <span className="text-xs font-bold text-slate-700 block">{selectedListingDetail.location}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold tracking-wider block">Tình trạng pháp lý:</span>
                  <span className="text-xs font-bold text-orange-600 block flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {selectedListingDetail.legalStatus}
                  </span>
                </div>
              </div>

              {/* Direct Location Map shortcut */}
              <div className="bg-orange-50/20 p-4 rounded-2xl flex items-center justify-between border border-orange-100/50 gap-4">
                <div className="text-left">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1 font-mono tracking-wider">Tọa độ định vị chuẩn vệ tinh:</span>
                  <span className="font-mono text-xs font-semibold text-slate-600 block">Vỹ độ (Lat): {selectedListingDetail.coordinates.lat}</span>
                  <span className="font-mono text-xs font-semibold text-slate-600 block">Kinh độ (Lng): {selectedListingDetail.coordinates.lng}</span>
                </div>
                <button
                  id="btn-goto-map-modal"
                  onClick={() => {
                    onSelectListing(selectedListingDetail);
                    setSelectedListingDetail(null);
                    const mapElement = document.getElementById('map-container-section');
                    if (mapElement) {
                      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-605 hover:to-orange-605 text-white font-bold text-xs tracking-wider font-mono px-4 py-2.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1 shadow-md shadow-orange-500/10"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Xem trên bản đồ
                </button>
              </div>

              {/* Contact info card inside modal */}
              <div className="pt-6 border-t border-orange-100 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border border-orange-100/50 p-4 rounded-2xl gap-4 shadow-sm shadow-orange-950/2">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-bold block">Người đại diện / Ký gửi:</span>
                  <span className="text-sm font-bold text-slate-800 font-mono italic">{selectedListingDetail.contactName}</span>
                </div>
                
                <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
                  <a
                    href={`tel:${selectedListingDetail.contactPhone}`}
                    className="flex-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs tracking-wider px-4.5 py-3 rounded-full transition-all text-center shadow-lg shadow-orange-500/15 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 animate-pulse" />
                    Gọi {selectedListingDetail.contactPhone}
                  </a>

                  <button
                    id="btn-modal-inquire"
                    onClick={() => {
                      onInquire(selectedListingDetail);
                      setSelectedListingDetail(null);
                    }}
                    className="flex-1 bg-slate-55 hover:bg-orange-50/40 border border-orange-100 text-slate-700 font-bold text-xs tracking-wider px-4.5 py-3 rounded-full transition-all cursor-pointer text-center"
                  >
                    Yêu cầu nhanh
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Inline fallback icon for modal closes
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
