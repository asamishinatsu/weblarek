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
import { IProduct, IOrder } from './types';

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

const previewContainer = cloneTemplate<HTMLElement>('#card-preview');
const previewCard = new CardPreview(previewContainer, {
  onClick: () => events.emit('cart:toggle')
});

// ===== ЗАПУСК ПРИЛОЖЕНИЯ =====

api.getProductsList()
  .then((data) => {
    const processedItems = data.items.map(item => ({
      ...item,
      image: `${CDN_URL}${item.image}`
    }));
    catalog.setItems(processedItems);
  })
  .catch(console.error);

// ===== ОБРАБОТЧИКИ СОБЫТИЙ МОДЕЛИ =====

events.on('catalog:updated', () => {
  const cardElements = catalog.getItems().map((item) => {
    const cardContainer = cloneTemplate<HTMLButtonElement>('#card-catalog');
    const card = new CardCatalog(cardContainer, {
      onClick: () => events.emit('preview:select', item)
    });
    card.render({
      title: item.title,
      price: item.price,
      image: item.image,
      category: item.category
    });
    return cardContainer;
  });

  gallery.render({ catalog: cardElements });
});

events.on('catalog:preview', () => {
  const preview = catalog.preview;
  if (!preview) return;

  previewCard.render({
    title: preview.title,
    price: preview.price,
    image: preview.image,
    category: preview.category,
    description: preview.description,
    buttonText: cart.contains(preview.id) ? 'Удалить из корзины' : 'В корзину',
    buttonDisabled: preview.price === null
  });

  modalContainer.content = previewContainer;
  modalContainer.open();
});

events.on('cart:updated', () => {
  header.render({ counter: cart.getCount() });
  const items = cart.getItems();

  const cartItemElements = items.map((item, index) => {
    const cartItemContainer = cloneTemplate<HTMLLIElement>('#card-cart');
    const cardCart = new CardCart(cartItemContainer, {
      onClick: () => events.emit('cart:remove', item)
    });
    cardCart.render({
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
  const errors = buyer.validate();
  const info = buyer.getInfo();
  
  formOrder.render({
    payment: info.payment,
    address: info.address,
    valid: !errors.payment && !errors.address,
    errors: [errors.payment, errors.address].filter(Boolean) as string[]
  });

  formContacts.render({
    email: info.email,
    phone: info.phone,
    valid: !errors.email && !errors.phone,
    errors: [errors.email, errors.phone].filter(Boolean) as string[]
  });
});

// ===== ОБРАБОТЧИКИ СОБЫТИЙ ПРЕДСТАВЛЕНИЙ =====

events.on('preview:select', (item: IProduct) => {
  catalog.preview = item;
});

events.on('cart:toggle', () => {
  const product = catalog.preview;
  if (!product) return;

  if (cart.contains(product.id)) {
    cart.remove(product.id);
  } else {
    cart.add(product);
  }

  modalContainer.close();
});

events.on('cart:remove', (product: IProduct) => {
  cart.remove(product.id);
});

events.on('cart:show', () => {
  modalContainer.content = cartView.render();
  modalContainer.open();
});

events.on('modal:close', () => {
  modalContainer.clear();
});

events.on('success:close', () => {
  modalContainer.close();
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
  const info = buyer.getInfo();
  modalContainer.content = formOrder.render({
    payment: info.payment,
    address: info.address,
    valid: false,
    errors: []
  });
  modalContainer.open();
});

events.on('order:submit', () => {
  modalContainer.content = formContacts.render({
    email: '',
    phone: '',
    valid: false,
    errors: []
  });
});

events.on('contacts:submit', () => {
  const order: IOrder = {
    ...buyer.getInfo(),
    items: cart.getItems().map(item => item.id),
    total: cart.getTotal()
  };

  api.postOrder(order)
    .then((result) => {
      cart.clear();
      buyer.clear();
      modalContainer.content = successModal.render({ total: result.total });
    })
    .catch(console.error);
});
