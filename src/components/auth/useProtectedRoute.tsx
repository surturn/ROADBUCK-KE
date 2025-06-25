import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useisAdmin';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();

  const isLoading = authLoading || (requireAdmin && adminLoading);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth'); // Redirect to login page
      } else if (requireAdmin && !isAdmin) {
        router.push('/unauthorized'); // Redirect if not admin
      }
    }
  }, [user, isAdmin, isLoading, router, requireAdmin]);

  if (isLoading || !user || (requireAdmin && !isAdmin)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};
