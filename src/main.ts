import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Catalog } from './components/models/Catalog';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from './components/services/LarekApi';

import { Gallery } from './components/views/Gallery';
import { Header } from './components/views/Header';
import { ModalContainer } from './components/views/ModalContainer';
import { CardCatalog } from './components/views/CardCatalog';
import { CardPreview } from './components/views/CardPreview';
import { CardCart } from './components/views/CardCart';
import { Cart as CartView } from './components/views/Cart';
import { FormOrder } from './components/views/FormOrder';
import { FormContacts } from './components/views/FormContacts';
import { SuccessModal } from './components/views/SuccessModal';

import { ensureElement, cloneTemplate } from './utils/utils';
import { IOrder } from './types';

// ===== Api и модели =====
const baseApi = new Api(API_URL, {});
const api = new LarekApi(baseApi);

const events = new EventEmitter();

const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

// ===== Постоянные представления =====
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const modalContainer = new ModalContainer(ensureElement<HTMLElement>('#modal-container'), events);
const cartView = new CartView(cloneTemplate('#cart'), events);
const formOrder = new FormOrder(cloneTemplate('#order'), events);
const formContacts = new FormContacts(cloneTemplate('#contacts'), events);
const successModal = new SuccessModal(cloneTemplate('#success'), events);

let orderStep: 'order' | 'contacts' = 'order';

// ===== ОБРАБОТЧИКИ СОБЫТИЙ МОДЕЛИ =====

events.on('catalog:updated', () => {
  const cardElements = catalog.getItems().map((item) => {
    const cardContainer = cloneTemplate<HTMLButtonElement>('#card-catalog');
    const card = new CardCatalog(cardContainer, events);
    card.render({
      id: item.id,
      title: item.title,
      price: item.price,
      image: `${CDN_URL}/${item.image}`,
      category: item.category,
      description: item.description
    });
    return cardContainer;
  });

  gallery.render({ catalog: cardElements });
});

events.on('catalog:preview', () => {
  const preview = catalog.preview;
  if (!preview) return;

  const cardContainer = cloneTemplate<HTMLElement>('#card-preview');
  const card = new CardPreview(cardContainer, events);

  card.render({
    id: preview.id,
    title: preview.title,
    price: preview.price,
    image: `${CDN_URL}/${preview.image}`,
    category: preview.category,
    description: preview.description,
    buttonState: {
      inCart: cart.contains(preview.id),
      available: preview.price !== null
    }
  });

  modalContainer.clear();
  modalContainer.content = cardContainer;
  modalContainer.open();
});

events.on('cart:updated', () => {
  const items = cart.getItems();

  header.render({ counter: cart.getCount() });

  const cartItemElements = items.map((item, index) => {
    const cartItemContainer = cloneTemplate<HTMLLIElement>('#card-cart');
    const cardCart = new CardCart(cartItemContainer, events);
    cardCart.render({
      id: item.id,
      title: item.title,
      price: item.price
    });
    cardCart.index = index + 1;
    return cartItemContainer;
  });

  cartView.render({
    cartItems: cartItemElements,
    total: cart.getTotal(),
    isEmpty: cart.getCount() === 0
  });
});

events.on('buyer:updated', () => {
  const info = buyer.getInfo();

  if (orderStep === 'order') {
    formOrder.render({
      payment: info.payment,
      address: info.address,
      errors: [],
      valid: Object.keys(buyer.validateOrder()).length === 0
    });
  } else {
    formContacts.render({
      email: info.email,
      phone: info.phone,
      errors: [],
      valid: Object.keys(buyer.validateContacts()).length === 0
    });
  }
});

// ===== ОБРАБОТЧИКИ СОБЫТИЙ ПРЕДСТАВЛЕНИЙ =====

events.on('preview:select', (data: { id: string }) => {
  const product = catalog.getProduct(data.id);
  if (product) {
    catalog.preview = product;
  }
});

events.on('cart:toggle', (data: { id: string }) => {
  const product = catalog.getProduct(data.id);
  if (!product) return;

  if (cart.contains(data.id)) {
    cart.remove(data.id);
  } else {
    cart.add(product);
  }

  modalContainer.close();
});

events.on('cart:remove', (data: { id: string }) => {
  cart.remove(data.id);
});

events.on('cart:show', () => {
  modalContainer.clear();
  modalContainer.content = cartView.render();
  modalContainer.open();
});

events.on('modal:close', () => {
  modalContainer.close();
  modalContainer.clear();
});

events.on('success:close', () => {
  modalContainer.close();
  modalContainer.clear();
  cart.clear();
  buyer.clear();
  orderStep = 'order';
});

events.on('order:payment', (data: { payment: string }) => {
  buyer.setInfo('payment', data.payment);
});

events.on('order:address', (data: { address: string }) => {
  buyer.setInfo('address', data.address);
});

events.on('order:email', (data: { email: string }) => {
  buyer.setInfo('email', data.email);
});

events.on('order:phone', (data: { phone: string }) => {
  buyer.setInfo('phone', data.phone);
});

events.on('checkout:start', () => {
  orderStep = 'order';
  const info = buyer.getInfo();

  const formElement = formOrder.render({
    payment: info.payment,
    address: info.address,
    errors: [],
    valid: Object.keys(buyer.validateOrder()).length === 0
  });

  modalContainer.clear();
  modalContainer.content = formElement;
  modalContainer.open();
});

events.on('order:submit', () => {
  if (orderStep === 'order') {
    const errors = Object.values(buyer.validateOrder());

    if (errors.length > 0) {
      formOrder.render({ errors });
      return;
    }

    orderStep = 'contacts';
    const info = buyer.getInfo();

    const formElement = formContacts.render({
      email: info.email,
      phone: info.phone,
      errors: [],
      valid: Object.keys(buyer.validateContacts()).length === 0
    });

    modalContainer.clear();
    modalContainer.content = formElement;
    modalContainer.open();
    return;
  }

  const errors = Object.values(buyer.validateContacts());

  if (errors.length > 0) {
    formContacts.render({ errors });
    return;
  }

  const order: IOrder = {
    ...buyer.getInfo(),
    items: cart.getItems().map(item => item.id),
    total: cart.getTotal()
  };

  api.postOrder(order).then((result) => {
    const successElement = successModal.render({ total: result.total });
    modalContainer.clear();
    modalContainer.content = successElement;
    modalContainer.open();
  });
});

// ===== ЗАПУСК ПРИЛОЖЕНИЯ =====

api.getProductsList()
  .then((data) => {
    catalog.setItems(data.items);
  });