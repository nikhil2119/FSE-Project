import "../assets/css/Category.css"; // Import the CSS file
import { FaTshirt, FaLaptop, FaMobileAlt, FaShoePrints, FaCouch } from "react-icons/fa";

const Categories = () => {

    const categoryList = [
        { id: 1, name: "Clothing", icon: <FaTshirt /> },
        { id: 2, name: "Electronics", icon: <FaLaptop /> },
        { id: 3, name: "Mobiles", icon: <FaMobileAlt /> },
        { id: 4, name: "Footwear", icon: <FaShoePrints /> },
        { id: 5, name: "Furniture", icon: <FaCouch /> }
    ];

    return (

        <div className="categories">

            <div className="categories-title">
                <h1>Shop by Categories</h1>
            </div>
            <div className="category-grid">
                {categoryList.map((category) => (
                    <div key={category.id} className="category-card">
                        <div className="category-icon">{category.icon}</div>
                        <div className="category-name">{category.name}</div>
                    </div>
                ))}
            </div>
        </div>
        
    );
};

export default Categories;
