/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, Phone, MapPin, Mail, Sparkles, MessageCircle, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { LandListing, ContactMessage } from '../types';

interface ContactFormProps {
  listings: LandListing[];
  selectedListingForInquiry: LandListing | null;
  onSubmitContactMessage: (message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => void;
  clearSelectedListingInquiry: () => void;
}

export default function ContactForm({
  listings,
  selectedListingForInquiry,
  onSubmitContactMessage,
  clearSelectedListingInquiry
}: ContactFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [messageText, setMessageText] = useState('');
  const [interestListingId, setInterestListingId] = useState(selectedListingForInquiry?.id || 'general');
  const [isSuccess, setIsSuccess] = useState(false);

  // AI Advisory Q&A Widget (Local Automated advising agent)
  const [aiAnswer, setAiAnswer] = useState<string>('Xin chào! Tôi là Trợ lý tự động BĐS Hoa Nguyễn. Hãy chọn một trong các câu hỏi pháp lý nhanh bên dưới, tôi sẽ tư vấn giải đáp tức thì cho bạn!');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Set selected listing interest when chosen from list
  React.useEffect(() => {
    if (selectedListingForInquiry) {
      setInterestListingId(selectedListingForInquiry.id);
      setMessageText(`Tôi muốn nhận chi tiết thông tin quy hoạch, bản vẽ và lịch xem thực tế cho lô đất: "${selectedListingForInquiry.title}".`);
    }
  }, [selectedListingForInquiry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Vui lòng cung cấp ít nhất Họ tên và Số điện thoại liên hệ!');
      return;
    }

    const matchedListing = listings.find(l => l.id === interestListingId);
    
    onSubmitContactMessage({
      name,
      phone,
      email: email || undefined,
      interestInListingId: interestListingId !== 'general' ? interestListingId : undefined,
      interestInListingTitle: matchedListing ? matchedListing.title : undefined,
      message: messageText || 'Yêu cầu tư vấn ký gửi / mua bán đất nền.'
    });

    setIsSuccess(true);
    
    // Clear form inputs after success status
    setTimeout(() => {
      setName('');
      setPhone('');
      setEmail('');
      setMessageText('');
      setInterestListingId('general');
      clearSelectedListingInquiry();
      setIsSuccess(false);
    }, 4500);
  };

  // AI Consultation responses
  const AI_KNOWLEDGE_BASE = {
    'phap-ly': {
      q: 'Hồ sơ pháp lý cần kiểm tra khi mua đất nền là gì?',
      a: 'Khi giao dịch mua đất nền, Quý khách cần đặc biệt lưu ý kiểm tra các giấy tờ cốt lõi sau:\n1. Sổ đỏ/Sổ hồng gốc (Giấy chứng nhận QSDĐ) - kiểm tra kỹ hình thức, diện tích đất ở đô thị (ONT/ODT), tránh nhầm lẫn với đất trồng cây.\n2. Bản đồ đo đạc trích lục thửa đất hiện tại của Sở Tài nguyên Môi trường để đối chiếu ranh giới cột mốc ngoài thực địa.\n3. Chứng nhận xác thực quy hoạch của quận/huyện để đảm bảo lô đất không nằm trong hành lang an toàn giao thông, lưới điện quốc gia hoặc dự án thu hồi công ích.'
    },
    'sang-ten': {
      q: 'Quy trình và thuế phí sang tên sổ đỏ mất bao lâu?',
      a: 'Thủ tục chuyển nhượng sang tên sổ đỏ tại Hà Tĩnh / Hà Nam / Nghệ An thông thường gồm 4 bước và diễn ra trong 15 - 20 ngày làm việc:\n1. Đặt cọc và làm Hợp đồng chuyển nhượng công chứng.\n2. Nộp hồ sơ kê khai thuế tại Văn phòng đăng ký đất đai.\n3. Thanh toán Thuế thu nhập cá nhân (2% giá trị hợp đồng) và Lệ phí trước bạ (0.5% dịch vụ).\n4. Nhận sổ đỏ mới hoàn toàn mang tên chủ mới.'
    },
    'vay-von': {
      q: 'Chính sách vay ngân hàng mua đất tại BĐS Hoa Nguyễn?',
      a: 'BĐS Hoa Nguyễn ký hợp tác với các ngân hàng uy tín hàng đầu (Vietcombank, BIDV, TPBank) hỗ trợ quý khách hàng:\n- Hạn mức hỗ trợ vay: Lên tới 70% - 80% định giá thẩm định tài sản thực tế.\n- Lãi suất mua đất nền hấp dẫn: Dao động khoảng 5.5% - 6.8% cố định trong năm đầu tiên.\n- Thời gian vay tối đa lên tới 25 năm, hồ sơ phê duyệt nhanh gọn trong vòng 3 ngày làm việc.'
    }
  };

  const handleAiConsult = (topic: keyof typeof AI_KNOWLEDGE_BASE) => {
    setIsAiLoading(true);
    setAiAnswer('');
    
    setTimeout(() => {
      setAiAnswer(AI_KNOWLEDGE_BASE[topic].a);
      setIsAiLoading(false);
    }, 800);
  };

  return (
    <div className="bg-gradient-to-br from-[#FFF8F4] via-white to-[#FFFDFB] rounded-3xl border border-orange-100 shadow-xl p-6 md:p-10 text-slate-900" id="contact-form-section">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        
        {/* Left Side: Contact Information & Smart Advisory Panel */}
        <div className="lg:col-span-2 space-y-8 text-left">
          <div>
            <span className="text-orange-600 font-bold font-mono uppercase text-[10px] tracking-widest block mb-1">
              Hỗ Trợ Luôn Luôn Sẵn Sàng 24/7
            </span>
            <h2 className="text-3xl font-black text-slate-850 tracking-tight font-display uppercase">
              Liên Hệ & Đóng Góp Ký Gửi
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium leading-relaxed">
              Hãy để lại lời nhắn hoặc câu hỏi, đội ngũ chuyên viên pháp lý của <strong>BĐS Hoa Nguyễn</strong> sẽ phản hồi kèm bản đồ trích lục quy hoạch mới nhất cho bạn trong vòng 30 phút.
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-orange-50/50 shadow-sm transition-transform duration-300 hover:scale-[1.01]">
              <div className="p-3.5 rounded-xl bg-orange-50 text-orange-600 shrink-0">
                <Phone className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono">Hotline Tư Vấn</span>
                <span className="text-sm font-black text-slate-755">0896.234.822 (Zalo Hoa Nguyễn)</span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-orange-50/50 shadow-sm transition-transform duration-300 hover:scale-[1.01]">
              <div className="p-3.5 rounded-xl bg-orange-50 text-orange-600 shrink-0">
                <Mail className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono">Hòm thư điện tử</span>
                <span className="text-sm font-bold text-slate-755 font-mono">nguyenhoa48adhv@gmail.com</span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-orange-50/50 shadow-sm transition-transform duration-300 hover:scale-[1.01]">
              <div className="p-3.5 rounded-xl bg-orange-50 text-orange-600 shrink-0">
                <MapPin className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono">Trụ sở chính</span>
                <span className="text-sm font-bold text-slate-755 leading-snug">Xã Nghi Xuân, tỉnh Hà Tĩnh</span>
              </div>
            </div>
          </div>

          {/* Interactive Adviser Assistant Card */}
          <div className="bg-white rounded-3xl border border-orange-100 p-5 shadow-sm shadow-orange-950/2 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3.5">
              <span className="p-1.5 rounded-full bg-orange-50 text-orange-600">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] font-extrabold tracking-wider text-slate-700 font-mono uppercase">HỘP THƯ TRỢ LÝ PHÁP LÝ TỰ ĐỘNG</span>
            </div>

            {/* Answer Display */}
            <div className="bg-orange-50/15 border border-orange-100/40 rounded-2xl p-4 min-h-[110px] text-xs leading-relaxed text-slate-700 font-semibold whitespace-pre-line text-left">
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center gap-2 h-full py-8 text-orange-600 font-mono font-bold text-center">
                  <RefreshCw className="w-5 h-5 animate-spin mb-1" />
                  <span>ĐANG TRA CỨU QUY HOẠCH HÀ TĨNH...</span>
                </div>
              ) : (
                aiAnswer
              )}
            </div>

            {/* Clickable prompt chips */}
            <div className="mt-4 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider block text-left">Đề xuất tra cứu nhanh:</span>
              <div className="flex flex-wrap gap-1.5 justify-start">
                <button
                  id="btn-ai-consult-phaply"
                  onClick={() => handleAiConsult('phap-ly')}
                  className="bg-orange-50/40 hover:bg-orange-100 text-slate-700 border border-orange-100/50 text-[10px] font-bold font-mono py-1.5 px-3 rounded-full transition-all cursor-pointer"
                >
                  Hồ sơ pháp lý?
                </button>
                <button
                  id="btn-ai-consult-sangten"
                  onClick={() => handleAiConsult('sang-ten')}
                  className="bg-orange-50/40 hover:bg-orange-100 text-slate-700 border border-orange-100/50 text-[10px] font-bold font-mono py-1.5 px-3 rounded-full transition-all cursor-pointer"
                >
                  Thuế phí sang tên?
                </button>
                <button
                  id="btn-ai-consult-vayvon"
                  onClick={() => handleAiConsult('vay-von')}
                  className="bg-orange-50/40 hover:bg-orange-100 text-slate-700 border border-orange-100/50 text-[10px] font-bold font-mono py-1.5 px-3 rounded-full transition-all cursor-pointer"
                >
                  Ngân hàng & Lãi suất?
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Fast Inquiry form container */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 md:p-8 border border-orange-150/40 shadow-xl shadow-orange-950/2">
          
          {isSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4 animate-scale-up" id="contact-success-box">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 border border-orange-100 rounded-full flex items-center justify-center shadow-md shadow-orange-500/10">
                <CheckCircle2 className="w-9 h-9 stroke-[2.2] text-orange-500 animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-1 font-display uppercase tracking-tight">Gửi Yêu Cầu Thành Công!</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Cảm ơn <strong>{name || "Khách hàng"}</strong>. Hệ thống CRM của BĐS Hoa Nguyễn đã ghi nhận yêu cầu tư vấn. Chuyên viên sẽ trực tiếp điện thoại giải đáp cho bạn trong ít phút tới.
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono font-bold block pt-4">Tự động làm mới khung liên hệ...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" id="consultation-form">
              <span className="text-xs font-black uppercase tracking-widest text-[#E9825E] font-display block text-left mb-1.5 border-b pb-1.5 border-orange-50">
                GỬI YÊU CẦU TƯ VẤN NGAY
              </span>

              {/* Related Listing Indicator */}
              {selectedListingForInquiry && (
                <div className="bg-orange-50/60 border border-orange-200/50 text-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4 text-left shadow-sm">
                  <div className="truncate pr-2">
                    <span className="text-[10px] font-bold text-orange-700 uppercase block font-mono">Thửa đất đặc biệt:</span>
                    <span className="text-xs font-bold truncate block mt-0.5 uppercase tracking-wide">{selectedListingForInquiry.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={clearSelectedListingInquiry}
                    className="text-xs font-bold text-red-550 hover:text-red-700 font-mono uppercase underline shrink-0 cursor-pointer"
                    title="Xóa lựa chọn thửa đất"
                  >
                    Hủy chọn
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 block text-left">
                  <label className="text-[10px] font-bold text-slate-650 uppercase tracking-wider block">Tên của bạn (*):</label>
                  <input
                    type="text"
                    required
                    placeholder="Mời nhập họ tên của bạn..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm text-slate-800"
                  />
                </div>

                <div className="space-y-1 block text-left">
                  <label className="text-[10px] font-bold text-slate-655 uppercase tracking-wider block">Số điện thoại (*):</label>
                  <input
                    type="tel"
                    required
                    placeholder="Nhập SĐT nhận tư vấn..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 block text-left">
                  <label className="text-[10px] font-bold text-slate-655 uppercase tracking-wider block">Địa chỉ Email:</label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm text-slate-800"
                  />
                </div>

                <div className="space-y-1 block text-left">
                  <label className="text-[10px] font-bold text-slate-655 uppercase tracking-wider block">Hạng mục quan tâm cốt lõi:</label>
                  <select
                    value={interestListingId}
                    onChange={(e) => setInterestListingId(e.target.value)}
                    className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none cursor-pointer transition-all shadow-sm text-slate-800"
                  >
                    <option value="general">Cần tư vấn thủ tục ký gửi đất nền</option>
                    <option value="legal">Tra cứu thông tin quy hoạch Hà Tĩnh & Nghệ An</option>
                    {listings.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.price} - Lô: {l.title.slice(0, 24)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1 block text-left">
                <label className="text-[10px] font-bold text-slate-655 uppercase tracking-wider block">Nội dung ghi chú yêu cầu tư vấn chi tiết:</label>
                <textarea
                  rows={3}
                  placeholder="Gợi ý: Cần hẹn lịch xem đất ngày cuối tuần, thương lượng trực tiếp chủ, hỗ trợ đo đạc lại..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full bg-white border border-orange-100/60 rounded-2xl px-4 py-3 text-xs font-bold font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm text-slate-800"
                />
              </div>

              <button
                type="submit"
                id="btn-consultation-submit"
                className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold py-3.5 px-6 rounded-full text-xs uppercase tracking-widest font-mono shadow-lg shadow-orange-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                GỬI ĐĂNG KÝ TƯ VẤN NGAY
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-slate-400 text-center leading-relaxed font-sans">
                * BĐS Hoa Nguyễn bảo mật thông tin tuyệt đối của Quý khách theo chuẩn bảo mật thông tin Quốc gia. 
                Cam kết không spam quảng cáo rác làm phiền.
              </p>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
