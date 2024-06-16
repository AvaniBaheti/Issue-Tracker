'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import "tailwindcss/tailwind.css";
import { PiBugDroidDuotone } from "react-icons/pi";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className='flex border-b mb-5 p-5 h-14'>
      <Link href='/'>
        <PiBugDroidDuotone size={24} className="h-6 w-6"/>
      </Link>
      <ul className='flex justify-center items-center mx-auto space-x-8'>
        <li>
          <Link href='/' className={`text-zinc-500 hover:text-zinc-800 ${pathname === '/' ? 'text-zinc-800' : ''}`}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link href='/new-issue' className={`text-zinc-500 hover:text-zinc-800 ${pathname === '/new-issue' ? 'text-zinc-800' : ''}`}>
            Create Issue
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
