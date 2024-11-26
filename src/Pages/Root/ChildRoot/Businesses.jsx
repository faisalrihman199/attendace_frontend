import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BusinessCard from '../../../Components/ChildRoot/BusinessCard'
import { useAPI } from '../../../contexts/Apicontext'
import Loading from '../../../Components/Loading'
import Pagination from '../../../Components/Pagination'


const Businesses = () => {
    const { allBussineses } = useAPI();
    const [loading, setLoading] = useState(0);
    const [search, setSearch] = useState(null);
    const [allBussines, setAllBussiness] = useState([]);
    const [change,setChange]=useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        setLoading(1)
        allBussineses(currentPage).
            then((res) => {
                console.log("All Bussinesses :", res.data);

                setAllBussiness(res.data.businesses);
                setCurrentPage(res.data.currentPage);
                setTotalPages(res.data.totalPages);
            })
            .catch((err) => {
                console.log("Error :", err);

            })
            .finally(() => {
                setLoading(0)
            })
    }, [change,currentPage])
    return (
        <>
            {
                loading === 1 ?
                    <Loading />
                    :
                    <div className="container p-4">
                        <div className='my-3'>
                            <h1 className=' text-center top_heading poppins-bold color_bao' style={{ fontSize: '2.5rem' }}>ACTIVE BUSINESSES</h1>
                        </div>
                        <div className="my-3">
                            <div className="d-flex justify-content-end">
                                <Link to="/root/add_business" className=' bg_dede color-bao poppins-medium p-3 color_bao px-4 ' style={{ borderRadius: '20px', fontSize: '16px', border: 'none' }}>Add Business</Link>
                            </div>
                        </div>
                        <div className="my-2">
                            <div className="row m-ms-0 m-md-3">
                                {allBussines? (
                                    allBussines.map((business) => (
                                        <BusinessCard key={business.id} business={business} setChange={setChange} />
                                    ))
                                ) : (
                                    <p>No businesses available.</p>
                                )}
                            </div>
                        </div>
                        <div className="my-4">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>

                    </div>
            }
        </>
    )
}

export default Businesses