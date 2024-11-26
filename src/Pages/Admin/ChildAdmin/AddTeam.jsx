import React from 'react'
import AddAthlete from '../../../Components/ChildAdmin/AtheletesManagement/AddTeam'

const AddTeam = () => {
    return (
        <div className="container p-4">
                <div className='mt-3'>
                    <h1 className='top_heading poppins-medium color_bao'>ADD TEAM/CLASS</h1>
                </div>
                <div className="my-4">
                    <AddAthlete />
                </div>
            </div>
      )
}

export default AddTeam