import colors from "../../constants/colors";
import styles from "./Move.module.css";

function Move({ move }) {
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <li className={styles.move}>
            <p>
                <strong
                    style={{
                        backgroundColor: colors[move.type],
                    }}
                >
                    {capitalizeFirstLetter(move.name)}
                </strong>
            </p>

            <p>Type: {capitalizeFirstLetter(move.type)}</p>
            <p>Power: {move.power ? move.power : "N/A"}</p>
            <p>Accuracy: {move.accuracy ? move.accuracy : "N/A"}</p>
            <p>PP: {move.pp}</p>
        </li>
    );
}

export default Move;