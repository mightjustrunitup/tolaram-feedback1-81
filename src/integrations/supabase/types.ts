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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics_metrics: {
        Row: {
          created_at: string
          id: string
          metric_data: Json | null
          metric_type: string
          metric_value: number | null
          period_end: string
          period_start: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_data?: Json | null
          metric_type: string
          metric_value?: number | null
          period_end: string
          period_start: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_data?: Json | null
          metric_type?: string
          metric_value?: number | null
          period_end?: string
          period_start?: string
          user_id?: string
        }
        Relationships: []
      }
      bill_comments: {
        Row: {
          bill_id: string
          comment: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          bill_id: string
          comment: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          bill_id?: string
          comment?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bill_comments_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
      }
      bills: {
        Row: {
          amount: number | null
          bill_date: string | null
          category: string | null
          content_hash: string | null
          created_at: string
          currency: string | null
          file_hash: string | null
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          metadata: Json | null
          mime_type: string | null
          status: Database["public"]["Enums"]["bill_status"] | null
          updated_at: string
          user_id: string
          vendor_name: string | null
        }
        Insert: {
          amount?: number | null
          bill_date?: string | null
          category?: string | null
          content_hash?: string | null
          created_at?: string
          currency?: string | null
          file_hash?: string | null
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          status?: Database["public"]["Enums"]["bill_status"] | null
          updated_at?: string
          user_id: string
          vendor_name?: string | null
        }
        Update: {
          amount?: number | null
          bill_date?: string | null
          category?: string | null
          content_hash?: string | null
          created_at?: string
          currency?: string | null
          file_hash?: string | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          status?: Database["public"]["Enums"]["bill_status"] | null
          updated_at?: string
          user_id?: string
          vendor_name?: string | null
        }
        Relationships: []
      }
      customer_rewards: {
        Row: {
          coordinates: Json | null
          created_at: string
          customer_name: string | null
          feedback_id: string | null
          id: string
          location: string | null
          phone: string
        }
        Insert: {
          coordinates?: Json | null
          created_at?: string
          customer_name?: string | null
          feedback_id?: string | null
          id?: string
          location?: string | null
          phone: string
        }
        Update: {
          coordinates?: Json | null
          created_at?: string
          customer_name?: string | null
          feedback_id?: string | null
          id?: string
          location?: string | null
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_rewards_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "complete_feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_rewards_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          comments: string | null
          created_at: string
          customer_name: string | null
          id: string
          location: string | null
          product_id: string
          updated_at: string
          variant_id: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          customer_name?: string | null
          id?: string
          location?: string | null
          product_id: string
          updated_at?: string
          variant_id: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          customer_name?: string | null
          id?: string
          location?: string | null
          product_id?: string
          updated_at?: string
          variant_id?: string
        }
        Relationships: []
      }
      feedback_images: {
        Row: {
          created_at: string
          feedback_id: string
          id: string
          image_url: string
        }
        Insert: {
          created_at?: string
          feedback_id: string
          id?: string
          image_url: string
        }
        Update: {
          created_at?: string
          feedback_id?: string
          id?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_images_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "complete_feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_images_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_issues: {
        Row: {
          created_at: string
          feedback_id: string
          id: string
          issue: string
        }
        Insert: {
          created_at?: string
          feedback_id: string
          id?: string
          issue: string
        }
        Update: {
          created_at?: string
          feedback_id?: string
          id?: string
          issue?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_issues_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "complete_feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_issues_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_detections: {
        Row: {
          analysis_details: Json | null
          bill_id: string
          confidence_score: number | null
          detection_timestamp: string
          flags: Json | null
          id: string
          risk_level: Database["public"]["Enums"]["fraud_risk_level"]
        }
        Insert: {
          analysis_details?: Json | null
          bill_id: string
          confidence_score?: number | null
          detection_timestamp?: string
          flags?: Json | null
          id?: string
          risk_level: Database["public"]["Enums"]["fraud_risk_level"]
        }
        Update: {
          analysis_details?: Json | null
          bill_id?: string
          confidence_score?: number | null
          detection_timestamp?: string
          flags?: Json | null
          id?: string
          risk_level?: Database["public"]["Enums"]["fraud_risk_level"]
        }
        Relationships: [
          {
            foreignKeyName: "fraud_detections_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          created_at: string
          credentials: Json | null
          id: string
          integration_name: string
          integration_type: string
          last_sync: string | null
          settings: Json | null
          status: Database["public"]["Enums"]["integration_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credentials?: Json | null
          id?: string
          integration_name: string
          integration_type: string
          last_sync?: string | null
          settings?: Json | null
          status?: Database["public"]["Enums"]["integration_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credentials?: Json | null
          id?: string
          integration_name?: string
          integration_type?: string
          last_sync?: string | null
          settings?: Json | null
          status?: Database["public"]["Enums"]["integration_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      scanned_products: {
        Row: {
          barcode_data: string
          created_at: string
          id: string
          image_url: string | null
          product_id: string
          user_id: string | null
        }
        Insert: {
          barcode_data: string
          created_at?: string
          id?: string
          image_url?: string | null
          product_id: string
          user_id?: string | null
        }
        Update: {
          barcode_data?: string
          created_at?: string
          id?: string
          image_url?: string | null
          product_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      bill_analytics: {
        Row: {
          average_amount: number | null
          flagged_bills: number | null
          month: string | null
          total_amount: number | null
          total_bills: number | null
          user_id: string | null
          verified_bills: number | null
        }
        Relationships: []
      }
      complete_feedback: {
        Row: {
          comments: string | null
          created_at: string | null
          customer_name: string | null
          id: string | null
          images: string[] | null
          issues: string[] | null
          location: string | null
          product_id: string | null
          updated_at: string | null
          variant_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      bill_status: "pending" | "verified" | "flagged" | "rejected"
      fraud_risk_level: "low" | "medium" | "high" | "critical"
      integration_status: "connected" | "disconnected" | "pending" | "error"
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
      bill_status: ["pending", "verified", "flagged", "rejected"],
      fraud_risk_level: ["low", "medium", "high", "critical"],
      integration_status: ["connected", "disconnected", "pending", "error"],
    },
  },
} as const
