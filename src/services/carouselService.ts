import { apiService } from './apiService';

export interface CarouselItem {
  id: number;
  title: string;
  description: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export const carouselService = {
  // Public methods - for frontend carousel display
  getActiveCarouselItems: async (): Promise<CarouselItem[]> => {
    try {
      const items = await apiService.get('/carousels');
      // Ensure all items have proper defaults to prevent undefined values
      const normalizedItems = Array.isArray(items) ? items.map((item: any) => ({
        ...item,
        image: item.image || '',
        imageType: item.imageType || 'url',
        description: item.description || '',
        link: item.link || '',
      })) : [];
      return normalizedItems;
    } catch (error) {
      console.error('Error fetching carousel items:', error);
      return [];
    }
  },

  getCarouselItemById: async (id: number): Promise<CarouselItem | undefined> => {
    try {
      const item = await apiService.get(`/carousels/${id}`);
      // Ensure the item has proper defaults to prevent undefined values
      return {
        ...item,
        image: item.image || '',
        imageType: item.imageType || 'url',
        description: item.description || '',
        link: item.link || '',
      };
    } catch (error) {
      console.error('Error fetching carousel item:', error);
      return undefined;
    }
  },

  // Admin methods - require authentication
  createCarouselItem: async (item: Omit<CarouselItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<CarouselItem | null> => {
    try {
      return await apiService.post('/carousels', item);
    } catch (error) {
      console.error('Error creating carousel item:', error);
      return null;
    }
  },

  updateCarouselItem: async (id: number, item: Partial<CarouselItem>): Promise<CarouselItem | null> => {
    try {
      return await apiService.put(`/carousels/${id}`, item);
    } catch (error) {
      console.error('Error updating carousel item:', error);
      return null;
    }
  },

  deleteCarouselItem: async (id: number): Promise<boolean> => {
    try {
      await apiService.delete(`/carousels/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting carousel item:', error);
      return false;
    }
  },

  // Method to get all carousel items (admin access)
  getAllCarouselItems: async (): Promise<CarouselItem[]> => {
    try {
      const items = await apiService.get('/carousels');
      return Array.isArray(items) ? items : [];
    } catch (error) {
      console.error('Error fetching all carousel items:', error);
      return [];
    }
  }
};