import React, { useEffect, useState } from 'react';
import TableView from "../TableView";
import { useAPI } from '../../../contexts/Apicontext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Pagination from '../../Pagination';
import { toast } from 'react-toastify';
import Loading from '../../Loading';
import { confirmAlert } from 'react-confirm-alert';

const AthleteManagement = ({query}) => {
    const { allStudents,deleteStudent} = useAPI();
    const [athletes, setAthletes] = useState([]);
    const navigate = useNavigate(); // Initialize navigate
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [change, setChange]=useState(false);
    const [loading,setLoading]=useState(true);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const headNames = [
        'Athlete ID',
        'Athlete Name',
        'Team/Class',
        'Action',
    ];

    useEffect(() => {
        setLoading(true);
        allStudents(currentPage,query)
            .then((res) => {
                console.log("All Students:", res.data);
                setAthletes(res.data.athletes); 
                setCurrentPage(res.data.currentPage);
                setTotalPages(res.data.totalPages);
            })
            .catch((err) => {
                console.log("Error:", err);
            })
            .finally(()=>{
                setLoading(false);
            })
    }, [currentPage, change,query]);
    
    const handleDelete = (id) => {
        confirmAlert({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>confirmDelete(id)
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
      .then((res)=>{
        if(res.success){
          toast.success(res.message);
          setChange(!change);
        }
        else{   
          toast.error(res.message);
        }
      })
      .catch((err)=>{
        console.log("Error :", err);
        toast.error("Failed to delete athlete");
        
      })
      .finally(()=>{

      })
  };
  function sortGroups(data, sortBy, sorting) {
    let key;

    // Determine the key to sort by based on sortBy value
    if (sortBy === 1) {
        key = 'pin'; // Sort by pin
    } else if (sortBy === 2) {
        key = 'name'; // Sort by name
    } else if (sortBy === 3) {
        key = 'groupName'; // Sort by groupName
    }

    const currentOrder = sorting ? 'asc' : 'desc';

    // Perform the sorting
    const sortedData = data.sort((a, b) => {
        if (a[key] < b[key]) return currentOrder === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return currentOrder === 'asc' ? 1 : -1;
        return 0;
    });

    return sortedData;
}

  const [sortValue, setSortValue]=useState(1);
  const [sorting, setSorting]=useState(false);
  useEffect(()=>{
    console.log("Sort Value Changed :", sortValue);
    setAthletes(sortGroups(athletes,sortValue,sorting));
    // console.log(sortGroups(athletes,sortValue,sorting));
    
  },[sortValue,sorting])

    return (
        loading?
        <Loading />
        :
        <div>
            {athletes.length > 0 ? (
                <TableView
                    headNames={headNames}
                    setSortValue={setSortValue}
                    setSorting={setSorting}
                    rows={athletes.map((athlete, index) => ({
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
                            </div>
                        ),
                    }))}
                />
            ):
            <div className='text-danger ms-3' >No Active Athelete Found</div>
        }
            <div className="my-4">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
        </div>
    );
};

export default AthleteManagement;
