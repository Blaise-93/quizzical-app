import React, {useState, useEffect} from 'react-dom'
import { nanoid } from 'nanoid'
import { decode } from 'he'
import Trivia from './containers/Trivia'
import {categories} from './containers/data'
import axios from 'axios'

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

    const userResult = JSON.stringify(selected) !== "{}" && selected
    .filter((result) => quizzal
        .some((trivia) => trivia.id === result.triviaId &&
         trivia.correct_answer === result.value
         ) 
    ).length

    const quizzHtmlData = quizzal ? quizzal.map((trivia, index) => (
        <Trivia
            key={index}
            trivia={trivia}
            selected={
                selected.filter(result => result.trivia === trivia)[0] || {}     
            }
            handleClick={handleClick}
            isChecked={isChecked}
        />
    )): [] 
    


    const handleClick = (traviaId, resultId, value) => {
        setSelected(prevState => {
            let newSelected
            const triviaIndex  = prevState
                .findIndex(result => result.triviaId === traviaId)
            
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


    const startQuizzal = async e => {
        !isChecked && e.preventDefault();
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

            setQuizzical(
                data.results.map((arr) => ({
                    ...arr,
                    correct_answer: decode(arr.correct_answer),
                    incorrect_answers: arr.incorrect_answers.map((result) => {
                        return decode(result)
                    }),
                    question: decode(el.question),
                    id: nanoid(),
                    answers: shuffleArr([...arr.incorrect_answers, el.correct_answer])
                        .map(result => ({
                            value: decode(result),
                            id: nanoid()
                        })) 
                    })
                
                 )

                )
        } catch (error) {
            console.log(error)
        }
    }
    
    const shuffleArr = arr => {
        for (let i = arr.length - 1;  i > 0; --1) {
            const randomNum =  Math.floor(Math.random() * (1 + 1))
            const loopNum = arr[i]
            arr[i] = arr[randomNum]
            arr[randomNum] = loopNum
        }
        console.log(arr)
        return arr
    }

    const checkUserResult = () => {
        if(selected.length === quizzal.length) {
            setIsChecked(true)
            setMessage(`Congrats! Your scored ${userResult} / ${quizzal.length} in your quiz.`)
        }else {
            setMessage("Please answer all the questions given prior to checking the results")
        }
    }

    const continuePlaying = async () => {
        await startQuizzal()
        setIsChecked(false)
        setSelected([])
        setMessage("")
    }

    const setOptions = e => {
        const event = e.target.name
        setParams(prevState => ({
            ...prevState,
            [event]: e.target.value
        }))
    }
 
    const restart = () => {
        setIsChecked(false)
        setSelected([])
        setMessage('')
        setQuizzical(null)

    }

    useEffect(() => {
        startQuizzal()
    }, [])

    

}


export default App