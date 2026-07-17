export interface IHeaderData {
  counter: number
}

export interface IGalleryData {
  catalog: HTMLElement[]
}

export interface IModalData {
  content: HTMLElement
}

export interface ISuccessData {
  total: number
}

export interface ICardData {
  title: string;
  price: number | null;
}

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICardCatalogData extends ICardData {
  image: string;
  category: string;
}

export interface ICardPreviewData extends ICardCatalogData {
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export interface ICartData {
  cartItems: HTMLElement[];
  total: number;
  isEmpty: boolean;
}

export interface IFormData {
  payment?: string;
  address?: string;
  email?: string;
  phone?: string;
  errors: string[];
  valid: boolean;
}