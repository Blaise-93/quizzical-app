import PropTypes from "prop-types";



/** A function to pass the the user selected Trivia options on the game using
 * reacts props drilling principles.
  */
function Trivia({ trivia, handleClick, selected, isChecked }){
     {/**return the incomming array of trivia answers  */}
  return (
    <div className="trivia__container">
      <h2 className="trivia__title">{trivia.question}</h2>
      <div className="answers__container">
        {trivia.answers.map((answer) => {
          const isHeld =
            JSON.stringify(selected) !== "{}" &&
            selected.answerId === answer.id;
          const isCorrect = trivia.correct_answer === answer.value;
          const isIncorrect = isHeld && !isCorrect;
          return (
            /** Do some routine checks on the user selected options.  */
            <span
              className={`${!isChecked && isHeld ? "answer__held" : ""} ${
                isChecked && isCorrect ? "answer__green" : ""
              } ${isChecked && isIncorrect ? "answer__red" : ""} ${
                isChecked && !isCorrect ? "answer__gray" : ""
              } ${isChecked ? "answer__disabled" : ""}`}
              key={answer.id}
              onClick={() => handleClick(trivia.id, answer.id, answer.value)}
            >
              {answer.value}
            </span>
          );
        })}
      </div>
    </div>
  );
}


/** Validators check on the user inputs/object selected.  */
    Trivia.ProtoTypes = {
        trivia: PropTypes.object.isRequired,
        handleClick: PropTypes.func.isRequired,
        selected: PropTypes.object.isRequired,
        isChecked: PropTypes.bool.isRequired
    }

export default Trivia
