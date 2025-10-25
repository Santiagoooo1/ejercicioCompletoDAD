import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Meal() {
    const { id } = useParams();
    const [meal, setMeal] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(
                    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
                );
                const json = await res.json();
                const m = json.meals?.[0];
                if (!m) throw new Error("Plato no encontrado.");

                const ingr = [];
                for (let i = 1; i <= 20; i++) {
                    const name = m[`strIngredient${i}`];
                    const measure = m[`strMeasure${i}`];
                    if (name) ingr.push(`${measure || ""} ${name}`);
                }

                setMeal(m);
                setIngredients(ingr);
            } catch {
                setError("Error al cargar el plato.");
            }
        })();
    }, [id]);

    if (error) return <p>{error}</p>;
    if (!meal) return <p>Cargando detalles...</p>;

    return (
        <div className="meal-detail" style={{ padding: "1rem" }}>
            <h2>{meal.strMeal}</h2>
            <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                style={{ maxWidth: "400px", borderRadius: "10px" }}
            />
            <h3>Ingredientes</h3>
            <ul>
                {ingredients.map((i, idx) => (
                    <li key={idx}>{i}</li>
                ))}
            </ul>

            <h3>Instrucciones</h3>
            <p style={{ whiteSpace: "pre-line" }}>{meal.strInstructions}</p>

            {meal.strYoutube && (
                <p>
                    Video:{" "}
                    <a href={meal.strYoutube} target="_blank" rel="noreferrer">
                        Ver en YouTube
                    </a>
                </p>
            )}

            <Link
                to="/"
                style={{
                    display: "inline-block",
                    marginTop: "1rem",
                    color: "#3b82f6",
                    textDecoration: "underline",
                }}
            >
                ← Volver al menú
            </Link>
        </div>
    );
}

export default Meal;
