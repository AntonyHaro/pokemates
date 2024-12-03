import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "../../utils/utils";
import styles from "./PokemonsList.module.css";

function PokemonsList({
    pokemons,
    isComparatorOpen,
    onSelect,
    selectedPokemons,
}) {
    return (
        <ul id={styles.pokemonsContainer}>
            {pokemons.map((pokemon) => (
                <Pokemon
                    key={pokemon.id}
                    pokemon={pokemon}
                    isComparatorOpen={isComparatorOpen}
                    onSelect={onSelect}
                    selectedPokemons={selectedPokemons}
                />
            ))}
            {pokemons.length == 0 && (
                <p className={styles.noPokemons}>
                    No Pokemon of this type were found
                </p>
            )}
        </ul>
    );
}

export default PokemonsList;

function Pokemon({ pokemon, isComparatorOpen, onSelect, selectedPokemons }) {
    const navigate = useNavigate();

    let isSelected;

    selectedPokemons
        ? (isSelected = selectedPokemons.some(
              (selected) => selected.id === pokemon.id
          ))
        : "";

    const playSound = async (id) => {
        const soundUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
        try {
            const audio = new Audio(soundUrl);
            await audio.play();
        } catch (error) {
            console.error("Error playing audio:", error);
        }
    };

    const handleClick = () => {
        if (!isComparatorOpen) {
            playSound(pokemon.id);
            navigate(`/pokemon/${pokemon.id}`);
            return;
        }
        onSelect(pokemon);
    };

    const firstType =
        pokemon.types && pokemon.types[0] ? pokemon.types[0].type.name : null;

    const colors = {
        normal: "0, 0%, 70%",
        fire: "20, 85%, 55%",
        water: "200, 75%, 50%",
        electric: "50, 95%, 60%",
        grass: "120, 60%, 45%",
        ice: "190, 100%, 85%",
        fighting: "0, 75%, 45%",
        poison: "280, 60%, 55%",
        ground: "30, 40%, 45%",
        flying: "220, 80%, 80%",
        psychic: "300, 70%, 60%",
        bug: "90, 55%, 40%",
        rock: "35, 30%, 35%",
        ghost: "260, 55%, 40%",
        dragon: "270, 65%, 50%",
        dark: "240, 20%, 20%",
        steel: "210, 20%, 70%",
        fairy: "330, 80%, 85%",
        unknown: "0, 0%, 50%",
        stellar: "240, 80%, 50%",
    };

    const getItemColor = (type, alpha) => {
        return `hsla(${colors[type]}, ${alpha})`;
    };

    return (
        <li
            className={`${styles.pokemonCard} ${
                isSelected ? styles.selected : ""
            }`}
            style={{
                backgroundImage: firstType
                    ? `linear-gradient(to right, ${getItemColor(firstType, 0.7)} 0%, ${getItemColor(firstType, 0.3)} 100%)`
                    : "",
            }}
            onClick={handleClick}
        >
            <div className={styles.textContainer}>
                <p className={styles.id}>
                    #{String(pokemon.id).padStart(3, "0")}
                </p>
                <div className={styles.nameContainer}>
                    <p className={styles.name}>
                        {capitalizeFirstLetter(pokemon.name)}
                    </p>
                </div>
                <div className={styles.typesContainer}>
                    {pokemon.types.map((type, index) => (
                        <p
                            key={index}
                            className={styles.type}
                            style={{
                                backgroundColor: getItemColor(type.type.name, 1) || "",
                            }}
                        >
                            {capitalizeFirstLetter(type.type.name)}
                        </p>
                    ))}
                </div>
            </div>
            <div className={styles.imgContainer}>
                <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                    alt={pokemon.name}
                />
            </div>
        </li>
    );
}
