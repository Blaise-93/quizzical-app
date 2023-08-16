import { useState } from "react";
import { nanoid } from "nanoid";
import axios from "axios";
import { decode } from "he";
import Trivia from "./containers/Trivia";
import { categories } from "./containers/data";

function App() {
  const [quizzical, setQuizzical] = useState(null);
  const [selected, setSelected] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [message, setMessage] = useState("");
  const [parameters, setParameters] = useState({
    difficulty: "any",
    category: 0,
    type: "any",
  });


  /** A function that retrieves the user result lengths after
     * it's been filtered out and returned the answer that matched
     * the the one provided by the opentdb.
     */
  const result =
    JSON.stringify(selected) !== "{}" && selected.filter((answer) =>
      quizzical.some(
        (trivia) =>
          trivia.id === answer.triviaId &&
          trivia.correct_answer === answer.value
      )
    ).length;

  const quizHtmlData = quizzical
    ? quizzical.map((trivia) => (
        <Trivia
          key={trivia.id}
          trivia={trivia}
          selected={
            selected.filter((answer) => answer.triviaId === trivia.id)[0] || {}
          }
          handleClick={handleClick}
          isChecked={isChecked}
        />
      ))
    : [];

  function shuffleArr(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }


  /** Fetch the required Quizzical objects from the database as a promise and returns 
   * the stateless updated proof of truth for the user playing the game. If the
   * promise fails, then error is thrown at the user.
   */
  async function startQuiz(event) {
    !isChecked && event.preventDefault();

    let url = "https://opentdb.com/api.php?amount=5";

    const params = Object.entries(parameters).filter(
      ([key, value]) =>
        ((key === "difficulty" || key === "type") && value !== "any") ||
        (key === "category" && value !== 0)
    );

    if (params.length > 0) {
      params.forEach(([key, value]) => {
        url += `&${key}=${value}`;
      });
    }

   try {
    const res = await axios.get(url);
    const data = await res.data;
    console.log(data.results)
    setQuizzical(
      data.results.map((el) => ({

        ...el,
        correct_answer: decode(el.correct_answer),
        incorrect_answers: el.incorrect_answers.map((answer) => 
        decode(answer)),
        question: decode(el.question),
        id: nanoid(),
        answers: shuffleArr([...el.incorrect_answers, el.correct_answer])
        .map(
          (answer) => ({
            value: decode(answer),
            id: nanoid(),
          })
        ),
      }))
    );
   } catch (error) {
        `Something went wrong! Kindly refresh your browser.`
   }
  }


    /** Provides a click event  which helps to select the data
   * needed by the user via making sure that the triviaIndex
   * matches with the user given input.
    */

  function handleClick(triviaId, answerId, value) {
    setSelected((prevSelected) => {
      let newSelected;
      const triviaIndex = prevSelected.findIndex(
        (answer) => answer.triviaId === triviaId
      );
      if (triviaIndex >= 0) {
        newSelected = [...prevSelected];
        newSelected[triviaIndex] = {
          triviaId,
          answerId,
          value,
        };
      } else {
        newSelected = [
          ...prevSelected,
          {
            triviaId,
            answerId,
            value,
          },
        ];
      }
      return newSelected;
    });
  }
 
 
  /** Strickly check user results and send a useful message about the user/client 
     * state of the quiz.
  */
  const checkUserResult = () => {
    if (selected.length === quizzical.length) {
      setIsChecked(true);
        if(result === 5) {
          setMessage(`Excellent👏! You scored ${result} / ${quizzical.length}
           correct answers`);
        }

        else if (result >= 3) {
          setMessage(`Good score 👍! You scored ${result} / ${quizzical.length}
           correct answers`);
        }
        else {
          setMessage(` You scored ${result} / ${quizzical.length} 
          correct answers. Very Poor result, don't be discouraged.
           Kindly try again😍 `);
        }
    }
     else {
      setMessage("Please answer all questions before checking the results");
    }
  }

 /** A function to keep the user abreast of the game. */
  const continuePlaying = async () => {
     await startQuiz();
    setIsChecked(false);
    setSelected([]);
    setMessage("");
  }


  /** Set the options of the parameters of the quiz  */ 
  const setOptions = event => {
    const name = event.target.name;
    setParameters((prevParam) => ({
      ...prevParam,
      [name]: event.target.value,
    }));
  }


/** A function to keep the user in the loop of continuation of the game
     * if the user wishes.
  */
  function restart() {
    setIsChecked(false);
    setSelected([]);
    setMessage("");
    setQuizzical(null);
  }


  return (
    <div className="quiz__container">
      {!quizzical ? (
        <div className="start__container">
           <img src='src/assets/start1.png'  alt='quiz background logo' className='img__one' />
            <img src='src/assets/start2.png' alt='quiz background logo' className='img__two' />
            <h1 className="start__title">Quizzical</h1>
          <p>The best trivia in town</p>
          <form className="parameters__form">
            <div className="params__container">
              <label htmlFor="difficulty" className="difficulty">Choose difficulty level:</label>
              <select
                name="difficulty"
                id="difficulty"
                value={parameters.difficulty}
                onChange={setOptions}
              >
                <option value="any">Any difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="params__container">
              <label htmlFor="category" className="difficulty">Choose category:</label>
              <select
                name="category"
                id="category"
                value={parameters.category}
                onChange={setOptions}
              >
                <option value={0}>Any category</option>
                {categories.trivia_categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="params__container">
              <label htmlFor="type" className="difficulty">Choose type:</label>
              <select
                name="type"
                id="type"
                value={parameters.type}
                onChange={setOptions}
              >
                <option value="any">Any type</option>
                <option value="multiple">Multiple choice</option>
                <option value="boolean">True / False</option>
              </select>
            </div>
            <button className="start__btn" onClick={startQuiz}>
              Start quiz
            </button>
          </form>
        </div>
      ) : (
        <div>
           <img src="src/assets/quiz1.png"  alt="quiz background logo" className="img__one" />
            <img src="src/assets/quiz2.png" alt='quiz background logo' className="img__two" />
            <div className="trivias__container">
            {quizHtmlData}
            {!isChecked ? (
              <div className="trivias__results">
                <button className="trivias__btn" onClick={checkUserResult}>
                  Check answers
                </button>
                <span className="results__warning">{message}</span>
              </div>
            ) : (
              <div className="trivias__results">
                <span className="results__display">{message}</span>
                <button className="trivias__btn" onClick={continuePlaying}>
                  Play again
                </button>
                <button className="restart__btn" onClick={ restart }>
                  Reset parameters
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


export default App