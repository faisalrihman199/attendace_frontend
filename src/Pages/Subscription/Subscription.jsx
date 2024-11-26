import React from 'react'
import CardInfo from '../../Components/CreditCard/CardInfo'

const Subscription = () => {
    return (
        <div className="auth bg_dede p-3 p-md-5">
            <div className="row p-4 upper_frame">

                <div className="col-sm-12">
                    <div className="d-flex h-100 col_2 w-100 px-2 px-md-5  justify-content-center">
                        <h1 className='poppins-semibold color_bao main_heading'>COMPLETE YOUR SUBSCRIPTION</h1>
                            <p className='sub_para mx-1'>
                            Enter your credit card information to start your subscription.
                            </p>
                        <CardInfo />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Subscription