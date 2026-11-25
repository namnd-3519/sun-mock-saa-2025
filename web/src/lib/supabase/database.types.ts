
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "departments": {
                  Row: {
                    "code": string,"created_at": string,"id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "code": string,"created_at"?: string,"id"?: string
                  }
                  Update: {
                    "code"?: string,"created_at"?: string,"id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"hashtags": {
                  Row: {
                    "created_at": string,"id": string,"name": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"name": string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"name"?: string
                  }
                  Relationships: [
                    
                  ]
                },"kudos": {
                  Row: {
                    "anonymous_name": string | null,"content": string,"created_at": string,"id": string,"is_anonymous": boolean,"recipient_id": string,"sender_id": string,"title": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "anonymous_name"?: string | null,"content": string,"created_at"?: string,"id"?: string,"is_anonymous"?: boolean,"recipient_id": string,"sender_id": string,"title"?: string | null
                  }
                  Update: {
                    "anonymous_name"?: string | null,"content"?: string,"created_at"?: string,"id"?: string,"is_anonymous"?: boolean,"recipient_id"?: string,"sender_id"?: string,"title"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "kudos_recipient_id_fkey"
      columns: ["recipient_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "kudos_sender_id_fkey"
      columns: ["sender_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"kudos_hashtags": {
                  Row: {
                    "hashtag_id": string,"kudos_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "hashtag_id": string,"kudos_id": string
                  }
                  Update: {
                    "hashtag_id"?: string,"kudos_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "kudos_hashtags_hashtag_id_fkey"
      columns: ["hashtag_id"]
isOneToOne: false
      referencedRelation: "hashtags"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "kudos_hashtags_kudos_id_fkey"
      columns: ["kudos_id"]
isOneToOne: false
      referencedRelation: "kudos"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "kudos_hashtags_kudos_id_fkey"
      columns: ["kudos_id"]
isOneToOne: false
      referencedRelation: "kudos_feed"
      referencedColumns: ["id"]
    }
                  ]
                },"kudos_images": {
                  Row: {
                    "created_at": string,"id": string,"kudos_id": string,"position": number,"storage_path": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"kudos_id": string,"position": number,"storage_path": string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"kudos_id"?: string,"position"?: number,"storage_path"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "kudos_images_kudos_id_fkey"
      columns: ["kudos_id"]
isOneToOne: false
      referencedRelation: "kudos"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "kudos_images_kudos_id_fkey"
      columns: ["kudos_id"]
isOneToOne: false
      referencedRelation: "kudos_feed"
      referencedColumns: ["id"]
    }
                  ]
                },"kudos_likes": {
                  Row: {
                    "created_at": string,"kudos_id": string,"user_id": string,"weight": number
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"kudos_id": string,"user_id"?: string,"weight"?: number
                  }
                  Update: {
                    "created_at"?: string,"kudos_id"?: string,"user_id"?: string,"weight"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "kudos_likes_kudos_id_fkey"
      columns: ["kudos_id"]
isOneToOne: false
      referencedRelation: "kudos"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "kudos_likes_kudos_id_fkey"
      columns: ["kudos_id"]
isOneToOne: false
      referencedRelation: "kudos_feed"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "kudos_likes_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "avatar_url": string | null,"created_at": string,"department_id": string | null,"email": string | null,"full_name": string | null,"id": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "avatar_url"?: string | null,"created_at"?: string,"department_id"?: string | null,"email"?: string | null,"full_name"?: string | null,"id": string,"updated_at"?: string
                  }
                  Update: {
                    "avatar_url"?: string | null,"created_at"?: string,"department_id"?: string | null,"email"?: string | null,"full_name"?: string | null,"id"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "profiles_department_id_fkey"
      columns: ["department_id"]
isOneToOne: false
      referencedRelation: "departments"
      referencedColumns: ["id"]
    }
                  ]
                },"secret_boxes": {
                  Row: {
                    "badge": Database["public"]['Enums']["secret_badge"] | null,"created_at": string,"id": string,"opened_at": string | null,"owner_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "badge"?: Database["public"]['Enums']["secret_badge"] | null,"created_at"?: string,"id"?: string,"opened_at"?: string | null,"owner_id": string
                  }
                  Update: {
                    "badge"?: Database["public"]['Enums']["secret_badge"] | null,"created_at"?: string,"id"?: string,"opened_at"?: string | null,"owner_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "secret_boxes_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"special_days": {
                  Row: {
                    "created_at": string,"day": string,"note": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"day": string,"note"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"day"?: string,"note"?: string | null
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            "kudos_feed": {
                  Row: {
                    "anonymous_name": string | null,"content": string,"created_at": string,"hashtag_ids": (string)[] | null,"hashtags": Json | null,"id": string,"image_paths": (string)[] | null,"is_anonymous": boolean,"is_mine": boolean | null,"like_count": number | null,"liked_by_me": boolean | null,"recipient": Json | null,"recipient_department_id": string | null,"recipient_id": string,"sender": Json | null,"sender_id": string | null,"title": string | null
                  }
                  ComputedFields: never
                  Relationships: [
                    {
      foreignKeyName: "kudos_recipient_id_fkey"
      columns: ["recipient_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "profiles_department_id_fkey"
      columns: ["recipient_department_id"]
isOneToOne: false
      referencedRelation: "departments"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Functions: {
            "create_kudos":
{ Args: { "p_anonymous_name"?: string,"p_content": string,"p_hashtag_ids": (string)[],"p_image_paths"?: (string)[],"p_is_anonymous"?: boolean,"p_recipient_id": string,"p_title"?: string }; Returns: string
                           },
"get_my_kudos_stats":
{ Args: Record<PropertyKey, never>; Returns: {
              "boxes_opened": number,"boxes_unopened": number,"hearts_received": number,"kudos_received": number,"kudos_sent": number
            }[]
                           },
"hearts_received_by":
{ Args: { "p_user_id": string }; Returns: number
                           },
"is_kudos_sender":
{ Args: { "p_kudos_id": string }; Returns: boolean
                           },
"kudos_person_json":
{ Args: { "p_profile_id": string }; Returns: Json
                           },
"open_secret_box":
{ Args: Record<PropertyKey, never>; Returns: {
              "badge": Database["public"]['Enums']["secret_badge"],"box_id": string
            }[]
                           },
"pick_secret_badge":
{ Args: { "p_roll": number }; Returns: Database["public"]['Enums']["secret_badge"]
                           }
          }
          Enums: {
            "secret_badge": "stay_gold"|"flow_to_horizon"|"beyond_the_boundary"|"root_further"|"touch_of_light"|"revival"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            "secret_badge": ["stay_gold", "flow_to_horizon", "beyond_the_boundary", "root_further", "touch_of_light", "revival"]
          }
        }
} as const
