export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          height: number | null;
          weight: number | null;
          age: number | null;
          gender: string | null;
          activity_level: string | null;
          goal: string | null;
          body_fat_percentage: number | null;
          target_calories: number | null;
          current_calories: number | null;
          created_at: string | null;
          updated_at: string | null;
          free_analysis_used: boolean | null;
          name: string | null;
          weekly_activity: number | null;
          weight_change: number | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          height?: number | null;
          weight?: number | null;
          age?: number | null;
          gender?: string | null;
          activity_level?: string | null;
          goal?: string | null;
          body_fat_percentage?: number | null;
          target_calories?: number | null;
          current_calories?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          free_analysis_used?: boolean | null;
          name?: string | null;
          weekly_activity?: number | null;
          weight_change?: number | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          height?: number | null;
          weight?: number | null;
          age?: number | null;
          gender?: string | null;
          activity_level?: string | null;
          goal?: string | null;
          body_fat_percentage?: number | null;
          target_calories?: number | null;
          current_calories?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          free_analysis_used?: boolean | null;
          name?: string | null;
          weekly_activity?: number | null;
          weight_change?: number | null;
        };
      };
      saved_workouts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          date: string;
          total_weight: number;
          total_xp: number;
          entries: {
            exercise: string;
            sets: {
              weight: number;
              reps: number;
            }[];
          }[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          date?: string;
          total_weight: number;
          total_xp: number;
          entries: {
            exercise: string;
            sets: {
              weight: number;
              reps: number;
            }[];
          }[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          date?: string;
          total_weight?: number;
          total_xp?: number;
          entries?: {
            exercise: string;
            sets: {
              weight: number;
              reps: number;
            }[];
          }[];
          created_at?: string;
        };
      };
    };
  };
}