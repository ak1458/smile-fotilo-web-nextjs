export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          role: 'admin' | 'client' | 'agent_creator' | null;
          company_name: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          role?: 'admin' | 'client' | 'agent_creator' | null;
          company_name?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      businesses: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          category: string | null;
          phone: string;
          whatsapp_number: string | null;
          email: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          language_preference: string | null;
          timezone: string | null;
          subscription_tier: string | null;
          is_active: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          category?: string | null;
          phone: string;
          whatsapp_number?: string | null;
          email?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          language_preference?: string | null;
          timezone?: string | null;
          subscription_tier?: string | null;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['businesses']['Insert']>;
      };
      agents: {
        Row: {
          id: string;
          business_id: string | null;
          name: string;
          type: string | null;
          configuration: Json | null;
          is_active: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          business_id?: string | null;
          name: string;
          type?: string | null;
          configuration?: Json | null;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['agents']['Insert']>;
      };
      knowledge_documents: {
        Row: {
          id: string;
          agent_id: string;
          title: string;
          content: string;
          document_type: string | null;
          metadata: Json | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          agent_id: string;
          title: string;
          content: string;
          document_type?: string | null;
          metadata?: Json | null;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['knowledge_documents']['Insert']>;
      };
      conversations: {
        Row: {
          id: string;
          agent_id: string | null;
          business_id: string;
          customer_phone: string;
          customer_name: string | null;
          source: string | null;
          status: string | null;
          ai_handled: boolean | null;
          metadata: Json | null;
          last_message_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          agent_id?: string | null;
          business_id: string;
          customer_phone: string;
          customer_name?: string | null;
          source?: string | null;
          status?: string | null;
          ai_handled?: boolean | null;
          metadata?: Json | null;
          last_message_at?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_type: 'customer' | 'ai' | 'human' | 'system';
          content: string;
          media_urls: string[] | null;
          ai_confidence: number | null;
          requires_human: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_type: 'customer' | 'ai' | 'human' | 'system';
          content: string;
          media_urls?: string[] | null;
          ai_confidence?: number | null;
          requires_human?: boolean | null;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      missed_calls: {
        Row: {
          id: string;
          business_id: string;
          caller_number: string;
          caller_name: string | null;
          call_time: string;
          call_duration: number | null;
          recovery_status: string | null;
          recovery_message: string | null;
          recovery_sent_at: string | null;
          customer_response: string | null;
          notes: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          business_id: string;
          caller_number: string;
          caller_name?: string | null;
          call_time: string;
          call_duration?: number | null;
          recovery_status?: string | null;
          recovery_message?: string | null;
          recovery_sent_at?: string | null;
          customer_response?: string | null;
          notes?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['missed_calls']['Insert']>;
      };
      appointments: {
        Row: {
          id: string;
          business_id: string;
          conversation_id: string | null;
          customer_name: string;
          customer_phone: string;
          appointment_date: string;
          appointment_time: string;
          service_type: string | null;
          status: string | null;
          reminder_sent_24h: boolean | null;
          reminder_sent_2h: boolean | null;
          notes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          business_id: string;
          conversation_id?: string | null;
          customer_name: string;
          customer_phone: string;
          appointment_date: string;
          appointment_time: string;
          service_type?: string | null;
          status?: string | null;
          reminder_sent_24h?: boolean | null;
          reminder_sent_2h?: boolean | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['appointments']['Insert']>;
      };
      video_content: {
        Row: {
          id: string;
          business_id: string;
          title: string;
          prompt: string;
          status: string | null;
          video_url: string | null;
          thumbnail_url: string | null;
          scheduled_for: string | null;
          posted_to_gmb: boolean | null;
          posted_to_instagram: boolean | null;
          metadata: Json | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          business_id: string;
          title: string;
          prompt: string;
          status?: string | null;
          video_url?: string | null;
          thumbnail_url?: string | null;
          scheduled_for?: string | null;
          posted_to_gmb?: boolean | null;
          posted_to_instagram?: boolean | null;
          metadata?: Json | null;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['video_content']['Insert']>;
      };
      agent_templates: {
        Row: {
          id: string;
          creator_id: string | null;
          name: string;
          slug: string;
          description: string;
          short_description: string | null;
          category: string | null;
          icon_url: string | null;
          cover_image_url: string | null;
          configuration: Json;
          knowledge_base_template: Json | null;
          price_inr: number | null;
          status: string | null;
          is_featured: boolean | null;
          downloads_count: number | null;
          rating_average: number | null;
          rating_count: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          creator_id?: string | null;
          name: string;
          slug: string;
          description: string;
          short_description?: string | null;
          category?: string | null;
          icon_url?: string | null;
          cover_image_url?: string | null;
          configuration?: Json;
          knowledge_base_template?: Json | null;
          price_inr?: number | null;
          status?: string | null;
          is_featured?: boolean | null;
          downloads_count?: number | null;
          rating_average?: number | null;
          rating_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['agent_templates']['Insert']>;
      };
      marketplace_purchases: {
        Row: {
          id: string;
          buyer_id: string | null;
          template_id: string | null;
          amount_paid: number;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          status: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          buyer_id?: string | null;
          template_id?: string | null;
          amount_paid: number;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          status?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['marketplace_purchases']['Insert']>;
      };
      subscriptions: {
        Row: {
          id: string;
          business_id: string;
          plan_name: string;
          amount_inr: number;
          billing_cycle: string | null;
          razorpay_subscription_id: string | null;
          status: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          business_id: string;
          plan_name: string;
          amount_inr: number;
          billing_cycle?: string | null;
          razorpay_subscription_id?: string | null;
          status?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

