import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaStar, FaUsers } from "react-icons/fa6";
import { FaRulerVertical, FaWeight } from "react-icons/fa";

import titleColors from "../../constants/titleColors";
import colors from "../../constants/colors";
import { capitalizeFirstLetter } from "../../utils/utils";

import StatsContainer from "../../components/StatsContainer/StatsContainer";
import TeamsContainer from "../../components/TeamsContainer/TeamsContainer";
import Move from "../../components/Move/Move";
import Modal from "../../components/Modal/Modal";
import styles from "./PokemonInfo.module.css";

function PokemonInfo() {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [pokemonMoves, setPokemonMoves] = useState(null);
    const [loadingMoves, setLoadingMoves] = useState(true);
    const [errorMoves, setErrorMoves] = useState(null);

    const [pokemonAbilities, setPokemonAbilities] = useState(null);
    const [errorAbilities, setErrorAbilities] = useState(null);
    const [loadingAbilities, setLoadingAbilities] = useState(true);

    const [favorite, setFavorite] = useState(false);
    const [team, setTeam] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(true);

    useEffect(() => {
        const fetchPokemon = async () => {
            const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Failed to fetch Pokémon");

                const data = await response.json();
                setPokemon(data);
            } catch (error) {
                setError("Failed to fetch Pokémon. Please try again later.");
                console.error("Error fetching Pokémon:", error);
            } finally {
                setLoading(false);
            }
        };

        // Verifica se o Pokémon está marcado como favorito ao carregar a página
        const checkFavoriteStatus = () => {
            const favoritePokemons =
                JSON.parse(localStorage.getItem("favoritePokemons")) || [];

            const isFavorite = favoritePokemons.some(
                (fav) => fav.id === Number(id)
            );

            setFavorite(isFavorite);
        };

        fetchPokemon();
        checkFavoriteStatus();
    }, [id]);

    useEffect(() => {
        if (pokemon) {
            const fetchMoves = async () => {
                try {
                    const moveDetails = await Promise.all(
                        pokemon.moves.map(async (move) => {
                            const moveResponse = await fetch(move.move.url);
                            if (!moveResponse.ok)
                                throw new Error(
                                    `Failed to fetch move details for ${move.move.name}`
                                );
                            const moveData = await moveResponse.json();
                            return {
                                name: move.move.name,
                                power: moveData.power,
                                accuracy: moveData.accuracy,
                                type: moveData.type.name,
                                pp: moveData.pp,
                            };
                        })
                    );

                    setPokemonMoves(moveDetails);
                } catch (error) {
                    setErrorMoves(
                        "Failed to fetch move details. Please try again later."
                    );
                    console.error("Error fetching move details:", error);
                } finally {
                    setLoadingMoves(false);
                }
            };

            const fetchAbilities = async () => {
                try {
                    const abilityDetails = await Promise.all(
                        pokemon.abilities.map(async (ability) => {
                            const abilityResponse = await fetch(
                                ability.ability.url
                            );
                            if (!abilityResponse.ok) {
                                throw new Error(
                                    `Failed to fetch ability details for ${ability.ability.name}`
                                );
                            }
                            const abilityData = await abilityResponse.json();
                            return abilityData || null;
                        })
                    );

                    setPokemonAbilities(abilityDetails);
                } catch (error) {
                    setErrorAbilities(
                        "Failed to fetch ability details. Please try again later."
                    );
                    console.error("Error fetching ability details:", error);
                } finally {
                    setLoadingAbilities(false);
                }
            };

            fetchAbilities();
            fetchMoves();
        }
    }, [pokemon]);

    const handleFavorite = (pokemon) => {
        if (!pokemon || typeof pokemon !== "object") {
            console.error("O argumento precisa ser um objeto válido.");
            return;
        }

        const favoritePokemons =
            JSON.parse(localStorage.getItem("favoritePokemons")) || [];

        // Verifica se o Pokémon já está nos favoritos
        const isAlreadyFavorite = favoritePokemons.some(
            (fav) => fav.id === pokemon.id
        );

        if (isAlreadyFavorite) {
            // Remove o Pokémon dos favoritos
            const updatedFavoritePokemons = favoritePokemons.filter(
                (fav) => fav.id !== pokemon.id
            );

            localStorage.setItem(
                "favoritePokemons",
                JSON.stringify(updatedFavoritePokemons)
            );

            setFavorite(false);
        } else {
            // Adiciona o Pokémon aos favoritos
            const updatedFavoritePokemons = [...favoritePokemons, pokemon];

            localStorage.setItem(
                "favoritePokemons",
                JSON.stringify(updatedFavoritePokemons)
            );

            setFavorite(true);
        }
    };

    const handleTeam = (pokemon) => {
        if (!pokemon || typeof pokemon !== "object") {
            console.error("O argumento precisa ser um objeto válido.");
            return;
        }

        const storedTeam = JSON.parse(localStorage.getItem("team")) || [];

        // Verifica se o Pokémon já está no time
        const isAlreadyOnTeam = storedTeam.some(
            (member) => member.id === pokemon.id
        );

        if (isAlreadyOnTeam) {
            // Remove o Pokémon do time
            const updatedTeam = storedTeam.filter(
                (member) => member.id !== pokemon.id
            );

            localStorage.setItem("team", JSON.stringify(updatedTeam));
            setTeam(false);
        } else {
            // Adiciona o Pokémon ao time (limitando o tamanho, por exemplo, a 6 Pokémons)
            if (storedTeam.length >= 6) {
                alert("Você só pode ter até 6 Pokémons no time!");
                return;
            }

            const updatedTeam = [...storedTeam, pokemon];

            localStorage.setItem("team", JSON.stringify(updatedTeam));
            setTeam(true);
        }
    };

    if (loading) {
        return <p id="loader">Loading Pokémon...</p>;
    }

    if (error) {
        return <p id="error-message">{error}</p>;
    }

    if (!pokemon) {
        return <p id="error-message">No Pokémon found</p>;
    }

    return (
        <div className={styles.pokemon_info}>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
                <h1>dfdfdfdf</h1>
            </Modal>
            <header>
                <Link to="/" className={styles.backButton}>
                    <IoIosArrowBack /> Back to Home
                </Link>
                <div className={styles.pokemonHeader}>
                    <h1
                        style={{
                            color: titleColors[pokemon.types[0].type.name],
                        }}
                    >
                        {capitalizeFirstLetter(pokemon.name)}, #
                        {String(pokemon.id).padStart(3, "0")}
                    </h1>
                    <div className={styles.typesContainer}>
                        {pokemon.types.map((type, index) => (
                            <p
                                key={index}
                                className={styles.type}
                                style={{
                                    backgroundColor: colors[type.type.name],
                                }}
                            >
                                {capitalizeFirstLetter(type.type.name)}
                            </p>
                        ))}
                    </div>

                    <div className={styles.btnsContainer}>
                        <button
                            onClick={() => handleFavorite(pokemon)}
                            className={`${styles.button} ${
                                favorite ? styles.favorite : ""
                            }`}
                        >
                            <FaStar />
                        </button>
                        <button
                            onClick={() => handleTeam(pokemon)}
                            className={`${styles.button} ${
                                team ? styles.team : ""
                            }`}
                        >
                            <FaUsers />
                        </button>
                    </div>
                </div>
                <nav>
                    <ul>
                        <li>
                            <a href="#stats">Stats</a>
                        </li>
                        <li>
                            <a href="#abilities">Abilities</a>
                        </li>
                        <li>
                            <a href="#moves">Moves</a>
                        </li>
                    </ul>
                </nav>
            </header>

            <section className={styles.generalInfo}>
                <div className={styles.infoContainer}>
                    <div className={styles.info}>
                        <FaRulerVertical
                            style={{
                                color: titleColors[pokemon.types[0].type.name],
                            }}
                        />
                        <div className={styles.infoRow}>
                            <strong>Height:</strong>
                            {pokemon.height / 10} m
                        </div>
                    </div>
                    <div className={styles.info}>
                        <FaWeight
                            style={{
                                color: titleColors[pokemon.types[0].type.name],
                            }}
                        />
                        <div className={styles.infoRow}>
                            <strong>Weight:</strong>
                            {pokemon.weight / 10} kg
                        </div>
                    </div>
                    <div className={styles.info}>
                        <FaStar
                            style={{
                                color: titleColors[pokemon.types[0].type.name],
                            }}
                        />
                        <div className={styles.infoRow}>
                            <strong>Base Experience:</strong>
                            {pokemon.base_experience}
                        </div>
                    </div>
                </div>
            </section>

            <div className={styles.sprites}>
                <img src={pokemon.sprites.front_default} alt="Front Default" />
                <img src={pokemon.sprites.back_default} alt="Back Default" />
                {pokemon.sprites.front_shiny && (
                    <>
                        <img
                            src={pokemon.sprites.front_shiny}
                            alt="Front Shiny"
                        />
                        <img
                            src={pokemon.sprites.back_shiny}
                            alt="Back Shiny"
                        />
                    </>
                )}
            </div>

            <StatsContainer pokemon={pokemon} />

            <section id="abilities">
                <h2>Abilities</h2>
                {loadingAbilities ? (
                    <p>Loading abilities...</p>
                ) : errorAbilities ? (
                    <p>{errorAbilities}</p>
                ) : pokemonAbilities && pokemonAbilities.length > 0 ? (
                    <ul className={styles.abilitiesContainer}>
                        {pokemonAbilities.map((ability, index) => (
                            <li key={index}>
                                <strong>
                                    {capitalizeFirstLetter(ability.name)}
                                    {pokemon.abilities[index].is_hidden ? (
                                        <span> (hidden)</span>
                                    ) : (
                                        ""
                                    )}
                                </strong>
                                <p>
                                    {ability.effect_entries.find(
                                        (entry) => entry.language.name === "en"
                                    )?.effect ||
                                        "Effect not available in English."}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p id="loader">No abilities found.</p>
                )}
            </section>

            <section className={styles.movesSection} id="moves">
                <h2>Moves</h2>
                <p>Click in one move to see more details.</p>
                <ul className={styles.movesContainer}>
                    {loadingMoves ? (
                        <p id="loader">Loading moves...</p>
                    ) : errorMoves ? (
                        <p>{errorMoves}</p>
                    ) : (
                        pokemonMoves &&
                        pokemonMoves.map((move, index) => (
                            <Move
                                key={index}
                                move={{
                                    ...move,
                                    pokemonId: pokemon.id,
                                }}
                            />
                        ))
                    )}
                </ul>
            </section>
        </div>
    );
}

export default PokemonInfo;
