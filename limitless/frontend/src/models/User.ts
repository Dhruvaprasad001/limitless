export interface User {
  id: string;
  tenantId: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
