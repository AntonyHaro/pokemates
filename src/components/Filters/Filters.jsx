import { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaUsers } from "react-icons/fa6";
import colors from "../../constants/colors";
import styles from "./Filters.module.css";
import { IoMdMenu, IoMdClose } from "react-icons/io";

function Filters({ selectedTypes, handleTypeSelection, types }) {
    const [isFilterOpen, setIsFilterOpen] = useState(true);

    const capitalizeFirstLetter = (string) =>
        string.charAt(0).toUpperCase() + string.slice(1);

    if (types.length === 0) {
        return null;
    }

    return (
        <div className={styles.filterContainer}>
            <div className={styles.buttonsContainer}>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={styles.toggleButton}
                >
                    {isFilterOpen ? (
                        <>
                            <IoMdClose /> Hide Filters
                        </>
                    ) : (
                        <>
                            <IoMdMenu /> Show Filters
                        </>
                    )}
                </button>
                <nav>
                    <Link to="/favorites" className={styles.link}>
                        Favorites <FaStar className={styles.star} />
                    </Link>

                    <Link to="/team" className={styles.link}>
                        Teams <FaUsers className={styles.teams} />
                    </Link>
                </nav>
            </div>

            {isFilterOpen && (
                <div className={styles.filter}>
                    <button
                        onClick={() => handleTypeSelection("all")}
                        className={
                            selectedTypes.length === 0
                                ? styles.active
                                : undefined
                        }
                    >
                        All
                    </button>

                    {types.map((type) => (
                        <button
                            key={type.name}
                            onClick={() => handleTypeSelection(type.name)}
                            style={{
                                backgroundColor:
                                    colors[type.name] || "lightgray",
                            }}
                            className={
                                selectedTypes.includes(type.name)
                                    ? styles.active
                                    : undefined
                            }
                        >
                            {capitalizeFirstLetter(type.name)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Filters;
