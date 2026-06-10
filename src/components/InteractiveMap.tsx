/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ZoomIn, ZoomOut, Layers, Maximize2, RotateCcw, Check, Info, Compass, HelpCircle } from 'lucide-react';
import { LandListing, Coordinates } from '../types';

interface InteractiveMapProps {
  listings: LandListing[];
  selectedListing: LandListing | null;
  onSelectListing: (listing: LandListing | null) => void;
  pinModeActive: boolean;
  setPinModeActive: (active: boolean) => void;
  pinnedCoordinates: Coordinates | null;
  setPinnedCoordinates: (coords: Coordinates | null) => void;
}

export default function InteractiveMap({
  listings,
  selectedListing,
  onSelectListing,
  pinModeActive,
  setPinModeActive,
  pinnedCoordinates,
  setPinnedCoordinates
}: InteractiveMapProps) {
  const [zoom, setZoom] = useState<number>(1.2);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mapType, setMapType] = useState<' quy-hoach' | 've-tinh'>(' quy-hoach');
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Map limits
  const MIN_LAT = 15.90;
  const MAX_LAT = 16.10;
  const MIN_LNG = 108.15;
  const MAX_LNG = 108.35;

  // Convert GPS Coordinates to Local SVG Map Percentages
  // Longitude corresponds to X-axis (West to East)
  const getX = (lng: number) => {
    return ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 100;
  };
  // Latitude corresponds to Y-axis (South to North, so invert it for SVG Y-axis)
  const getY = (lat: number) => {
    return (1 - (lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * 100;
  };

  // Convert Click Event Percentages into GPS coordinates (Reverse Mapping!)
  const getCoordinatesFromClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!mapContainerRef.current) return null;
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Exact click coords relative to SVG container
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert with respect to current pan and zoom
    const pctX = (clickX / rect.width) * 100;
    const pctY = (clickY / rect.height) * 100;

    // Translate back to Lat/Lng
    const lng = MIN_LNG + (pctX / 100) * (MAX_LNG - MIN_LNG);
    const lat = MIN_LAT + (1 - pctY / 100) * (MAX_LAT - MIN_LAT);

    // Keep precision elegant (4 decimals like real GPS)
    return {
      lat: Math.round(lat * 10000) / 10000,
      lng: Math.round(lng * 10000) / 10000
    };
  };

  const handleDragStart = (e: React.MouseEvent) => {
    // Only drag map if we are NOT pinning a coordinate point
    if (pinModeActive) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (pinModeActive) {
      const coords = getCoordinatesFromClick(e);
      if (coords) {
        setPinnedCoordinates(coords);
      }
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      let nextZoom = direction === 'in' ? prev + 0.2 : prev - 0.2;
      return Math.max(0.6, Math.min(nextZoom, 2.5));
    });
  };

  const handleResetMap = () => {
    setZoom(1.2);
    setPan({ x: 0, y: 0 });
    onSelectListing(null);
    setPinnedCoordinates(null);
    setPinModeActive(false);
  };

  // Center on designated listing coordinate
  useEffect(() => {
    if (selectedListing) {
      const targetX = getX(selectedListing.coordinates.lng);
      const targetY = getY(selectedListing.coordinates.lat);

      setZoom(1.6);
      
      if (mapContainerRef.current) {
        const rect = mapContainerRef.current.getBoundingClientRect();
        const targetPxX = (targetX / 100) * rect.width;
        const targetPxY = (targetY / 100) * rect.height;
        
        setPan({
          x: rect.width / 2 - targetPxX * 1.6,
          y: rect.height / 2 - targetPxY * 1.6
        });
      }
    }
  }, [selectedListing]);

  return (
    <div className="bg-gradient-to-b from-[#FFFDFB] to-[#FFF9F2] rounded-3xl border border-orange-100/60 p-6 md:p-8 shadow-xl text-slate-900" id="map-container-section">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-left">
            <span className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-100/50 block shadow-sm">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-display tracking-tight uppercase ml-2">
              Bản Đồ Đất Đai Vùng Đô Thị & Sinh Thái
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium text-left ml-0.5 mt-1 sm:ml-[42px]">
            Phạm vi quy hoạch: Hà Tĩnh - Thành phố Vinh (Nghệ An). Kéo bản đồ để di chuyển, click hạt vị trí để xem chính chủ bán.
          </p>
        </div>

        {/* Tools and Pinner */}
        <div className="flex flex-wrap gap-2.5">
          {/* Quick Pin Tool */}
          <button
            id="btn-toggle-pin-mode"
            onClick={() => {
              setPinModeActive(!pinModeActive);
              if (pinModeActive) setPinnedCoordinates(null);
            }}
            className={`px-5 py-3 rounded-full text-xs font-bold font-mono tracking-wider uppercase transition-all flex items-center gap-2 shadow-md border ${
              pinModeActive
                ? 'bg-orange-600 border-orange-500 text-white shadow-orange-500/20 animate-pulse'
                : 'bg-white border-orange-100 text-slate-700 hover:bg-orange-50/20 shadow-orange-100/30'
            }`}
          >
            <MapPin className="w-4 h-4" />
            {pinModeActive ? 'Đang bật: Click bản đồ tạo mốc' : 'Bật Tool định vị nhanh'}
          </button>

          {/* Toggle Map type */}
          <button
            id="btn-toggle-map-type"
            onClick={() => setMapType(mapType === ' quy-hoach' ? 've-tinh' : ' quy-hoach')}
            className="px-5 py-3 rounded-full text-[10px] font-extrabold bg-white hover:bg-orange-50/20 text-slate-700 border border-orange-100 shadow-md flex items-center gap-2 transition-all font-mono uppercase cursor-pointer"
          >
            <Layers className="w-4 h-4 text-orange-500" />
            Kiểu: {mapType === ' quy-hoach' ? 'Bản vẽ quy hoạch' : 'Vệ tinh Google'}
          </button>

          {/* Reset Map */}
          <button
            id="btn-reset-map"
            onClick={handleResetMap}
            className="p-3 rounded-full bg-white hover:bg-orange-50/20 text-slate-700 border border-orange-100 shadow-md transition-all cursor-pointer"
            title="Khôi phục mặc định"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid Wrapper with Sidebar & Map Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Real-time coordinates dashboard */}
        <div className="lg:col-span-1 bg-white/75 backdrop-blur-md rounded-2xl border border-orange-100/50 p-5 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-3.5 font-display text-left">
              Toạ Độ Định Vị Hiện Tại
            </span>

            {pinModeActive && (
              <div className="bg-orange-55/15 border border-orange-100 text-slate-800 p-4 rounded-2xl mb-4 text-xs leading-relaxed font-sans text-left">
                <div className="flex items-center gap-1.5 font-bold mb-1 text-orange-600">
                  <Check className="w-4 h-4 text-orange-500" /> Chế độ Ghim toạ độ
                </div>
                Click bất kỳ vào địa điểm trên bản đồ để lấy toạ độ tự động điền vào form đăng bán!
                {pinnedCoordinates && (
                  <div className="bg-white p-3 rounded-xl mt-2 border border-orange-100 font-mono text-slate-800 flex flex-col gap-1 text-center font-extrabold text-[11px] shadow-sm">
                    <span>LAT (Vĩ độ): {pinnedCoordinates.lat}</span>
                    <span>LNG (Kinh độ): {pinnedCoordinates.lng}</span>
                  </div>
                )}
              </div>
            )}

            {!pinModeActive && (
              <div className="bg-orange-50/20 border border-orange-100/40 p-3.5 rounded-2xl mb-4 text-xs text-slate-650 leading-relaxed flex items-start gap-2 text-left">
                <Info className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <span>Chọn một lô đất bên dưới để tự động định vị tiêu điểm và xem thông tin thửa đất được khoanh đỏ.</span>
              </div>
            )}

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              <span className="text-[10px] text-slate-450 font-bold block mb-1 uppercase tracking-wider font-mono text-left">Cơ sở dữ liệu đang hiển thị:</span>
              {listings.map((l) => {
                const isSelected = selectedListing?.id === l.id;
                return (
                  <div
                    key={l.id}
                    onClick={() => onSelectListing(l)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border text-left flex items-center justify-between ${
                      isSelected
                        ? 'bg-orange-51 border-orange-351 text-slate-900 font-bold shadow-sm shadow-orange-500/10'
                        : 'bg-white hover:bg-orange-50/20 border-orange-50/30 text-slate-700'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <span className="block text-xs font-bold truncate uppercase tracking-tight">{l.title}</span>
                      <span className="text-[9px] text-slate-400 block font-mono mt-0.5">Lat: {l.coordinates.lat}, Lng: {l.coordinates.lng}</span>
                    </div>
                    <span className={`text-[9px] leading-none py-1.5 px-2.5 rounded-full font-bold font-mono border shrink-0 ${
                      l.type === 'dat-biet-thu' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                      l.type === 'dat-tho-cu' ? 'bg-orange-50 border-orange-100 text-orange-700' :
                      l.type === 'dat-vuon' ? 'bg-amber-50 border-amber-100 text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-700'
                    }`}>
                      {l.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50/60 to-amber-50/40 border border-orange-100/60 p-4 rounded-2xl mt-4 shadow-sm text-left">
            <span className="text-xs font-black text-slate-700 font-display uppercase tracking-wider block mb-1">Liên Hệ Nhận Bản Vẽ Gốc</span>
            <p className="text-[10px] text-slate-500 mb-2 leading-relaxed font-sans">
              Nhận bản vẽ kỹ thuật đầy đủ 1/500 có chữ ký đóng dấu sở tài nguyên môi trường.
            </p>
            <a
              href="tel:0896234822"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider block text-center shadow-md shadow-orange-500/10 transition-all font-mono"
              id="map-contact-btn"
            >
              Hotline hỗ trợ: 0896.234.822
            </a>
          </div>
        </div>

        {/* Map Canvas with SVG Vectors */}
        <div className="lg:col-span-3 relative h-[380px] sm:h-[480px] bg-slate-900 rounded-3xl border border-orange-100/80 overflow-hidden shadow-xl">
          
          {/* Zoom controls */}
          <div className="absolute top-4 left-4 z-30 flex flex-col gap-1.5 bg-white/95 backdrop-blur-sm p-1.5 rounded-2xl border border-orange-100 shadow-lg">
            <button
              id="btn-map-zoom-in"
              onClick={() => handleZoom('in')}
              className="p-2 hover:bg-orange-50/50 text-slate-700 rounded-xl transition-all hover:scale-105 active:scale-90"
              title="Phóng to"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              id="btn-map-zoom-out"
              onClick={() => handleZoom('out')}
              className="p-2 hover:bg-orange-50/50 text-slate-700 rounded-xl transition-all hover:scale-105 active:scale-90"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              id="btn-map-maximize"
              onClick={() => {
                setZoom(1.5);
                setPan({ x: -100, y: -100 });
              }}
              className="p-2 hover:bg-orange-50/50 text-slate-700 rounded-xl transition-all hover:scale-105 active:scale-90"
              title="Vị trí trung tâm"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Map canvas screen */}
          <div
            ref={mapContainerRef}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            className={`w-full h-full select-none ${isDragging ? 'cursor-grabbing' : pinModeActive ? 'cursor-crosshair' : 'cursor-grab'}`}
          >
            {/* Styled Transform Engine */}
            <div
              className="w-full h-full relative origin-center transition-transform duration-300 ease-out"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              }}
            >
              {/* Actual Map Drawing */}
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 1000 1000"
                onClick={handleSvgClick}
                className="w-full h-full"
              >
                {/* Background base of land depending on type */}
                {mapType === ' quy-hoach' ? (
                  // Topographic Plan theme Map Base
                  <>
                    <rect width="1000" height="1000" fill="#fcfbf7" />
                    <path
                      d="M 600,0 C 650,200 620,400 750,600 C 820,700 800,900 850,1000 L 1000,1000 L 1000,0 Z"
                      fill="#f0f9ff"
                      stroke="#bfdbfe"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 600,0 C 650,200 620,400 750,600 C 820,700 800,900 850,1000"
                      fill="none"
                      stroke="#fef3c7"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                  </>
                ) : (
                  // Satellite View representation using rich satellite colors
                  <>
                    <rect width="1000" height="1000" fill="#1e291b" />
                    <path
                      d="M 600,0 C 650,200 620,400 750,600 C 820,700 800,900 850,1000 L 1000,1000 L 1000,0 Z"
                      fill="#0b1e36"
                    />
                    <path
                      d="M 600,0 C 650,200 620,400 750,600 C 820,700 800,900 850,1000"
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="5"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                  </>
                )}

                {/* Rivers Drawing */}
                <path
                  d="M 450,0 Q 420,150 430,300 T 500,450 T 600,600 T 700,750 T 850,1000"
                  fill="none"
                  stroke={mapType === ' quy-hoach' ? '#e0f2fe' : '#0e1f33'}
                  strokeWidth="24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Secondary Branching river */}
                <path
                  d="M 430,300 Q 200,320 150,450 T 100,700"
                  fill="none"
                  stroke={mapType === ' quy-hoach' ? '#e0f2fe' : '#0e1f33'}
                  strokeWidth="12"
                  strokeLinecap="round"
                />

                {/* Landmarks */}
                <ellipse
                  cx="540"
                  cy="70"
                  rx="120"
                  ry="50"
                  fill={mapType === ' quy-hoach' ? '#ecfccb' : '#142213'}
                  stroke={mapType === ' quy-hoach' ? '#bef264' : '#0d180d'}
                  strokeWidth="1.5"
                />
                
                <circle
                  cx="580"
                  cy="590"
                  r="25"
                  fill={mapType === ' quy-hoach' ? '#e2e8f0' : '#334155'}
                  stroke={mapType === ' quy-hoach' ? '#cbd5e1' : '#1e293b'}
                  strokeWidth="1.5"
                />

                {/* Labels styling */}
                <text
                  x="520"
                  y="70"
                  fill={mapType === ' quy-hoach' ? '#3f6212' : '#65a30d'}
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  HỒ KÈ GỖ
                </text>
                
                <text
                  x="800"
                  y="200"
                  fill={mapType === ' quy-hoach' ? '#0284c7' : '#0ea5e9'}
                  fontSize="14"
                  fontWeight="bold"
                  letterSpacing="2"
                  fontFamily="sans-serif"
                >
                  BIỂN THIÊN CẦM
                </text>

                <text
                  x="565"
                  y="628"
                  fill={mapType === ' quy-hoach' ? '#475569' : '#cbd5e1'}
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  NÚI HỒNG LĨNH
                </text>

                <text
                  x="370"
                  y="180"
                  fill={mapType === ' quy-hoach' ? '#64748b' : '#94a3b8'}
                  fontSize="12"
                  fontWeight="semibold"
                  fontFamily="sans-serif"
                >
                  Sông Lam
                </text>

                <text
                  x="610"
                  y="670"
                  fill={mapType === ' quy-hoach' ? '#64748b' : '#94a3b8'}
                  fontSize="11"
                  fontWeight="medium"
                  rotation="45"
                  fontFamily="sans-serif"
                >
                  Sông Trí (Kỳ Anh)
                </text>

                {/* Major Highways */}
                <path
                  d="M 590,0 C 640,200 610,400 740,600 C 810,700 790,900 840,1000"
                  fill="none"
                  stroke={mapType === ' quy-hoach' ? '#e2e8f0' : '#475569'}
                  strokeWidth="5"
                />
                <text x="590" y="320" fill="#94a3b8" fontSize="8" fontWeight="bold" rotation="-45">ĐẠI LỘ LÊ NIN</text>

                <path
                  d="M 120,0 C 130,300 110,600 180,1000"
                  fill="none"
                  stroke={mapType === ' quy-hoach' ? '#fff7ed' : '#334155'}
                  strokeWidth="8"
                />
                <text x="145" y="400" fill="#94a3b8" fontSize="8" fontWeight="bold">QUỐC LỘ 1A</text>

                {/* Plot Boundaries */}
                {mapType === ' quy-hoach' && (
                  <>
                    <g opacity="0.35" stroke="#f97316" strokeWidth="1" fill="none">
                      <rect x="420" y="520" width="80" height="60" rx="4" />
                      <line x1="420" y1="550" x2="500" y2="550" />
                      <line x1="440" y1="520" x2="440" y2="580" />
                      <line x1="460" y1="520" x2="460" y2="580" />
                      <line x1="480" y1="520" x2="480" y2="580" />
                    </g>
                    <text x="415" y="515" fill="#ea580c" fontSize="8" fontWeight="bold">KĐT Lam River Sector</text>

                    <g opacity="0.35" stroke="#8b5cf6" strokeWidth="1" fill="none">
                      <rect x="730" y="780" width="70" height="70" rx="3" />
                      <line x1="730" y1="815" x2="800" y2="815" />
                      <line x1="750" y1="780" x2="750" y2="850" />
                      <line x1="775" y1="780" x2="775" y2="850" />
                    </g>
                    <text x="715" y="775" fill="#6d28d9" fontSize="8" fontWeight="bold">Sinh Thái Sông Trí Villas</text>
                  </>
                )}

                {/* Selected Land highlight circle */}
                {selectedListing && (
                  <circle
                    cx={getX(selectedListing.coordinates.lng) * 10}
                    cy={getY(selectedListing.coordinates.lat) * 10}
                    r="40"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    className="animate-spin-slow"
                  />
                )}

                {/* Active pins in db */}
                {listings.map((l) => {
                  const x = getX(l.coordinates.lng) * 10;
                  const y = getY(l.coordinates.lat) * 10;
                  const isSelected = selectedListing?.id === l.id;

                  return (
                    <g 
                      key={l.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectListing(l);
                      }}
                      className="cursor-pointer group"
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r="16"
                        fill={isSelected ? '#ea580c' : '#f97316'}
                        opacity={isSelected ? '0.35' : '0'}
                        className="group-hover:opacity-20 transition-opacity duration-200"
                        style={{ transformOrigin: `${x}px ${y}px` }}
                      />

                      <path
                        d={`M ${x} ${y} C ${x - 6} ${y - 12} ${x - 9} ${y - 18} ${x} ${y - 25} C ${x + 9} ${y - 18} ${x + 6} ${y - 12} ${x} ${y} Z`}
                        fill={isSelected ? '#f97316' : l.type === 'dat-vuon' ? '#ea580c' : l.type === 'dat-tho-cu' ? '#f59e0b' : l.type === 'dat-biet-thu' ? '#ec4899' : '#3b82f6'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />

                      <circle cx={x} cy={y - 16} r="3" fill="#ffffff" />

                      <text
                        x={x}
                        y={y - 32}
                        textAnchor="middle"
                        fill="#0f172a"
                        fontSize="10"
                        fontWeight="bold"
                        className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        fontFamily="sans-serif"
                      >
                        {l.price} • {l.size}m²
                      </text>
                    </g>
                  );
                })}

                {/* Custom Pinned Marker point created by user */}
                {pinnedCoordinates && (
                  <g>
                    <circle
                      cx={getX(pinnedCoordinates.lng) * 10}
                      cy={getY(pinnedCoordinates.lat) * 10}
                      r="18"
                      fill="#ea580c"
                      opacity="0.3"
                      className="animate-ping"
                      style={{ transformOrigin: `${getX(pinnedCoordinates.lng) * 10}px ${getY(pinnedCoordinates.lat) * 10}px` }}
                    />
                    <path
                      d={`M ${getX(pinnedCoordinates.lng) * 10} ${getY(pinnedCoordinates.lat) * 10} C ${getX(pinnedCoordinates.lng) * 10 - 6} ${getY(pinnedCoordinates.lat) * 10 - 12} ${getX(pinnedCoordinates.lng) * 10 - 9} ${getY(pinnedCoordinates.lat) * 10 - 18} ${getX(pinnedCoordinates.lng) * 10} ${getY(pinnedCoordinates.lat) * 10 - 25} C ${getX(pinnedCoordinates.lng) * 10 + 9} ${getY(pinnedCoordinates.lat) * 10 - 18} ${getX(pinnedCoordinates.lng) * 10 + 6} ${getY(pinnedCoordinates.lat) * 10 - 12} ${getX(pinnedCoordinates.lng) * 10} ${getY(pinnedCoordinates.lat) * 10} Z`}
                      fill="#ea580c"
                      stroke="#ffffff"
                      strokeWidth="1.8"
                    />
                    <circle cx={getX(pinnedCoordinates.lng) * 10} cy={getY(pinnedCoordinates.lat) * 10 - 16} r="3" fill="#ffffff" />
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Floated instructions / Status message */}
          <div className="absolute bottom-4 right-4 z-30 bg-white/95 backdrop-blur-sm px-4 py-3.5 rounded-2xl border border-orange-100/60 shadow-xl max-w-xs text-[11px] leading-relaxed text-slate-800 text-left">
            {selectedListing ? (
              <div>
                <span className="font-extrabold text-orange-600 block text-xs truncate mb-1 font-display">{selectedListing.title}</span>
                <span className="block text-slate-550 font-mono text-[9px]">Vị trí: {selectedListing.location}</span>
                <span className="block mt-1.5 font-bold text-slate-700 border-t border-orange-100/50 pt-1.5">
                  Pháp lý: <span className="text-orange-650 font-mono text-[9px]">{selectedListing.legalStatus}</span>
                </span>
              </div>
            ) : pinModeActive ? (
              <div className="flex items-center gap-2 font-bold text-orange-700">
                <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping inline-block shrink-0" />
                <span>Bạn đang mở <strong className="text-slate-900 font-mono text-[9px]">Lập toạ độ</strong>. Hãy click vào bản đồ để ghim.</span>
              </div>
            ) : (
              <div className="flex items-start gap-1.5 text-slate-500 font-bold">
                <HelpCircle className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
                Sử dụng chuột/tay vuốt để di chuyển bản đồ quy hoạch.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
