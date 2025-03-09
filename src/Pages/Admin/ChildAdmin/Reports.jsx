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

  // New state to handle export format
  const [exportFormat, setExportFormat] = useState('pdf');
  const [perPage, setPerPage] = useState(10);
    const handlePerPageChange = (event) => {
        const newPerPage = parseInt(event.target.value, 10);
        setPerPage(newPerPage);
        setCurrentPage(1);
    };
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
  const [totalItems, setTotalItems]=useState(0);
  useEffect(() => {
    setLoading(1);
    checkIndata(currentPage, query,perPage)
      .then((res) => {
        console.log("Response :", res);
        setCheckIn(res.data);
        setCurrentPage(res.currentPage);
        setTotalPages(res.totalPages);
        setTotalItems(res?.totalCheckins)
      })
      .catch((err) => {
        console.log("Error :", err);
      })
      .finally(() => {
        setLoading(0);
      });
  }, [currentPage, query,perPage]);

  const handleQuery = () => {
    const qryParts = [];
    if (searchInput) {
      qryParts.push(`query=${searchInput}`);
    }
    if (startDate) {
      qryParts.push(`startDate=${startDate}`);
    }
    if (endDate) {
      qryParts.push(`endDate=${endDate}`);
    }
    setCurrentPage(1);
    const qry = qryParts.join('&');
    setQuery(qry);
    console.log("Query is:", qry);
    return qry;
  };

  // Function to trigger export based on the provided format
  const handleExport = (format) => {
    const qry = handleQuery();
    // Append the format parameter to the query string
    const exportQry = qry ? `${qry}&format=${format}` : `format=${format}`;
    console.log("Export Query:", exportQry);

    reportPDF(exportQry)
      .then((res) => {
        console.log("Response object:", res);
        if (res.status === 200) {
          const contentType = res.headers['content-type'] || 'application/pdf';
          const blob = new Blob([res.data], { type: contentType });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          // The file extension is determined by the format selected
          const ext = format === 'excel' ? 'xlsx' : format === 'csv' ? 'csv' : 'pdf';
          const now = new Date();
          const timeOptions = { hour: 'numeric', minute: 'numeric',second:'numeric', hour12: true };
          let timePart = now.toLocaleTimeString('en-US', timeOptions); // e.g., "2:38 PM"
          timePart = timePart.replace(' ', ','); // becomes "2:38:PM"

          // Format date as "Mar-3-2025"
          const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
          let datePart = now.toLocaleDateString('en-US', dateOptions); // e.g., "Mar 3, 2025"
          datePart = datePart.replace(',', '').replace(/\s+/g, '-'); // becomes "Mar-3-2025"

          let fileName = `report-${timePart}-${datePart}.${ext}`;
          fileName.replace('_',',')
          console.log("FileName :", `${fileName}`);
          
          link.setAttribute('download', `${fileName}`);
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

  // Trigger export immediately when export format changes
  const handleExportFormatChange = (e) => {
    const newFormat = e.target.value;
    setExportFormat(newFormat);
    // Automatically export data on dropdown change
    handleExport(newFormat);
  };

  const handleGetStarted = () => {
    const qry = handleQuery();
    if (!qry) return;
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
  const [sortValue, setSortValue] = useState(1);
  const [sorting, setSorting] = useState(false);
  useEffect(() => {
    console.log("Sort Value Changed :", sortValue);
    setCheckIn(sortGroups(checkData, sortValue, sorting));
  }, [sortValue, sorting]);

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
              {/* Option select can go here if needed */}
            </div>
            <div className="col-md-1 col-sm-12 my-2" />
            <div className="col-md-3 col-sm-12 my-2">
              <button
                className="bg_dede bg_dede_btn poppins-medium p-3 px-4 w-100"
                style={{ borderRadius: '20px', color: '#50514F', fontSize: '16px', border: 'none' }}
                onClick={handleGetStarted}
              >
                Search
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
                onFocus={(e) => { e.target.type = 'date'; }}
                onBlur={(e) => { if (!e.target.value) { e.target.type = 'text'; } }}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-4 col-sm-12 my-2">
              <input
                type="text"
                placeholder="End Date"
                className="form-control bg_dede"
                value={endDate}
                onFocus={(e) => { e.target.type = 'date'; }}
                onBlur={(e) => { if (!e.target.value) { e.target.type = 'text'; } }}
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

        {/* Export Section: Format dropdown and export button */}
        <div className="row mt-3">
          <div className="col-md-6 col-sm-12 my-2">
            <select
              value={exportFormat}
              onChange={handleExportFormatChange}
              className="form-control"
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
            </select>
          </div>
          <div className="col-md-6 col-sm-12 my-2">
            <button
              className="bg_dede bg_dede_btn poppins-medium p-3 px-4 w-100 d-flex align-items-center justify-content-center"
              style={{ borderRadius: '20px', color: '#50514F', fontSize: '16px', border: 'none' }}
              onClick={() => handleExport(exportFormat)}
            >
              <FaFileExport size={25} style={{ paddingRight: '10px' }} />
              Export as {exportFormat.toUpperCase()}
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
        <div className="my-5 d-flex flex-column flex-md-row justify-content-between align-items-center mx-4">
                    {/* Left Side: Showing [dropdown] per page */}
                    <div className="d-flex align-items-center mb-3 mb-md-0">
                        <span className="me-2 fw-medium">Showing</span>
                        <select className="form-select w-auto" onChange={handlePerPageChange} value={perPage}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <span className="ms-2 fw-medium">per page</span>
                    </div>
                    {/* Right Side: Pagination and current display info */}
                    <div className="d-flex flex-column flex-md-row align-items-center">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                        <span className="mt-2 mt-md-0 ms-md-3 fw-medium">
                            {Math.min(perPage * currentPage, totalItems)} of {totalItems} items
                        </span>
                    </div>
                </div>
      </div>
    )
  );
};

export default Reports;
