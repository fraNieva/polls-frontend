export interface PollOption {
  id: number;
  text: string;
  vote_count: number;
  percentage: number;
  poll_id: number;
}

export interface Poll {
  id: number;
  title: string;
  description?: string;
  is_active: boolean;
  is_public: boolean;
  owner_id: number;
  pub_date: string;
  options: PollOption[];
  total_votes: number;
  user_has_voted: boolean;
  user_vote_option_id?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  size: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedPollResponse {
  polls: Poll[];
  total: number;
  page: number;
  size: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PollFilters {
  is_active?: boolean;
  is_public?: boolean;
  search?: string;
  owner_id?: number;
}

export interface CreatePollData {
  title: string;
  description?: string;
  is_active?: boolean;
  is_public?: boolean;
  options?: string[];
}

export interface VoteResponse {
  message: string;
  vote: {
    id: number;
    user_id: number;
    poll_option_id: number;
    poll_id: number;
    created_at: string;
  };
  poll_id: number;
  option_id: number;
  updated_vote_count: number;
  timestamp: string;
}
