import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLinkClick = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link 
            href="/" 
            className={`${
              pathname === '/' ? 'text-black' : 'text-gray-500'
            } hover:text-gray-300 transition duration-300`}
            onClick={() => handleLinkClick('/')}
          >
            Home
          </Link>
          <Link 
            href="/new-issue" 
            className={`${
              pathname === '/new-issue' ? 'text-black' : 'text-gray-500'
            } hover:text-gray-300 transition duration-300`}
            onClick={() => handleLinkClick('/new-issue')}
          >
            New Issue
          </Link>
        </div>
      </div>
      <hr className="mt-4 border-gray-300" />
    </nav>
  );
};

export default Navbar;
