import {File} from './file';
import {User} from './user';
import {Category} from './category';

export interface Petition {
  id: number;
  title: string;
  description: string;
  destinatary: string;
  signers: string;
  user_id: number;
  status: string;
  category_id: number;
  created_at: string;
  updated_at: string;
  files: File[],
  user: User,
  category?: Category[]
}
