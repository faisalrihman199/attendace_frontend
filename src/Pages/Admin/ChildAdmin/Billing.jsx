import React, { useEffect, useState } from 'react'
import CardInfo from '../../../Components/CreditCard/CardInfo'
import TableView from "../../../Components/ChildAdmin/TableView"
import { useAPI } from '../../../contexts/Apicontext';
import Pagination from '../../../Components/Pagination';
import Loading from '../../../Components/Loading';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
const Billing = () => {

  const [cardData, setCard] = useState(null);
  const [plan, setPlan] = useState(null);
  const [payments, setPayments] = useState([]);
  const { billingDashboard, paymentHistory,changePLan } = useAPI();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(0);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    setLoading(1);
    billingDashboard()
      .then((res) => {
        console.log("Billing Data :", res.data);
        setPlan(res.data.plan);
        setCard(res.data.cards);
      })
      .catch((err) => {
        console.log("Error :", err);
      })
      .finally(() => {
        setLoading(0);
      })
  }, [change])
  useEffect(() => {
    setLoading(2);
    paymentHistory(currentPage)
      .then((res) => {
        console.log("Payment Data :", res.data);
        setPayments(res.data.paymentHistory);
        setCurrentPage(res.data.pagination.currentPage);
        setTotalPages(res.data.pagination.totalPages);
      })
      .catch((err) => {
        console.log("Error :", err);
      })
      .finally(() => {
        setLoading(0);
      })

  }, [currentPage])

  const headNames=[
    'Invoice Number',
    'Amount',
    'Status',
    'Date',
  ];
  function sortGroups(data, sortBy, sorting) {
    let key;

    // Determine the key to sort by based on sortBy value
    if (sortBy === 1) {
        key = 'invoiceNumber'; // Sort by invoiceNumber
    } else if (sortBy === 2) {
        key = 'amount'; // Sort by amount
    } else if (sortBy === 3) {
        key = 'status'; // Sort by status
    } else if (sortBy === 4) {
        key = 'date'; // Sort by date
    }

    const currentOrder = sorting ? 'asc' : 'desc';

    // Perform the sorting
    const sortedData = data.sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        if (aValue < bValue) return currentOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return currentOrder === 'asc' ? 1 : -1;
        return 0;
    });

    return sortedData;
}
const ChangePlan = (pln) => {
  confirmAlert({
      title: 'Confirm Plan Update',
      message: 'Are you sure you want to Change Plan?',
      buttons: [
          {
              label: 'Yes',
              // onClick: () => console.log("Change Okay")
              onClick: () => handleChangePlan(pln)
          },
          {
              label: 'No',
              onClick: () => console.log("Change cancelled")
          }
      ]
  });
};
const handleChangePlan=(pln)=>{
  if(!plan.planPrice.includes(pln)){
    console.log("Price is :", pln);
    const qry=`price=${pln}`;
    setLoading(4)
    changePLan(qry)
    .then((res)=>{
      toast.success(res.message);
      setChange(!change);
    })
    .catch((err)=>{
      toast.error("Failed to Update Plan")
      console.log("Error :",err);
    })
    .finally(()=>{
      setLoading(0);
      
    })
    
  }
}
const [sortValue, setSortValue]=useState(1);
  const [sorting, setSorting]=useState(false);
  useEffect(()=>{
    console.log("Sort Value Changed :", sortValue);
    setPayments(sortGroups(payments,sortValue,sorting));
    // console.log(sortGroups(athletes,sortValue,sorting));
    
  },[sortValue,sorting])


  
  return (
    <div className="container p-4 poppins-regular">
     { loading===1?
        <Loading />
        :
        
      <>
        <div className='mt-3'>
          <h1 className='top_heading poppins-medium color_bao'>BILLING</h1>
        </div>
        {
          plan &&
          <div className="row m-3 ms-0">
          
            <div className="col-md-6 col-sm-12 p-1" >
            <div className='bg_dede p-3' style={{ borderRadius: '15px' }}>
              <span className={`poppins-ragular ${plan && !(plan.planPrice.includes('45'))?'cursor-pointer bg-white p-1 rounded':''}`} onClick={()=>{ChangePlan('45')}} > {plan?.planPrice.includes('45')?'Activated':loading===4?'Updating':'Change'} Plan</span>
              <h3 className='poppins-medium my-2' style={{ fontSize: '28px' }}>
                  45$ / Month
                </h3>

              </div>
            </div>
            <div className="col-md-6 col-sm-12 p-1" >
              <div className='bg_dede p-3' style={{ borderRadius: '15px' }}>
              <span className={`poppins-ragular ${plan && !(plan.planPrice.includes('30'))?'cursor-pointer bg-white p-1 rounded':''}`} onClick={()=>{ChangePlan('30')}} > {plan?.planPrice.includes('30')?'Activated':loading===4?'Updating ':"Change"} Plan</span>
              <h3 className='poppins-medium my-2' style={{ fontSize: '28px' }}>
                  30$ / Month
                </h3>

              </div>
            </div>
          </div>
        }
        <div className='my-2'>
          <p className='poppins-medium color_bao font-20 ms-1'>CARD DETAILS</p>
        </div>
        {
          
          <CardInfo cardData={cardData?cardData[0]:null} />

        }
      
      </>
    }
      
      
      
      {
        loading===2?
        <Loading />
        :
        <>
          <div className='my-4'>
            <p className='poppins-medium color_bao font-20 ms-2'>PAYMENT HISTORY</p>
            {
              payments.length>0?
              <TableView headNames={headNames} 
              setSortValue={setSortValue}
              setSorting={setSorting}
              rows={payments.map((payment) => ({
                id: payment.invoiceNumber,
                amount: `$${(parseFloat(payment.amount)).toFixed(2)}`,
                status: payment.status,
                date: payment.date.split('T')[0],
            }))}
              />
              :
              <p className='ms-3 text-danger'>No Payment Records Found</p>

            }
          </div>
          <div className="my-4">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>  
        </>
      }


    </div>
  )
}

export default Billing