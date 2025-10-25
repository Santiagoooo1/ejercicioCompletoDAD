import { useState, useEffect } from "react";
import MenuList from "./MenuList";
import MenuItem from "./MenuItem";

function Home() {
    const [categories, setCategories] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const CATEGORIES_API = "https://www.themealdb.com/api/json/v1/1/categories.php";
    const FOOD_API = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";

    const priceFromId = (id) => {
        let h = 0;
        for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
        const n = (h % 1100) / 100;
        return (8 + n).toFixed(2);
    };

    const anchorId = (name) =>
        `category-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(CATEGORIES_API);
                const json = await res.json();
                setCategories(json.categories || []);
            } catch (err) {
                setError("Error al cargar las categorías");
            }
        })();
    }, []);

    useEffect(() => {
        if (!categories.length) return;
        (async () => {
            setLoading(true);
            try {
                const promises = categories.map(async (cat) => {
                    const res = await fetch(`${FOOD_API}${cat.strCategory}`);
                    const json = await res.json();
                    const meals = (json.meals || []).map((m) => ({
                        id: m.idMeal,
                        name: m.strMeal,
                        thumb: m.strMealThumb,
                        price: priceFromId(m.idMeal),
                    }));
                    return {
                        id: cat.idCategory,
                        name: cat.strCategory,
                        anchor: anchorId(cat.strCategory),
                        meals,
                    };
                });
                const result = await Promise.all(promises);
                setData(result);
            } catch {
                setError("Error al cargar los platos");
            } finally {
                setLoading(false);
            }
        })();
    }, [categories]);

    const scrollToCategory = (name) => {
        const el = document.getElementById(anchorId(name));
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div>
            <header className="app-header">
                <h1 className="header-title">Menú del Restaurante</h1>
            </header>

            <main className="main-content">
                <aside className="menu-sidebar">
                    <MenuList categories={data} onCategorySelect={scrollToCategory} />
                </aside>

                <section className="food-main-section">
                    {loading && <p>Cargando el menú...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {!loading &&
                        data.map((cat) => (
                            <div key={cat.id} id={cat.anchor} className="category-section">
                                <h2 className="section-title">{cat.name}</h2>
                                <div className="food-grid">
                                    {cat.meals.map((m) => (
                                        <MenuItem
                                            key={m.id}
                                            id={m.id}
                                            name={m.name}
                                            thumbnail={m.thumb}
                                            price={parseFloat(m.price)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                </section>
            </main>
        </div>
    );
}

export default Home;
