import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface MedicalTest {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
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
      const response = await fetch('https://run.mocky.io/v3/a523dbac-3d7e-4f96-80ac-782afdddcfc6');
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
          ? test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.description?.toLowerCase().includes(searchTerm.toLowerCase())
          : true;
        return matchesCategory && matchesSearch;
      });
    },
    sortTests: (state, action) => {
      const sortBy = action.payload;
      const testsToSort = [...state.filteredTests];
      
      testsToSort.sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
      
      state.filteredTests = testsToSort;
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
        state.tests = action.payload.tests || action.payload;
        state.filteredTests = state.tests;
        state.categories = [...new Set(state.tests.map(test => test.category))];
      })
      .addCase(fetchMedicalTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch tests';
      });
  },
});

export const { filterTests, sortTests } = medicalTestSlice.actions;
export default medicalTestSlice.reducer;