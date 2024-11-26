import React from 'react'
import AddAthlete from '../../../Components/ChildAdmin/AtheletesManagement/AddAthlete'

const AddAthelete = () => {
  return (
    <div className="container p-4">
            <div className='mt-3'>
                <h1 className='top_heading poppins-medium color_bao'>ADD ATHLETE</h1>
            </div>
            <div className="my-4">
                <AddAthlete />
            </div>
        </div>
  )
}

export default AddAthelete