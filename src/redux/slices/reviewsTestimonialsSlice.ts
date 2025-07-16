import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "@/lib/axios";

// Types
interface User {
  id: number;
  name: string;
}

interface Review {
  id: number;
  userId: number;
  packageId?: number;
  hotelId?: number;
  flightId?: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: User;
}

interface ReviewEntity {
  id: number;
  title?: string;
  type: 'package' | 'hotel' | 'flight';
}

interface UserReview extends Review {
  entity: ReviewEntity;
}

interface ReviewListResponse {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

interface UserReviewsResponse {
  reviews: UserReview[];
  totalCount: number;
}

interface Testimonial {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  user: User;
}

interface TestimonialListResponse {
  testimonials: Testimonial[];
  totalCount: number;
}

interface CreateReviewRequest {
  rating: number;
  comment: string;
}

interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}

interface CreateTestimonialRequest {
  content: string;
}

interface UpdateTestimonialRequest {
  content: string;
}

interface ReviewsTestimonialsState {
  // Reviews state
  reviews: Review[];
  userReviews: UserReview[];
  currentReviewList: ReviewListResponse | null;
  reviewsLoading: boolean;
  reviewsError: string | null;
  
  // Testimonials state
  testimonials: Testimonial[];
  userTestimonials: Testimonial[];
  testimonialsLoading: boolean;
  testimonialsError: string | null;
  
  // Pagination
  reviewsPagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
  testimonialsPagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

const initialState: ReviewsTestimonialsState = {
  reviews: [],
  userReviews: [],
  currentReviewList: null,
  reviewsLoading: false,
  reviewsError: null,
  
  testimonials: [],
  userTestimonials: [],
  testimonialsLoading: false,
  testimonialsError: null,
  
  reviewsPagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  testimonialsPagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
  },
};

export const createPackageReview = createAsyncThunk(
  'reviewsTestimonials/createPackageReview',
  async ({ packageId, data }: { packageId: number; data: CreateReviewRequest }) => {
    const response = await api.post(`/reviews/packages/${packageId}`, data);
    return response.data.data;
  }
);

export const createHotelReview = createAsyncThunk(
  'reviewsTestimonials/createHotelReview',
  async ({ hotelId, data }: { hotelId: number; data: CreateReviewRequest }) => {
    const response = await api.post(`/reviews/hotels/${hotelId}`, data);
    return response.data.data;
  }
);

export const createFlightReview = createAsyncThunk(
  'reviewsTestimonials/createFlightReview',
  async ({ flightId, data }: { flightId: number; data: CreateReviewRequest }) => {
    const response = await api.post(`/reviews/flights/${flightId}`, data);
    return response.data.data;
  }
);

export const getPackageReviews = createAsyncThunk(
  'reviewsTestimonials/getPackageReviews',
  async ({ packageId, query }: { packageId: number; query?: any }) => {
    const response = await api.get(`/reviews/packages/${packageId}`, { params: query });
    return response.data.data;
  }
);

export const getUserReviews = createAsyncThunk(
  'reviewsTestimonials/getUserReviews',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    const response = await api.get('/reviews/my-reviews', { params: { page, limit } });
    return { data: response.data.data, page, limit };
  }
);

export const updateReview = createAsyncThunk(
  'reviewsTestimonials/updateReview',
  async ({ reviewId, data }: { reviewId: number; data: UpdateReviewRequest }) => {
    const response = await api.put(`/reviews/${reviewId}`, data);
    return response.data.data;
  }
);

export const deleteReview = createAsyncThunk(
  'reviewsTestimonials/deleteReview',
  async (reviewId: number) => {
    await api.delete(`/reviews/${reviewId}`);
    return reviewId;
  }
);

export const createTestimonial = createAsyncThunk(
  'reviewsTestimonials/createTestimonial',
  async (data: CreateTestimonialRequest) => {
    const response = await api.post('/testimonial', data);
    return response.data.data;
  }
);

export const getTestimonials = createAsyncThunk(
  'reviewsTestimonials/getTestimonials',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    const response = await api.get('/testimonial', { params: { page, limit } });
    return { data: response.data.data, page, limit };
  }
);

export const getUserTestimonials = createAsyncThunk(
  'reviewsTestimonials/getUserTestimonials',
  async () => {
    const response = await api.get('/testimonial/my-testimonials');
    return response.data.data;
  }
);

export const updateTestimonial = createAsyncThunk(
  'reviewsTestimonials/updateTestimonial',
  async ({ testimonialId, data }: { testimonialId: number; data: UpdateTestimonialRequest }) => {
    const response = await api.put(`/testimonial/${testimonialId}`, data);
    return response.data.data;
  }
);

export const deleteTestimonial = createAsyncThunk(
  'reviewsTestimonials/deleteTestimonial',
  async (testimonialId: number) => {
    await api.delete(`/testimonial/${testimonialId}`);
    return testimonialId;
  }
);

export const adminDeleteTestimonial = createAsyncThunk(
  'reviewsTestimonials/adminDeleteTestimonial',
  async (testimonialId: number) => {
    await api.delete(`/testimonial/${testimonialId}/admin`);
    return testimonialId;
  }
);

const reviewsTestimonialsSlice = createSlice({
  name: 'reviewsTestimonials',
  initialState,
  reducers: {
    clearReviewsError: (state) => {
      state.reviewsError = null;
    },
    clearTestimonialsError: (state) => {
      state.testimonialsError = null;
    },
    clearAllErrors: (state) => {
      state.reviewsError = null;
      state.testimonialsError = null;
    },
    setReviewsPage: (state, action) => {
      state.reviewsPagination.page = action.payload;
    },
    setTestimonialsPage: (state, action) => {
      state.testimonialsPagination.page = action.payload;
    },
    resetReviewsState: (state) => {
      state.reviews = [];
      state.userReviews = [];
      state.currentReviewList = null;
      state.reviewsLoading = false;
      state.reviewsError = null;
      state.reviewsPagination = initialState.reviewsPagination;
    },
    resetTestimonialsState: (state) => {
      state.testimonials = [];
      state.userTestimonials = [];
      state.testimonialsLoading = false;
      state.testimonialsError = null;
      state.testimonialsPagination = initialState.testimonialsPagination;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPackageReview.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewsError = null;
      })
      .addCase(createPackageReview.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(createPackageReview.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewsError = action.error.message || 'Failed to create package review';
      });

    builder
      .addCase(createHotelReview.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewsError = null;
      })
      .addCase(createHotelReview.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(createHotelReview.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewsError = action.error.message || 'Failed to create hotel review';
      });

    builder
      .addCase(createFlightReview.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewsError = null;
      })
      .addCase(createFlightReview.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(createFlightReview.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewsError = action.error.message || 'Failed to create flight review';
      });

    builder
      .addCase(getPackageReviews.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewsError = null;
      })
      .addCase(getPackageReviews.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.currentReviewList = action.payload;
        state.reviews = action.payload.reviews;
      })
      .addCase(getPackageReviews.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewsError = action.error.message || 'Failed to fetch package reviews';
      });

    builder
      .addCase(getUserReviews.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewsError = null;
      })
      .addCase(getUserReviews.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.userReviews = action.payload.data.reviews;
        state.reviewsPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: Math.ceil(action.payload.data.totalCount / action.payload.limit),
        };
      })
      .addCase(getUserReviews.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewsError = action.error.message || 'Failed to fetch user reviews';
      });

    builder
      .addCase(updateReview.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewsError = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        const index = state.reviews.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
        const userIndex = state.userReviews.findIndex(r => r.id === action.payload.id);
        if (userIndex !== -1) {
          state.userReviews[userIndex] = { ...state.userReviews[userIndex], ...action.payload };
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewsError = action.error.message || 'Failed to update review';
      });

    builder
      .addCase(deleteReview.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewsError = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.reviews = state.reviews.filter(r => r.id !== action.payload);
        state.userReviews = state.userReviews.filter(r => r.id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewsError = action.error.message || 'Failed to delete review';
      });

    builder
      .addCase(createTestimonial.pending, (state) => {
        state.testimonialsLoading = true;
        state.testimonialsError = null;
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.testimonialsLoading = false;
        state.testimonials.unshift(action.payload);
        state.userTestimonials.unshift(action.payload);
      })
      .addCase(createTestimonial.rejected, (state, action) => {
        state.testimonialsLoading = false;
        state.testimonialsError = action.error.message || 'Failed to create testimonial';
      });

    builder
      .addCase(getTestimonials.pending, (state) => {
        state.testimonialsLoading = true;
        state.testimonialsError = null;
      })
      .addCase(getTestimonials.fulfilled, (state, action) => {
        state.testimonialsLoading = false;
        state.testimonials = action.payload.data.testimonials;
        state.testimonialsPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: Math.ceil(action.payload.data.totalCount / action.payload.limit),
        };
      })
      .addCase(getTestimonials.rejected, (state, action) => {
        state.testimonialsLoading = false;
        state.testimonialsError = action.error.message || 'Failed to fetch testimonials';
      });

    builder
      .addCase(getUserTestimonials.pending, (state) => {
        state.testimonialsLoading = true;
        state.testimonialsError = null;
      })
      .addCase(getUserTestimonials.fulfilled, (state, action) => {
        state.testimonialsLoading = false;
        state.userTestimonials = action.payload;
      })
      .addCase(getUserTestimonials.rejected, (state, action) => {
        state.testimonialsLoading = false;
        state.testimonialsError = action.error.message || 'Failed to fetch user testimonials';
      });

    builder
      .addCase(updateTestimonial.pending, (state) => {
        state.testimonialsLoading = true;
        state.testimonialsError = null;
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.testimonialsLoading = false;
        const index = state.testimonials.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.testimonials[index] = action.payload;
        }
        const userIndex = state.userTestimonials.findIndex(t => t.id === action.payload.id);
        if (userIndex !== -1) {
          state.userTestimonials[userIndex] = action.payload;
        }
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.testimonialsLoading = false;
        state.testimonialsError = action.error.message || 'Failed to update testimonial';
      });

    builder
      .addCase(deleteTestimonial.pending, (state) => {
        state.testimonialsLoading = true;
        state.testimonialsError = null;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.testimonialsLoading = false;
        state.testimonials = state.testimonials.filter(t => t.id !== action.payload);
        state.userTestimonials = state.userTestimonials.filter(t => t.id !== action.payload);
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.testimonialsLoading = false;
        state.testimonialsError = action.error.message || 'Failed to delete testimonial';
      });

    builder
      .addCase(adminDeleteTestimonial.pending, (state) => {
        state.testimonialsLoading = true;
        state.testimonialsError = null;
      })
      .addCase(adminDeleteTestimonial.fulfilled, (state, action) => {
        state.testimonialsLoading = false;
        state.testimonials = state.testimonials.filter(t => t.id !== action.payload);
      })
      .addCase(adminDeleteTestimonial.rejected, (state, action) => {
        state.testimonialsLoading = false;
        state.testimonialsError = action.error.message || 'Failed to delete testimonial';
      });
  },
});

export const {
  clearReviewsError,
  clearTestimonialsError,
  clearAllErrors,
  setReviewsPage,
  setTestimonialsPage,
  resetReviewsState,
  resetTestimonialsState,
} = reviewsTestimonialsSlice.actions;

export default reviewsTestimonialsSlice.reducer;
