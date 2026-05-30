import { useState, useEffect } from "react"
import { useContext } from "react"
import { CartContext } from "../context/CartContext"




const ProductCard = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedRom, setSelectedRom] = useState(product.rom[0])
  const [selectedSim, setSelectedSim] = useState(product.sim ? product.sim[0] : "")
  const [selectedCondition, setSelectedCondition] = useState(product.condition ? product.condition[0] : "")
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const delay = (ms) => new Promise(res => setTimeout(res, ms))


  // ADDED
  const [finalPrice, setFinalPrice] = useState(product.price)

  const { addToCart } = useContext(CartContext)

  const runWithLoader = async (fn, minTime = 1000) => {
  setLoading(true)

  await Promise.all([fn(), delay(minTime)])

  setLoading(false)
}

const handleAddToCart = async () => {
  await runWithLoader(async () => {

    const cartItem = {
      id: product.id,
      name: product.name,
      color: selectedColor.name,
      storage: selectedRom,
      sim: selectedSim,
      condition: selectedCondition,
      price: finalPrice,
      image: selectedColor.image
    }

    addToCart(cartItem)

    setShowModal(false)

  })
}

  // ADDED
  const calculatePrice = () => {
    let total = product.price

    if (product.romPrice) {
      total += product.romPrice[selectedRom] || 0
    }

    if (selectedColor?.price) {
      total += selectedColor.price
    }

    if (product.simPrice && selectedSim) {
      total += product.simPrice[selectedSim] || 0
    }

    if (product.conditionPrice && selectedCondition) {
      total += product.conditionPrice[selectedCondition] || 0
    }

    setFinalPrice(total)

    console.log("Updated Price:", total)
  }

  // ADDED
  useEffect(() => {
    calculatePrice()
  }, [selectedColor, selectedRom, selectedSim, selectedCondition])

  return (
    <>
      <div className="bg-white rounded-xl p-6 text-center shadow hover:shadow-lg transition w-72 flex-shrink-0">
        {/* PRODUCT IMAGE */}
        <img
          src={selectedColor.image}
          alt={product.name}
          className="w-48 mx-auto mb-4 transition duration-300 rounded-3xl"
        />

        {/* NAME */}
        <h2 className="text-lg font-semibold">{product.name}</h2>

        {/* PRICE */}
        <p className="text-gray-500 mb-3">From ₦{finalPrice}</p>

        {/* COLOR OPTIONS */}
        <div className="flex justify-center gap-2 mb-4">
          {product.colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color)}
              className={`w-4 h-4 rounded-full border ${
                selectedColor.name === color.name
                  ? "border-black scale-110"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-center gap-3">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm"
            onClick={() => setShowModal(true)}
          >
            {loading ? (
              <span className="flex justify-center items-center gap-2">
                <i className="fa-solid fa-spinner fa-spin"></i> 
              </span>
            ) : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>

          {/* modal content */}
          <div className="relative bg-white p-6 rounded-3xl z-10 w-80 md:w-96 mx-4">
            <h2 className="text-xl font-bold mb-4">{product.name}</h2>

            {/* COLOR OPTIONS */}
            <h3 className="text-sm font-medium mb-2">Select Color:</h3>
            <div className="flex gap-2 mb-4">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full border ${
                    selectedColor.name === color.name
                      ? "border-black scale-110"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>

            {/* STORAGE OPTIONS */}
            <h3 className="text-sm font-medium mb-2">Select Storage:</h3>
            <div className="flex gap-2 mb-4">
              {product.rom.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedRom(size)}
                  className={`px-3 py-1 border rounded-full ${
                    selectedRom === size ? "bg-blue-500 text-white" : "bg-gray-100"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* SIM OPTIONS */}
            {product.sim && (
              <>
                <h3 className="text-sm font-medium mb-2">Select SIM:</h3>
                <div className="flex gap-2 mb-4">
                  {product.sim.map((simOption) => (
                    <button
                      key={simOption}
                      onClick={() => setSelectedSim(simOption)}
                      className={`px-3 py-1 border rounded-full ${
                        selectedSim === simOption ? "bg-blue-500 text-white" : "bg-gray-100"
                      }`}
                    >
                      {simOption}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* CONDITION OPTIONS */}
            {product.condition && (
              <>
                <h3 className="text-sm font-medium mb-2">Select Condition:</h3>
                <div className="flex gap-2 mb-6">
                  {product.condition.map((cond) => (
                    <button
                      key={cond}
                      onClick={() => setSelectedCondition(cond)}
                      className={`px-3 py-1 border rounded-full ${
                        selectedCondition === cond ? "bg-blue-500 text-white" : "bg-gray-100"
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </>
            )}

            <button
              className="w-full bg-blue-500 text-white py-2 rounded-full"
              onClick={handleAddToCart}
            >
              {loading ? (
              <span className="flex justify-center items-center gap-2">
                <i className="fa-solid fa-spinner fa-spin"></i> 
              </span>
            ) : "Add to Cart"}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductCard