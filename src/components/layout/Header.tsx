
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ShoppingCart, User, Menu, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { toast } from 'sonner';

interface HeaderProps {
  cartItemCount?: number;
  currentLanguage?: 'en' | 'sw';
  onLanguageChange?: (lang: 'en' | 'sw') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  cartItemCount = 0, 
  currentLanguage = 'en',
  onLanguageChange 
}) => {
  const { user, profile, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
      navigate('/');
    }
  };

  const translations = {
    en: {
      products: 'Products',
      about: 'About',
      contact: 'Contact',
      downloads: 'Downloads',
      signIn: 'Sign In',
      profile: 'Profile',
      orders: 'My Orders',
      signOut: 'Sign Out',
      admin: 'Admin Dashboard'
    },
    sw: {
      products: 'Bidhaa',
      about: 'Kuhusu',
      contact: 'Mawasiliano',
      downloads: 'Mipakuzi',
      signIn: 'Ingia',
      profile: 'Wasifu',
      orders: 'Maagizo Yangu',
      signOut: 'Toka',
      admin: 'Dashibodi ya Msimamizi'
    }
  };

  const t = translations[currentLanguage];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">ROADBUCK</h1>
              <span className="ml-2 text-sm text-gray-500">Kenya</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/products">
              <Button variant="ghost">{t.products}</Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost">{t.about}</Button>
            </Link>
            <Link to="/downloads">
              <Button variant="ghost">{t.downloads}</Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost">{t.contact}</Button>
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Globe className="h-4 w-4 mr-1" />
                  {currentLanguage.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onLanguageChange?.('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onLanguageChange?.('sw')}>
                  Kiswahili
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Shopping Cart */}
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-1" />
                    {profile?.full_name || profile?.email || 'User'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>{t.profile}</DropdownMenuItem>
                  <DropdownMenuItem>{t.orders}</DropdownMenuItem>
                  {profile?.role === 'admin' && (
                    <DropdownMenuItem>{t.admin}</DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    {t.signOut}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setAuthModalOpen(true)}>
                {t.signIn}
              </Button>
            )}

            {/* Mobile menu */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </header>
  );
};
