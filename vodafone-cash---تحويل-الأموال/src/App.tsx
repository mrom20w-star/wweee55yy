import React, { useState } from 'react';
import { PhoneFrame } from './components/PhoneFrame';
import { HomeScreen } from './components/HomeScreen';
import { PinScreen } from './components/PinScreen';
import { TransferInputScreen } from './components/TransferInputScreen';
import { TransferConfirmScreen } from './components/TransferConfirmScreen';
import { TransferSuccessScreen } from './components/TransferSuccessScreen';
import { LoadingModal } from './components/LoadingModal';
import { AppScreen } from './types';

export default function App() {
  // Screen navigation state matching the video flow
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('HOME');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('جاري التحميل');

  // Wallet & Transfer State
  const [balance, setBalance] = useState<number>(19000);
  const senderPhone = '01087163221';
  const [recipientPhone, setRecipientPhone] = useState('');
  const [transferAmount, setTransferAmount] = useState<number>(200);
  const fee = 0;

  // Masked name resolver
  const getMaskedName = (phone: string) => {
    if (phone === '01036985270') {
      return 'Amr B*** Y**** R*****';
    }
    return 'Mohamed A*** H**** M*****';
  };

  // Helper to trigger realistic Vodafone loading transition
  const transitionWithLoading = (nextScreen: AppScreen, delayMs = 650, msg = 'جاري التحميل') => {
    setLoadingMessage(msg);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentScreen(nextScreen);
    }, delayMs);
  };

  // 1. User unlocks wallet via PIN at startup (or locks wallet)
  const handleInitialPinComplete = (_pin: string) => {
    transitionWithLoading('HOME', 600);
  };

  // 2. User taps "تحويل الأموال" on Home Screen
  const handleStartTransfer = () => {
    transitionWithLoading('TRANSFER_INPUT', 550);
  };

  // 3. User finishes entering phone and amount in Step 1
  const handleInputProceed = (phone: string, amount: number) => {
    setRecipientPhone(phone);
    setTransferAmount(amount);
    transitionWithLoading('TRANSFER_CONFIRM', 600);
  };

  // 4. User confirms details in Step 2 -> prompted for PIN
  const handleConfirmProceed = () => {
    transitionWithLoading('TRANSFER_PIN', 500);
  };

  // 5. User enters PIN to authorize money transfer
  const handleAuthorizePinComplete = (_pin: string) => {
    // Deduct balance
    setBalance((prev) => Math.max(0, prev - transferAmount));
    // Transition to success receipt
    transitionWithLoading('TRANSFER_SUCCESS', 800);
  };

  // 6. User clicks "تم" on success receipt -> return to Home
  const handleDone = () => {
    transitionWithLoading('HOME', 400);
  };

  return (
    <PhoneFrame>
      {/* Loading Spinner Overlay */}
      <LoadingModal isOpen={isLoading} message={loadingMessage} />

      {/* Screen Render based on active state */}
      {currentScreen === 'INITIAL_PIN' && (
        <PinScreen
          onComplete={handleInitialPinComplete}
          title="ادخل رقم المحفظة السري"
        />
      )}

      {currentScreen === 'HOME' && (
        <HomeScreen
          balance={balance}
          onStartTransfer={handleStartTransfer}
        />
      )}

      {currentScreen === 'TRANSFER_INPUT' && (
        <TransferInputScreen
          defaultPhone={recipientPhone}
          defaultAmount={transferAmount}
          onBack={() => transitionWithLoading('HOME', 350)}
          onProceed={handleInputProceed}
        />
      )}

      {currentScreen === 'TRANSFER_CONFIRM' && (
        <TransferConfirmScreen
          senderPhone={senderPhone}
          recipientPhone={recipientPhone}
          recipientName={getMaskedName(recipientPhone)}
          amount={transferAmount}
          fee={fee}
          onBack={() => transitionWithLoading('TRANSFER_INPUT', 350)}
          onConfirm={handleConfirmProceed}
        />
      )}

      {currentScreen === 'TRANSFER_PIN' && (
        <PinScreen
          onComplete={handleAuthorizePinComplete}
          title="ادخل رقم المحفظة السري"
          onBack={() => transitionWithLoading('TRANSFER_CONFIRM', 350)}
        />
      )}

      {currentScreen === 'TRANSFER_SUCCESS' && (
        <TransferSuccessScreen
          senderPhone={senderPhone}
          recipientPhone={recipientPhone}
          recipientName={getMaskedName(recipientPhone)}
          amount={transferAmount}
          fee={fee}
          dateTime="14 سبتمبر 2026 07:18"
          referenceNumber="100510859841"
          onDone={handleDone}
        />
      )}
    </PhoneFrame>
  );
}
