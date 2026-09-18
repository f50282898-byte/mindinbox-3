'use client';

import SageChat from '@/components/SageChat';

export default function Home() {
  return (
    <div className="w-full h-[100svh] relative flex flex-col overflow-hidden" dir="rtl">
      <SageChat />
    </div>
  );
}
