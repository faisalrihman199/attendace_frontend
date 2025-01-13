import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import TeamManage from '../../../Components/ChildAdmin/AtheletesManagement/TeamManage'
import { useAPI } from '../../../contexts/Apicontext'

const ManageTeams = () => {
  const { allTeams } = useAPI();
  const [teams, setTeams] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchName,setName]=useState(null);
  const handleSearch = () => {
    setName(searchInput);
  }
  return (
    <div className="container p-4">
      <div className='mt-3'>
        <h1 className='top_heading poppins-medium color_bao'>MANAGE TEAMS/CLASSES</h1>
      </div>
      <div className="my-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="col-md-4 col-sm-12 my-2">
            <div className="d-flex my-4 align-items-center bg_dede password_fields rounded pe-3">
              <i className="bi-search mx-3" style={{ cursor: 'pointer' }} onClick={handleSearch} ></i>
              <input
                type="text"
                placeholder="Search"
                className="form-control p-2"
                style={{ backgroundColor: 'transparent', border: 'none' }}
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  handleSearch();
                }}
              />
            </div>
          </div>
          <div>

          <Link to="/admin/teams/add" className=' bg_dede color-bao poppins-medium p-3 color_bao px-4 my-2' style={{ borderRadius: '20px', fontSize: '16px', border: 'none' }}>Add Team/Class</Link>
          </div>
        </div>
      </div>
      <div className="my-3">
        <TeamManage searchName={searchName} />
      </div>
    </div>
  )
}

export default ManageTeams