import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store'; // Adjust import path as needed

// Constants
const API_URL = "http://localhost:3000/api/v1/service-pkg";
const MIN_FEATURED_RATING = 4.7;
const MIN_SUGGESTED_RATING = 4.5;
const MAX_SUGGESTED_RATING = 4.7;

// Error messages
const ERROR_MESSAGES = {
  FETCH_FAILED: "Failed to fetch service packages",
  INVALID_RESPONSE: "Invalid server response",
};

// Interfaces
interface ServiceItem {
  id: number;
  name: string;
  description: string;
  price?: number;
}

interface ServiceCategory {
  id: number;
  category: string;
  items: ServiceItem[];
}

interface PackageItem {
  id: number;
  serviceId: number;
  packageId: number;
  quantity?: number;
}

interface ServicePackage {
  id: number;
  name: string;
  description: string;
  image?: string;
  price: number;
  type: 'general' | 'medical';
  totalDuration: number;
  rating: number;
  reviews: number;
  target: string;
  availableLocations: string[];
  validUntil: string;
  categoryId: number;
  category?: string;
  preparation?: string;
  resultTime?: string;
  details?: {
    [key: string]: any;
    categories?: ServiceCategory[];
  };
}

interface ServicePackageState {
  packages: ServicePackage[];
  serviceItems: ServiceItem[];
  serviceCategories: ServiceCategory[];
  packageItems: PackageItem[];
  filteredPackages: ServicePackage[];
  featuredPackages: ServicePackage[];
  suggestedPackages: ServicePackage[];
  categories: string[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ServicePackageState = {
  packages: [],
  serviceItems: [],
  serviceCategories: [],
  packageItems: [],
  filteredPackages: [],
  featuredPackages: [],
  suggestedPackages: [],
  categories: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchServicePackages = createAsyncThunk(
  'servicePackage/fetchServicePackages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.FETCH_FAILED);
      }

      const data = await response.json();
      console.log("API Response:", data); // Để kiểm tra dữ liệu thực tế

      if (!Array.isArray(data)) {
        throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
      }

      return data.map(pkg => {
        // Clone để tránh mutate dữ liệu gốc
        const normalized = { 
          ...pkg,
          details: { ...(pkg.details || {}) }
        };
        
        // Đảm bảo category name luôn được gán
        if (pkg.category) {
          normalized.category = pkg.category.name;
        }
        
        // Chuẩn hóa cấu trúc categories nếu không có sẵn
        if (!normalized.details.categories && pkg.items && pkg.items.length > 0) {
          // Nhóm items theo category
          const itemsByCategory = {};
          
          pkg.items.forEach(item => {
            const categoryId = item.categoryId;
            const categoryName = item.category?.name || "Không phân loại";
            
            if (!itemsByCategory[categoryId]) {
              itemsByCategory[categoryId] = {
                category: categoryName,
                items: []
              };
            }
            
            // Thêm item vào
            itemsByCategory[categoryId].items.push({
              name: item.name,
              description: item.description,
              duration: item.duration,
              // Thêm các thuộc tính khác nếu cần
            });
          });
          
          normalized.details.categories = Object.values(itemsByCategory);
        }
        
        return normalized;
      });
    } catch (err) {
      const error = err instanceof Error ? err.message : ERROR_MESSAGES.FETCH_FAILED;
      return rejectWithValue(error);
    }
  }
);

export const fetchServiceItems = createAsyncThunk<
  ServiceItem[],
  void,
  { rejectValue: string }
>(
  'servicePackage/fetchServiceItems',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with your actual API endpoint for service items
      const response = await fetch('http://localhost:3000/api/v1/service-item');
      
      if (!response.ok) {
        throw new Error('Failed to fetch service items');
      }

      return await response.json();
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to fetch service items';
      return rejectWithValue(error);
    }
  }
);

export const fetchServiceCategories = createAsyncThunk<
  ServiceCategory[],
  void,
  { rejectValue: string }
>(
  'servicePackage/fetchServiceCategories',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with your actual API endpoint for service categories
      const response = await fetch('http://localhost:3000/api/v1/service-category');
      
      if (!response.ok) {
        throw new Error('Failed to fetch service categories');
      }

      return await response.json();
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to fetch service categories';
      return rejectWithValue(error);
    }
  }
);

// Slice
const servicePackageSlice = createSlice({
  name: 'servicePackage',
  initialState,
  reducers: {
    filterPackages: (state, action: PayloadAction<{ category?: string; searchTerm?: string }>) => {
      const { category, searchTerm } = action.payload;
      
      state.filteredPackages = state.packages.filter(pkg => {
        const matchesCategory = category ? pkg.category === category : true;
        
        const matchesSearch = searchTerm 
          ? (
              pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              (pkg.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
            )
          : true;
          
        return matchesCategory && matchesSearch;
      });
    },
    
    sortPackages: (state, action: PayloadAction<'price' | 'name' | 'rating'>) => {
      const sortBy = action.payload;
      const packagesToSort = [...state.filteredPackages];
      
      packagesToSort.sort((a, b) => {
        if (sortBy === 'price') {
          return a.price - b.price;
        }
        
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        
        return 0;
      });
      
      state.filteredPackages = packagesToSort;
    },
    
    searchInDetails: (state, action: PayloadAction<string>) => {
      const searchTerm = action.payload.toLowerCase();
    
      state.filteredPackages = state.packages.filter(pkg => {
        // Tìm theo tên hoặc mô tả gói
        if (
          pkg.name.toLowerCase().includes(searchTerm) ||
          (pkg.description?.toLowerCase() || '').includes(searchTerm)
        ) {
          return true;
        }
    
        // Tìm theo chi tiết danh mục (nếu có)
        if (pkg.details?.categories) {
          return pkg.details.categories.some(category => 
            category.category.toLowerCase().includes(searchTerm) ||
            category.items.some(item => 
              item.name.toLowerCase().includes(searchTerm) ||
              (item.description?.toLowerCase() || '').includes(searchTerm)
            )
          );
        }
    
        return false;
      });
    },
    
    
    filterByPriceRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      const { min, max } = action.payload;
      
      state.filteredPackages = state.packages.filter(pkg => {
        return pkg.price >= min && pkg.price <= max;
      });
    },
    
    filterByLocation: (state, action: PayloadAction<string>) => {
      const location = action.payload;
      
      state.filteredPackages = state.packages.filter(pkg => {
        return pkg.availableLocations.some(loc => 
          loc.toLowerCase().includes(location.toLowerCase())
        );
      });
    },
    
    filterByTarget: (state, action: PayloadAction<string>) => {
      const target = action.payload;
      
      state.filteredPackages = state.packages.filter(pkg => {
        return pkg.target.toLowerCase().includes(target.toLowerCase());
      });
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchServicePackages
      .addCase(fetchServicePackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicePackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload;
        state.filteredPackages = action.payload;
        
        // Extract unique categories
        state.categories = [...new Set(
          action.payload
            .filter(pkg => pkg.category)
            .map(pkg => pkg.category as string)
        )];
        
        // Sort packages by rating for featured and suggested collections
        const sortedPackages = [...action.payload].sort((a, b) => b.rating - a.rating);
        
        // Set featured packages (rating >= 4.7)
        state.featuredPackages = sortedPackages.filter(
          (pkg) => pkg.rating >= MIN_FEATURED_RATING
        );
        
        // Set suggested packages (rating between 4.5 and 4.7)
        state.suggestedPackages = sortedPackages.filter(
          (pkg) => pkg.rating >= MIN_SUGGESTED_RATING && pkg.rating < MAX_SUGGESTED_RATING
        );
      })
      .addCase(fetchServicePackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error occurred";
      })
      
      // Handle fetchServiceItems
      .addCase(fetchServiceItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceItems.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceItems = action.payload;
      })
      .addCase(fetchServiceItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch service items";
      })
      
      // Handle fetchServiceCategories
      .addCase(fetchServiceCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceCategories = action.payload;
      })
      .addCase(fetchServiceCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch service categories";
      });
  },
});

// Actions
export const {
  filterPackages,
  sortPackages,
  searchInDetails,
  filterByPriceRange,
  filterByLocation,
  filterByTarget
} = servicePackageSlice.actions;

// Selectors
export const selectAllPackages = (state: RootState) => state.servicePackage.packages;
export const selectFilteredPackages = (state: RootState) => state.servicePackage.filteredPackages;
export const selectFeaturedPackages = (state: RootState) => 
  state?.servicePackage?.featuredPackages || [];
export const selectSuggestedPackages = (state: RootState) => 
  state?.servicePackage?.suggestedPackages || [];
export const selectServiceItems = (state: RootState) => state.servicePackage.serviceItems;
export const selectServiceCategories = (state: RootState) => state.servicePackage.serviceCategories;
export const selectCategories = (state: RootState) => state.servicePackage.categories;
export const selectLoadingStatus = (state: RootState) => state.servicePackage.loading;
export const selectError = (state: RootState) => state.servicePackage.error;

export default servicePackageSlice.reducer;