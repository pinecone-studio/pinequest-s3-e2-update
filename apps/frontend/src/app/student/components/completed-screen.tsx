"use client";
import Image from "next/image";

export function CompletedScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f6fb] px-3 py-8 text-[#1f2a44] sm:px-4 sm:py-10">
      <div className="flex min-h-0 w-full max-w-[768px] flex-col items-center justify-center rounded-[20px] bg-[#edf6ff] px-4 py-10 text-center sm:rounded-[28px] sm:px-8 sm:py-12 md:min-h-[24rem] md:py-16">
        <Image
          src="/bugsteibee.png"
          alt="Success"
          width={230}
          height={180}
          priority
          className="h-32 w-auto max-w-[85vw] object-contain sm:h-40 md:h-[180px]"
        />
        <h1 className="mt-6 max-w-lg text-pretty text-xl font-medium leading-snug text-[#111111] sm:mt-10 sm:text-2xl md:text-[32px] md:leading-[1.25]">
          Шалгалтаа амжилттай дууссанд баяр хүргэе.
        </h1>
      </div>
    </main>
  );
}
