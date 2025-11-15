import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Home } from 'lucide-react';
import { Session } from '@supabase/supabase-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoriesManager } from '@/components/admin/CategoriesManager';
import { ImagesManager } from '@/components/admin/ImagesManager';
import { SectionsManager } from '@/components/admin/SectionsManager';

const AdminDashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (!session) {
          navigate('/auth');
        } else {
          checkAdminStatus(session.user.id);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      } else {
        checkAdminStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: "Error",
          description: "Failed to verify admin status",
          variant: "destructive",
        });
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFFEED] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#F5569B]" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#EFFEED] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border-4 border-[#F5569B] text-center">
          <h1 className="text-2xl font-black text-black mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have admin privileges. Please contact the administrator.
          </p>
          <Button
            onClick={handleLogout}
            className="bg-gradient-to-r from-[#F5569B] to-[#A88AED] hover:opacity-90 text-white"
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFFEED]">
      <div className="container max-w-[1400px] mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-[#F5569B]">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black text-black">Панель Администратора</h1>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-2 border-gray-300 hover:bg-gray-100"
              >
                <Home className="w-4 h-4 mr-2" />
                На сайт
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-2 border-[#F5569B] text-[#F5569B] hover:bg-[#FFCBEB]"
              >
                Выйти
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="categories" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="categories">Категории</TabsTrigger>
              <TabsTrigger value="images">Изображения</TabsTrigger>
              <TabsTrigger value="sections">Секции</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories">
              <CategoriesManager />
            </TabsContent>
            
            <TabsContent value="images">
              <ImagesManager />
            </TabsContent>
            
            <TabsContent value="sections">
              <SectionsManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
