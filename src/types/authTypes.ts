export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string
}

export interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  agents: any; // Array of users with agent role
  agentsLoading: boolean; // Loading state for agents
  agentsError: string | null; // Error state for agents
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
}
