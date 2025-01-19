import React from 'react'
import AthleteManagement from '../../../Components/ChildAdmin/AtheletesManagement/AthletesManage'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const ManageAtheletes = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [query, setQuery] = useState(null);

  const handleQuery = () => {
   
    const qryParts = [];
    if (searchInput) {
      qryParts.push(`query=${searchInput}`);
    }
    const qry = qryParts.join('&');
    setQuery(qry);
    console.log("Query is:", qry);
    return qry;
  };
  const clearAllFilters = () => {
    setSelectedOption('');
    setSearchInput('');
    setQuery('');
  };

  return (
    <div className="container p-4">
      <div className='mt-3'>
        <h1 className='top_heading poppins-medium color_bao'>MANAGE ATHLETES</h1>
      </div>
      <div className="my-3">
        <div className="d-flex flex-wrap align-items-center ">
        <div className="row w-100 d-flex align-items-center">
          {/* Input Section */}
          <div className="col-md-3 col-sm-12 my-3">
            <div className="d-flex align-items-center bg_dede password_fields rounded pe-3">
              <i className="bi-search mx-3" style={{ cursor: 'pointer' }}></i>
              <input
                type="text"
                placeholder="Search"
                className="form-control p-2"
                style={{ backgroundColor: 'transparent', border: 'none' }}
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}/>
            </div>
          </div>

          {/* Select Section */}
          <div className="col-md-3 col-sm-12 my-3">
          <button
                className="bg_dede bg_dede_btn poppins-medium p-3 px-4 w-100"
                style={{ borderRadius: '20px', color: '#50514F', fontSize: '16px', border: 'none' }}
                onClick={handleQuery}
              >
                Search
              </button>
          </div>

          <div className="col-md-3 col-sm-12 my-3 d-flex justify-content-end">
          </div>

          <div className="col-md-3 col-sm-12 my-3 d-flex justify-content-end">
            <Link
              to="/admin/athletes/add"
              className="bg_dede d-flex justify-content-center color-bao poppins-medium p-3 color_bao px-4 w-75"
              style={{ borderRadius: '20px', fontSize: '16px', border: 'none' }}
            >
              Add Athlete
            </Link>
          </div>
        </div>
          
        <div className="row w-100 d-flex align-items-center">
          <div className="col-md-3 col-sm-12 my-3">
          <button
                className="bg_dede bg_dede_btn poppins-medium p-3 px-4 w-100"
                style={{ borderRadius: '20px', color: '#50514F', fontSize: '16px', border: 'none' }}
                onClick={clearAllFilters}
              >
                Reset
              </button>
          </div>

          <div className="col-md-3 col-sm-12 my-3">
         
          </div>

          <div className="col-md-3 col-sm-12 my-3 d-flex justify-content-end">
          </div>

          <div className="col-md-3 col-sm-12 my-3 d-flex justify-content-end">
          <Link
              to="/admin/athletes/uploadFile"
              className="bg_dede d-flex justify-content-center color-bao poppins-medium p-3 color_bao px-4 w-75"
              style={{ borderRadius: '20px', fontSize: '16px', border: 'none' }}
            >
              Upload File
            </Link>
          </div>

        </div>

        </div>
        {/* <div className="row">
            <div className='col-md-3 col-sm-12 my-3 d-flex ' >
              <Link to="/admin/athletes/add" className=' bg_dede d-flex justify-content-center color-bao poppins-medium p-3 color_bao px-4 w-75' style={{ borderRadius: '20px', fontSize: '16px', border: 'none' }}>Add Athlete</Link>
            </div>
            <div className='col-md-3 col-sm-12 my-3 d-flex j' >
              <Link to="/admin/athletes/uploadFile" className=' bg_dede d-flex justify-content-center color-bao poppins-medium p-3 color_bao px-4 w-75' style={{ borderRadius: '20px', fontSize: '16px', border: 'none' }}>Upload File</Link>
            </div>
          </div> */}
      </div>

      <div className="my-3">
        <AthleteManagement query={query} />
      </div>
    </div>
  )
}

export default ManageAtheletes