import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Catalog } from './components/models/Catalog';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { Api } from './components/base/Api';
import { API_URL, settings } from './utils/constants'; 
import { LarekApi } from './components/services/LarekApi';

const baseApi = new Api(API_URL, settings);
const api = new LarekApi(baseApi);

let events = new EventEmitter();

let catalog = new Catalog(events);
let cart: Cart = new Cart(events);
let buyer: Buyer = new Buyer(events);

api.getProductsList()
  .then((data) => {
    catalog.setItems(data.items);
    
    console.log('Api items:', data.items);
    console.log('Catalog items:', catalog.getItems());

    catalog.setPreview = catalog.getProduct('854cef69-976d-4c2a-a18c-2aa45046c390')!;
    console.log('Preview item:', catalog.getPreview);
  
    cart.add(catalog.getProduct('854cef69-976d-4c2a-a18c-2aa45046c390')!);
    cart.add(catalog.getProduct('c101ab44-ed99-4a54-990d-47aa2bb4e7d9')!);
    console.log('Item 1 added to the cart:', cart.contains('854cef69-976d-4c2a-a18c-2aa45046c390') ? 'Item is in the cart' : 'Item is not in the cart');
    console.log('Item 2 added to the cart:', cart.contains('c101ab44-ed99-4a54-990d-47aa2bb4e7d9') ? 'Item is in the cart' : 'Item is not in the cart');
    console.log('Cart count:', cart.getCount());
    console.log('Cart items:', cart.getItems());
    console.log('Cart total:', cart.getTotal());
  
    cart.remove('854cef69-976d-4c2a-a18c-2aa45046c390');
    console.log('Removed item in the cart:', cart.contains('854cef69-976d-4c2a-a18c-2aa45046c390') ? 'Item still in the cart' : 'Item removed from the cart');
    console.log('Cart count after removal:', cart.getCount());
    console.log('Cart items after removal:', cart.getItems());
    console.log('Cart total after removal:', cart.getTotal());
  
    cart.clear();
    console.log('Cart count after clearing:', cart.getCount());
    console.log('Cart items after clearing:', cart.getItems());
    console.log('Cart total after clearing:', cart.getTotal());
  
    buyer.setInfo('payment', 'card');
    console.log('Buyer info:', buyer.getInfo());
    console.log('Buyer validation errors:', buyer.validate());
    buyer.setInfo('address', '123 Main St');
    console.log('Buyer info after setting address:', buyer.getInfo());
    console.log('Buyer validation errors after setting address:', buyer.validate());
    buyer.setInfo('email', 'john.doe@example.com');
    console.log('Buyer info after setting email:', buyer.getInfo());
    console.log('Buyer validation errors after setting email:', buyer.validate());
    buyer.setInfo('phone', '123-456-7890');
    console.log('Buyer info after setting phone:', buyer.getInfo());
    console.log('Buyer validation errors after setting phone:', buyer.validate());
  
    buyer.clear();
    console.log('Buyer info after clearing:', buyer.getInfo());
    console.log('Buyer validation errors after clearing:', buyer.validate());
  })
  .catch((error) => {
    console.error('Error while fetching data:', error);
  });

