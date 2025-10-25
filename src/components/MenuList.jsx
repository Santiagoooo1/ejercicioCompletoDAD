function MenuList({ categories = [], onCategorySelect }) {
    return (
        <nav className="menu-nav">
            <h2 className="menu-title">Categorías</h2>
            <ul className="menu-list">
                {categories.map((cat) => (
                    <li key={cat.id}>
                        <button
                            className="category-button"
                            onClick={() => onCategorySelect(cat.name)}
                        >
                            {cat.name}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default MenuList;
