import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoriesManager } from '@/components/admin/CategoriesManager';
import { ImagesManager } from '@/components/admin/ImagesManager';
import { SectionsManager } from '@/components/admin/SectionsManager';
import { Seo } from '@/components/Seo';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EFFEED]">
      <Seo
        title="Admin Dashboard — Natalia Egorova"
        description="Manage portfolio content, images, and site sections."
        path="/admin"
        noindex
      />
      <div className="container max-w-[1400px] mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-[#F5569B]">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black text-black">Панель Администратора</h1>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="border-2 border-gray-300 hover:bg-gray-100"
            >
              <Home className="w-4 h-4 mr-2" />
              На сайт
            </Button>
          </div>

          <Tabs defaultValue="categories" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="categories">Категории</TabsTrigger>
              <TabsTrigger value="images">Изображения</TabsTrigger>
              <TabsTrigger value="sections">Секции</TabsTrigger>
            </TabsList>
            <TabsContent value="categories"><CategoriesManager /></TabsContent>
            <TabsContent value="images"><ImagesManager /></TabsContent>
            <TabsContent value="sections"><SectionsManager /></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
