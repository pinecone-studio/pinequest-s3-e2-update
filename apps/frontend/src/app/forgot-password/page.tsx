"use client";

import Image from "next/image";
import Link from "next/link";
import { IoChevronBack } from "react-icons/io5";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f7]">
      <header className="relative flex h-14 shrink-0 items-center justify-center px-5 pt-[env(safe-area-inset-top)]">
        <Link
          href="/sign-in"
          className="absolute left-5 flex h-10 w-10 items-center justify-center rounded-full text-gray-800 transition hover:bg-gray-200/80"
          aria-label="Буцах"
        >
          <IoChevronBack className="h-6 w-6" aria-hidden />
        </Link>
        <h1 className="text-lg font-bold tracking-tight text-gray-900">Нууц үг сэргээх</h1>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-10">
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-center text-sm leading-relaxed text-gray-600">
            Бүртгэлийн имэйл хаягаа шалгаад нууц үг сэргээх холбоос ирсэн эсэхийг харна уу. Хэрэв
            ирээгүй бол спам хавтсыг шалгаж, дэмжлэгтэй холбогдоно уу.
          </p>
          <Link
            href="/sign-in"
            className="mt-8 block text-center text-base font-bold text-[#29B6FF] underline-offset-2 hover:underline"
          >
            Нэвтрэх хуудас руу буцах
          </Link>
        </div>

        <footer className="mt-auto flex shrink-0 items-center justify-center gap-2 pt-10 pb-[env(safe-area-inset-bottom)]">
          <Image
            src="/bee.png"
            alt=""
            width={40}
            height={40}
            className="h-9 w-9 object-contain"
          />
          <span className="text-lg font-black tracking-tight text-[#11161d]">UPDATE</span>
        </footer>
      </div>
    </div>
  );
}
