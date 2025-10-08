import os
from supabase import create_client, Client
from typing import Optional

class SupabaseClient:
    _instance: Optional[Client] = None

    @classmethod
    def get_client(cls) -> Client:
        """Get or create Supabase client instance"""
        if cls._instance is None:
            supabase_url = os.environ.get('VITE_SUPABASE_URL')
            supabase_key = os.environ.get('VITE_SUPABASE_SUPABASE_ANON_KEY')

            if not supabase_url or not supabase_key:
                raise ValueError("Supabase URL and Key must be set in environment variables")

            cls._instance = create_client(supabase_url, supabase_key)

        return cls._instance

    @classmethod
    def reset_client(cls):
        """Reset the client instance (useful for testing)"""
        cls._instance = None

def get_supabase() -> Client:
    """Convenience function to get Supabase client"""
    return SupabaseClient.get_client()
