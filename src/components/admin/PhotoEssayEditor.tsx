function ChapterEditor({ chapter, updateChapter }) {
    return (
        <>
            Title:{" "}
            <input
                value={chapter.title}
                onChange={(e) => updateChapter({ title: e.target.value })}
            ></input>
        </>
    );
}

export default function PhotoEssayEditor({ value, onEditorChange }) {
    const updateChapter = (id, update) => {
        const updatedChapter = { ...value.chapters[id], ...update };
        const updatedValue = {
            ...value,
            chapters: value.chapters.with(id, updatedChapter),
        };
        onEditorChange(updatedValue);
    };
    const addChapter = () => {
        onEditorChange({
            ...value,
            chapters: [...value.chapters, { title: "", content: "" }],
        });
    };
    return (
        <div>
            <div>You are editing photo essay.</div>
            {value.chapters.map((c, index) => (
                <div key={index}>
                    <ChapterEditor
                        key={index}
                        index={index}
                        chapter={c}
                        updateChapter={(update) => updateChapter(index, update)}
                    />
                </div>
            ))}
            <div onClick={addChapter}>Add Chapter</div>
        </div>
    );
}
