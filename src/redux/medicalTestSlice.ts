import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface TestItem {
  name: string;
  description: string;
}

interface TestCategory {
  category: string;
  items: TestItem[];
}

interface TestDetails {
  categories: TestCategory[];
}

interface MedicalTest {
  id: number;
  name: string;
  description?: string;
  image?: string;
  details?: TestDetails;
  price?: number;
  category?: string;
  preparation?: string;
  resultTime?: string;
}

interface MedicalTestState {
  tests: MedicalTest[];
  categories: string[];
  filteredTests: MedicalTest[];
  loading: boolean;
  error: string | null;
}

const initialState: MedicalTestState = {
  tests: [],
  categories: [],
  filteredTests: [],
  loading: false,
  error: null,
};

export const fetchMedicalTests = createAsyncThunk(
  'medicalTests/fetchMedicalTests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://run.mocky.io/v3/34d92809-9b8f-4de4-be0c-6b712ad9db49');
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const medicalTestSlice = createSlice({
  name: 'medicalTests',
  initialState,
  reducers: {
    filterTests: (state, action) => {
      const { category, searchTerm } = action.payload;
      
      state.filteredTests = state.tests.filter(test => {
        const matchesCategory = category ? test.category === category : true;
        
        const matchesSearch = searchTerm 
          ? (
              test.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              (test.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
            )
          : true;
          
        return matchesCategory && matchesSearch;
      });
    },
    
    sortTests: (state, action) => {
      const sortBy = action.payload;
      const testsToSort = [...state.filteredTests];
      
      testsToSort.sort((a, b) => {
        if (sortBy === 'price') {
          const priceA = a.price || 0;
          const priceB = b.price || 0;
          return priceA - priceB;
        }
        
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        
        return 0;
      });
      
      state.filteredTests = testsToSort;
    },
    
    searchInDetails: (state, action) => {
      const searchTerm = action.payload.toLowerCase();
      
      state.filteredTests = state.tests.filter(test => {
        if (
          test.name.toLowerCase().includes(searchTerm) ||
          (test.description?.toLowerCase() || '').includes(searchTerm)
        ) {
          return true;
        }
        
        if (test.details?.categories) {
          return test.details.categories.some(category => 
            category.category.toLowerCase().includes(searchTerm) ||
            category.items.some(item => 
              item.name.toLowerCase().includes(searchTerm) ||
              item.description.toLowerCase().includes(searchTerm)
            )
          );
        }
        
        return false;
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicalTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicalTests.fulfilled, (state, action) => {
        state.loading = false;
        
        state.tests = Array.isArray(action.payload) 
          ? action.payload 
          : action.payload.tests || [action.payload];
          
        state.filteredTests = state.tests;
        
        state.categories = [...new Set(
          state.tests
            .filter(test => test.category)
            .map(test => test.category as string)
        )];
      })
      .addCase(fetchMedicalTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch tests';
      });
  },
});

export const { filterTests, sortTests, searchInDetails } = medicalTestSlice.actions;
export default medicalTestSlice.reducer;