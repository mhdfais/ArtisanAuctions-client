export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}



export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}


export interface LoginFormData{
  email:string
  password:string
}

export interface UserProfile {
  name: string;
  phone: string;
  bio: string;
  profileImage: string | File | null;
  email: string;
}

export interface IUserProfileUpdate {
  name: string;
  bio: string;
  phone: string;
  profileImage?: File | string;
}