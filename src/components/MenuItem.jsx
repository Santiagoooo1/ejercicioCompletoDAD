import { Link } from "react-router-dom";

function MenuItem({ id, name, thumbnail, price }) {
    return (
        <div className="food-card">
            <img
                src={thumbnail}
                alt={name}
                className="food-image"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                        "https://placehold.co/400x200/e2e8f0/64748b?text=No+Image";
                }}
            />
            <div className="food-card-content">
                <h3 className="food-title">{name}</h3>
                <Link to={`/meal/${id}`} className="food-link">
                    Ver detalles →
                </Link>
                <p className="food-price">{price.toFixed(2)} €</p>
            </div>
        </div>
    );
}

export default MenuItem;
