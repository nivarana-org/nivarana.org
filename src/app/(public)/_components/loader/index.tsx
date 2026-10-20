import * as motion from "motion/react-client";

export function LoaderLines() {
    return (
        <motion.div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map((a) => (
                <motion.div
                    key={a}
                    className="bg-nivarana-green h-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15, repeat: Infinity }}
                ></motion.div>
            ))}
        </motion.div>
    );
}

function Loader() {
    const box = {
        width: 100,
        height: 100,
        backgroundColor: "var(--color-nivarana-green)",
        borderRadius: 5,
    };
    return (
        <div className="mx-auto my-10 w-10">
            <motion.div
                animate={{
                    scale: [1, 2, 2, 1, 1],
                    rotate: [0, 0, 180, 180, 0],
                    borderRadius: ["0%", "0%", "50%", "50%", "0%"],
                }}
                transition={{
                    duration: 2,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.5, 0.8, 1],
                    repeat: Infinity,
                    repeatDelay: 0.3,
                }}
                style={box}
            />
        </div>
    );
}

export default Loader;
