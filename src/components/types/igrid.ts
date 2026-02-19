
// export interface PersonSegment {
//   seg_no: number;
//   zone: string;
//   start_time: string;
//   end_time: string;
//   points_count: number;
//   sample_snapshot: string;
// }

// export interface PersonDayTrace {
//   days: any;
//   people_name: string;
//   day_date: string;
//   summary: {
//     first_seen_time: string;
//     last_seen_time: string;
//     presence_points: number;
//     segments_count: number;
//   };
//   segments: PersonSegment[];
// }

// export interface PersonLastSeen {
//   people_count: ReactNode;
//   camera_status: any;
//   people_name: string;
//   last_seen_time: string;
//   last_seen_zone: string;
//   last_seen_snapshot: string;
//   live_status: number;
// }

// Daily API
export interface PersonDayTrace {
  people_name: string;
  day_date: string;
  summary: {
    first_seen_time: string;
    last_seen_time: string;
    presence_points: number;
    segments_count: number;
  };
  segments: PersonSegment[];
}

// Range API
export interface PersonRangeTrace {
  days: {
    date: string;
    segments: PersonSegment[];
  }[];
}

export interface PersonSegment {
  camera_code: string;
  seg_no: number;
  zone: string;
  start_time: string;
  end_time: string;
  points_count: number;
  sample_snapshot: string;
}

export interface PersonLastSeen {
  people_name: string;
  last_seen_time: string;
  last_seen_zone: string;
  last_seen_snapshot: string;
  camera_status: number;
  people_count: number;
  live_status: number;
}

export interface FaceMatchResult {
  person_id: string;
  person_name: string;
  match_percentage: number;
  last_seen_time: string;
  last_seen_zone: string;
  snapshot: string;
  confidence: "high" | "medium" | "low";
}
