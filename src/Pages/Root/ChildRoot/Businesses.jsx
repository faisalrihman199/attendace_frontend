import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BusinessCard from '../../../Components/ChildRoot/BusinessCard';
import { useAPI } from '../../../contexts/Apicontext';
import Loading from '../../../Components/Loading';
import Pagination from '../../../Components/Pagination';

const Businesses = () => {
    const { allBussineses } = useAPI();
    const [loading, setLoading] = useState(0);
    const [search, setSearch] = useState('');
    const [allBussines, setAllBussiness] = useState([]);
    const [filteredBusinesses, setFilteredBusinesses] = useState([]);
    const [change, setChange] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery]=useState(null);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    useEffect(() => {
        setLoading(1);
        allBussineses(currentPage,null, searchQuery)
            .then((res) => {
                setAllBussiness(res.data.businesses);
                setFilteredBusinesses(res.data.businesses); // Initialize filtered list
                setCurrentPage(res.data.currentPage);
                setTotalPages(res.data.totalPages);
            })
            .catch((err) => {
                console.log("Error :", err);
            })
            .finally(() => {
                setLoading(0);
            });
    }, [change, currentPage, searchQuery]);

    const handleSearchChange = (event) => {
        const searchValue = event.target.value.toLowerCase();
        setSearch(searchValue);

        // Filter businesses based on search input
        const filtered = allBussines.filter((business) =>
            business.name.toLowerCase().includes(searchValue) // Adjust based on business attributes
        );
        setFilteredBusinesses(filtered);
    };
    const hanldeSearch=()=>{
        setSearchQuery(search);        
    }

    return (
        <>
            {loading === 1 ? (
                <Loading />
            ) : (
                <div className="container p-4">
                    <div className="my-3">
                        <h1
                            className="text-center top_heading poppins-bold color_bao"
                            style={{ fontSize: '2.5rem' }}
                        >
                            ACTIVE BUSINESSES
                        </h1>
                    </div>
                    <div className="my-3 d-flex flex-wrap justify-content-between align-items-center">
                        {/* Search Field */}
                        <div className="input-group my-2" style={{ width: '300px' }}>
                            <span className="input-group-text bg-white cursor-pointer" onClick={hanldeSearch} style={{ borderRadius: '20 20px 20px 20px' }}>
                                <i className="bi bi-search" style={{ color: '#888' }}></i>
                            </span>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search businesses..."
                                value={search}
                                onChange={handleSearchChange}
                                style={{ borderRadius: '0 5px 5px 0' }}
                            />
                        </div>

                        {/* Add Business Button */}
                        <Link
                            to="/root/add_business"
                            className="bg_dede color-bao poppins-medium p-3 color_bao px-4 my-2"
                            style={{
                                borderRadius: '20px',
                                fontSize: '16px',
                                border: 'none',
                            }}
                        >
                            Add Business
                        </Link>
                    </div>
                    <div className="my-2">
                        <div className="row m-0">
                            {filteredBusinesses.length > 0 ? (
                                filteredBusinesses.map((business) => (
                                    <BusinessCard
                                        key={business.id}
                                        business={business}
                                        setChange={setChange}
                                    />
                                ))
                            ) : (
                                <p>No businesses available.</p>
                            )}
                        </div>
                    </div>
                    <div className="my-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default Businesses;
