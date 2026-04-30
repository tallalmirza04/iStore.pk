
// import { useNavigate } from "react-router-dom";
// import { addToCart } from "../utils/cart";

// function ProductCard({ product: p }) {
//   const navigate = useNavigate();

//   // ✅ Handle both DB shape (_id, images[], batteryHealth) and old static shape (id, image, battery)
//   const id       = p._id || p.id;
//   const image    = p.images?.[0] || p.image || null;
//   const battery  = p.batteryHealth || p.battery || null;

//   const handleAddToCart = (e) => {
//     e.stopPropagation();
//     addToCart({ ...p, _id: id });
//     alert("Added to cart!");
//   };

//   return (
//     <div
//       onClick={() => navigate(`/product/${id}`)}
//       className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
//     >
//       {/* Image */}
//       {image ? (
//         <img src={image} alt={p.name}
//           className="w-full h-48 object-cover bg-gray-100" />
//       ) : (
//         <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-5xl">📱</div>
//       )}

//       {/* Info */}
//       <div className="p-4">
//         <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{p.name}</h3>

//         <div className="flex flex-wrap gap-1 mb-2">
//           {p.storage && (
//             <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p.storage}</span>
//           )}
//           {p.condition && (
//             <span className={`text-xs px-2 py-0.5 rounded-full font-medium
//               ${p.condition === "New" ? "bg-green-100 text-green-700"
//                 : p.condition === "PTA Approved" ? "bg-blue-100 text-blue-700"
//                 : "bg-orange-100 text-orange-700"}`}>
//               {p.condition}
//             </span>
//           )}
//           {battery && (
//             <span className={`text-xs px-2 py-0.5 rounded-full
//               ${battery >= 85 ? "bg-green-100 text-green-700"
//                 : battery >= 70 ? "bg-yellow-100 text-yellow-700"
//                 : "bg-red-100 text-red-700"}`}>
//               🔋 {battery}%
//             </span>
//           )}
//         </div>

//         <p className="font-bold text-gray-900 mb-3">Rs {Number(p.price).toLocaleString()}</p>

//         <button
//           onClick={handleAddToCart}
//           className="w-full bg-black text-white py-2 rounded-xl text-sm hover:bg-gray-800 transition-colors"
//         >
//           Add to Cart
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ProductCard;






import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cart";

const CONDITION_STYLE = {
  "New":          "bg-green-100 text-green-700",
  "PTA Approved": "bg-blue-100 text-blue-700",
  "Used":         "bg-orange-100 text-orange-700",
  "Non PTA":      "bg-red-100 text-red-700",
  "JV":           "bg-purple-100 text-purple-700",
  "MDM":          "bg-indigo-100 text-indigo-700",
  "BYPASS":       "bg-gray-100 text-gray-700",
};

function ProductCard({ product: p }) {
  const navigate   = useNavigate();
  const [added, setAdded] = useState(false);

  const id      = p._id || p.id;
  const image   = p.images?.[0] || p.image || null;
  const battery = p.batteryHealth || p.battery || null;

  const condStyle = CONDITION_STYLE[p.condition] || "bg-gray-100 text-gray-600";

  const batteryStyle = !battery ? ""
    : battery >= 85 ? "bg-green-100 text-green-700"
    : battery >= 70 ? "bg-yellow-100 text-yellow-700"
    : "bg-red-100 text-red-700";

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ ...p, _id: id });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className="group bg-white rounded-2xl overflow-hidden cursor-pointer border border-gray-100
        transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/8
        flex flex-col"
    >
      {/* ── Image area ── */}
      <div className="relative w-full h-52 bg-gray-50 overflow-hidden flex-shrink-0">
        {image ? (
          <img
            src={image}
            alt={p.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-20">📱</span>
          </div>
        )}

        {/* Condition badge — top left */}
        {p.condition && (
          <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full
            backdrop-blur-sm ${condStyle}`}>
            {p.condition}
          </span>
        )}

        {/* Sold out overlay */}
        {p.inStock === false && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-full tracking-wide">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-4 flex flex-col flex-1">

        {/* Name */}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2">
          {p.name}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {p.storage && (
            <span className="text-xs bg-gray-100 text-gray-500 font-medium px-2.5 py-0.5 rounded-full">
              {p.storage}
            </span>
          )}
          {battery && (
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${batteryStyle}`}>
              🔋 {battery}%
            </span>
          )}
          {p.partsChanged && (
            <span className="text-xs bg-orange-50 text-orange-500 font-medium px-2.5 py-0.5 rounded-full">
              Parts replaced
            </span>
          )}
        </div>

        {/* Description */}
        {p.description && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
            {p.description}
          </p>
        )}

        {/* Price + button — pinned to bottom */}
        <div className="mt-auto">
          <p className="text-lg font-bold text-gray-900 mb-3 tracking-tight">
            Rs {Number(p.price).toLocaleString()}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={p.inStock === false}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
              ${added
                ? "bg-green-600 text-white scale-95"
                : p.inStock === false
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-black active:scale-95"
              }`}
          >
            {added ? "✓ Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;