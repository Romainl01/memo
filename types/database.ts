/**
 * Supabase Database Types
 *
 * These types are auto-generated from the database schema.
 * Run `npx supabase gen types typescript` to regenerate after schema changes.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          push_token: string | null;
          timezone: string;
          notification_enabled: boolean;
          reminder_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          push_token?: string | null;
          timezone?: string;
          notification_enabled?: boolean;
          reminder_time?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          push_token?: string | null;
          timezone?: string;
          notification_enabled?: boolean;
          reminder_time?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          photo_url: string | null;
          birthday: string | null;
          notes: string | null;
          frequency_days: number;
          last_contact_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          photo_url?: string | null;
          birthday?: string | null;
          notes?: string | null;
          frequency_days?: number;
          last_contact_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          photo_url?: string | null;
          birthday?: string | null;
          notes?: string | null;
          frequency_days?: number;
          last_contact_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      catch_ups: {
        Row: {
          id: string;
          user_id: string;
          contact_id: string;
          date: string;
          notes: string | null;
          type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          contact_id: string;
          date?: string;
          notes?: string | null;
          type?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          contact_id?: string;
          date?: string;
          notes?: string | null;
          type?: string;
          created_at?: string;
        };
      };
      journals: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          content: string | null;
          mood: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          content?: string | null;
          mood?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          content?: string | null;
          mood?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      journal_mentions: {
        Row: {
          id: string;
          journal_id: string;
          contact_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          journal_id: string;
          contact_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          journal_id?: string;
          contact_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// Helper types for easier access
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Contact = Database["public"]["Tables"]["contacts"]["Row"];
export type CatchUp = Database["public"]["Tables"]["catch_ups"]["Row"];
export type Journal = Database["public"]["Tables"]["journals"]["Row"];
export type JournalMention = Database["public"]["Tables"]["journal_mentions"]["Row"];
