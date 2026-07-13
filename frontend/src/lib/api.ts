export interface User {
  id: number;
  name: string;
  email?: string;
  role: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  articles_count?: number;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category_id: number;
  author_id: number;
  status: 'draft' | 'published';
  published_at: string;
  created_at: string;
  updated_at: string;
  category: Category;
  author: User;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: Array<{ url: string | null; label: string; active: boolean }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface FooterLink {
  title: string;
  url: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SiteSettings {
  site_name: string;
  site_description: string;
  logo_url: string | null;
  footer_links: FooterLink[];
  social_links: SocialLink[];
  contact_email: string | null;
}

export interface DashboardStats {
  total_articles: number;
  published_articles: number;
  draft_articles: number;
  total_categories: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recent_articles: Article[];
}

export interface LoginResponse {
  token: string;
  user: User;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Helper to get the auth token safely on client side.
 */
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('gg_admin_token');
  }
  return null;
}

/**
 * Custom fetch client for the Next.js App Router.
 * Supports token auth, caching, and revalidation.
 */
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = getAuthToken();
  const headers = new Headers(options.headers);
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('Accept', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const defaultOptions: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    // If auth expires (401), we can optionally clear token
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('gg_admin_token');
      localStorage.removeItem('gg_admin_user');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status} on ${endpoint}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  // ================= PUBLIC FETCH OPERATIONS =================
  getArticles: (params?: { category?: string; q?: string; page?: number; per_page?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.q) searchParams.append('q', params.q);
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.per_page) searchParams.append('per_page', String(params.per_page));

    const queryString = searchParams.toString();
    return fetchAPI<PaginatedResponse<Article>>(`/articles?${queryString}`, {
      next: { revalidate: 60 },
    });
  },

  getFeaturedArticle: () => {
    return fetchAPI<Article>('/articles/featured', {
      next: { revalidate: 60 },
    });
  },

  getArticleBySlug: (categorySlug: string, slug: string) => {
    return fetchAPI<Article>(`/articles/${categorySlug}/${slug}`, {
      next: { revalidate: 60 },
    });
  },

  getCategories: () => {
    return fetchAPI<Category[]>('/categories', {
      next: { revalidate: 3600 },
    });
  },

  getCategoryBySlug: (slug: string, page = 1) => {
    return fetchAPI<{ category: Category; articles: PaginatedResponse<Article> }>(
      `/categories/${slug}?page=${page}`,
      { next: { revalidate: 60 } }
    );
  },

  getSettings: () => {
    return fetchAPI<SiteSettings>('/settings', {
      next: { revalidate: 600 },
    });
  },

  // ================= ADMIN/PRIVATE API OPERATIONS =================
  admin: {
    login: (credentials: { email: string; password: string }) => {
      return fetchAPI<LoginResponse>('/admin/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
        cache: 'no-store'
      });
    },

    logout: () => {
      return fetchAPI<{ message: string }>('/admin/logout', {
        method: 'POST',
        cache: 'no-store'
      });
    },

    getMe: () => {
      return fetchAPI<User>('/admin/me', { cache: 'no-store' });
    },

    getDashboardStats: () => {
      return fetchAPI<DashboardResponse>('/admin/dashboard', { cache: 'no-store' });
    },

    // Admin Articles CRUD
    getArticles: (params?: { page?: number; q?: string; category_id?: string; status?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', String(params.page));
      if (params?.q) searchParams.append('q', params.q);
      if (params?.category_id) searchParams.append('category_id', params.category_id);
      if (params?.status) searchParams.append('status', params.status);
      
      const queryString = searchParams.toString();
      return fetchAPI<PaginatedResponse<Article>>(`/admin/articles?${queryString}`, { cache: 'no-store' });
    },

    getArticle: (id: number) => {
      return fetchAPI<Article>(`/admin/articles/${id}`, { cache: 'no-store' });
    },

    createArticle: (data: Partial<Article>) => {
      return fetchAPI<{ message: string; article: Article }>('/admin/articles', {
        method: 'POST',
        body: JSON.stringify(data),
        cache: 'no-store'
      });
    },

    updateArticle: (id: number, data: Partial<Article>) => {
      return fetchAPI<{ message: string; article: Article }>(`/admin/articles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        cache: 'no-store'
      });
    },

    deleteArticle: (id: number) => {
      return fetchAPI<{ message: string }>(`/admin/articles/${id}`, {
        method: 'DELETE',
        cache: 'no-store'
      });
    },

    // Admin Categories CRUD
    getCategories: () => {
      return fetchAPI<Category[]>('/admin/categories', { cache: 'no-store' });
    },

    createCategory: (data: { name: string; slug?: string }) => {
      return fetchAPI<{ message: string; category: Category }>('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(data),
        cache: 'no-store'
      });
    },

    updateCategory: (id: number, data: { name: string; slug: string }) => {
      return fetchAPI<{ message: string; category: Category }>(`/admin/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        cache: 'no-store'
      });
    },

    deleteCategory: (id: number) => {
      return fetchAPI<{ message: string }>(`/admin/categories/${id}`, {
        method: 'DELETE',
        cache: 'no-store'
      });
    },

    // Settings Configuration Page
    updateSettings: (data: SiteSettings) => {
      return fetchAPI<{ message: string; settings: SiteSettings }>('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
        cache: 'no-store'
      });
    },

    // Image Upload helper
    uploadImage: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      return fetchAPI<{ url: string; message: string }>('/admin/upload', {
        method: 'POST',
        body: formData,
        cache: 'no-store'
      });
    }
  }
};
