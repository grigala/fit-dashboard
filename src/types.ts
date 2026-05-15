export type Activity = {
  id: number;
  file_name: string;
  activity_name: string;
  sport: string;
  device: string;
  start_ts_utc: string;
  end_ts_utc: string;
  duration_s: number;
  distance_m: number;
  start_latitude?: number;
  start_longitude?: number;
  metadata_json?: string;
};

export type RecordPoint = {
  timestamp_ms: number;
  latitude?: number;
  longitude?: number;
  altitude_m?: number;
  distance_m?: number;
  speed_m_s?: number;
  heart_rate?: number;
  cadence?: number;
  power?: number;
  temperature_c?: number;
};

export type OverviewStats = {
  activity_count: number;
  total_distance_m: number;
  total_duration_s: number;
};

export type ActivityMetadata = {
  heart_rate_zone_bounds_bpm?: number[];
  file_id?: {
    product_name?: string | null;
    serial_number?: number | null;
  };
  activity_metrics?: {
    vo2_max?: number | null;
  };
  session?: {
    beginning_body_battery?: number | null;
    ending_body_battery?: number | null;
    max_heart_rate?: number | null;
    avg_heart_rate?: number | null;
    max_cadence?: number | null;
    avg_cadence?: number | null;
    total_elapsed_time_s?: number | null;
    total_distance_m?: number | null;
    total_calories?: number | null;
  };
  laps?: Array<{
    start_ts_utc?: string | null;
    end_ts_utc?: string | null;
    total_elapsed_time_s?: number | null;
    total_timer_time_s?: number | null;
    total_distance_m?: number | null;
    avg_speed_m_s?: number | null;
    max_speed_m_s?: number | null;
    avg_heart_rate?: number | null;
    max_heart_rate?: number | null;
    total_ascent_m?: number | null;
    total_descent_m?: number | null;
    avg_cadence?: number | null;
    max_cadence?: number | null;
    total_calories?: number | null;
    best_speed_m_s?: number | null;
  }>;
};
