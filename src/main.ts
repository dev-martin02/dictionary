const wordOfUsageNavBar = document.querySelector("nav") as HTMLElement;
const api = "https://api.dictionaryapi.dev/api/v2/entries/en/"; // + yourWord;

if (wordOfUsageNavBar) {
  // Add class or remove Class if button was clicked
  function btnContentState(clickedButton: HTMLButtonElement) {
    Array.from(wordOfUsageNavBar.children).forEach((child) => {
      if (child === clickedButton) {
        child.classList.add("active");
      } else {
        child.classList.remove("active");
      }
    });
  }

  function displayContentSection(clickedButton: HTMLButtonElement) {
    const contentSection = document.getElementById(
      "content"
    ) as HTMLElement | null;
    if (!contentSection) {
      console.error("Content section not found");
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

//Interact with the content sections
const searchWordBtn = document.getElementById("searchBtn") as HTMLButtonElement;
searchWordBtn.addEventListener("click", async () => {
  const inputBarElement = document.querySelector("input") as HTMLInputElement;
  const userWord = await searchWord(inputBarElement.value);

  if (Array.isArray(userWord)) {
    const wordTitleElement = document.getElementById("wordName") as HTMLElement;
    wordTitleElement.innerText = capitalizeFirstLetter(userWord[0].word);
  }
});

/*
  Task 
   - Better interaction with Errors 
   - Add audio functionality 

*/
