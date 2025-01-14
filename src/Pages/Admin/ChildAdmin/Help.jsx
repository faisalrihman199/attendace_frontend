import React from 'react'
import Contact from './Contact'

const Help = () => {

  return (
    <>
      <div className="container p-4">
        <div className='row'>
          <div className='mt-3'>
              <h1 className='top_heading poppins-medium color_bao'>HELP</h1>
              <h1 className='font-20 poppins-medium my-2' >Frequently Asked Questions</h1>
              <p className='poppins-light' style={{fontSize:'16px'}}>Stuck on something? We are here to help you answer your questions</p>
            </div>
            <div className="my-3">
              <a href="https://attendace.net/help/" target="_blank" rel="noopener noreferrer">
                Link to our FAQs
              </a>
            </div>
        </div>
      </div>

      <Contact />

    </>
  )
}

export default Help