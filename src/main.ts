const wordOfUsageNavBar = document.querySelector("nav") as HTMLElement;
const api = "https://api.dictionaryapi.dev/api/v2/entries/en/"; // + yourWord;
const contentSection = document.getElementById("content") as HTMLElement;

if (wordOfUsageNavBar) {
  // Add class or remove Class if button was clicked
  function btnContentState(clickedButton: HTMLButtonElement) {
    Array.from(wordOfUsageNavBar.children).forEach((child) => {
      if (child === clickedButton) {
        contentSection.classList.add("content-box");
        child.classList.add("active");
      } else {
        child.classList.remove("active");
      }
    });
  }

  function displayContentSection(clickedButton: HTMLButtonElement) {
    if (!contentSection) {
      return;
    }
    const targetSectionId = `${clickedButton.innerText}_list`;

    Array.from(contentSection.children).forEach((child) => {
      if (child.id === targetSectionId) {
        child.classList.remove("no_display");
        child.classList.add("display_section");
      } else {
        child.classList.remove("display_section");
        child.classList.add("no_display");
      }
    });
  }

  wordOfUsageNavBar.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLButtonElement) {
      btnContentState(target);
      displayContentSection(target);
    } else {
      console.error("Clicked element is not an HTMLButtonElement");
      return null;
    }
  });
} else {
  console.error("Navigation bar not found");
}

//Fetch Data from API
async function searchWord(userWord: String): Promise<any[] | object> {
  try {
    const response = await fetch(api + userWord);
    const data = await response.json();
    // if word is not found -> Getting [obj, obj] why?
    if (!Array.isArray(data)) {
      console.log(data);
      return data;
    }

    console.log(data);
    return data;
  } catch (error: unknown) {
    console.error(error);
    return [];
  }
}

function capitalizeFirstLetter(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function addNavigationLinks(arr: []) {
  wordOfUsageNavBar.replaceChildren();
  return arr.forEach(({ partOfSpeech, definitions }) => {
    const newButtonElement = document.createElement("button");
    newButtonElement.textContent = partOfSpeech;
    const buttonStyle = ["fs-4", "btn"];
    newButtonElement.classList.add(...buttonStyle);

    wordOfUsageNavBar.appendChild(newButtonElement);
    addContentSection(definitions, partOfSpeech);
  });
}

function addContentSection(arr: [], partOfSpeech: string) {
  const newOlElement = document.createElement("ol");
  newOlElement.id = `${partOfSpeech}_list`;
  newOlElement.classList.add("no_display");

  arr.forEach(({ definition }) => {
    const newLiElement = document.createElement("li");
    newLiElement.innerText = definition;
    newOlElement.appendChild(newLiElement);
  });

  return contentSection.appendChild(newOlElement);
}

//Interact with the content sections
const searchWordBtn = document.getElementById("searchBtn") as HTMLButtonElement;
searchWordBtn.addEventListener("click", async () => {
  const inputBarElement = document.querySelector("input") as HTMLInputElement;
  const userWord = await searchWord(inputBarElement.value);

  // Check and delete old Ol tags to avoid repetition
  const oldOlElement = document.querySelectorAll("ol");
  if (oldOlElement) {
    oldOlElement.forEach((ol) => {
      ol.remove();
    });
  }

  // userWord is an Array means the word was found it in the API
  if (Array.isArray(userWord)) {
    const { word, phonetic, meanings, phonetics } = userWord[0];

    const wordTitleElement = document.getElementById("wordName") as HTMLElement;
    wordTitleElement.innerText = capitalizeFirstLetter(word);

    const wordPronunciation = document.getElementById(
      "word_pronunciation"
    ) as HTMLElement;
    wordPronunciation.innerText = phonetic;
    addNavigationLinks(meanings);
    playPronunciationAudio(phonetics);
  }
});

//Tell typeScript how the array content would look like
interface Phonetic {
  audio: string;
}

function playPronunciationAudio(phonetics: Phonetic[]) {
  const audioBtn = document.getElementById(
    "play_audio_btn"
  ) as HTMLButtonElement | null;

  if (!audioBtn) {
    console.error("Audio button not found");
    return;
  }

  const audioFile = phonetics.find((phonetic) => phonetic);

  if (!audioFile) {
    console.error("No audio file found in phonetics");
    return;
  }
  const audio = new Audio(audioFile.audio);

  audioBtn.onclick = () => {
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };
}

/*
  Task 
   - Better interaction with Errors 
   - Add audio functionality
   - Add new section where it will tell the user to search for a word+
   - When the user select the word it has to show the meaning of it
*/
