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
      vehicles: {
        Row: {
          id: string;
          name_i18n: Json;
          description_i18n: Json | null;
          category: string | null;
          specifications: Json | null;
          price_range_min: number | null;
          price_range_max: number | null;
          status: string | null;
          created_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["vehicles"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["vehicles"]["Row"]>;
      };
      vehicle_images: {
        Row: {
          id: string;
          vehicle_id: string | null;
          url: string;
          display_order: number | null;
          is_cover: boolean | null;
        };
        Insert: Partial<Database["public"]["Tables"]["vehicle_images"]["Row"]> & {
          url: string;
        };
        Update: Partial<Database["public"]["Tables"]["vehicle_images"]["Row"]>;
      };
      certificates: {
        Row: {
          id: string;
          vehicle_id: string | null;
          title_i18n: Json;
          certificate_number: string | null;
          pdf_url: string | null;
          issue_date: string | null;
          expiry_date: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["certificates"]["Row"]> & {
          title_i18n: Json;
        };
        Update: Partial<Database["public"]["Tables"]["certificates"]["Row"]>;
      };
      documents: {
        Row: {
          id: string;
          title_i18n: Json;
          category: string | null;
          file_url: string;
          file_size: number | null;
          created_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["documents"]["Row"]> & {
          title_i18n: Json;
          file_url: string;
        };
        Update: Partial<Database["public"]["Tables"]["documents"]["Row"]>;
      };
      jobs: {
        Row: {
          id: string;
          title_i18n: Json;
          description_i18n: Json | null;
          location: string | null;
          employment_type: string | null;
          requirements_i18n: Json | null;
          status: string | null;
          created_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["jobs"]["Row"]> & {
          title_i18n: Json;
        };
        Update: Partial<Database["public"]["Tables"]["jobs"]["Row"]>;
      };
      job_applications: {
        Row: {
          id: string;
          job_id: string | null;
          applicant_name: string;
          email: string;
          phone: string | null;
          resume_url: string | null;
          cover_letter_i18n: Json | null;
          status: string | null;
          applied_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["job_applications"]["Row"]> & {
          applicant_name: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["job_applications"]["Row"]>;
      };
      inquiries: {
        Row: {
          id: string;
          vehicle_id: string | null;
          company_name: string | null;
          contact_name: string | null;
          email: string;
          phone: string | null;
          country: string | null;
          message_i18n: Json | null;
          quantity: number | null;
          status: string | null;
          created_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["inquiries"]["Row"]> & {
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["inquiries"]["Row"]>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          role: string | null;
          last_login: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["users"]["Row"]> & {
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>;
      };
    };
  };
};
