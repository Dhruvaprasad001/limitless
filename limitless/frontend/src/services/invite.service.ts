import apiClient from "@/lib/axios";

export interface InviteResponse {
  token: string;
  tenant_id: string;
  created_at: string;
}

export interface InvitePreview {
  token: string;
  tenant_name: string;
}

export const inviteService = {
  async create(): Promise<InviteResponse> {
    const { data } = await apiClient.post<InviteResponse>("/invites/");
    return data;
  },

  async preview(token: string): Promise<InvitePreview> {
    const { data } = await apiClient.get<InvitePreview>(`/invites/${token}`);
    return data;
  },

  async accept(token: string): Promise<void> {
    await apiClient.post(`/invites/${token}/accept`);
  },
};
