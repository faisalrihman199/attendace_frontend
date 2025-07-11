import React, { useState } from 'react';
import { BsXCircleFill } from 'react-icons/bs';
import { FaFileExport } from 'react-icons/fa';
import { PiCheckCircle } from 'react-icons/pi';
import { BiSolidDownArrow } from 'react-icons/bi';

const GroupAttendanceCard = ({ group }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const exportToPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`${group.groupName} Attendance Report`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Total Athletes: ${group.totalAthletes}`, 14, 30);
    doc.text(`Total Check-ins: ${group.totalCheckins}`, 14, 36);
    doc.text(`Days: ${group.totalDays}`, 14, 42);
    doc.text(`Attendance %: ${group.percentage}%`, 14, 48);

    const tableData = group.athletes.flatMap((athlete) =>
      athlete.attendance.map((rec) => [
        athlete.name,
        `${rec.date} (${rec.day})`,
        rec.status.toUpperCase(),
        rec.checkInTime || '—',
      ])
    );

    doc.autoTable({
      head: [['Athlete', 'Date', 'Status', 'Time Logged']],
      body: tableData,
      startY: 55,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save(`${group.groupName}_Attendance_Report.pdf`);
  };

  const filteredRecords = group.athletes.flatMap((athlete) =>
    athlete.attendance
      .filter((record) => {
        const query = searchQuery.toLowerCase();
        return (
          athlete.name.toLowerCase().includes(query) ||
          record.day?.toLowerCase().includes(query) ||
          record.date?.toLowerCase().includes(query) ||
          record.status?.toLowerCase().includes(query)
        );
      })
      .map((record, index) => ({
        ...record,
        athleteName: athlete.name,
        athleteId: athlete.id,
        key: `${athlete.id}-${index}`,
      }))
  );

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const aVal = a[sortConfig.key]?.toString().toLowerCase?.() || '';
    const bVal = b[sortConfig.key]?.toString().toLowerCase?.() || '';

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="container my-4 p-4 border shadow-sm bg-white rounded">
      <div className="row">
        {/* Group Info */}
        <div className="col-md-4">
          <h5 className="top_heading poppins-medium color_bao">{group.groupName}</h5>

          <div className="mt-3">
            <p className="m-0"><strong>Total Athletes:</strong> {group.totalAthletes}</p>
            <p className="m-0"><strong>Total Check-ins:</strong> {group.totalCheckins}</p>
            <p className="m-0"><strong>Days:</strong> {group.totalDays}</p>
          </div>

          <div className="mt-3">
            <p className="mb-1 fw-bold text-secondary">Attendance %</p>
            <div className="progress" style={{ height: '30px' }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${group.percentage}%` }}
              >
                {group.percentage}%
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <div>
              <p className="text-muted m-0">On Time</p>
              <h5 className="text-success">{group.totalOnTime}</h5>
            </div>
            <div>
              <p className="text-muted m-0">Late</p>
              <h5 className="text-danger">{group.totalLate}</h5>
            </div>
            <div>
              <p className="text-muted m-0">Missing</p>
              <h5 className="text-warning">{group.totalMissing}</h5>
            </div>
          </div>

          <div className="mt-3">
            <button
              className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center"
              onClick={exportToPDF}
            >
              <FaFileExport size={20} className="me-2" /> Export as PDF
            </button>
          </div>
        </div>

        {/* Records Table */}
        <div className="col-md-8">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by name, date, day or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div style={{ maxHeight: '360px', overflowY: 'auto', scrollbarWidth: 'none' }}>
            <table className="table table-bordered align-middle">
              <thead className="table-light sticky-top">
                <tr>
                  {['athleteName', 'date', 'status', 'checkInTime'].map((key, i) => {
                    const labelMap = {
                      athleteName: 'Athlete',
                      date: 'Date',
                      status: 'Status',
                      checkInTime: 'Time Logged',
                    };
                    const isActive = sortConfig.key === key;
                    return (
                      <th
                        key={i}
                        style={{ cursor: 'pointer', verticalAlign: 'middle' }}
                        onClick={() => handleSort(key)}
                      >
                        <div className="d-flex align-items-center gap-1">
                          {labelMap[key]}
                          <span className="d-flex flex-column ms-1" style={{ lineHeight: 0 }}>
                            <BiSolidDownArrow
                              size={10}
                              style={{
                                transform: 'rotate(180deg)',
                                color: isActive && sortConfig.direction === 'asc' ? '#000' : '#ccc',
                              }}
                            />
                            <BiSolidDownArrow
                              size={10}
                              style={{
                                transform: 'rotate(0deg)',
                                color: isActive && sortConfig.direction === 'desc' ? '#000' : '#ccc',
                              }}
                            />
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {sortedRecords.length > 0 ? (
                  sortedRecords.map((rec) => (
                    <tr key={rec.key}>
                      <td className="fw-bold text-dark">{rec.athleteName}</td>
                      <td>{rec.date} ({rec.day})</td>
                      <td>
                        {rec.status === 'on time' && (
                          <span className="text-success">
                            <PiCheckCircle className="me-1" />
                            On Time
                          </span>
                        )}
                        {rec.status === 'late' && (
                          <span className="text-danger">
                            <PiCheckCircle className="me-1" />
                            Late
                          </span>
                        )}
                        {rec.status === 'missing' && (
                          <span className="text-warning">
                            <BsXCircleFill className="me-1" />
                            Missing
                          </span>
                        )}
                      </td>
                      <td>
                        {rec.status === 'missing' ? (
                          <span className="text-muted">No Time Logged</span>
                        ) : rec.status === 'on time' ? (
                          <span className="text-success fw-bold">{rec.checkInTime}</span>
                        ) : (
                          <span className="text-danger fw-bold">{rec.checkInTime}</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No records match your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupAttendanceCard;
