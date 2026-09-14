import React, { useState } from 'react';
import {
  Bell,
  Eye,
  EyeOff,
  QrCode,
  ArrowLeftRight,
  Plus,
  CreditCard,
  Radio,
  Droplets,
  Zap,
  Flame,
  ChevronLeft,
  X,
  Send,
  SlidersHorizontal,
  Layers,
  Sparkles,
} from 'lucide-react';
import { VodafoneLogo } from './VodafoneIcons';

interface HomeScreenProps {
  balance: number;
  onStartTransfer: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  balance,
  onStartTransfer,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const [showDismissableAlert, setShowDismissableAlert] = useState(true);
  const [activeTab, setActiveTab] = useState<'wallet' | 'transfer' | 'services' | 'more'>('wallet');

  // Format balance with commas and two decimals
  const formattedBalance = balance.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="flex flex-col h-full w-full bg-[#f4f5f7] text-gray-900 overflow-y-auto no-scrollbar pb-20 select-none" dir="rtl">
      {/* Top Header Bar */}
      <div className="bg-[#e60000] text-white pt-3 pb-3 px-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-white rounded-full"></div>
          <span className="text-lg font-bold tracking-tight">فودافون كاش</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/20 border border-white/20 px-2.5 py-1 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>المحفظة مفعل</span>
          </div>

          <button
            type="button"
            className="relative p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4">
        {/* User Greeting */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            أهلاً، <span className="text-[#e60000]">كريم</span>
          </h2>
        </div>

        {/* Balance & Quick Actions Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4a0d17] via-[#380911] to-[#25040a] text-white shadow-xl p-5 border border-red-950/40">
          {/* Subtle decorative curved pattern in card background */}
          <div className="absolute inset-0 pointer-events-none opacity-15">
            <svg viewBox="0 0 400 250" className="w-full h-full" fill="none">
              <circle cx="350" cy="50" r="180" stroke="white" strokeWidth="1.5" strokeDasharray="6 6" />
              <circle cx="350" cy="50" r="140" stroke="white" strokeWidth="1" />
              <circle cx="350" cy="50" r="90" stroke="white" strokeWidth="0.75" />
            </svg>
          </div>

          {/* Top Bar inside Card: QR code & Eye toggle */}
          <div className="flex items-center justify-between relative z-10 mb-2">
            <button
              type="button"
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md flex items-center justify-center text-white/90 border border-white/10 transition-colors"
              title="مسح QR"
            >
              <QrCode className="w-5 h-5" />
            </button>

            {/* Balance Amount with Eye Toggle */}
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-extrabold tracking-tight">
                {showBalance ? `${formattedBalance} ج.م` : '••••••••'}
              </span>
              <button
                type="button"
                onClick={() => setShowBalance(!showBalance)}
                className="p-1 rounded-full text-white/80 hover:text-white transition-colors"
                title={showBalance ? 'إخفاء الرصيد' : 'إظهار الرصيد'}
              >
                {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Subtext: View expenses */}
          <div className="text-center relative z-10 mb-6">
            <button
              type="button"
              className="text-xs font-semibold text-white/80 hover:text-white flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <span>عرض مصروفاتك</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Main Action Circles */}
          <div className="grid grid-cols-4 gap-2 relative z-10 pt-2 border-t border-white/10">
            {/* 1. Transfer Money */}
            <button
              type="button"
              onClick={onStartTransfer}
              className="flex flex-col items-center gap-2 group focus:outline-none"
            >
              <div className="w-13 h-13 rounded-full bg-white text-[#2a060d] flex items-center justify-center shadow-lg group-hover:scale-105 group-active:scale-95 transition-all">
                <ArrowLeftRight className="w-6 h-6 stroke-[2.2] text-[#2a060d]" />
              </div>
              <span className="text-[11px] font-bold text-center leading-tight text-white group-hover:text-red-200">
                تحويل الأموال
              </span>
            </button>

            {/* 2. Deposit Money */}
            <button
              type="button"
              className="flex flex-col items-center gap-2 group focus:outline-none opacity-90 hover:opacity-100"
            >
              <div className="w-13 h-13 rounded-full bg-white/15 border border-white/20 text-white flex items-center justify-center shadow-md group-hover:scale-105 group-active:scale-95 transition-all">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-medium text-center leading-tight text-white/90">
                إيداع الأموال
              </span>
            </button>

            {/* 3. ATM Operations */}
            <button
              type="button"
              className="flex flex-col items-center gap-2 group focus:outline-none opacity-90 hover:opacity-100"
            >
              <div className="w-13 h-13 rounded-full bg-white/15 border border-white/20 text-white flex items-center justify-center shadow-md group-hover:scale-105 group-active:scale-95 transition-all">
                <CreditCard className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[11px] font-medium text-center leading-tight text-white/90">
                عمليات ATM
              </span>
            </button>

            {/* 4. Telecom Services */}
            <button
              type="button"
              className="flex flex-col items-center gap-2 group focus:outline-none opacity-90 hover:opacity-100"
            >
              <div className="w-13 h-13 rounded-full bg-white/15 border border-white/20 text-white flex items-center justify-center shadow-md group-hover:scale-105 group-active:scale-95 transition-all">
                <Radio className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[11px] font-medium text-center leading-tight text-white/90">
                خدمات الاتصالات
              </span>
            </button>
          </div>
        </div>

        {/* Cash Services (خدمات كاش) */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between mb-3.5 px-1">
            <h3 className="text-base font-bold text-gray-900">خدمات كاش</h3>
            <button
              type="button"
              className="text-xs font-bold text-gray-500 hover:text-[#e60000] transition-colors"
            >
              عرض الكل
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {/* Water */}
            <div className="flex flex-col items-center gap-2 p-2 rounded-2xl bg-[#032b43]/5 border border-[#032b43]/15 hover:bg-[#032b43]/10 transition-colors cursor-pointer">
              <div className="w-11 h-11 rounded-xl bg-[#0284c7]/15 text-[#0284c7] flex items-center justify-center">
                <Droplets className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[11px] font-semibold text-gray-800 text-center leading-tight">
                المياه الشهرية
              </span>
            </div>

            {/* Electricity Card (NFC) */}
            <div className="relative flex flex-col items-center gap-2 p-2 rounded-2xl bg-[#032b43]/5 border border-[#032b43]/15 hover:bg-[#032b43]/10 transition-colors cursor-pointer">
              <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 bg-blue-600 text-[9px] font-bold text-white rounded-full">
                NFC
              </span>
              <div className="w-11 h-11 rounded-xl bg-[#0284c7]/15 text-[#0284c7] flex items-center justify-center">
                <Zap className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[11px] font-semibold text-gray-800 text-center leading-tight">
                كارت الكهرباء
              </span>
            </div>

            {/* Recharge Card (NEW) */}
            <div className="relative flex flex-col items-center gap-2 p-2 rounded-2xl bg-[#032b43]/5 border border-[#032b43]/15 hover:bg-[#032b43]/10 transition-colors cursor-pointer">
              <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 bg-amber-500 text-[9px] font-bold text-white rounded-full">
                NEW
              </span>
              <div className="w-11 h-11 rounded-xl bg-[#0284c7]/15 text-[#0284c7] flex items-center justify-center">
                <Sparkles className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[11px] font-semibold text-gray-800 text-center leading-tight">
                كارت الشحن
              </span>
            </div>

            {/* Electricity & Gas */}
            <div className="flex flex-col items-center gap-2 p-2 rounded-2xl bg-[#032b43]/5 border border-[#032b43]/15 hover:bg-[#032b43]/10 transition-colors cursor-pointer">
              <div className="w-11 h-11 rounded-xl bg-[#0284c7]/15 text-[#0284c7] flex items-center justify-center">
                <Flame className="w-6 h-6 stroke-[2]" />
              </div>
              <span className="text-[11px] font-semibold text-gray-800 text-center leading-tight">
                كهرباء / غاز
              </span>
            </div>
          </div>
        </div>

        {/* Offers Banner (العروض) */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-2.5 px-1">العروض</h3>
          <div className="overflow-hidden rounded-3xl bg-gradient-to-l from-[#382613] via-[#24170a] to-[#1a1107] text-white p-4 relative shadow-md">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 space-y-1 z-10">
                <h4 className="text-sm font-extrabold text-amber-200 leading-snug">
                  خدمات النيابة العامة دلوقتي في مكان واحد
                </h4>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  تقدر تطلب وتتابع الخدمات الجنائية من مكانك
                </p>
              </div>

              {/* Phone graphic mockup */}
              <div className="shrink-0 w-16 h-20 bg-neutral-800 rounded-xl border-2 border-amber-500/40 shadow-inner flex flex-col items-center justify-center p-1 relative overflow-hidden">
                <div className="w-8 h-1 bg-amber-400/80 rounded-full mb-1"></div>
                <div className="w-full flex-1 bg-neutral-900 rounded flex flex-col items-center justify-center text-[8px] text-amber-200 text-center font-bold">
                  <span>النيابة</span>
                  <span>العامة</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access / Bill Alert */}
        {showDismissableAlert && (
          <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">لا يوجد فواتير مستحقة</p>
                <p className="text-[10px] text-gray-500">تحويل اموال ومصروفاتك في مكان واحد</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowDismissableAlert(false)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Sticky Navigation Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-6 py-2.5 flex items-center justify-between z-30 max-w-lg mx-auto">
        {/* Tab 1: Wallet */}
        <button
          type="button"
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'wallet' ? 'text-[#e60000]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className="relative">
            <VodafoneLogo className="w-5 h-5" />
            {activeTab === 'wallet' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#e60000] rounded-full"></span>
            )}
          </div>
          <span className="text-[11px] font-bold">المحفظة</span>
        </button>

        {/* Tab 2: Transfer */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('transfer');
            onStartTransfer();
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'transfer' ? 'text-[#e60000]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <ArrowLeftRight className="w-5 h-5" />
          <span className="text-[11px] font-medium">تحويل أموال</span>
        </button>

        {/* Tab 3: Services */}
        <button
          type="button"
          onClick={() => setActiveTab('services')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'services' ? 'text-[#e60000]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[11px] font-medium">الخدمات</span>
        </button>

        {/* Tab 4: More */}
        <button
          type="button"
          onClick={() => setActiveTab('more')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'more' ? 'text-[#e60000]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="text-[11px] font-medium">المزيد</span>
        </button>
      </div>
    </div>
  );
};
