import Link from 'next/link';
import React from 'react'
import "tailwindcss/tailwind.css";
const Navbar = () => {

  return (
    <nav className='flex'>
      <Link href='/'>Logo</Link>
      <ul className='flex'>
        <li><Link href='/'>Dashboard</Link></li>
        <li><Link href='/new-issue'>Create Issue</Link></li>
      </ul>
      <hr className='mx-8'></hr>
    </nav>
  );
};

export default Navbar;
