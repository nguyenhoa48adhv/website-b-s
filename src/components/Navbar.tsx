/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Compass, MapPin, Contact, PlusCircle, Phone } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  openPostModal: () => void;
}

export default function Navbar({ activeSection, setActiveSection, openPostModal }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-orange-100/60 transition-all duration-300 shadow-sm shadow-orange-950/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveSection('home')}
            id="nav-logo"
          >
            <div className="w-11 h-11 bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-all duration-200">
              <Home className="w-5.5 h-5.5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-black font-display tracking-tight bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent block leading-tight uppercase">
                BĐS HOẠ NGUYỄN
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#EA580C] uppercase block font-mono">
                UY TÍN • TẬN TÂM • PHÁP LÝ RÕ RÀNG
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              id="btn-nav-home"
              onClick={() => setActiveSection('home')}
              className={`px-4.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-2 ${
                activeSection === 'home'
                  ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-orange-600 font-extrabold border border-orange-200/50'
                  : 'text-slate-600 hover:text-orange-500'
              }`}
            >
              <Compass className="w-4 h-4" />
              Trang Chủ
            </button>
            <button
              id="btn-nav-map"
              onClick={() => {
                setActiveSection('map');
                const element = document.getElementById('map-container-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className={`px-4.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-2 ${
                activeSection === 'map'
                  ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-orange-600 font-extrabold border border-orange-200/50'
                  : 'text-slate-600 hover:text-orange-500'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Bản Đồ Quy Hoạch
            </button>
            <button
              id="btn-nav-contact"
              onClick={() => {
                setActiveSection('contact');
                const element = document.getElementById('contact-form-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className={`px-4.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-2 ${
                activeSection === 'contact'
                  ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-orange-600 font-extrabold border border-orange-200/50'
                  : 'text-slate-600 hover:text-orange-500'
              }`}
            >
              <Contact className="w-4 h-4" />
              Liên Hệ Ký Gửi
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <a 
              href="tel:0896234822" 
              className="hidden lg:flex items-center gap-2 bg-slate-50 hover:bg-orange-50/50 text-slate-800 px-4 py-2.2 rounded-full text-xs font-bold border border-orange-100 transition-colors uppercase tracking-wider font-mono"
              id="nav-call-btn"
            >
              <Phone className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <span>HOTLINE: 0896.234.822</span>
            </a>
            
            <button
              id="btn-nav-post"
              onClick={openPostModal}
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Đăng Tin Bán Đất
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
