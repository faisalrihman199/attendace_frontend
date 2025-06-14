import React, { useEffect, useState } from 'react';
import CardInfo from '../../../Components/CreditCard/CardInfo';
import TableView from "../../../Components/ChildAdmin/TableView";
import { useAPI } from '../../../contexts/Apicontext';
import Pagination from '../../../Components/Pagination';
import Loading from '../../../Components/Loading';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';

const Billing = () => {
  const [cardData, setCard] = useState(null);
  const [plan, setPlan] = useState(null);
  const [payments, setPayments] = useState([]);
  const { billingDashboard, paymentHistory, changePLan, cancelSubscriptionRequest } = useAPI();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(0); // 0 = none, 1 = dashboard, 2 = payments, 3 = plan change
  const [isCancelling, setIsCancelling] = useState(false);
  const [sortValue, setSortValue] = useState(1);
  const [sorting, setSorting] = useState(false);
  const [cancelRequested,setCancelRequested]=useState(false);

  const handlePageChange = (page) => setCurrentPage(page);

  useEffect(() => {
    setLoading(1);
    billingDashboard()
      .then((res) => {
        setPlan(res.data.plan);
        setCard(res.data.cards);
        setCancelRequested(res.data.cancelRequested)
        
      })
      .catch((err) => console.error("Dashboard Error:", err))
      .finally(() => setLoading(0));
  }, [change]);

  useEffect(() => {
    setLoading(2);
    paymentHistory(currentPage)
      .then((res) => {
        setPayments(res.data.paymentHistory || []);
        setCurrentPage(res.data.pagination.currentPage);
        setTotalPages(res.data.pagination.totalPages);
      })
      .catch((err) => console.error("Payment History Error:", err))
      .finally(() => setLoading(0));
  }, [currentPage]);

  const sortGroups = (data, sortBy, ascending) => {
    const keyMap = {
      1: 'invoiceNumber',
      2: 'amount',
      3: 'status',
      4: 'date',
    };
    const key = keyMap[sortBy] || 'invoiceNumber';

    return [...data].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      // Convert numeric values properly
      if (key === 'amount') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }

      if (aVal < bVal) return ascending ? -1 : 1;
      if (aVal > bVal) return ascending ? 1 : -1;
      return 0;
    });
  };

  useEffect(() => {
    if (payments.length > 0) {
      const sorted = sortGroups(payments, sortValue, sorting);
      setPayments(sorted);
    }
  }, [sortValue, sorting]);

  const ChangePlan = (price) => {
    confirmAlert({
      title: 'Confirm Plan Update',
      message: 'Are you sure you want to change your plan?',
      buttons: [
        { label: 'Yes', onClick: () => handleChangePlan(price) },
        { label: 'No' },
      ],
    });
  };

  const handleChangePlan = (price) => {
    if (!plan?.planPrice.includes(price)) {
      setLoading(3);
      changePLan(`price=${price}`)
        .then((res) => {
          toast.success(res.message);
          setChange(prev => !prev);
        })
        .catch(() => toast.error("Failed to update plan"))
        .finally(() => setLoading(0));
    }
  };

  const handleCancelSubscription = () => {
    confirmAlert({
      title: 'Cancel Subscription',
      message: 'Are you sure you want to update your subscription status?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const currentBusiness=sessionStorage.getItem("currentBussiness")
            setIsCancelling(true);
            cancelSubscriptionRequest(currentBusiness,!cancelRequested)
              .then(res => {
                toast.success(res.message || "Subscription status updated.");
                setChange(prev => !prev);
                setCancelRequested(!cancelRequested);
              })
              .catch(() => toast.error("Failed to update subscription."))
              .finally(() => setIsCancelling(false));
          }
        },
        {
          label: 'No',
          onClick: () => {
            const toggle = document.getElementById('cancelToggle');
            if (toggle) toggle.checked = true;
          }
        }
      ]
    });
  };

  const headNames = ['Invoice Number', 'Amount', 'Status', 'Date'];

  return (
    <div className="container p-4 poppins-regular">
      {loading === 1 ? (
        <Loading />
      ) : (
        <>
          <div className='mt-3 d-flex align-items-center justify-content-between flex-wrap'>
            <h1 className='top_heading poppins-medium color_bao'>BILLING</h1>
            <div className="mt-3 ms-1 d-flex align-items-center">
              <label className="form-check-label me-2 poppins-regular" htmlFor="cancelToggle">
                Cancel Subscription
              </label>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="cancelToggle"
                  checked={cancelRequested}
                  onChange={(e) => {
                      handleCancelSubscription();
                    
                  }}
                  disabled={isCancelling}
                />
              </div>
            </div>
          </div>

          {plan && (
            <div className="row m-3 ms-0">
              {['45', '30'].map(price => (
                <div key={price} className="col-md-6 col-sm-12 p-1">
                  <div className='bg_dede p-3' style={{ borderRadius: '15px' }}>
                    <span
                      className={`poppins-ragular ${!plan.planPrice.includes(price) ? 'cursor-pointer bg-white p-1 rounded' : ''}`}
                      onClick={() => ChangePlan(price)}
                    >
                      {plan.planPrice.includes(price) ? 'Activated' : loading === 3 ? 'Updating' : 'Change'} Plan
                    </span>
                    <h3 className='poppins-medium my-2' style={{ fontSize: '28px' }}>
                      {price}$ / Month
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className='my-2'>
            <p className='poppins-medium color_bao font-20 ms-1'>CARD DETAILS</p>
          </div>

          <CardInfo cardData={cardData ? cardData[0] : null} />
        </>
      )}

      {loading === 2 ? (
        <Loading />
      ) : (
        <>
          <div className='my-4'>
            <p className='poppins-medium color_bao font-20 ms-2'>PAYMENT HISTORY</p>
            {payments.length > 0 ? (
              <TableView
                headNames={headNames}
                setSortValue={setSortValue}
                setSorting={setSorting}
                rows={payments.map(payment => ({
                  id: payment.invoiceNumber,
                  amount: `$${parseFloat(payment.amount).toFixed(2)}`,
                  status: payment.status,
                  date: payment.date?.split('T')[0] || '',
                }))}
              />
            ) : (
              <p className='ms-3 text-danger'>No Payment Records Found</p>
            )}
          </div>

          <div className="my-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Billing;
