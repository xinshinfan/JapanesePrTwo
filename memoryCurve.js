const intervals = [1, 2, 4, 8, 16, 32, 64]; // 复习间隔天数

function getNextReviewDate(interval) {
    const now = new Date();
    now.setDate(now.getDate() + interval);
    return now.getTime();
}

function updateWord(word, isCorrect) {
    if (isCorrect) {
        if (word.intervalIndex < intervals.length - 1) {
            word.intervalIndex++;
        }
    } else {
        word.intervalIndex = 0;
    }
    word.interval = intervals[word.intervalIndex];
    word.nextReview = getNextReviewDate(word.interval);
}

function saveWords(words) {
    localStorage.setItem("words", JSON.stringify(words));
}

function loadWords() {
    const savedWords = localStorage.getItem("words");
    if (savedWords) {
        return JSON.parse(savedWords);
    }
    return null;
}

function getNextWordToReview(words) {
    const now = new Date().getTime();
    for (let i = 0; i < words.length; i++) {
        if (words[i].nextReview <= now) {
            return i;
        }
    }
    return 0; // 如果没有需要复习的单词，返回第一个单词
}

function getWordsFromGitHub() {
    return fetch('https://raw.githubusercontent.com/your-username/your-repo/main/words.json')
        .then(response => response.json())
        .then(data => {
            const savedWords = loadWords();
            if (savedWords) {
                // 合并本地存储的数据和GitHub上的数据
                for (let i = 0; i < data.length; i++) {
                    if (savedWords[i]) {
                        data[i].nextReview = savedWords[i].nextReview;
                        data[i].interval = savedWords[i].interval;
                        data[i].intervalIndex = savedWords[i].intervalIndex;
                    } else {
                        data[i].nextReview = 0;
                        data[i].interval = 1;
                        data[i].intervalIndex = 0;
                    }
                }
            }
            return data;
        })
        .catch(error => {
            console.error("加载单词数据失败:", error);
            return null;
        });
}
