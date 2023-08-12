import React  from "react"
import PropTypes from 'prop-types'

/** A function to pass the the user selected Trivia options on the game using
 * reacts props drilling principles.
  */
function Trivia(props) {
    console.log(props)
    return (
    <React.Fragment className='trivia__container'>
        <h2 className="trivia__title">{ props.question }</h2>
        <div className="answers__container">
            {/**return the incomming array of trivia answers  */}
            { props.trivia.answers.map(result => {
                const isHeld = JSON.stringify(props.selected) != '{}' && 
                props.selected.answerId === result.id
                const isCorrect = props.trivia.correct_answer === result.value;
                const isNotTheAnswer = isHeld && !isCorrect
           
                return (
                    /** Do some routine checks on the user selected options.  */
                    <span className={`${!props.isChecked && isHeld ? 'answer__held' : ''}
                        ${ props.isChecked && isNotTheAnswer ? 'answer__red': ''} 
                        ${
                          props.isChecked && !isCorrect ? 'answer__gray': ''  
                        }
                        ${props.isChecked ? 'answer__disabled' : ''}
                        
                    `} key={result.id}
                    onClick={() => props.handleClick(
                                props.trivia, result.id, answer.value
                                )}
                    >
                        {result.value}
                    </span>
                )
            }) 
            
            }
        </div>
    </React.Fragment>
    )
}

/** Validators check on the user inputs/object selected.  */
    Trivia.ProtoTypes = {
        trivia: PropTypes.object.isRequired,
        handleClick: PropTypes.func.isRequired,
        selected: PropTypes.object.isRequired,
        isChecked: PropTypes.bool.isRequired
    }

export default Trivia
