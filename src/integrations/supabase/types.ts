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
      agent_applications: {
        Row: {
          account_number: string | null
          address: string | null
          approved_at: string | null
          approved_by: string | null
          bank_name: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          experience_years: number | null
          full_name: string
          id: string
          id_document_url: string | null
          ifsc_code: string | null
          license_number: string | null
          pan_number: string | null
          phone: string
          pincode: string | null
          previous_company: string | null
          state: string | null
          status: string | null
        }
        Insert: {
          account_number?: string | null
          address?: string | null
          approved_at?: string | null
          approved_by?: string | null
          bank_name?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          experience_years?: number | null
          full_name: string
          id?: string
          id_document_url?: string | null
          ifsc_code?: string | null
          license_number?: string | null
          pan_number?: string | null
          phone: string
          pincode?: string | null
          previous_company?: string | null
          state?: string | null
          status?: string | null
        }
        Update: {
          account_number?: string | null
          address?: string | null
          approved_at?: string | null
          approved_by?: string | null
          bank_name?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          experience_years?: number | null
          full_name?: string
          id?: string
          id_document_url?: string | null
          ifsc_code?: string | null
          license_number?: string | null
          pan_number?: string | null
          phone?: string
          pincode?: string | null
          previous_company?: string | null
          state?: string | null
          status?: string | null
        }
        Relationships: []
      }
      agent_commissions: {
        Row: {
          agent_user_id: string
          commission_amount: number
          commission_percentage: number | null
          created_at: string
          customer_name: string | null
          id: string
          paid_at: string | null
          policy_id: string | null
          status: string
        }
        Insert: {
          agent_user_id: string
          commission_amount?: number
          commission_percentage?: number | null
          created_at?: string
          customer_name?: string | null
          id?: string
          paid_at?: string | null
          policy_id?: string | null
          status?: string
        }
        Update: {
          agent_user_id?: string
          commission_amount?: number
          commission_percentage?: number | null
          created_at?: string
          customer_name?: string | null
          id?: string
          paid_at?: string | null
          policy_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_commissions_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "insurance_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      insurance_policies: {
        Row: {
          coverage_details: string | null
          created_at: string
          created_by: string | null
          description: string | null
          file_url: string | null
          id: string
          is_active: boolean
          name: string
          policy_type: string
          premium_range: string | null
          provider: string | null
          updated_at: string
        }
        Insert: {
          coverage_details?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          policy_type: string
          premium_range?: string | null
          provider?: string | null
          updated_at?: string
        }
        Update: {
          coverage_details?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          policy_type?: string
          premium_range?: string | null
          provider?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          age: number | null
          coverage_amount: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          insurance_type: string
          message: string | null
          phone: string
          service_provider: string | null
          status: string | null
        }
        Insert: {
          age?: number | null
          coverage_amount?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          insurance_type: string
          message?: string | null
          phone: string
          service_provider?: string | null
          status?: string | null
        }
        Update: {
          age?: number | null
          coverage_amount?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          insurance_type?: string
          message?: string | null
          phone?: string
          service_provider?: string | null
          status?: string | null
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
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "agent" | "client"
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
      app_role: ["admin", "agent", "client"],
    },
  },
} as const
