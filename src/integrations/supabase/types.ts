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
      detections: {
        Row: {
          bbox_height: number
          bbox_width: number
          bbox_x: number
          bbox_y: number
          class_label: Database["public"]["Enums"]["detection_class"]
          confidence: number
          created_at: string
          frame_index: number
          frame_url: string | null
          id: string
          latitude: number | null
          longitude: number | null
          notes: string | null
          severity_score: Database["public"]["Enums"]["severity_level"]
          timestamp: string
          video_id: string
        }
        Insert: {
          bbox_height: number
          bbox_width: number
          bbox_x: number
          bbox_y: number
          class_label: Database["public"]["Enums"]["detection_class"]
          confidence: number
          created_at?: string
          frame_index: number
          frame_url?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          severity_score: Database["public"]["Enums"]["severity_level"]
          timestamp: string
          video_id: string
        }
        Update: {
          bbox_height?: number
          bbox_width?: number
          bbox_x?: number
          bbox_y?: number
          class_label?: Database["public"]["Enums"]["detection_class"]
          confidence?: number
          created_at?: string
          frame_index?: number
          frame_url?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          severity_score?: Database["public"]["Enums"]["severity_level"]
          timestamp?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "detections_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      gps_points: {
        Row: {
          created_at: string
          heading: number | null
          id: string
          latitude: number
          longitude: number
          speed: number | null
          timestamp: string
          video_id: string
        }
        Insert: {
          created_at?: string
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          speed?: number | null
          timestamp: string
          video_id: string
        }
        Update: {
          created_at?: string
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          speed?: number | null
          timestamp?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gps_points_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          approved: boolean | null
          created_at: string
          email: string
          id: string
          name: string
          organization: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          approved?: boolean | null
          created_at?: string
          email: string
          id?: string
          name: string
          organization?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          approved?: boolean | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          organization?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          id: string
          inspector_name: string
          json_url: string | null
          organization: string | null
          pdf_url: string | null
          summary: Json
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inspector_name: string
          json_url?: string | null
          organization?: string | null
          pdf_url?: string | null
          summary?: Json
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inspector_name?: string
          json_url?: string | null
          organization?: string | null
          pdf_url?: string | null
          summary?: Json
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          detection_count: number | null
          end_time: string | null
          id: string
          original_filename: string
          processed_frames: number | null
          processing_status: Database["public"]["Enums"]["processing_status"]
          start_time: string | null
          storage_url: string | null
          total_frames: number | null
          uploaded_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          detection_count?: number | null
          end_time?: string | null
          id?: string
          original_filename: string
          processed_frames?: number | null
          processing_status?: Database["public"]["Enums"]["processing_status"]
          start_time?: string | null
          storage_url?: string | null
          total_frames?: number | null
          uploaded_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          detection_count?: number | null
          end_time?: string | null
          id?: string
          original_filename?: string
          processed_frames?: number | null
          processing_status?: Database["public"]["Enums"]["processing_status"]
          start_time?: string | null
          storage_url?: string | null
          total_frames?: number | null
          uploaded_at?: string
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
      app_role: "admin" | "inspector"
      detection_class: "pothole" | "crack" | "other"
      processing_status: "pending" | "processing" | "completed" | "failed"
      severity_level: "low" | "medium" | "high" | "critical"
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
      app_role: ["admin", "inspector"],
      detection_class: ["pothole", "crack", "other"],
      processing_status: ["pending", "processing", "completed", "failed"],
      severity_level: ["low", "medium", "high", "critical"],
    },
  },
} as const
