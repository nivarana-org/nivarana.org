const lowerCaseOnly = (listOfWords: string[]) => (word: string) => {
    const lower = word.toLocaleLowerCase()
    if (listOfWords.includes(lower)) {
        return lower
    }
    return word;
}

const titleCaseWord = (word: string) => {
    if (word.length === 0) return word;
    return word[0].toUpperCase() + word.slice(1,)
}

const capitalizeFirstAndLast = (words: string[]) => {
    const result = []
    const lastWord = words.length - 1;
    for (let i = 0; i <= lastWord; i++) {
        if (i === 0 || i === lastWord) {
            result.push(titleCaseWord(words[i]))
        } else {
            result.push(words[i]);
        }
    }
    return result;
}

const LOWER_CASE_LIST = [
    'and', 'but', 'for', 'or', 'nor', 'the', 'a', 'an', 'to', 'as', 'in', 'on'
]

export const titleCase = (title: string) => {
    let words = title.split(' ');
    words = words.map(titleCaseWord)
    words = words.map(lowerCaseOnly(LOWER_CASE_LIST))
    words = capitalizeFirstAndLast(words)
    return words.join(" ")
}