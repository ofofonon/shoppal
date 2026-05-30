import banner from "./banner.jpg"
import logo from "./logo.PNG"

const shop = {
    id: "shop002",
  
    vendorId: "zVfcUfbSpJYcvhpYDmHKMPDZqWo1",
  
    slug: "shoppal-groceries",
  
    name: "Shoppal Groceries",
  
    category: "grocery",
  
    rating: 4.8,
  
    deliveryTime: "20-30 mins",
  
    featured: true,
  
    logo: logo,
  
    banner: banner,

    size: "small",

    products: [],

    location: "Abuja",

    deliveryPricing: {
      baseFee: 500,
      perKm: 150
    },

    location2: {
      area: "Wuse 2",
      city: "Abuja",
    
      coordinates: {
        lat: 9.0765,
        lng: 7.3986
      }
    },
    shopConnected: false
  };
  
  export default shop;