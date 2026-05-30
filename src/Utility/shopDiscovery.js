export const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {
  
    const R = 6371;
  
    const dLat =
      (lat2 - lat1) * Math.PI / 180;
  
    const dLon =
      (lon2 - lon1) * Math.PI / 180;
  
    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
  
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
  
      Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
  
    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );
  
    return R * c;
  };
  
  
  
  
  
  export const getDeliveryTime = (
    distanceKm
  ) => {
  
    if (distanceKm <= 2) {
      return "15–25 mins";
    }
  
    if (distanceKm <= 5) {
      return "25–40 mins";
    }
  
    if (distanceKm <= 10) {
      return "40–60 mins";
    }
  
    return "60+ mins";
  };
  
  
  
  
  
  export const getFeaturedShops = (
    shops
  ) => {
  
    return shops.filter(
      (shop) => shop.featured === true
    );
  };
  
  
  
  
  
  export const filterShopsByCategory = (
    shops,
    category
  ) => {
  
    if (
      category === "browse-all"
    ) {
      return shops;
    }
  
    return shops.filter(
      (shop) =>
        shop.category === category
    );
  };
  
  
  
  
  
  export const searchShopsAndProducts = (
    shops,
    productMap,
    query
  ) => {
  
    if (!query.trim()) {
      return shops;
    }
  
    const lower =
      query.toLowerCase();
  
    // SHOP MATCHES
    const matchedShops =
      shops.filter((shop) =>
        shop.name
          .toLowerCase()
          .includes(lower)
      );
  
    // PRODUCT MATCHES
    const productMatchedShops =
      [];
  
    for (const slug in productMap) {
  
      const products =
        productMap[slug];
  
      const hasMatch =
        products.some((product) =>
          product.name
            .toLowerCase()
            .includes(lower)
        );
  
      if (hasMatch) {
  
        const shop =
          shops.find(
            (s) => s.slug === slug
          );
  
        if (shop) {
          productMatchedShops.push(
            shop
          );
        }
      }
    }
  
    // REMOVE DUPLICATES
    const combined =
      [
        ...matchedShops,
        ...productMatchedShops,
      ];
  
    return combined.filter(
      (shop, index, self) =>
        index ===
        self.findIndex(
          (s) => s.id === shop.id
        )
    );
  };