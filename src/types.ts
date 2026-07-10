export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isSimulated?: boolean;
}

export interface Course {
  id: string;
  title: string;
  duration: string;
  rating: number;
  imageUrl: string;
  isPopular?: boolean;
  skills: string[];
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatarGradient: string;
  score: number;
  isCurrentUser?: boolean;
}

export interface CareerTrackStep {
  id: string;
  label: string;
  duration: string;
  icon: string;
  status: "completed" | "active" | "locked";
  week: string;
}
