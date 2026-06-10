/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Save, Image, MapPin, Sparkles } from 'lucide-react';
import { LandListing, PropertyType, Coordinates } from '../types';

interface ListingFormProps {
  onAddListing: (listing: Omit<LandListing, 'id' | 'createdAt'>) => void;
  onClose: () => void;
  pinnedCoordinates: Coordinates | null;
}

export default function ListingForm({ onAddListing, onClose, pinnedCoordinates }: ListingFormProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PropertyType>('dat-tho-cu');
  const [price, setPrice] = useState('');
  const [priceValue, setPriceValue] = useState<number>(1.5);
  const [size, setSize] = useState<number>(100);
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState<number>(15.95);
  const [lng, setLng] = useState<number>(108.25);
  const [imageOption, setImageOption] = useState<'upload' | 'preset-1' | 'preset-2' | 'preset-3'>('preset-1');
  const [customImage, setCustomImage] = useState('');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [legalStatus, setLegalStatus] = useState('Sổ đỏ riêng, chính chủ');
  const [direction, setDirection] = useState('Đông Đông Nam');
  const [width, setWidth] = useState<number>(5);
  const [length, setLength] = useState<number>(20);

  // Preset premium photographs of lands
  const PRESET_IMAGES = {
    'preset-1': {
      label: 'Đất nền bờ sông thơ mộng',
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
    },
    'preset-2': {
      label: 'Đất quy hoạch hạ tầng chuẩn',
      url: 'https://images.unsplash.com/photo-1444653389962-8149286c578a?auto=format&fit=crop&w=1200&q=80'
    },
    'preset-3': {
      label: 'Đất biệt thự mẫu vĩ mô',
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    }
  };

  // Import pinned coordinate values automatically if available
  useEffect(() => {
    if (pinnedCoordinates) {
      setLat(pinnedCoordinates.lat);
      setLng(pinnedCoordinates.lng);
    }
  }, [pinnedCoordinates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !location || !description || !contactPhone || !contactName) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    // Determine target image URL
    let selectedImageUrl = '';
    if (imageOption === 'upload') {
      selectedImageUrl = customImage || PRESET_IMAGES['preset-1'].url;
    } else {
      selectedImageUrl = PRESET_IMAGES[imageOption].url;
    }

    onAddListing({
      title,
      type,
      price,
      priceValue: Number(priceValue) || 1.5,
      size: Number(size) || 100,
      location,
      coordinates: { lat: Number(lat), lng: Number(lng) },
      image: selectedImageUrl,
      description,
      contactName,
      contactPhone,
      legalStatus,
      direction,
      width: Number(width) || undefined,
      length: Number(length) || undefined,
      isFeatured: false
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-orange-100 max-h-[88vh] flex flex-col animate-scale-up">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 flex justify-between items-center shrink-0 shadow-md">
          <div>
            <span className="text-white/90 font-mono font-extrabold text-[10px] tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
              Đăng tin bán đất ký gửi miễn phí tại BĐS Hoa Nguyễn
            </span>
            <h3 className="text-lg sm:text-xl font-black font-display tracking-tight">Ký gửi bất động sản chính chủ</h3>
          </div>
          <button
            id="btn-close-listing-form"
            onClick={onClose}
            className="p-2.5 bg-white/25 hover:bg-white/35 text-white rounded-full transition-all cursor-pointer shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-[#222222] bg-gradient-to-b from-white to-orange-50/15" id="listing-form-element">
          
          {/* Section 1: Cần bán */}
          <div>
            <span className="text-xs font-black text-slate-500 tracking-widest block mb-4 border-b border-orange-50 pb-2 font-display">
              1. Thông tin tiêu đề & loại đất
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1 md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-500 tracking-wider block">Tiêu đề đăng bài (*):</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lô biệt thự Xuân An ven sông Lam cực đẹp giá tốt"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 tracking-wider block">Loại hình đất (*):</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as PropertyType)}
                  className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none cursor-pointer transition-all shadow-sm text-slate-800"
                >
                  <option value="dat-tho-cu">Đất Thổ Cư</option>
                  <option value="dat-biet-thu">Đất Biệt Thự</option>
                  <option value="dat-vuon">Đất Vườn Sinh Thái</option>
                  <option value="dat-nen">Đất Nền Dự Án</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Thông tin chi tiết */}
          <div>
            <span className="text-xs font-black text-slate-500 tracking-widest block mb-4 border-b border-orange-50 pb-2 font-display">
              2. Diện tích & Định giá
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 tracking-wider block">Giá hiển thị (*):</label>
                <input
                  type="text"
                  required
                  placeholder="2.5 Tỷ hoặc Thỏa thuận"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 tracking-wider block">Giá lọc (Tỷ VNĐ) (*):</label>
                <input
                  type="number"
                  step="0.05"
                  required
                  value={priceValue}
                  onChange={(e) => setPriceValue(Number(e.target.value))}
                  className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 tracking-wider block">Diện tích m² (*):</label>
                <input
                  type="number"
                  required
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 tracking-wider block">Hướng đất:</label>
                <input
                  type="text"
                  placeholder="Đông Nam, Tây, ..."
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 tracking-wider block">Mặt tiền m:</label>
                <input
                  type="number"
                  placeholder="Ví dụ: 5"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 tracking-wider block">Chiều sâu m:</label>
                <input
                  type="number"
                  placeholder="Ví dụ: 20"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm text-slate-800"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-500 tracking-wider block">Pháp lý thửa đất:</label>
                <input
                  type="text"
                  placeholder="Sổ đỏ chính chủ, Sổ đỏ riêng..."
                  value={legalStatus}
                  onChange={(e) => setLegalStatus(e.target.value)}
                  className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Vị trí và Toạ độ quy hoạch */}
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-orange-50 pb-2">
              <span className="text-xs font-black text-slate-500 tracking-widest block font-display">
                3. Địa điểm & Định vị quy hoạch
              </span>
              {pinnedCoordinates && (
                <span className="bg-[#E9825E] text-white px-3.5 py-1.5 rounded-full font-mono text-[9px] font-bold shadow-sm animate-pulse">
                  Đã khóa tọa độ ghim bản đồ
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 tracking-wider block">Địa chỉ thửa đất (*):</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lô đất Hà Huy Tập, phường Nam Hà, trung tâm Tp. Hà Tĩnh"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-500 tracking-wider block">Kinh độ (Longitude) (*):</label>
                    <span className="text-[9px] text-slate-400 font-mono">Khoảng 108.15 - 108.35</span>
                  </div>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={lng}
                    onChange={(e) => setLng(Number(e.target.value))}
                    className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-500 tracking-wider block">Vĩ độ (Latitude) (*):</label>
                    <span className="text-[9px] text-slate-400 font-mono">Khoảng 15.90 - 16.10</span>
                  </div>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={lat}
                    onChange={(e) => setLat(Number(e.target.value))}
                    className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Hình ảnh đất */}
          <div>
            <span className="text-xs font-black text-slate-500 tracking-widest block mb-4 border-b border-orange-50 pb-2 font-display">
              4. Hình ảnh thực tế đất
            </span>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <label className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all text-sm font-semibold flex-1 ${
                  imageOption === 'preset-1' ? 'border-orange-500 bg-orange-500/10 text-slate-900 shadow-sm' : 'border-slate-100 hover:bg-orange-50/20 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="imageOption"
                    value="preset-1"
                    checked={imageOption === 'preset-1'}
                    onChange={() => setImageOption('preset-1')}
                    className="hidden"
                  />
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0 bg-white">
                    {imageOption === 'preset-1' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-extrabold tracking-tight">Lô bờ sông</span>
                    <span className="text-[9px] text-slate-400 font-mono">Hòa Nguyễn preset</span>
                  </div>
                </label>

                <label className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all text-sm font-semibold flex-1 ${
                  imageOption === 'preset-2' ? 'border-orange-500 bg-orange-500/10 text-slate-900 shadow-sm' : 'border-slate-100 hover:bg-orange-50/20 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="imageOption"
                    value="preset-2"
                    checked={imageOption === 'preset-2'}
                    onChange={() => setImageOption('preset-2')}
                    className="hidden"
                  />
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0 bg-white">
                    {imageOption === 'preset-2' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-extrabold tracking-tight">KĐT dự án</span>
                    <span className="text-[9px] text-slate-400 font-mono">Hòa Nguyễn preset</span>
                  </div>
                </label>

                <label className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all text-sm font-semibold flex-1 ${
                  imageOption === 'preset-3' ? 'border-orange-500 bg-orange-500/10 text-slate-900 shadow-sm' : 'border-slate-100 hover:bg-orange-50/20 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="imageOption"
                    value="preset-3"
                    checked={imageOption === 'preset-3'}
                    onChange={() => setImageOption('preset-3')}
                    className="hidden"
                  />
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0 bg-white">
                    {imageOption === 'preset-3' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-extrabold tracking-tight">Biệt thự</span>
                    <span className="text-[9px] text-slate-400 font-mono">Hòa Nguyễn preset</span>
                  </div>
                </label>

                <label className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all text-sm font-semibold flex-1 ${
                  imageOption === 'upload' ? 'border-orange-500 bg-orange-500/10 text-slate-900 shadow-sm' : 'border-slate-100 hover:bg-orange-50/20 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="imageOption"
                    value="upload"
                    checked={imageOption === 'upload'}
                    onChange={() => setImageOption('upload')}
                    className="hidden"
                  />
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0 bg-white">
                    {imageOption === 'upload' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-extrabold tracking-tight">Link ảnh khác</span>
                    <span className="text-[9px] text-slate-400 font-mono">Nhập link URL</span>
                  </div>
                </label>
              </div>

              {imageOption === 'upload' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 tracking-wider block">Địa chỉ link hình ảnh (URL) (*):</label>
                  <input
                    type="url"
                    required={imageOption === 'upload'}
                    placeholder="https://example.com/images/dat-ban.jpg"
                    value={customImage}
                    onChange={(e) => setCustomImage(e.target.value)}
                    className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm text-slate-800"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Giới thiệu bài viết & Liên hệ */}
          <div>
            <span className="text-xs font-black text-slate-500 tracking-widest block mb-4 border-b border-orange-50 pb-2 font-display">
              5. Giới thiệu lô đất & Thông tin liên hệ ký gửi
            </span>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 tracking-wider block">Đặc điểm nổi bật & Giới thiệu lô đất (*):</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Mô tả cụ thể ưu điểm lô đất của bạn (vị trí, mật độ dân cư, trục đường lớn, gần trường học, chợ, tiềm năng tăng giá...)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 tracking-wider block">Họ và tên chủ sở hữu / Người liên hệ (*):</label>
                  <input
                    type="text"
                    required
                    placeholder="Mời nhập họ tên..."
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 tracking-wider block">Số điện thoại liên hệ nhanh (*):</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ví dụ: 0896.234.822"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-orange-100 shrink-0">
            <button
              type="button"
              id="btn-form-cancel"
              onClick={onClose}
              className="px-6 py-3.5 rounded-full border border-orange-200 text-slate-700 bg-white hover:bg-orange-50/30 font-bold tracking-wider text-xs transition-colors cursor-pointer"
            >
              Hủy tin đăng
            </button>
            <button
              type="submit"
              id="btn-form-submit"
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white px-8 py-3.5 rounded-full font-bold tracking-wider text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Lưu & Đăng Tin Lên Bản Đồ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
