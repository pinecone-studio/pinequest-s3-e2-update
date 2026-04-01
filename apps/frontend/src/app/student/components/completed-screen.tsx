"use client";
import Image from "next/image";

export function CompletedScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f6fb] px-4 py-10 text-[#1f2a44]">
      <div className="flex h-[510px] w-full max-w-[768px] flex-col items-center justify-center rounded-[28px] bg-[#edf6ff] text-center">
        <Image
          src="/bugsteibee.png"
          alt="Success"
          width={230}
          height={180}
          priority
          className="h-[180px] w-auto object-contain"
        />
        <h1 className="mt-10 text-[32px] font-medium leading-[1.25] text-[#111111]">
          Шалгалтаа амжилттай дууссанд
          <br />
          баяр хүргэе.
        </h1>
      </div>
    </main>
  );
}
