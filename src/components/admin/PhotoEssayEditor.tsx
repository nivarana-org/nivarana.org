import { Button, FormControl, FormLabel, Textarea } from "@mui/joy";
import ArticleEditor from "./ArticleEditor";
import ImagePicker from "./ImagePicker";

function ChapterEditor({ chapter, updateChapter }) {
    return (
        <>
            <h1 className="text-bold">Chapter</h1>
            <FormControl>
                <FormLabel>Chapter Title</FormLabel>
                <Textarea
                    value={chapter.title}
                    onChange={(e) => updateChapter({ title: e.target.value })}
                    minRows={4}
                ></Textarea>
            </FormControl>
            <FormControl>
                <FormLabel>Chapter Body</FormLabel>
                <ArticleEditor
                    value={chapter.body}
                    onEditorChange={(newValue) =>
                        updateChapter({ body: newValue })
                    }
                />
            </FormControl>
            <FormControl>
                <FormLabel className="font-bold">Image</FormLabel>
                <ImagePicker
                    defaultValue={chapter.image}
                    onChange={(newValue: string) => {
                        updateChapter({ image: newValue });
                    }}
                ></ImagePicker>
            </FormControl>
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
            chapters: [...value.chapters, { title: "", body: "" }],
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
            <div className="mt-4">
                <Button onClick={addChapter}>Add Chapter</Button>
            </div>
        </div>
    );
}
