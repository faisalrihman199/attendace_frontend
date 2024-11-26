import React from 'react'
import SignupForm from '../../../Components/Signup/SignupForm'

const AddBussiness = () => {
    return (
        <div className="container p-4">
            <div className="d-flex justify-content-center">
                <div style={{ width: '100%', maxWidth: '600px' }}>

                    <div className='my-5'>
                    <h1 className=' text-center top_heading poppins-bold color_bao' style={{fontSize:'44px'}}>ADD BUSINESS</h1>
                    </div>
                    <SignupForm />
                </div>
            </div>
        </div>
    )
}

export default AddBussiness