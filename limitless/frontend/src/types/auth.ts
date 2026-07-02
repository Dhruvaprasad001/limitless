export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface CurrentUser {
  id: string;
  tenantId: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
