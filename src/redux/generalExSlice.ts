import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://run.mocky.io/v3/0fc1e048-9fab-4f7e-96d4-bf543350b22d";
const MIN_FEATURED_RATING = 4.7;
const MIN_SUGGESTED_RATING = 4.5;
const MAX_SUGGESTED_RATING = 4.7;

const ERROR_MESSAGES = {
  FETCH_FAILED: "Failed to fetch general exam packages",
  INVALID_RESPONSE: "Invalid server response",
};

interface ServiceItem {
  name: string;
  description: string;
}

interface ServiceCategory {
  category: string;
  items: ServiceItem[];
}

interface ExamPackage {
  id: number;
  name: string;
  description: string;
  price: number;
  priceCurrency: string;
  duration: number;
  durationUnit: string;
  rating: number;
  reviews: number;
  target: string;
  image: string;
  servicesIncluded: ServiceCategory[];
  availableLocations: string[];
  validUntil: string;
}

interface GeneralExamsState {
  allPackages: ExamPackage[];
  featuredPackages: ExamPackage[];
  suggestedPackages: ExamPackage[];
  loading: boolean;
  error: string | null;
}

export const fetchGeneralExams = createAsyncThunk<
  ExamPackage[],
  void,
  { rejectValue: string }
>(
  "generalExams/fetchGeneralExams",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.FETCH_FAILED);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
      }

      const isValidPackage = (pkg: any): pkg is ExamPackage => {
        return (
          typeof pkg.id === 'number' &&
          typeof pkg.name === 'string' &&
          typeof pkg.rating === 'number'
          // Add more validation as needed
        );
      };

      if (!data.every(isValidPackage)) {
        throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
      }

      return data;
    } catch (err) {
      const error = err instanceof Error ? err.message : ERROR_MESSAGES.FETCH_FAILED;
      return rejectWithValue(error);
    }
  }
);

const initialState: GeneralExamsState = {
  allPackages: [],
  featuredPackages: [],
  suggestedPackages: [],
  loading: false,
  error: null,
};

const generalExSlice = createSlice({
  name: "generalExams",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneralExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGeneralExams.fulfilled, (state, action) => {
        state.loading = false;
        state.allPackages = action.payload;
        
        const sortedPackages = [...action.payload].sort((a, b) => b.rating - a.rating);
        
        state.featuredPackages = sortedPackages.filter(
          (pkg) => pkg.rating >= MIN_FEATURED_RATING
        );
        
        state.suggestedPackages = sortedPackages.filter(
          (pkg) => pkg.rating >= MIN_SUGGESTED_RATING && pkg.rating < MAX_SUGGESTED_RATING
        );
      })
      .addCase(fetchGeneralExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error occurred";
      });
  },
});

export const selectAllPackages = (state: { generalExams: GeneralExamsState }) => 
  state.generalExams.allPackages;

export const selectFeaturedPackages = (state: { generalExams: GeneralExamsState }) => 
  state.generalExams.featuredPackages;

export const selectSuggestedPackages = (state: { generalExams: GeneralExamsState }) => 
  state.generalExams.suggestedPackages;

export const selectLoadingStatus = (state: { generalExams: GeneralExamsState }) => 
  state.generalExams.loading;

export const selectError = (state: { generalExams: GeneralExamsState }) => 
  state.generalExams.error;

export default generalExSlice.reducer;