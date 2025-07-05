export interface AuthResponse {
  success : boolean;
  data: {
    user: {
      id: number;
      email: string;
      name: string;
    };
    token: string;
  };
}
