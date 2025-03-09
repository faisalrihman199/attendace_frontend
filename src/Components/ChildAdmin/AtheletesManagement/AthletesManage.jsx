import React, { useEffect, useState } from 'react';
import TableView from "../TableView";
import { useAPI } from '../../../contexts/Apicontext';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../Pagination';
import { toast } from 'react-toastify';
import Loading from '../../Loading';
import { confirmAlert } from 'react-confirm-alert';
import { RiMailSendFill } from 'react-icons/ri';

const AthleteManagement = ({ query }) => {
    const { allStudents, deleteStudent, resendWelcomeEmail } = useAPI();
    const [athletes, setAthletes] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [change, setChange] = useState(false);
    const [totalAthletes, setTotal] = useState(0)
    const [perPage, setPerPage] = useState(10);
    const handlePerPageChange = (event) => {
        const newPerPage = parseInt(event.target.value, 10);
        setPerPage(newPerPage);
        setCurrentPage(1);
    };
    const [dataLoading, setDataLoading] = useState(true);
    const [emailLoadingId, setEmailLoadingId] = useState(null);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const headNames = [
        'Athlete ID',
        'Athlete Name',
        'Team/Class',
        'Action',
    ];

    const handleResendEmail = (id) => {
        setEmailLoadingId(id);
        resendWelcomeEmail(id)
            .then((res) => {
                if (res.success) {
                    toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || "Error resending email");
            })
            .finally(() => {
                setEmailLoadingId(null);
            });
    };

    useEffect(() => {
        setDataLoading(true);
        allStudents(currentPage, query, perPage)
            .then((res) => {
                console.log("All Students:", res.data);
                setAthletes(res?.data?.athletes);
                setCurrentPage(res?.data?.currentPage);
                setTotalPages(res?.data?.totalPages);
                setTotal(res?.data?.totalItems)
            })
            .catch((err) => {
                console.log("Error:", err);
            })
            .finally(() => {
                setDataLoading(false);
            });
    }, [currentPage, change, query, perPage]);

    const handleDelete = (id) => {
        confirmAlert({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => confirmDelete(id)
                },
                {
                    label: 'No',
                    onClick: () => console.log("Deletion cancelled")
                }
            ]
        });
    };

    const confirmDelete = (id) => {
        deleteStudent(id)
            .then((res) => {
                if (res.success) {
                    toast.success(res.message);
                    setChange(!change);
                } else {
                    toast.error(res.message);
                }
            })
            .catch((err) => {
                console.log("Error :", err);
                toast.error("Failed to delete athlete");
            });
    };

    function sortGroups(data, sortBy, sorting) {
        let key;
        if (sortBy === 1) {
            key = 'pin';
        } else if (sortBy === 2) {
            key = 'name';
        } else if (sortBy === 3) {
            key = 'groupName';
        }
        const currentOrder = sorting ? 'asc' : 'desc';
        const sortedData = data.sort((a, b) => {
            if (a[key] < b[key]) return currentOrder === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return currentOrder === 'asc' ? 1 : -1;
            return 0;
        });
        return sortedData;
    }

    const [sortValue, setSortValue] = useState(1);
    const [sorting, setSorting] = useState(false);
    useEffect(() => {
        console.log("Sort Value Changed :", sortValue);
        setAthletes(sortGroups(athletes, sortValue, sorting));
    }, [sortValue, sorting]);

    return (
        dataLoading ?
            <Loading />
            :
            <div>
                {athletes.length > 0 ? (
                    <TableView
                        headNames={headNames}

                        setSortValue={setSortValue}
                        setSorting={setSorting}
                        rows={athletes.map((athlete) => ({
                            athleteId: athlete.pin,
                            athleteName: athlete.name,
                            team: athlete.groupName,
                            action: (
                                <div>
                                    <div className="tooltip-container-icon">
                                        <i
                                            className="bi-pencil mx-2 action-icon"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                navigate('/admin/athletes/add', { state: { athlete } });
                                            }}
                                        ></i>
                                        <span className="tooltip-text-bottom">Edit</span>
                                    </div>
                                    <div className="tooltip-container-icon">
                                        <i
                                            className="bi-trash mx-2 action-icon"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleDelete(athlete.id)}
                                        ></i>
                                        <span className="tooltip-text-bottom">Delete</span>
                                    </div>
                                    <div className="tooltip-container-icon">
                                        {emailLoadingId === athlete.id ? (
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only"></span>
                                            </div>
                                        ) : (
                                            <RiMailSendFill
                                                className='mx-2 action-icon mt-0'
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleResendEmail(athlete.id)}
                                            />
                                        )}
                                        <span className="tooltip-text-bottom">Resend Email</span>
                                    </div>
                                </div>
                            ),
                        }))}
                    />
                ) : (
                    <div className='text-danger ms-3'>No Active Athlete Found</div>
                )}
                <div className="my-5 d-flex flex-column flex-lg-row justify-content-between align-items-center mx-4">
  {/* Line 1 / Left Side: Showing [dropdown] per page */}
  <div className="d-flex align-items-center mb-3 mb-lg-0">
    <span className="me-2 fw-medium">Showing</span>
    <select
      className="form-select w-auto"
      onChange={handlePerPageChange}
      value={perPage}
    >
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </select>
    <span className="ms-2 fw-medium">per page</span>
  </div>
  
  {/* Right Side: Contains Pagination and Athletes count */}
  <div className="d-flex flex-column flex-lg-row align-items-center">
    {/* Line 2 on tablet/mobile: Pagination */}
    <div className="mb-3 mb-lg-0">
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
    {/* Line 3 on tablet/mobile: Current Athletes count */}
    <div className="ms-lg-3">
      <span className="fw-medium">
        {Math.min(perPage * currentPage, totalAthletes)} of {totalAthletes} Athletes
      </span>
    </div>
  </div>
</div>





            </div>
    );
};

export default AthleteManagement;
