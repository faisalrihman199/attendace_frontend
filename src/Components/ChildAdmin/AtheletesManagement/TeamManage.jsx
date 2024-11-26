import React, { useEffect, useState } from 'react'
import TableView from "../TableView"
import { useAPI } from '../../../contexts/Apicontext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Pagination from '../../Pagination';
import Loading from '../../Loading';
import { confirmAlert } from 'react-confirm-alert';

const TeamManage = ({searchName}) => {
  const {allGroups,deleteGroup}=useAPI();
  const [teams, setGroups] = useState([]);
  const navigate = useNavigate(); // Initialize navigate
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [change, setChange]=useState(false);
  const [loading,setLoading]=useState(true);
  const handlePageChange = (page) => {
      setCurrentPage(page);
  };
  useEffect(() => {
    setLoading(true);
    const qry=`name=${searchName}`
    allGroups(currentPage,qry)
        .then((res) => {
            console.log("All Groups:", res.data);
            setGroups(res.data.AtheleteGroups); 
            setCurrentPage(res.data.currentPage);
            setTotalPages(res.data.totalPages);
        })
        .catch((err) => {
            console.log("Error:", err);
        })
        .finally(()=>{
          setLoading(false);
        })
}, [currentPage, change,searchName]);

  const headNames=[
    'Team Name',
    'Team/Class',
    'Action',
  ];
  
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
    deleteGroup(id)
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
      toast.error("Failed to delete Group");
      
    })
    .finally(()=>{

    })
};

function sortGroups(data, sortBy, sorting) {
  const key = sortBy === 1 ? 'groupName' : 'category';

  const currentOrder = sorting ? 'asc' : 'desc';

  // Perform the sorting
  const sortedData = data.sort((a, b) => {
    if (a[key] < b[key]) return currentOrder === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return currentOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sortedData;
}
const [sortValue, setSortValue]=useState(null);
const [sorting, setSorting]=useState(true);
useEffect(()=>{
  console.log("Sort Value Changed :", sortValue);
  setGroups(sortGroups(teams,sortValue,sorting));
},[sortValue,sorting])
    
    return (
      loading?
      <Loading />
      :
      teams.length > 0 ?
        <div>
          <TableView 
            headNames={headNames} 
            setSortValue={setSortValue}
            setSorting={setSorting}
            rows={teams.map((team,index)=> ({
              athleteName: team.groupName,
              team: team.category,
              action: (
                <div>
                    <i 
                      className="bi-pencil mx-2" 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => {
                        navigate('/admin/teams/add', { state: { team } });
                      }}
                    ></i>
                    <i 
                      className="bi-trash mx-2" 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => handleDelete(team.id)}
                    ></i>
                </div>
              ),
            }))}
          />
          <div className="my-4">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </div>
        :
        <div className='text-danger ms-3' >No Active Team Found</div>

      );
}

export default TeamManage