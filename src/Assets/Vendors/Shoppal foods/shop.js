import banner from "./banner.jpg"
import logo from "./logo.PNG"

const shop = {
    id: "shop001",
  
    vendorId: "Gyios8XHV6Vi0gpsr8GzRqcvUrv1",
  
    slug: "shoppal-foods",
  
    name: "Shoppal Foods",
  
    category: "food",
  
    rating: 4.8,
  
    deliveryTime: "20-30 mins",
  
    featured: true,
  
    logo: logo,
  
    banner: banner,

    size: "large",

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
    deliveryAreas: [
      {
        state: "Lagos",
        lgas: ["Ikeja", "Yaba"]
      },
  
      {
        state: "Abuja",
        lgas: ["Maitama"]
      }
    ]
  };
  
  export default shop;