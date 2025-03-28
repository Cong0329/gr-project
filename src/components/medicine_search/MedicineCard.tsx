import { Product } from "./ProductGrid";

interface ProductProp {
    product: Product;
  }

const ProductCard = ({ product }:ProductProp) => {
    return (
      <div className="bg-white p-4 shadow-sm rounded-lg">
        <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
        
        <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
        <p className="text-blue-600 font-bold">{product.price}</p>
        
        <button className="w-full mt-2 bg-blue-600 text-white p-2 rounded-lg">
          Chọn mua
        </button>
      </div>
    );
  };
  
  export default ProductCard;
  