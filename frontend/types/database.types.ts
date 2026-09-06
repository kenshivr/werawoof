export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      dogs: {
        Row: {
          age: number
          bio: string
          breed: string
          created_at: string
          id: number
          latitude: number
          longitude: number
          name: string
          personality_tags: string[]
          photos: string[]
          sex: string
          size: string
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number
          bio?: string
          breed?: string
          created_at?: string
          id?: never
          latitude?: number
          longitude?: number
          name: string
          personality_tags?: string[]
          photos?: string[]
          sex?: string
          size?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number
          bio?: string
          breed?: string
          created_at?: string
          id?: never
          latitude?: number
          longitude?: number
          name?: string
          personality_tags?: string[]
          photos?: string[]
          sex?: string
          size?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'dogs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      matches: {
        Row: {
          created_at: string
          dog1_id: number
          dog2_id: number
          id: number
        }
        Insert: {
          created_at?: string
          dog1_id: number
          dog2_id: number
          id?: never
        }
        Update: {
          created_at?: string
          dog1_id?: number
          dog2_id?: number
          id?: never
        }
        Relationships: [
          {
            foreignKeyName: 'matches_dog1_id_fkey'
            columns: ['dog1_id']
            isOneToOne: false
            referencedRelation: 'dogs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'matches_dog2_id_fkey'
            columns: ['dog2_id']
            isOneToOne: false
            referencedRelation: 'dogs'
            referencedColumns: ['id']
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: number
          match_id: number
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: never
          match_id: number
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: never
          match_id?: number
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'messages_match_id_fkey'
            columns: ['match_id']
            isOneToOne: false
            referencedRelation: 'matches'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'messages_sender_id_fkey'
            columns: ['sender_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      page_visits: {
        Row: {
          id: number
          ip: string
          path: string
          user_agent: string
          visited_at: string
        }
        Insert: {
          id?: never
          ip?: string
          path: string
          user_agent?: string
          visited_at?: string
        }
        Update: {
          id?: never
          ip?: string
          path?: string
          user_agent?: string
          visited_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string
          bio: string
          created_at: string
          id: string
          location: string
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string
          bio?: string
          created_at?: string
          id: string
          location?: string
          name?: string
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string
          bio?: string
          created_at?: string
          id?: string
          location?: string
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          id: number
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: never
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: never
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'reviews_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: number
        }
        Insert: {
          created_at?: string
          email: string
          id?: never
        }
        Update: {
          created_at?: string
          email?: string
          id?: never
        }
        Relationships: []
      }
      swipes: {
        Row: {
          created_at: string
          direction: string
          id: number
          swiped_id: number
          swiper_id: number
        }
        Insert: {
          created_at?: string
          direction: string
          id?: never
          swiped_id: number
          swiper_id: number
        }
        Update: {
          created_at?: string
          direction?: string
          id?: never
          swiped_id?: number
          swiper_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'swipes_swiped_id_fkey'
            columns: ['swiped_id']
            isOneToOne: false
            referencedRelation: 'dogs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'swipes_swiper_id_fkey'
            columns: ['swiper_id']
            isOneToOne: false
            referencedRelation: 'dogs'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_candidates: {
        Args: { swiper_dog_id: number }
        Returns: {
          age: number
          bio: string
          breed: string
          created_at: string
          id: number
          latitude: number
          longitude: number
          name: string
          personality_tags: string[]
          photos: string[]
          sex: string
          size: string
          updated_at: string
          user_id: string
        }[]
        SetofOptions: {
          from: '*'
          to: 'dogs'
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_reviews: {
        Args: never
        Returns: {
          comment: string
          created_at: string
          id: number
          rating: number
          user_avatar: string
          user_id: string
          user_name: string
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      is_match_member: { Args: { m_id: number }; Returns: boolean }
      owns_dog: { Args: { dog_id: number }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
