import { getFirebaseAuth, getGoogleProvider } from "@/lib/firebase";
import {
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";

export class AuthService {
  async loginWithGoogle(): Promise<User> {
    const result = await signInWithPopup(getFirebaseAuth(), getGoogleProvider());
    return result.user;
  }

  async logout(): Promise<void> {
    await signOut(getFirebaseAuth());
  }

  async getAccessToken(): Promise<string | null> {
    const user = getFirebaseAuth().currentUser;
    if (!user) return null;
    return user.getIdToken();
  }
}

export const authService = new AuthService();
