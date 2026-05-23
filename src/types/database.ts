export interface Tribute {
  id: string;
  name: string | null;
  contact: string | null;
  message: string;
  is_anonymous: boolean;
  relationship: string | null;
  created_at: string;
}

export type TributeInsert = Omit<Tribute, "id" | "created_at">;
