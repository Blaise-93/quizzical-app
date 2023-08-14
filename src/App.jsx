import  {useState} from "react"

import { nanoid } from 'nanoid'
import { decode } from 'he'
import axios from 'axios'

import Trivia from './containers/Trivia'
import {categories} from './containers/data'

const App = () => {

    const [quizzal, setQuizzical] = useState(null)
    const [selected, setSelected] = useState([])
    const [isChecked, setIsChecked] = useState(false)
    const [message, setMessage] = useState('')
    const [params, setParams] = useState({
        difficulty: 'any',
        category: 0,
        type: 'any'
    })


    /** A function that retrieves the user result lengths after
     * it's been filtered out and returned the answer that matched
     * the the one provided by the opentdb.
     */
    const userResult = JSON.stringify(selected) !== "{}" && selected
    .filter((answer) => quizzal
        .some((trivia) => trivia.id === answer.triviaId &&
         trivia.correct_answer === answer.value
         ) 
    ).length


    /** Renders html data gotten from quiz [opentdb] database.  */
    const quizzHtmlData = quizzal ? quizzal.map((trivia, index) => (
        <Trivia
            key={index}
            trivia={trivia}
            selected={
                selected.filter(answer => answer.trivia === trivia)[0] || {}     
            }
            handleClick={handleClick}
            isChecked={isChecked}
        />
    )): [] 
    

    /** Provides a click event  which helps to select the data
     * needed by the user via making sure that the triviaIndex
     * matches with the user given input.
      */
    const handleClick = (traviaId, resultId, value) => {
        setSelected(prevState => {
            let newSelected
            const triviaIndex  = prevState
                .findIndex(answer => answer.triviaId === traviaId)
            
            if(triviaIndex >= 0) {
                newSelected = [...prevState]
                newSelected[triviaIndex] = {
                    traviaId,
                    resultId,
                    value
                }
            }
            else {
                newSelected = [
                    ...prevState, {traviaId, resultId, value}
                ]
            }
       
        })
    }

    /** Fetch the required Quizzical objects from the database as a promise and returns 
     * the stateless updated proof of truth for the user playing the game. If the
     * promise fails, then error is thrown at the user.
     */
    const startQuizzal = async event => {
        !isChecked && event.preventDefault();
        let url =  "https://opentdb.com/api.php?amount=5";

        const dataType = Object.entries(params).filter(
         ([key, value], index) => 
         ((key === 'difficulty' || key === 'type') && value !== 'any')
         || (key === 'category' && value != 0)     
        )

        if(dataType.length > 0) {
            dataType.forEach(([key, value]) => {
                url += `&${key}=${value}`
            })
        }

        try {
            const res = await axios.get(url)
            const data = res.data
            console.log(data)

            setQuizzical(
                data.results.map((arr) => ({
                    ...arr,
                    correct_answer: decode(arr.correct_answer),
                    incorrect_answers: arr.incorrect_answers.map((answer) => {
                        return decode(answer)
                    }),
                    question: decode(el.question),
                    id: nanoid(),
                    answers: shuffleArr([...arr.incorrect_answers, el.correct_answer])
                        .map(answer => ({
                            value: decode(answer),
                            id: nanoid()
                        })) 
                    })
                
                 )

                )
        } catch (error) {
           <p className="error-message">
                Something went wrong! Kindly refresh your browser.
           </p>
        }
    }

    /** Randomnly shuffle the incomming data of answers to reduce the
     * user's prediction. 
      */
    const shuffleArr = arr => {
        for (let i = arr.length - 1;  i > 0; --i) {
            const randomNum =  Math.floor(Math.random() * (1 + i))
            const loopNum = arr[i]
            arr[i] = arr[randomNum]
            arr[randomNum] = loopNum
        }
        console.log(arr)
        return arr
    }


    /** Strickly check user results and send a useful message about the user/client 
     * state of the quiz.
       */
    const checkUserResult = () => {
        if(selected.length === quizzal.length) {
            setIsChecked(true)
            if (userResult >= 4) {
                setMessage(`Excellent job! Your scored ${userResult} / ${quizzal.length} in your quiz.`)
            }
            else {
                setMessage(`Your scored ${userResult} / ${quizzal.length} in your quiz.\
                Work hard next time.`)
            }
        }else {
            setMessage("Please answer all the questions given prior to checking the results")
        }
    }


    /** A function to keep the user abreast of the game. */
    const continuePlaying = async () => {
        await startQuizzal()
        setIsChecked(false)
        setSelected([])
        setMessage("")
    }

    /** Set the options of the parameters of the quiz  */
    const setOptions = e => {
        const event = e.target.name
        setParams(prevState => ({
            ...prevState,
            [event]: e.target.value
        }))
    }
    
    /** A function to keep the user in the loop of continuation of the game
     * if the user wishes.
       */
    const restart = () => {
        setIsChecked(false)
        setSelected([])
        setMessage('')
        setQuizzical(null)

    }
   

    return (
        <div className='quiz__container'>
            {!quizzal ? (
                
                <div className="quizzal__container">
                    <img src='src/assets/start1.png' className='img__one' />
                    <img src='src/assets/start2.png' className='img__two' />
                    
                    <h1 className='start__title'>Quizzical</h1>
                    <p>The best trivia you can ever imagine.</p>
                    <form action="" className='params__form'>
                        <div className='params__container'>
                            <label htmlFor="difficulty">Choose difficulty level</label>
                            <select               
                                name="difficulty"
                                id="difficulty"
                                value={ params.difficulty }
                                onChange={ setOptions }
                            >
                                <option value="any">Any difficulty</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                        <div className='params__container'>
                            <label htmlFor='category'>Kindly choose category:</label>
                            <select name="category" id="category"
                                value={ params.category }
                                onChange={ setOptions }>
                                <option value={0}>Any categ</option>
                                    {  categories.trivia_categories
                                    .map((category) => (
                                        <option key={category.id}
                                        value={categories.id}>
                                            {category.name}
                                        </option>
                                    ))}

                                </select>
                        </div>  
                    <div className='params__container'>
                        <label htmlFor="type">Choose type:</label>
                        <select 
                            name="type" id="type"
                            value={params.type}
                            onChange={setOptions}
                            >
                            <option value="any">Any type</option>
                            <option value="multiple">Multiple choice</option>
                            <option value="boolean">True/False</option>
                          
                        </select>
                    </div>  
                    <button
                        className='start__btn' onClick={startQuizzal}
                        >Start quiz 
                    </button>
                    </form>
                </div>
            ): (
                <div>
                    <img src="src/assets/quiz1.png" className="img__one" />
                    <img src="src/assets/quiz2.png" className="img__two" />
                    <div className="trivias__container">
                        {quizzHtmlData}
                        {!isChecked ? ( 
                            <div className="trivias__results">
                            <button className="trivias__btn" onClick={ checkUserResult }>
                              Check answers
                            </button>
                            <span className="results__warning">{ message }</span>
                          </div>
                        ) : (
                            <section className="trivias__results">
                                <span className="results__display">{ message }</span>
                                <button className="trivias__btn" onClick={ continuePlaying }>
                                    Play Again 
                                </button>
                                <button className="restart__btn" onClick={restart}>
                                    Resest parameters
                                </button>
                            </section>       
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}


export default App