
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      verse_scripts: {
        Row: {
          id: string
          user_id: string | null
          title: string
          content: string
          prompt: string
          model: string
          temperature: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          content: string
          prompt: string
          model: string
          temperature: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          content?: string
          prompt?: string
          model?: string
          temperature?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "verse_scripts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
