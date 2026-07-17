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
  id: string;
  title: string;
  price: number | null;
  image?: string;
  category?: string;
  description?: string;
}

export interface ICardPreviewData extends ICardData {
  buttonState: {
    inCart: boolean;
    available: boolean;
  };
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