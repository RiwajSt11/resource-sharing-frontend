export interface Module {
  name: string;
  course_code: string;
  level: number;
  semester: number;
  description: string;
  time_label: string;
  image_url: string;
  status?:string;
}
