/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, ShieldAlert, Award, ChevronUp } from 'lucide-react';

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-450 font-medium text-sm pt-16 pb-12 border-t border-slate-900" id="footer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-lg font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 tracking-wider uppercase">
                BĐS HOA NGUYỄN
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Đơn vị phân phối và ký gửi bất động sản chất lượng cao hàng đầu khu vực Hà Tĩnh và Nghệ An. 
              Chuyên quy hoạch phân lô đất nền thổ cư, đất nhà vườn, biệt thự sinh thái biệt lập sạch sẽ pháp lý vững bền.
            </p>
            <div className="flex items-center gap-2 text-xs text-orange-450 font-bold font-mono tracking-wider">
              <Award className="w-4 h-4 text-orange-400" />
              <span>THƯƠNG HIỆU UY TÍN VÀNG VÌ NGƯỜI MUA CHÍNH CHỦ 2026</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4 text-left">
            <h4 className="text-slate-200 font-extrabold text-xs uppercase tracking-wider font-display">Thời gian làm việc</h4>
            <ul className="text-xs space-y-2.5 text-slate-400">
              <li>Thứ hai - Thứ sáu: <strong className="text-slate-200 font-mono">7:30 - 21:00</strong></li>
              <li>Thứ bảy - Chủ nhật: <strong className="text-slate-200 font-mono">8:00 - 18:00</strong></li>
              <li>Xem thực địa thực tế: <strong className="text-orange-400 uppercase font-mono tracking-wide">Có xe đưa đón miễn phí</strong></li>
            </ul>
          </div>

          {/* Standards */}
          <div className="space-y-4 text-left">
            <h4 className="text-slate-200 font-extrabold text-xs uppercase tracking-wider font-display">Cam Kết Vàng</h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5 leading-relaxed">
                <ShieldAlert className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>Không nâng khống giá niêm yết</span>
              </li>
              <li className="flex items-center gap-1.5 leading-relaxed">
                <ShieldAlert className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>Công chứng sẽ bàn giao sổ đỏ theo tiến độ ra bìa của VPĐK đất đai</span>
              </li>
              <li className="flex items-center gap-1.5 leading-relaxed">
                <ShieldAlert className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>Kiểm tra chính xác mốc tọa độ quy hoạch</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & Scroll back to top */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>
            © {new Date().getFullYear()} BĐS Hoa Nguyễn. Bảo lưu mọi quyền hành pháp lý. 
            Phát triển trên nền tảng AI Studio tiên tiến.
          </span>
          <button
            id="btn-scroll-to-top"
            onClick={handleScrollToTop}
            className="flex items-center gap-1.5 hover:text-white text-orange-400 transition-colors text-[10px] uppercase font-bold tracking-widest font-mono cursor-pointer"
          >
            Lên đầu trang
            <ChevronUp className="w-4 h-4 text-orange-500" />
          </button>
        </div>
      </div>
    </footer>
  );
}
