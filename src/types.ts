import { Client } from 'zaileys';

export interface Plugin {
  name: string;
  setup: (client: Client) => void;
}