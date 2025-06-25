import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useIsAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Check if user is in a 'users' table with a role field
      const { data, error } = await supabase
        .from('users') // previously "customers", renamed to "users"
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        setIsAdmin(false);
      } else {
        setIsAdmin(data.role === 'admin'); // assumes role is a string ('admin' | 'user')
      }

      setLoading(false);
    };

    checkAdmin();
  }, [user]);

  return { isAdmin, loading };
};
