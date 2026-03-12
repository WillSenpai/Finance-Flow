export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      academy_lessons_cache: {
        Row: {
          content: string
          created_at: string
          id: string
          lesson_id: string
          titolo: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          lesson_id: string
          titolo: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          lesson_id?: string
          titolo?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_posts: {
        Row: {
          contenuto: string
          created_at: string
          emoji: string
          file_url: string | null
          id: string
          image_url: string | null
          published: boolean
          scheduled_at: string | null
          tipo: string
          titolo: string
          updated_at: string
          user_id: string
          views_count: number
          visibility: string
        }
        Insert: {
          contenuto: string
          created_at?: string
          emoji?: string
          file_url?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          scheduled_at?: string | null
          tipo?: string
          titolo: string
          updated_at?: string
          user_id: string
          views_count?: number
          visibility?: string
        }
        Update: {
          contenuto?: string
          created_at?: string
          emoji?: string
          file_url?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          scheduled_at?: string | null
          tipo?: string
          titolo?: string
          updated_at?: string
          user_id?: string
          views_count?: number
          visibility?: string
        }
        Relationships: []
      }
      categorie_spese: {
        Row: {
          colore: string
          created_at: string
          emoji: string
          id: string
          nome: string
          slug: string
          user_id: string
        }
        Insert: {
          colore: string
          created_at?: string
          emoji: string
          id?: string
          nome: string
          slug: string
          user_id: string
        }
        Update: {
          colore?: string
          created_at?: string
          emoji?: string
          id?: string
          nome?: string
          slug?: string
          user_id?: string
        }
        Relationships: []
      }
      coach_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coach_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "coach_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_articles: {
        Row: {
          categoria: string
          contenuto: string
          created_at: string
          emoji: string
          id: string
          image_url: string | null
          ordine: number
          published: boolean
          tags: string[]
          titolo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          categoria?: string
          contenuto: string
          created_at?: string
          emoji?: string
          id?: string
          image_url?: string | null
          ordine?: number
          published?: boolean
          tags?: string[]
          titolo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          categoria?: string
          contenuto?: string
          created_at?: string
          emoji?: string
          id?: string
          image_url?: string | null
          ordine?: number
          published?: boolean
          tags?: string[]
          titolo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      investimenti: {
        Row: {
          colore: string
          created_at: string
          emoji: string
          id: string
          nome: string
          user_id: string
          valore: number
        }
        Insert: {
          colore: string
          created_at?: string
          emoji: string
          id?: string
          nome: string
          user_id: string
          valore?: number
        }
        Update: {
          colore?: string
          created_at?: string
          emoji?: string
          id?: string
          nome?: string
          user_id?: string
          valore?: number
        }
        Relationships: []
      }
      lesson_illustrations: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string
          lesson_id: string
          step_index: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          image_url: string
          lesson_id: string
          step_index: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          lesson_id?: string
          step_index?: number
          title?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed_at: string
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_lesson_intro_views: {
        Row: {
          created_at: string
          lesson_id: string
          seen_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          lesson_id: string
          seen_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          lesson_id?: string
          seen_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      news_cache: {
        Row: {
          created_at: string
          fonte: string
          id: string
          image: string | null
          link: string
          summary: string | null
          tempo: string
          titolo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          fonte: string
          id?: string
          image?: string | null
          link?: string
          summary?: string | null
          tempo?: string
          titolo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          fonte?: string
          id?: string
          image?: string | null
          link?: string
          summary?: string | null
          tempo?: string
          titolo?: string
          updated_at?: string
        }
        Relationships: []
      }
      patrimonio: {
        Row: {
          colore: string
          created_at: string
          emoji: string
          id: string
          nome: string
          ordine: number
          user_id: string
          valore: number
        }
        Insert: {
          colore: string
          created_at?: string
          emoji: string
          id?: string
          nome: string
          ordine?: number
          user_id: string
          valore?: number
        }
        Update: {
          colore?: string
          created_at?: string
          emoji?: string
          id?: string
          nome?: string
          ordine?: number
          user_id?: string
          valore?: number
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "admin_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_views: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "admin_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_id: string
          birth_date: string | null
          created_at: string
          email: string | null
          goals: string[]
          has_completed_onboarding: boolean
          id: string
          level: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_id?: string
          birth_date?: string | null
          created_at?: string
          email?: string | null
          goals?: string[]
          has_completed_onboarding?: boolean
          id: string
          level?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_id?: string
          birth_date?: string | null
          created_at?: string
          email?: string | null
          goals?: string[]
          has_completed_onboarding?: boolean
          id?: string
          level?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      salvadanai: {
        Row: {
          attuale: number
          created_at: string
          id: string
          nome: string
          obiettivo: number
          user_id: string
        }
        Insert: {
          attuale?: number
          created_at?: string
          id?: string
          nome: string
          obiettivo?: number
          user_id: string
        }
        Update: {
          attuale?: number
          created_at?: string
          id?: string
          nome?: string
          obiettivo?: number
          user_id?: string
        }
        Relationships: []
      }
      spese: {
        Row: {
          badge: string[]
          categoria_id: string | null
          created_at: string
          data: string
          id: string
          importo: number
          nome: string
          nota: string | null
          ricorrenza: string
          user_id: string
        }
        Insert: {
          badge?: string[]
          categoria_id?: string | null
          created_at?: string
          data?: string
          id?: string
          importo: number
          nome: string
          nota?: string | null
          ricorrenza?: string
          user_id: string
        }
        Update: {
          badge?: string[]
          categoria_id?: string | null
          created_at?: string
          data?: string
          id?: string
          importo?: number
          nome?: string
          nota?: string | null
          ricorrenza?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spese_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorie_spese"
            referencedColumns: ["id"]
          },
        ]
      }
      user_suggestions: {
        Row: {
          category: string
          created_at: string
          id: string
          message: string
          status: string
          updated_at: string
          user_email: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          message: string
          status?: string
          updated_at?: string
          user_email: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          message?: string
          status?: string
          updated_at?: string
          user_email?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
