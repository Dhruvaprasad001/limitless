import apiClient from "@/lib/axios";
import { InvitesApi, Configuration } from "@client";
import { env } from "@/config/env";

const api = new InvitesApi(
  new Configuration({ basePath: env.apiBaseUrl }),
  env.apiBaseUrl,
  apiClient
);

export const inviteService = {
  async create() {
    const { data } = await api.createInviteInvitesPost({});
    return data;
  },

  async preview(token: string) {
    const { data } = await api.previewInviteInvitesTokenGet({ token });
    return data;
  },

  async accept(token: string) {
    await api.acceptInviteInvitesTokenAcceptPost({ token });
  },
};
