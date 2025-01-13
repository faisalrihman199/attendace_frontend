import React from 'react'
import { useLocation } from 'react-router-dom';
import AddAthlete from '../../../Components/ChildAdmin/AtheletesManagement/AddAthlete'

const AddAthelete = () => {
  const location = useLocation();
  const { athlete } = location.state || {};

  return (
    <div className="container p-4">
            <div className='mt-3'>
                <h1 className='top_heading poppins-medium color_bao'>{athlete ? 'EDIT' : 'ADD'} ATHLETE</h1>
            </div>
            <div className="my-4">
                <AddAthlete />
            </div>
        </div>
  )
}

export default AddAthelete