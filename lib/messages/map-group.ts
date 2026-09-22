import type { ApiGroup } from "@/lib/api/types";
import type { Group } from "@/lib/types/message";

export function mapApiGroupToGroup(apiGroup: ApiGroup): Group {
  return {
    id: String(apiGroup.id ?? ""),
    name: apiGroup.name ?? "",
    createdAt: apiGroup.created_at ?? new Date().toISOString(),
  };
}

export function mapApiGroupsToGroups(apiGroups: ApiGroup[]): Group[] {
  return apiGroups
    .filter((apiGroup) => apiGroup.id != null)
    .map(mapApiGroupToGroup);
}
