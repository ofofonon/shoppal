// ===============================
// SHOP PAGE.jsx
// ===============================

import { useParams } from "react-router-dom";
import { useState } from "react";
import { productMap } from "../../data/products";
import { shops } from "../../data/shops/index";

export default function ShopPage({ addToCart, cartItems }) {
  const { slug } = useParams();
  const [loadingId, setLoadingId] = useState(null);
  const [shareText, setShareText] = useState("");

  // ✅ NEW: SEARCH STATE
  const [search, setSearch] = useState("");

  // FIND CURRENT SHOP
  const shop = shops.find((s) => s.slug === slug);

  // CATEGORY FILTER STATE
  const [activeCategory, setActiveCategory] = useState("All");

  const isInCart = (id) => {
    return cartItems?.some((item) => item.id === id);
  };

  if (!shop) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center font-bric">
        Shop data missing
      </div>
    );
  }

  const products = productMap[slug] || [];

  // GET UNIQUE CATEGORIES
  const categories = [
    "All",
    ...new Set(products.map((p) => p.category)),
  ];

  // ✅ UPDATED FILTER (CATEGORY + SEARCH)
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All"
        ? true
        : product.category === activeCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shop?.name || "Shop",
          text: `Check out this shop`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareText("Link copied");
      }
    } catch (error) {
      console.error(error);

      try {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        setShareText("Link copied");
      } catch (e) {
        setShareText("Unable to copy");
      }
    }

    setTimeout(() => setShareText(""), 2000);
  };

  const handleAddToCart = async (product) => {
    setLoadingId(product.id);

    await new Promise((res) => setTimeout(res, 600));

    addToCart({
      ...product,
      shopId: shop.slug,
      shopName: shop.name,
      vendorId: shop.vendorId,
    });

    setLoadingId(null);
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white font-bric">

      {/* HERO SECTION */}
      <div className="relative h-[320px] md:h-[500px] overflow-hidden">

        {/* SHARE BUTTON */}
        <div className="absolute top-5 right-10 z-[999]" onClick={handleShare}>
          <button className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-orange-500 transition-all duration-300">
            <i className="fa-solid fa-share-nodes text-lg"></i>
          </button>

          {shareText && (
            <div className="absolute right-0 mt-2 bg-black/80 backdrop-blur-xl px-3 py-2 rounded-xl text-xs whitespace-nowrap border border-white/10">
              {shareText}
            </div>
          )}
        </div>

        {/* BANNER */}
        <img
          src={shop.banner}
          alt={shop.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/50 to-transparent" />

        {/* SHOP INFO */}
        <div className="absolute bottom-0 left-0 w-full px-4 md:px-12 pb-6">
          <div className="flex items-end gap-4">

            <div className="w-[85px] h-[85px] md:w-[120px] md:h-[120px] rounded-[28px] overflow-hidden bg-white shadow-2xl border border-white/10">
              <img
                src={shop.logo}
                alt={shop.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="pb-2">
              <h1 className="text-2xl md:text-5xl font-bric font-semibold tracking-tight">
                {shop.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-white/70 text-sm md:text-base">
                <div className="flex items-center gap-1 text-yellow-400">
                  ★ {shop.rating}
                </div>

                <span>•</span>
                <span>{shop.location}</span>
                <span>•</span>
                <span>{shop.deliveryTime}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* PRODUCTS SECTION */}
      <div className="px-4 md:px-12 py-10">

        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-4xl font-bric font-semibold">
            Popular Items
          </h2>
          <p className="text-white/45 mt-2">
            Curated products from this shop.
          </p>
        </div>

        {/* ✅ SEARCH BAR */}
        <div className="mb-6">
          <div className="flex items-center bg-[#0d0d0d] border border-white/5 rounded-full px-4 h-[58px]">
            <i className="fa-solid fa-magnifying-glass text-white/40 "></i>

            <input
              type="text"
              placeholder={`Search in ${shop.name}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none flex-1 px-3 text-sm text-white font-montserrat"
            />

            {search && (
              <button onClick={() => setSearch("")}>
                <i className="fa-solid fa-xmark text-white/40"></i>
              </button>
            )}
          </div>
        </div>

        {/* CATEGORY FILTER */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full whitespace-nowrap transition-all duration-300 text-sm md:text-base font-montserrat ${
                activeCategory === category
                  ? "bg-orange-500 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">

          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-[#0d0d0d] border border-white/5 rounded-[28px] overflow-hidden hover:border-white/10 transition-all duration-300"
              >
                <div className="relative overflow-hidden aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-sm">
                    ₦{product.price}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-sm md:text-base line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-white/40 text-xs md:text-sm mt-1">
                    {product.category}
                  </p>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={isInCart(product.id) || loadingId === product.id}
                    className={`mt-4 w-full py-2 rounded-full transition-all duration-300 text-sm font-montserrat flex items-center justify-center gap-2
                      ${
                        isInCart(product.id)
                          ? "bg-green-500 text-white"
                          : "bg-orange-500 hover:bg-orange-700 text-white"
                      }`}
                  >
                    {loadingId === product.id ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        Adding...
                      </>
                    ) : isInCart(product.id) ? (
                      <>
                        <i className="fa-solid fa-check"></i>
                        Added
                      </>
                    ) : (
                      "Add to Cart"
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-white/50">
              No products found for "{search}"
            </div>
          )}

        </div>
      </div>
    </div>
  );
}