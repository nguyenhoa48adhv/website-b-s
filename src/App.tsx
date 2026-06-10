/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InteractiveMap from './components/InteractiveMap';
import LandGrid from './components/LandGrid';
import ListingForm from './components/ListingForm';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import { LandListing, PropertyType, Coordinates, ContactMessage } from './types';
import { DEFAULT_LISTINGS } from './data/defaultListings';
import { Sparkles, MessageCircle, Map, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [listings, setListings] = useState<LandListing[]>([]);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedListing, setSelectedListing] = useState<LandListing | null>(null);
  const [selectedListingForInquiry, setSelectedListingForInquiry] = useState<LandListing | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  // Coordinate Pinner States
  const [pinModeActive, setPinModeActive] = useState<boolean>(false);
  const [pinnedCoordinates, setPinnedCoordinates] = useState<Coordinates | null>(null);
  
  // Notification banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load listings on mount
  useEffect(() => {
    const cached = localStorage.getItem('bds_hoa_nguyen_listings');
    if (cached) {
      try {
        setListings(JSON.parse(cached));
      } catch (err) {
        setListings(DEFAULT_LISTINGS);
      }
    } else {
      setListings(DEFAULT_LISTINGS);
      localStorage.setItem('bds_hoa_nguyen_listings', JSON.stringify(DEFAULT_LISTINGS));
    }
  }, []);

  // Save new listings to local storage & state
  const handleAddListing = (newListingData: Omit<LandListing, 'id' | 'createdAt'>) => {
    const newListing: LandListing = {
      ...newListingData,
      id: `listing-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const updated = [newListing, ...listings];
    setListings(updated);
    localStorage.setItem('bds_hoa_nguyen_listings', JSON.stringify(updated));
    showToast(`Chúc mừng! Tin đăng "${newListing.title}" đã được duyệt tự động thành công và cập nhật định vị trực tiếp lên bản đồ.`);

    // Reset pin model if finished
    setPinnedCoordinates(null);
    setPinModeActive(false);
  };

  // Trigger quick counseling about a property
  const handleInquireProperty = (listing: LandListing) => {
    setSelectedListingForInquiry(listing);
    const element = document.getElementById('contact-form-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleContactSubmit = (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    // Save contact logs to localStorage
    const cachedMsgs = localStorage.getItem('bds_hoa_nguyen_contacts') || '[]';
    let msgsList = [];
    try {
      msgsList = JSON.parse(cachedMsgs);
    } catch (e) {}

    const fullMsg: ContactMessage = {
      ...msg,
      id: `contact-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    msgsList.push(fullMsg);
    localStorage.setItem('bds_hoa_nguyen_contacts', JSON.stringify(msgsList));
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  const handleSearchCommit = (searchData: { text: string; type: PropertyType | 'all' }) => {
    setSearchFilter(searchData);
  };

  const [searchFilter, setSearchFilter] = useState<{ text: string; type: PropertyType | 'all' }>({
    text: '',
    type: 'all'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5EC] via-[#FFFDFB] to-[#FFF9F2] text-slate-900 selection:bg-orange-500 selection:text-white flex flex-col justify-between font-sans">
      {/* Dynamic Pop-up Toast Message Banner */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-white/95 backdrop-blur-md text-slate-900 border border-orange-100 shadow-2xl p-4 rounded-2xl max-w-sm flex items-start gap-4 animate-slide-up" id="toast-banner">
          <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest font-mono block mb-1">HỆ THỐNG GHI NHẬN</span>
            <p className="text-xs text-slate-800 font-semibold leading-relaxed">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Header Navigation view */}
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        openPostModal={() => setIsPostModalOpen(true)}
      />

      {/* Main landing sections */}
      <main className="flex-1 space-y-16 pb-20">
        
        {/* Banner with customized filters search input */}
        <Hero 
          onSearch={handleSearchCommit} 
          totalListingsCount={listings.length}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Quick interactive maps block */}
          <section id="gis-map-layout" className="scroll-mt-24">
            <InteractiveMap
              listings={listings}
              selectedListing={selectedListing}
              onSelectListing={setSelectedListing}
              pinModeActive={pinModeActive}
              setPinModeActive={setPinModeActive}
              pinnedCoordinates={pinnedCoordinates}
              setPinnedCoordinates={setPinnedCoordinates}
            />
          </section>

          {/* Quick Guide on how to coordinate mapping */}
          {pinModeActive && (
            <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-100 rounded-2xl text-slate-800 text-xs text-left flex items-start gap-3.5 max-w-2xl mx-auto shadow-lg shadow-orange-950/5 animate-fade-in" id="map-pin-guide">
              <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-bold mb-1 uppercase tracking-wider">Bí quyết định vị toạ độ chính xác 100%:</strong>
                Bật nút quy hoạch hoặc Bản đồ vệ tinh trên bản đồ, tìm vị trí thực của thửa đất bạn. 
                Sau đó, bấm đúp vào vị trí đó, hệ thống sẽ ghim một hạt mốc màu xanh lục ấm. 
                Cuối cùng nhấn <button onClick={() => setIsPostModalOpen(true)} className="underline font-bold text-orange-600 hover:text-orange-700 font-mono tracking-widest uppercase cursor-pointer">Đăng Tin Bán Đất</button> và toạ độ Kinh/Vĩ độ thực sẽ được chuyển trực tiếp vào mẫu đăng ký!
              </div>
            </div>
          )}

          {/* Grid view showing listings database entries */}
          <section id="estate-list" className="scroll-mt-24">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-orange-600 font-bold font-mono uppercase text-xs tracking-widest block mb-2 border-b border-dashed border-orange-250 pb-1.5 w-max mx-auto">
                Quỹ Đất Đang Giao Dịch
              </span>
              <h2 className="text-4xl font-black text-slate-950 tracking-tight font-display uppercase">
                Danh Sách Thửa Đất Nổi Bật
              </h2>
              <p className="text-xs text-slate-650 mt-2.5 font-medium leading-relaxed">
                Độ minh bạch cao, tất cả lô đất đều được chuyên viên kiểm tra hiện trạng thực địa và đối chiếu pháp lý trực tiếp tại sở tài nguyên môi trường.
              </p>
            </div>

            <LandGrid
              listings={listings}
              onSelectListing={setSelectedListing}
              selectedListing={selectedListing}
              onInquire={handleInquireProperty}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
            />
          </section>

          {/* Quick Consultation Inquiry section */}
          <section id="consultation-section" className="scroll-mt-24">
            <ContactForm
              listings={listings}
              selectedListingForInquiry={selectedListingForInquiry}
              onSubmitContactMessage={handleContactSubmit}
              clearSelectedListingInquiry={() => setSelectedListingForInquiry(null)}
            />
          </section>

        </div>
      </main>

      {/* Footer Branding section */}
      <Footer />

      {/* Post Modal Form Popup */}
      {isPostModalOpen && (
        <ListingForm
          onAddListing={handleAddListing}
          onClose={() => setIsPostModalOpen(false)}
          pinnedCoordinates={pinnedCoordinates}
        />
      )}
    </div>
  );
}
