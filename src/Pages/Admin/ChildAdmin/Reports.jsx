import React, { useEffect, useState } from 'react';
import TableView from "../../../Components/ChildAdmin/TableView";
import { toast } from 'react-toastify';
import { useAPI } from '../../../contexts/Apicontext';
import Pagination from '../../../Components/Pagination';
import Loading from '../../../Components/Loading';
import { FaFileExport } from 'react-icons/fa';

const Reports = () => {
  // State variables for input and select
  const [searchInput, setSearchInput] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [query, setQuery] = useState(null);
  const { checkIndata, reportPDF } = useAPI();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(0);
  const [checkData, setCheckIn] = useState([]);

  const headNames = [
    'Athlete ID',
    'Athlete Name',
    'Team/Class',
    'Date',
    'Time',
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setLoading(1);
    checkIndata(currentPage, query)
      .then((res) => {
        console.log("Response :", res);
        setCheckIn(res.data);
        setCurrentPage(res.currentPage);
        setTotalPages(res.totalPages);
      })
      .catch((err) => {
        console.log("Error :", err);
      })
      .finally(() => {
        setLoading(0);
      });
  }, [currentPage, query]);

  const handleQuery = () => {
    

    const qryParts = [];
    if (selectedOption && searchInput) {
      qryParts.push(`${selectedOption}=${searchInput}`);
    }
    if (startDate) {
      qryParts.push(`startDate=${startDate}`);
    }
    if (endDate) {
      qryParts.push(`endDate=${endDate}`);
    }

    const qry = qryParts.join('&');
    setQuery(qry);
    console.log("Query is:", qry);
    return qry;
  };

  // Function to handle button click
  const handleGetStarted = () => {
    const qry = handleQuery();
    if (!qry) return;
  };

  const handlePrint = () => {
    const qry = handleQuery();
    reportPDF(qry)
      .then((res) => {
        console.log("Response object:", res);
        if (res.status === 200) {
          const contentType = res.headers['content-type'] || 'application/pdf';
          const blob = new Blob([res.data], { type: contentType });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'report.pdf');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          console.error("Unexpected response status:", res.status);
        }
      })
      .catch((err) => {
        console.error("Error occurred while downloading the file:", err);
        if (err.response) {
          console.error("Error response:", err.response);
        }
      });
  };
  const handleClearAll = () => {
    setSearchInput('');
    setSelectedOption('');
    setStartDate('');
    setEndDate('');
    setQuery(null);
    setCurrentPage(1); // Reset to the first page
  };
  function sortGroups(data, sortBy, sorting) {
    let key;

    // Determine the key to sort by based on sortBy value
    if (sortBy === 1) {
        key = 'athlete.pin'; // Sort by pin
    } else if (sortBy === 2) {
        key = 'athlete.name'; // Sort by name
    } else if (sortBy === 3) {
        key = 'athlete.groupName'; // Sort by groupName
    } else if (sortBy === 4) {
        key = 'createdAt'; // Sort by createdAt
    } else if (sortBy === 5) {
        key = 'checkinTime'; // Sort by checkinTime
    }

    const currentOrder = sorting ? 'asc' : 'desc';

    const sortedData = data.sort((a, b) => {
        const aValue = key.split('.').reduce((obj, keyPart) => obj[keyPart], a);
        const bValue = key.split('.').reduce((obj, keyPart) => obj[keyPart], b);

        if (aValue < bValue) return currentOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return currentOrder === 'asc' ? 1 : -1;
        return 0;
    });

    return sortedData;
}
  const [sortValue, setSortValue]=useState(1);
  const [sorting, setSorting]=useState(false);
  useEffect(()=>{
    console.log("Sort Value Changed :", sortValue);
    setCheckIn(sortGroups(checkData,sortValue,sorting));
    // console.log(sortGroups(athletes,sortValue,sorting));
    
  },[sortValue,sorting])

  return (
    loading === 1 ? (
      <Loading />
    ) : (
      <div className="container p-4">
        <div className='mt-3'>
          <h1 className='top_heading poppins-medium color_bao'>ATHLETE CHECK-IN REPORT</h1>
        </div>

        <div className="mt-3">

        {/* First Row: Search, Filter, Apply Filters */}
        <div className="row">
            <div className="col-md-4 col-sm-12 my-2">
              <div className="d-flex align-items-center bg_dede password_fields rounded pe-3">
                <i className="bi-search mx-3" style={{ cursor: 'pointer' }}></i>
                <input
                  type="text"
                  placeholder="Search"
                  className="form-control p-2"
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4 col-sm-12 my-2">
              <select
                className="form-control bg_dede"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="">Type</option>
                <option value="pin">ID</option>
                <option value="athleteName">Name</option>
                <option value="groupName">Team/Class</option>
              </select>
            </div>
            <div className="col-md-1 col-sm-12 my-2" />
            <div className="col-md-3 col-sm-12 my-2">
              <button
                className="bg_dede bg_dede_btn poppins-medium p-3 px-4 w-100"
                style={{ borderRadius: '20px', color: '#50514F', fontSize: '16px', border: 'none' }}
                onClick={handleGetStarted}
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Second Row: Start Date, End Date, Clear All */}
          <div className="row mt-3">
            <div className="col-md-4 col-sm-12 my-2">
              <input
                type="text"
                className="form-control bg_dede"
                placeholder="Start Date"
                value={startDate}
                onFocus={(e) => {
                  e.target.type = 'date';
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    e.target.type = 'text';
                  }
                }}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-4 col-sm-12 my-2">
              <input
                type="text"
                placeholder="End Date"
                className="form-control bg_dede"
                value={endDate}
                onFocus={(e) => {
                  e.target.type = 'date';
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    e.target.type = 'text';
                  }
                }}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-md-1 col-sm-12 my-2" />
            <div className="col-md-3 col-sm-12 my-2">
              <button
                className="bg_dede bg_dede_btn poppins-medium p-3 px-4 w-100"
                style={{ borderRadius: '20px', color: '#50514F', fontSize: '16px', border: 'none' }}
                onClick={handleClearAll}
              >
                Reset
              </button>
            </div>
          </div>        
        </div>
        {/* <div className="my-4">
          <h1 className="font-20 poppins-medium my-2">Athlete List</h1>
        </div> */}
        <div className="row mt-3">
          <div className="col-md-4 col-sm-12 my-2" />
          <div className="col-md-4 col-sm-12 my-2" />
          <div className="col-md-1 col-sm-12 my-2" />
          <div className="col-md-3 col-sm-12 my-2">
            <button
              className="bg_dede bg_dede_btn poppins-medium p-3 px-4 w-100"
              style={{ borderRadius: '20px', color: '#50514F', fontSize: '16px', border: 'none' }}
              onClick={handlePrint}
            >
            <FaFileExport size={25} style={{ paddingRight: '10px' }} />
              Export Report
            </button>
          </div>
        </div>        
        {checkData.length > 0 ? (
          <div className="my-3">
            <TableView
              headNames={headNames}
              setSortValue={setSortValue}
              setSorting={setSorting}
              rows={checkData.map((checkIn) => ({
                athleteId: checkIn.athlete.pin,
                athleteName: checkIn.athlete.name,
                team: checkIn.athlete.groupNames,
                date: checkIn.createdAt.split('T')[0],
                time: checkIn.checkinTime,
              }))}
            />
          </div>
        ) : (
          <div className="ms-3 text-danger">No Records Found</div>
        )}
        <div className="my-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    )
  );
};

export default Reports;
