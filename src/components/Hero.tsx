/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, MapPin, Sparkles, Shield, BookmarkCheck, Users } from 'lucide-react';
import { PropertyType } from '../types';

interface HeroProps {
  onSearch: (searchTerm: { text: string; type: PropertyType | 'all' }) => void;
  totalListingsCount: number;
}

export default function Hero({ onSearch, totalListingsCount }: HeroProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<PropertyType | 'all'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ text: searchText, type: selectedType });
    const gridElement = document.getElementById('listings-grid-section');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-[580px] lg:min-h-[660px] flex items-center bg-gradient-to-tr from-slate-950 via-amber-950/10 to-slate-950 overflow-hidden" id="hero-section">
      {/* Background with custom-generated premium image & subtle gradient overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_luxury_background_1781076011248.png"
          alt="Luxury Villa Background"
          className="w-full h-full object-cover object-center opacity-30 scale-105 animate-subtle-zoom"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent z-10" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FFF5EC] to-transparent z-10" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-white">
        <div className="max-w-3xl">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-orange-500/35 text-orange-250 text-[10px] font-bold tracking-widest mb-6 animate-fade-in font-mono shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-orange-450 animate-pulse" />
            Nhà môi giới chuyên nghiệp bất động sản uy tín Hà Tĩnh - Nghệ An
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display leading-[1.1] mb-6">
            Kiến Tạo Tương Lai <br />
            <span className="text-transparent bg-gradient-to-r from-amber-400 via-orange-500 to-rose-400 bg-clip-text border-b-2 border-orange-455 pb-1 block sm:inline mt-1">
              Đất Lành Đón Lộc Tài
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl font-sans border-l-2 border-orange-400 pl-4 py-1.5">
            Chào mừng Quý khách đến với <strong className="text-white">BĐS Hoa Nguyễn</strong>. Chúng tôi chuyên phân phối, ký gửi các phân khúc đất nền thổ cư, đất biệt thự sinh thái, đất vườn và dự án có pháp lý rõ ràng, minh bạch tại Hà Tĩnh và Thành phố Vinh.
          </p>

          {/* Interactive Search Bar Form */}
          <form 
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-xl p-3.5 sm:p-4 rounded-3xl border border-white/10 shadow-2xl shadow-orange-950/15 max-w-2xl mb-12"
            id="hero-search-form"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Nhập khu vực, tên lô đất hoặc vị trí..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full bg-slate-900/60 text-white placeholder-slate-450 pl-10 pr-4 py-3 rounded-full text-xs font-bold font-mono border border-slate-700/65 focus:border-orange-500/80 outline-none transition-all placeholder:font-sans placeholder:font-normal"
                />
              </div>

              <div className="w-full sm:w-44">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as PropertyType | 'all')}
                  className="w-full bg-slate-900/60 text-white py-3 px-3 rounded-full text-xs font-bold border border-slate-700/65 focus:border-orange-500/85 outline-none cursor-pointer transition-all font-mono"
                >
                  <option value="all" className="bg-slate-900 text-xs text-white">Tất cả loại hình</option>
                  <option value="dat-tho-cu" className="bg-slate-900 text-xs text-white">Đất thổ cư</option>
                  <option value="dat-biet-thu" className="bg-slate-900 text-xs text-white">Đất biệt thự</option>
                  <option value="dat-vuon" className="bg-slate-900 text-xs text-white">Đất vườn sinh thái</option>
                  <option value="dat-nen" className="bg-slate-900 text-xs text-white">Đất nền dính dự án</option>
                </select>
              </div>

              <button
                type="submit"
                id="btn-hero-search-submit"
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
              >
                Tìm kiếm
              </button>
            </div>
          </form>

          {/* Highlights / Trust metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4.5 pt-6 border-t border-white/10 max-w-3xl">
            <div className="flex items-start gap-3 p-3.5 bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl shadow-lg shadow-black/10 hover:border-orange-400/25 hover:translate-y-[-3px] transition-all duration-300">
              <div className="p-2.5 rounded-xl bg-orange-950/60 text-orange-400 border border-orange-800/30 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-lg font-bold font-display tracking-tight text-white leading-none">100%</span>
                <span className="text-[10px] text-slate-400 font-bold tracking-wider block mt-1.5 leading-tight">Pháp lý có sổ riêng</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl shadow-lg shadow-black/10 hover:border-orange-400/25 hover:translate-y-[-3px] transition-all duration-300">
              <div className="p-2.5 rounded-xl bg-orange-950/60 text-orange-400 border border-orange-800/30 shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-lg font-bold font-display tracking-tight text-white leading-none">850+</span>
                <span className="text-[10px] text-slate-400 font-bold tracking-wider block mt-1.5 leading-tight">Khách hàng tin chọn</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl shadow-lg shadow-black/10 hover:border-orange-400/25 hover:translate-y-[-3px] transition-all duration-300">
              <div className="p-2.5 rounded-xl bg-orange-950/60 text-orange-400 border border-orange-800/30 shrink-0">
                <BookmarkCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-lg font-bold font-display tracking-tight text-white leading-none">{totalListingsCount}+</span>
                <span className="text-[10px] text-slate-400 font-bold tracking-wider block mt-1.5 leading-tight">Chính chủ ký gửi</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl shadow-lg shadow-black/10 hover:border-orange-400/25 hover:translate-y-[-3px] transition-all duration-300">
              <div className="p-2.5 rounded-xl bg-orange-950/60 text-orange-400 border border-orange-800/30 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-lg font-bold font-display tracking-tight text-white leading-none">0đ</span>
                <span className="text-[10px] text-slate-400 font-bold tracking-wider block mt-1.5 leading-tight">Xem quy hoạch free</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
