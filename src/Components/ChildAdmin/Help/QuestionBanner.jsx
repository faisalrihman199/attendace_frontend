import React, { useState } from 'react'
import { SlArrowDown,SlArrowUp } from "react-icons/sl";

const QuestionBanner = ({faq}) => {
const [showAnswer, setShowAnswer]=useState(false);

  return (
    <div className="mx-1 my-3">
        <div className="d-flex justify-content-between p-3 align-items-center" style={{backgroundColor:'#98B7B7', borderRadius:'10px'}}>
            <div className="question">
                <h6 className='mb-0 poppins-semibold'>{faq.question}</h6>
            </div>
            <div className='cursor-pointer' onClick={()=>{setShowAnswer(!showAnswer)}} >
                {showAnswer?
                <SlArrowUp />
                :
                <SlArrowDown />
                }
            </div>
        </div>
        {
            showAnswer &&
        <div className="answer poppins-regular p-3">
            {faq.answer}
        </div>
        }
    </div>
  )
}

export default QuestionBanner