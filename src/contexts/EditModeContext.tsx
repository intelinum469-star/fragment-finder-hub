import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EditModeContextType {
  isEditMode: boolean;
  isAdmin: boolean;
  toggleEditMode: () => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export const EditModeProvider = ({ children }: { children: ReactNode }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        checkAdminStatus();
      } else {
        setIsAdmin(false);
        setIsEditMode(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setIsAdmin(false);
      return;
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    setIsAdmin(!!data && !error);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <EditModeContext.Provider value={{ isEditMode, isAdmin, toggleEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (context === undefined) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  return context;
};
