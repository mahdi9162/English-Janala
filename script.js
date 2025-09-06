function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-EN'; // English
  window.speechSynthesis.speak(utterance);
}
// Synonyms
const synonymsArr = (arr) => {
  const htmlElements = arr.map((el) => `<span class="btn border border-[#d7e4ef] rounded-md bg-[#edf7ff]">${el}</span>`);
  return htmlElements.join(' ');
};

const manageLoading = (status) => {
  if (status) {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('level-words').classList.add('hidden');
  } else {
    document.getElementById('level-words').classList.remove('hidden');
    document.getElementById('loading').classList.add('hidden');
  }
};

// Dynamic lessons btn API
const loadLessons = () => {
  const url = 'https://openapi.programming-hero.com/api/levels/all';
  fetch(url)
    .then((res) => res.json())
    .then((levels) => displayLessonBtn(levels.data));
};
loadLessons();

// lessons btns words API
const loadLevelWord = (id) => {
  manageLoading(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((wordsData) => displayLevelWord(wordsData.data));
};

// i button function / word details API
const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url); // এখানে অপেক্ষা করো যতক্ষণ না fetch তার جواب (response) নিয়ে আসে
  const data = await res.json(); // এখানে অপেক্ষা করো যতক্ষণ না res.json() ডেটা পার্স করে শেষ করে
  displayWordDetails(data.data); // উপরের দুটি কাজ শেষ হলেই কেবল এই লাইনটি চলবে
};

const displayWordDetails = (detail) => {
  const detailBox = document.getElementById('details-container');
  detailBox.innerHTML = `
        <div>
            <h2 class="md:text-3xl text-2xl font-semibold"> ${detail.word} <span class="font-bangla">
                (<i class="fa-solid fa-microphone-lines"></i>:${detail.pronunciation})</span>
            </h2>
        </div>
        <div>
            <h2 class="text-xl font-semibold mb-1">Meaning</h2>
            <p class="md:text-xl text-lg font-bangla">${detail.meaning}</p>
        </div>
        <div>
            <h2 class="text-xl font-semibold mb-1">Example</h2>
            <p class="md:text-lg text-sm">${detail.sentence}</p>
        </div>
        <div>
            <h2 class="md:text-xl text-lg font-semibold font-bangla mb-1">সমার্থক শব্দ গুলো</h2>
            ${synonymsArr(detail.synonyms)}
        </div>`;
  document.getElementById('my_modal_5').showModal();
};

// Display btns level words
const displayLevelWord = (words) => {
  const levelWords = document.getElementById('level-words');
  levelWords.innerHTML = '';
  if (words == 0) {
    levelWords.innerHTML = `
        <div class="my-16 col-span-full text-center space-y-3">
        <img class="mx-auto" src="./assets/alert-error.png" alt="">
        <p class="text-[#79716B] text-lg font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
        </p>
        <h2 class="text-3xl font-semibold">
          <span class="font-bangla">নেক্সট</span>
          <span class="text-[#3B25C1]">Lesson</span> <span class="font-bangla">এ যান।</span>
        </h2>
      </div>`;
  }
  words.forEach((word) => {
    const card = document.createElement('div');
    card.innerHTML = `
        <div class="bg-white py-14 px-12 text-center rounded-xl space-y-4 shadow-sm">
        <h1 class="font-bold md:text-3xl text-2xl">${word.word ? word.word : 'প্রদত্ত শব্দটি খুঁজে পাওয়া যায়নি।'}</h1>
        <p class="text-xl">Meaning /Pronounciation</p>
        <h2 class="font-bangla font-semibold md:text-2xl text-xl text-[#18181B]">
        "${word.meaning ? word.meaning : 'শব্দের অর্থ খুঁজে পাওয়া যায়নি।'} / ${word.pronunciation ? word.pronunciation : 'শব্দের উচ্চারণ খুঁজে পাওয়া যায়নি।'}"</h2>
        <div class="flex justify-between">
          <button onclick="loadWordDetail(${
            word.id
          })" class="bg-[#1A91FF10] rounded-xl p-4 cursor-pointer hover:bg-[#1A91FF80] transition-all duration-700">
          <i class="fa-solid fa-circle-info text-lg"></i>
          </button>
          <button onclick="pronounceWord('${
            word.word
          }')"  class="bg-[#1A91FF10] rounded-xl p-4 cursor-pointer hover:bg-[#1A91FF80] transition-all duration-700">
          <i class="fa-solid fa-volume-high text-lg"></i>
          </button>
        </div>
      </div>`;
    levelWords.appendChild(card);
  });
  manageLoading(false);
};

// Dynamic lessons btn
const levelContainer = document.getElementById('level-container');
const displayLessonBtn = (lessons) => {
  // 1. Get the container & empty
  levelContainer.innerHTML = '';

  // 2. get into every lessons
  lessons.forEach((lesson) => {
    // 3. create element
    const newDiv = document.createElement('div');
    newDiv.innerHTML = `
    <button data-level='${lesson.level_no}' class="lessons-btn btn btn-outline btn-primary"><i class="fa-solid fa-book-open"></i> Lesson -${lesson.level_no}</button>`;
    // append into container
    levelContainer.appendChild(newDiv);
  });
};

// remove active class from target lessons btns
const removeTargetActive = () => {
  const lessonsBtns = document.querySelectorAll('.lessons-btn');
  lessonsBtns.forEach((btn) => btn.classList.remove('active'));
};

// Get data from lessons btn in target lesson btns
levelContainer.addEventListener('click', (e) => {
  const targetBtn = e.target.closest('.lessons-btn');
  if (targetBtn) {
    loadLevelWord(targetBtn.dataset.level);
    removeTargetActive();
    targetBtn.classList.add('active');
  }
});

// Search Field
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', () => {
  removeTargetActive();
  const inputSearch = document.getElementById('input-search');
  const inputValue = inputSearch.value.trim().toLowerCase();
  if (inputValue === '') {
    document.getElementById('input-search').parentNode.classList.add('red');
    const levelWords = document.getElementById('level-words');
    levelWords.innerHTML = '';
    levelWords.innerHTML = `
        <div class="my-16 col-span-full text-center space-y-3">
        <img class="mx-auto" src="./assets/alert-error.png" alt="">
        <h2 class="text-3xl font-semibold font-bangla">
          ওহ! কিছু লিখেননি! আগে একটা শব্দ লিখে সার্চ করুন।😉
        </h2>
      </div>
    `;
    return;
  } else {
    document.getElementById('input-search').parentNode.classList.remove('red');
    fetch('https://openapi.programming-hero.com/api/words/all')
      .then((res) => res.json())
      .then((data) => {
        const allWords = data.data;
        const filterWord = allWords.filter((word) => word.word.toLowerCase().includes(inputValue));
        if (filterWord.length === 0) {
          const levelWords = document.getElementById('level-words');
          levelWords.innerHTML = '';
          levelWords.innerHTML = `
      
      <div class="my-16 col-span-full text-center space-y-3">
        <img class="mx-auto" src="./assets/alert-error.png" alt="">
        <h2 class="text-3xl font-semibold font-bangla">
        দুঃখিত, শব্দটি খুঁজে পাওয়া গেল না!😟
        </h2>
      </div>`;
        } else {
          displayLevelWord(filterWord);
        }
      });
  }
});
