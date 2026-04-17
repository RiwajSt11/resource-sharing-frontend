import { Week } from "./Week";

export interface Module {
  name: string;
  code: string;
  course?: string;
  course_code?:string;
  level: number;
  semester: number;
  description: string;
  time_label: string;
  image_url: string;
  hero_image_url?: string;
  status?: string;
  instructor_email?: string;
  welcome_text?: string;
  overview_text?: string;
  learning_outcomes?: string[];
  people_photos?: string[];
  weeks?: Week[];
  updatedAt?: Date;
}
