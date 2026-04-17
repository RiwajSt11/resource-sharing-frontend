export interface Week {
  _id?: string;
  code: string;
  number: number;
  title: string;
  contents: string[];
  resources: [
    {
      name: string;
      link: string;
    },
  ];
  module: string;
}
