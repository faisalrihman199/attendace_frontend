import React from 'react'
import { useLocation } from 'react-router-dom';
import AddTeamClass from '../../../Components/ChildAdmin/AtheletesManagement/AddTeam'

const AddTeam = () => {
    const location = useLocation();
    const { team } = location.state || {};
    return (
        <div className="container p-4">
                <div className='mt-3'>
                    <h1 className='top_heading poppins-medium color_bao'>{team ? 'EDIT' : 'ADD'} TEAM/CLASS</h1>
                </div>
                <div className="my-4">
                    <AddTeamClass />
                </div>
            </div>
      )
}

export default AddTeam