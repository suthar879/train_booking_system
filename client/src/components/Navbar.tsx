'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuth, logout } = useAuth();

  const commonLinks = [{ href: '/', label: 'Home' }];
  const guestLinks = [
    { href: '/login', label: 'Login' },
    { href: '/signup', label: 'Signup' },
  ];
  const authLinks = [{ href: '/dashboard', label: 'Dashboard' }];

  return (
    <nav className="w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">🚆 Train Booker</h1>
      <div className="flex gap-3 items-center">
        {[...commonLinks, ...(isAuth ? authLinks : guestLinks)].map(
          ({ href, label }) => (
            <Link key={href} href={href}>
              <Button
                variant={pathname === href ? 'default' : 'ghost'}
                className="capitalize"
              >
                {label}
              </Button>
            </Link>
          )
        )}
        {isAuth && (
          <Button onClick={() => {
            logout();
            router.push('/login');
          }} variant="destructive">
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
