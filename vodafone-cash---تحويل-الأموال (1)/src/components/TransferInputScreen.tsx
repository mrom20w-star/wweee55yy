import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Contact, X, Star, FileText, Delete, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playKeypadTick } from '../utils/audio';

interface TransferInputScreenProps {
  onBack: () => void;
  onProceed: (phone: string, amount: number) => void;
  defaultPhone?: string;
  defaultAmount?: number;
  balance?: number;
}

export const TransferInputScreen: React.FC<TransferInputScreenProps> = ({
  onBack,
  onProceed,
  defaultPhone = '',
  defaultAmount = 200,
  balance,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(defaultPhone);
  const [amount, setAmount] = useState<number | ''>('');
  const [activeInput, setActiveInput] = useState<'phone' | 'amount'>('phone');

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);

  // Check validity
  const isPhoneComplete = phoneNumber.length === 11;
  const isPhoneValid = isPhoneComplete && phoneNumber.startsWith('01');
  const isAmountValid = typeof amount === 'number' && amount >= 5 && amount <= 60000;
  const isBalanceSufficient = balance === undefined || (typeof amount === 'number' && amount <= balance);
  const canConfirm = isPhoneValid && isAmountValid && isBalanceSufficient;

  // Auto switch to amount input the exact moment 11 digits are reached!
  useEffect(() => {
    if (phoneNumber.length === 11) {
      setActiveInput('amount');
    } else if (phoneNumber.length < 11 && activeInput === 'amount') {
      setActiveInput('phone');
    }
  }, [phoneNumber.length]);

  const handleKeypadPress = (val: string) => {
    playKeypadTick();
    if (activeInput === 'phone') {
      if (phoneNumber.length < 11) {
        const next = phoneNumber + val;
        setPhoneNumber(next);
      }
    } else {
      const currentStr = amount === '' ? '' : amount.toString();
      if (currentStr.length < 5) {
        const nextStr = currentStr + val;
        setAmount(Number(nextStr));
      }
    }
  };

  const handleBackspace = () => {
    playKeypadTick();
    if (activeInput === 'amount' && (amount === '' || amount === 0)) {
      // If amount is empty, deleting goes back to editing phone
      setActiveInput('phone');
      setPhoneNumber((prev) => prev.slice(0, -1));
    } else if (activeInput === 'amount') {
      const str = amount === '' ? '' : amount.toString();
      if (str.length <= 1) {
        setAmount('');
      } else {
        setAmount(Number(str.slice(0, -1)));
      }
    } else {
      setPhoneNumber((prev) => prev.slice(0, -1));
    }
  };

  const addQuickAmount = (val: number) => {
    playKeypadTick();
    const current = typeof amount === 'number' ? amount : 0;
    const updated = current + val;
    if (updated <= 60000) {
      setAmount(updated);
    }
  };

  const selectFavorite = (num: string) => {
    playKeypadTick();
    setPhoneNumber(num);
  };

  // Allow native keyboard typing as well
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
    setPhoneNumber(raw);
  };

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 5);
    setAmount(raw === '' ? '' : Number(raw));
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f8f9fa] text-gray-900 select-none" dir="rtl">
      {/* Top Navigation Header */}
      <div className="shrink-0 pt-3 pb-3 px-4 flex items-center justify-between border-b border-gray-200 bg-white">
        <button
          type="button"
          onClick={onBack}
          className="p-1 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <h2 className="text-lg font-bold text-gray-900">تحويل إلي</h2>

        <div className="w-6"></div>
      </div>

      {/* Scrollable Form Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto no-scrollbar">
          {/* Mobile Number Input Card */}
          <div
            onClick={() => {
              setActiveInput('phone');
              phoneInputRef.current?.focus();
            }}
            className={`bg-white rounded-2xl p-3.5 border transition-all cursor-pointer shadow-xs ${
              activeInput === 'phone' ? 'border-[#e60000] ring-2 ring-[#e60000]/15' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-500">
                    رقم الموبايل
                  </label>
                  <span className="text-[11px] font-mono text-gray-400">
                    {phoneNumber.length}/11
                  </span>
                </div>

                <div className="relative flex items-center h-8">
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneInputChange}
                    placeholder="ادخل رقم الموبايل (11 رقم)"
                    className="w-full bg-transparent border-0 p-0 text-lg font-bold text-gray-900 tracking-wider focus:outline-none placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal font-mono"
                    maxLength={11}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pr-2">
                {phoneNumber.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhoneNumber('');
                      setAmount('');
                      setActiveInput('phone');
                    }}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}

                <div className="w-8 h-8 rounded-lg border border-red-200 bg-red-50 text-[#e60000] flex items-center justify-center">
                  <Contact className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Favorite Numbers Banner Card */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center shadow-xs">
            <div className="w-8 h-8 mx-auto mb-2 text-gray-400 flex items-center justify-center">
              <Star className="w-7 h-7 stroke-[1.5]" />
            </div>
            <p className="text-xs font-bold text-gray-800 mb-1">
              زود أرقامك المفضلة هنا علشان تلاقيهم بسهولة!
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => selectFavorite('01036985270')}
                className="text-xs font-bold text-[#e60000] bg-red-50 px-3 py-1 rounded-full hover:bg-red-100 transition-colors border border-red-100"
              >
                01036985270 (عمرو)
              </button>
              <button
                type="button"
                className="text-xs font-bold text-gray-600 border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors"
              >
                زود رقم مفضل +
              </button>
            </div>
          </div>

          {/* Amount Section - STRICTLY VISIBLE ONLY WHEN PHONE HAS EXACTLY 11 DIGITS */}
          <AnimatePresence>
            {isPhoneComplete && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={() => {
                  setActiveInput('amount');
                  amountInputRef.current?.focus();
                }}
                className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-xs overflow-hidden ${
                  activeInput === 'amount' ? 'border-[#e60000] ring-2 ring-[#e60000]/15' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-800">مبلغ</span>
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                    <span>الرسوم</span>
                  </div>
                </div>

                {/* Amount Big Display with hidden native input */}
                <div className="text-center py-2 relative">
                  <div className="flex items-center justify-center gap-2">
                    <input
                      ref={amountInputRef}
                      type="tel"
                      value={amount}
                      onChange={handleAmountInputChange}
                      placeholder="0"
                      className="w-36 text-center bg-transparent border-0 p-0 text-3xl font-black text-gray-900 tracking-tight focus:outline-none placeholder:text-gray-300"
                      maxLength={5}
                    />
                    <span className="text-xl font-bold text-gray-800">جنيه</span>
                  </div>
                </div>

                {/* Quick Add Chips */}
                <div className="flex items-center justify-center gap-2 mt-3" dir="ltr">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addQuickAmount(10);
                    }}
                    className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    + جنيه ١٠
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addQuickAmount(100);
                    }}
                    className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    + جنيه ١٠٠
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addQuickAmount(500);
                    }}
                    className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    + جنيه ٥٠٠
                  </button>
                </div>

                {/* Helper limitation text or Insufficient Balance Warning */}
                {typeof amount === 'number' && balance !== undefined && amount > balance ? (
                  <p className="text-[11px] text-red-600 font-bold text-center mt-2.5 bg-red-50 py-1 px-2 rounded-lg">
                    رصيدك الحالي غير كافٍ ({balance.toLocaleString()} ج.م)
                  </p>
                ) : (
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mt-3 px-1">
                    <span>الحد: ٥ - ٦٠,٠٠٠ جنيه</span>
                    {balance !== undefined && (
                      <span className="text-gray-600 font-semibold">
                        الرصيد المتاح: {balance.toLocaleString()} ج.م
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      {/* Bottom Area: Keypad + Confirm Button */}
      <div className="shrink-0 bg-white border-t border-gray-200">
        {/* Accessory Toolbar */}
        <div className="flex items-center justify-between px-4 py-1.5 bg-gray-100 border-b border-gray-200 text-gray-600 text-sm">
          <button
            type="button"
            onClick={() => {
              if (isPhoneComplete) {
                setActiveInput(activeInput === 'phone' ? 'amount' : 'phone');
              }
            }}
            className="flex items-center gap-3 text-gray-600"
          >
            <ChevronUp className="w-4 h-4" />
            <ChevronDown className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (canConfirm) {
                onProceed(phoneNumber, typeof amount === 'number' ? amount : 200);
              }
            }}
            className="text-gray-700 font-bold hover:text-black flex items-center gap-1"
          >
            <Check className="w-4 h-4 text-[#e60000] stroke-[3]" />
          </button>
        </div>

        {/* Dialpad with Arabic Subtext */}
        <div className="p-3 bg-gray-50" dir="ltr">
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            {[
              { num: '1', sub: '' },
              { num: '2', sub: 'ب ت ث' },
              { num: '3', sub: 'ا د' },
              { num: '4', sub: 'س ش ص ض' },
              { num: '5', sub: 'د ذ ر ز' },
              { num: '6', sub: 'ح خ ع غ' },
              { num: '7', sub: 'ن هـ و ي' },
              { num: '8', sub: 'ف ق ك ل م' },
              { num: '9', sub: 'ط ظ ع غ' },
            ].map((key) => (
              <button
                key={key.num}
                type="button"
                onClick={() => handleKeypadPress(key.num)}
                className="h-12 bg-white rounded-xl shadow-xs border border-gray-200 flex flex-col items-center justify-center active:bg-gray-200 transition-colors"
              >
                <span className="text-base font-bold text-gray-900 leading-none">{key.num}</span>
                {key.sub && <span className="text-[9px] text-gray-400 leading-none mt-0.5">{key.sub}</span>}
              </button>
            ))}

            {/* Empty space */}
            <div className="h-12"></div>

            {/* 0 */}
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="h-12 bg-white rounded-xl shadow-xs border border-gray-200 flex items-center justify-center active:bg-gray-200 transition-colors"
            >
              <span className="text-base font-bold text-gray-900">0</span>
            </button>

            {/* Backspace */}
            <button
              type="button"
              onClick={handleBackspace}
              className="h-12 rounded-xl flex items-center justify-center active:bg-gray-200 text-gray-600 transition-colors"
            >
              <Delete className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Sticky Confirm Button */}
        <div className="p-4 bg-white border-t border-gray-100" dir="rtl">
          <button
            type="button"
            disabled={!canConfirm}
            onClick={() => {
              if (canConfirm) {
                onProceed(phoneNumber, typeof amount === 'number' ? amount : 200);
              }
            }}
            className={`w-full py-3.5 rounded-full text-base font-bold transition-all shadow-md ${
              canConfirm
                ? 'bg-[#e60000] text-white hover:bg-[#cc0000] active:scale-[0.98]'
                : 'bg-red-200 text-white cursor-not-allowed'
            }`}
          >
            تأكيد
          </button>
        </div>
      </div>
    </div>
  );
};
