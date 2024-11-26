import React from 'react'
import QuestionBanner from '../../../Components/ChildAdmin/Help/QuestionBanner'

const Help = () => {
    const FAQs=[
        {
          question: "What is the purpose of the Attendance System?",
          answer: "The Attendance System is designed to streamline and automate the process of tracking attendance for employees, students, or members. It helps reduce manual errors, improves reporting accuracy, and allows easy monitoring of attendance trends."
        },
        {
          question: "How does the Attendance System work?",
          answer: "The system allows users to check in and check out via various methods such as biometric scanners, NFC tags, mobile apps, or web-based platforms. The system records the time and date of each attendance entry and generates reports based on this data."
        },
        {
          question: "Can I use the Attendance System for remote employees?",
          answer: "Yes, the system supports remote employees. Remote workers can mark their attendance using a mobile app or web platform, with geolocation features to verify their location."
        },
        {
          question: "How do I log in to the Attendance System?",
          answer: "To log in, use your registered email or employee ID along with your password. Some systems may also support login via single sign-on (SSO), mobile OTP, or biometric authentication."
        },
        {
          question: "What happens if I forget to check in or check out?",
          answer: "If you forget to mark your attendance, the system may allow you to submit a manual request to update your attendance log. This request will typically require approval from your manager or supervisor."
        },
        {
          question: "Can I view my attendance history?",
          answer: "Yes, the system typically includes a dashboard or history view where you can see your past attendance records, including check-in and check-out times, absences, and any leaves taken."
        },
        
    ]
  return (
    <div className="container p-4">
        <div className='mt-3'>
            <h1 className='top_heading poppins-medium color_bao'>HELP</h1>
            <h1 className='font-20 poppins-medium my-2' >Frequently Asked Questions</h1>
            <p className='poppins-light' style={{fontSize:'16px'}}>Stuck on something? We are here to help you answer your questions</p>
        </div>
        <div className="my-3">
            {
                FAQs.map((faq, index)=>{
                    return <QuestionBanner key={index} faq={faq} />
                })
            }
        </div>
    </div>
  )
}

export default Help