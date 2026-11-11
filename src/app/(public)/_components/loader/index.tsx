import styles from "./loader.module.css";

export function LoaderLines() {
    return (
        <div className={styles.lines}>
            {[1, 2, 3, 4, 5].map((a) => (
                <div key={a} className={styles.line}></div>
            ))}
        </div>
    );
}

function Loader() {
    return (
        <div className="mx-auto my-10 w-10">
            <div className={styles.box} />
        </div>
    );
}

export default Loader;
