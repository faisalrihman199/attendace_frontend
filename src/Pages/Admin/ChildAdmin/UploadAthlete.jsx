import React from 'react'
import UploadAthletes from '../../../Components/ChildAdmin/AtheletesManagement/UploadAthletes'

const UploadAthlete = () => {
  return (
    <div className="container p-4">
            <div className='mt-3'>
                <h1 className='top_heading poppins-medium color_bao'>UPLOAD ATHLETES</h1>
            </div>
            <div className="my-4">
                <UploadAthletes />
            </div>
        </div>
  )
}

export default UploadAthlete