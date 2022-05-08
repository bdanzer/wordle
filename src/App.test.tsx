import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { GameType, Outcome, Rounds } from "./@types";
import App from "./App";
import { getOfficialWord, getRandomWord, saveGame } from "./util/game";
import { roundsData } from "./__mocks__/roundsData";

describe("test", () => {
  test("Test NYT Word", async () => {
    const searchParams = new URLSearchParams(location.search);

    const challengerStringData = searchParams.get("challengerGameData");
    const challengerGameData = challengerStringData
      ? (JSON.parse(challengerStringData) as Rounds)
      : null;
    const wordIndex = searchParams.get("wordIndex")
      ? parseInt(searchParams.get("wordIndex") ?? "")
      : null;

    const randomWordleWord = getRandomWord(null, wordIndex);
    const officialWord = getOfficialWord(wordIndex);

    const newWordleWord = (wordIndex?: null | number) => {
      // setRandomWordleWord(getRandomWord(null, wordIndex));
    };

    const user = userEvent.setup();

    const screenItem = render(
      <MemoryRouter initialEntries={["?gameType=NYT"]}>
        <App
          challengerData={challengerGameData}
          wordIndex={wordIndex}
          wordleWord={officialWord}
          randomWord={randomWordleWord}
          newWordleWord={newWordleWord}
          isFirstTime={false}
        />
      </MemoryRouter>
    );

    await waitFor(() => screenItem.getByTestId(`gameboard-0-0`));
    //   await waitFor(() => screenItemgetByTestId(officialWord));

    await user.keyboard(officialWord);
    expect(screenItem.getByTestId("NYT").textContent).toBe("NYT");
    expect(screenItem.getByTestId(officialWord));
    expect(screenItem.getByTestId(`gameboard-0-0`).textContent).toBe(
      officialWord[0]
    );
    expect(screenItem.getByTestId(`gameboard-0-1`).textContent).toBe(
      officialWord[1]
    );
    expect(screenItem.getByTestId(`gameboard-0-2`).textContent).toBe(
      officialWord[2]
    );
    expect(screenItem.getByTestId(`gameboard-0-3`).textContent).toBe(
      officialWord[3]
    );
    expect(screenItem.getByTestId(`gameboard-0-4`).textContent).toBe(
      officialWord[4]
    );

    await user.keyboard("{Enter}");

    await waitFor(() => screenItem.getByTestId(`mini-modal`));

    console.log(officialWord);

    expect(screenItem.getByText("You Completed the game"));
    expect(screenItem.getByText(officialWord));

    expect(screenItem.getByTestId(`miniboard-gameboard-0-0`).textContent).toBe(
      officialWord[0]
    );
    expect(screenItem.getByTestId(`miniboard-gameboard-0-1`).textContent).toBe(
      officialWord[1]
    );
    expect(screenItem.getByTestId(`miniboard-gameboard-0-2`).textContent).toBe(
      officialWord[2]
    );
    expect(screenItem.getByTestId(`miniboard-gameboard-0-3`).textContent).toBe(
      officialWord[3]
    );
    expect(screenItem.getByTestId(`miniboard-gameboard-0-4`).textContent).toBe(
      officialWord[4]
    );

    await user.click(screenItem.getByText("Start New Game"));
    const playOfficialWordButton = screenItem.getByText("Play Official Word");
    expect(playOfficialWordButton);
    await user.click(playOfficialWordButton);
    expect(screenItem.getByText("You Completed the game"));
    expect(screenItem.getByText(officialWord));

    //   expect(screenItem.getByRole("heading")).toHaveTextContent("hello there");
    //   expect(screenItem.getByRole("button")).toBeDisabled();
  });

  test("Test Random Word", async () => {
    const searchParams = new URLSearchParams(location.search);

    const challengerStringData = searchParams.get("challengerGameData");
    const challengerGameData = challengerStringData
      ? (JSON.parse(challengerStringData) as Rounds)
      : null;
    const wordIndex = searchParams.get("wordIndex")
      ? parseInt(searchParams.get("wordIndex") ?? "")
      : null;

    const randomWordleWord = getRandomWord(null, wordIndex);
    const officialWord = getOfficialWord(wordIndex);

    const newWordleWord = (wordIndex?: null | number) => {
      // setRandomWordleWord(getRandomWord(null, wordIndex));
    };

    const user = userEvent.setup();

    const screenItem = render(
      <MemoryRouter initialEntries={["?gameType=Random"]}>
        <App
          challengerData={challengerGameData}
          wordIndex={wordIndex}
          wordleWord={officialWord}
          randomWord={randomWordleWord}
          newWordleWord={newWordleWord}
          isFirstTime={false}
        />
      </MemoryRouter>
    );

    await waitFor(() => screenItem.getByTestId(`gameboard-0-0`));
    //   await waitFor(() => screenItem.getByTestId(officialWord));

    await user.keyboard(randomWordleWord);
    expect(screenItem.getByTestId("Random").textContent).toBe("Random");
    expect(screenItem.getByTestId(randomWordleWord));
    expect(screenItem.getByTestId(`gameboard-0-0`).textContent).toBe(
      randomWordleWord[0]
    );
    expect(screenItem.getByTestId(`gameboard-0-1`).textContent).toBe(
      randomWordleWord[1]
    );
    expect(screenItem.getByTestId(`gameboard-0-2`).textContent).toBe(
      randomWordleWord[2]
    );
    expect(screenItem.getByTestId(`gameboard-0-3`).textContent).toBe(
      randomWordleWord[3]
    );
    expect(screenItem.getByTestId(`gameboard-0-4`).textContent).toBe(
      randomWordleWord[4]
    );

    await user.keyboard("{Enter}");

    await waitFor(() => screenItem.getByTestId(`mini-modal`));

    expect(screenItem.getByText("You Completed the game"));
    expect(screenItem.getByText(randomWordleWord));

    expect(screenItem.getByTestId(`miniboard-gameboard-0-0`).textContent).toBe(
      randomWordleWord[0]
    );
    expect(screenItem.getByTestId(`miniboard-gameboard-0-1`).textContent).toBe(
      randomWordleWord[1]
    );
    expect(screenItem.getByTestId(`miniboard-gameboard-0-2`).textContent).toBe(
      randomWordleWord[2]
    );
    expect(screenItem.getByTestId(`miniboard-gameboard-0-3`).textContent).toBe(
      randomWordleWord[3]
    );
    expect(screenItem.getByTestId(`miniboard-gameboard-0-4`).textContent).toBe(
      randomWordleWord[4]
    );

    //need to test the localstorage save
    expect(screenItem.getByText("Start New Game"));
    await user.click(screenItem.getByText("Start New Game"));
    // const playOfficialWordButton = screenItem.getByText("Play Official Word");
    // expect(playOfficialWordButton);
    // await user.click(playOfficialWordButton);
    // expect(screenItem.getByText("You Completed the game"));
    // expect(screenItem.getByText(randomWordleWord));

    console.log("test random wordle word", randomWordleWord);
    await waitFor(() => screenItem.getByTestId(`gameboard-0-0`));
    expect(screenItem.getByTestId("Random").textContent).toBe("Random");
    expect(screenItem.getByTestId(randomWordleWord));
    await user.keyboard(randomWordleWord);
    expect(screenItem.getByTestId(`gameboard-0-0`).textContent).toBe(
      randomWordleWord[0]
    );
  });

  test("Test NYT Challenge", async () => {
    saveGame(GameType.Official, roundsData, "midst", Outcome.W);
    const searchParams = new URLSearchParams(
      '?challengerGameData=%5B%5B%7B"status"%3A"wrong"%2C"letter"%3A"b"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"r"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"o"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"o"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"l"%7D%5D%2C%5B%7B"status"%3A"wrong"%2C"letter"%3A"r"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"e"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"a"%7D%2C%7B"status"%3A"yellow"%2C"letter"%3A"d"%7D%2C%7B"status"%3A"yellow"%2C"letter"%3A"s"%7D%5D%2C%5B%7B"status"%3A"yellow"%2C"letter"%3A"d"%7D%2C%7B"status"%3A"green"%2C"letter"%3A"i"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"n"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"k"%7D%2C%7B"status"%3A"yellow"%2C"letter"%3A"s"%7D%5D%2C%5B%7B"status"%3A"yellow"%2C"letter"%3A"t"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"h"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"u"%7D%2C%7B"status"%3A"yellow"%2C"letter"%3A"d"%7D%2C%7B"status"%3A"yellow"%2C"letter"%3A"s"%7D%5D%2C%5B%7B"status"%3A"green"%2C"letter"%3A"m"%7D%2C%7B"status"%3A"green"%2C"letter"%3A"i"%7D%2C%7B"status"%3A"green"%2C"letter"%3A"d"%7D%2C%7B"status"%3A"green"%2C"letter"%3A"s"%7D%2C%7B"status"%3A"green"%2C"letter"%3A"t"%7D%5D%2C%5B%7B"status"%3A"none"%2C"letter"%3A""%7D%2C%7B"status"%3A"none"%2C"letter"%3A""%7D%2C%7B"status"%3A"none"%2C"letter"%3A""%7D%2C%7B"status"%3A"none"%2C"letter"%3A""%7D%2C%7B"status"%3A"none"%2C"letter"%3A""%7D%5D%5D&wordIndex=322&gameType=NYT'
    );

    const challengerStringData = searchParams.get("challengerGameData");
    const challengerGameData = challengerStringData
      ? (JSON.parse(challengerStringData) as Rounds)
      : null;
    const wordIndex = 322;
    const randomWordleWord = getRandomWord(null, wordIndex);
    const officialWord = getOfficialWord(wordIndex);

    const newWordleWord = (wordIndex?: null | number) => {
      // setRandomWordleWord(getRandomWord(null, wordIndex));
    };

    const user = userEvent.setup();

    const screenItem = render(
      <MemoryRouter
        initialEntries={[
          '?challengerGameData=%5B%5B%7B"status"%3A"wrong"%2C"letter"%3A"b"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"r"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"o"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"o"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"l"%7D%5D%2C%5B%7B"status"%3A"wrong"%2C"letter"%3A"r"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"e"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"a"%7D%2C%7B"status"%3A"yellow"%2C"letter"%3A"d"%7D%2C%7B"status"%3A"yellow"%2C"letter"%3A"s"%7D%5D%2C%5B%7B"status"%3A"yellow"%2C"letter"%3A"d"%7D%2C%7B"status"%3A"green"%2C"letter"%3A"i"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"n"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"k"%7D%2C%7B"status"%3A"yellow"%2C"letter"%3A"s"%7D%5D%2C%5B%7B"status"%3A"yellow"%2C"letter"%3A"t"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"h"%7D%2C%7B"status"%3A"wrong"%2C"letter"%3A"u"%7D%2C%7B"status"%3A"yellow"%2C"letter"%3A"d"%7D%2C%7B"status"%3A"yellow"%2C"letter"%3A"s"%7D%5D%2C%5B%7B"status"%3A"green"%2C"letter"%3A"m"%7D%2C%7B"status"%3A"green"%2C"letter"%3A"i"%7D%2C%7B"status"%3A"green"%2C"letter"%3A"d"%7D%2C%7B"status"%3A"green"%2C"letter"%3A"s"%7D%2C%7B"status"%3A"green"%2C"letter"%3A"t"%7D%5D%2C%5B%7B"status"%3A"none"%2C"letter"%3A""%7D%2C%7B"status"%3A"none"%2C"letter"%3A""%7D%2C%7B"status"%3A"none"%2C"letter"%3A""%7D%2C%7B"status"%3A"none"%2C"letter"%3A""%7D%2C%7B"status"%3A"none"%2C"letter"%3A""%7D%5D%5D&wordIndex=322&gameType=NYT',
        ]}
      >
        <App
          challengerData={challengerGameData}
          wordIndex={wordIndex}
          wordleWord={officialWord}
          randomWord={randomWordleWord}
          newWordleWord={newWordleWord}
          isFirstTime={false}
        />
      </MemoryRouter>
    );

    console.log("location_search", location.search);

    expect(randomWordleWord).toBe("midst");
    await waitFor(() => screenItem.getByTestId(`gameboard-0-0`));
    //   await waitFor(() => screenItem.getByTestId(officialWord));

    await user.keyboard(randomWordleWord);
    expect(screenItem.getByTestId("NYT").textContent).toBe("NYT");
    expect(screenItem.getByTestId(randomWordleWord));
    expect(screenItem.getByTestId(`gameboard-0-0`).textContent).toBe(
      randomWordleWord[0]
    );
    expect(screenItem.getByTestId(`gameboard-0-1`).textContent).toBe(
      randomWordleWord[1]
    );
    expect(screenItem.getByTestId(`gameboard-0-2`).textContent).toBe(
      randomWordleWord[2]
    );
    expect(screenItem.getByTestId(`gameboard-0-3`).textContent).toBe(
      randomWordleWord[3]
    );
    expect(screenItem.getByTestId(`gameboard-0-4`).textContent).toBe(
      randomWordleWord[4]
    );

    await user.keyboard("{Enter}");

    await waitFor(() => screenItem.getByTestId(`mini-modal`));

    console.log(randomWordleWord);

    expect(screenItem.getByText("You Completed the game"));
    expect(screenItem.getByText(randomWordleWord));

    expect(screenItem.getByTestId(`miniboard-gameboard-0-0`).textContent).toBe(
      randomWordleWord[0]
    );
    expect(screenItem.getByTestId(`miniboard-gameboard-0-1`).textContent).toBe(
      randomWordleWord[1]
    );
    expect(screenItem.getByTestId(`miniboard-gameboard-0-2`).textContent).toBe(
      randomWordleWord[2]
    );
    expect(screenItem.getByTestId(`miniboard-gameboard-0-3`).textContent).toBe(
      randomWordleWord[3]
    );
    expect(screenItem.getByTestId(`miniboard-gameboard-0-4`).textContent).toBe(
      randomWordleWord[4]
    );

    screenItem.debug(screenItem.container);

    await user.click(screenItem.getByText("Start New Game"));
    const playOfficialWordButton = screenItem.getByText("Play Official Word");
    expect(playOfficialWordButton);
    await user.click(playOfficialWordButton);
    // await waitFor(() => screenItem.getByTestId(`mini-modal`));
    // expect(screenItem.getByText("You Completed the game"));
    // expect(screenItem.getByText("You Completed the game"));
    // expect(screenItem.getByText(randomWordleWord));

    //   expect(screenItem.getByRole("heading")).toHaveTextContent("hello there");
    //   expect(screenItem.getByRole("button")).toBeDisabled();
  });
});
