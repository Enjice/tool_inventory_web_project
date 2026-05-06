export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  isFavorite: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateToolDTO {
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface UpdateToolDTO extends Partial<CreateToolDTO> {
  isFavorite?: boolean;
}