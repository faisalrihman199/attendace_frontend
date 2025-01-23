import React from 'react'

const RecentLabel = ({ data }) => {
  const formatDateTime = (dateString, timeString) => {
    const date = new Date(dateString);

    // Format the date as "Month day Year"
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short', // 'Oct'
      day: '2-digit', // '25'
      year: 'numeric' // '2024'
    }).replace(/,/, ''); // Remove the comma after the month and day


    // Format the time as "HH:MM AM/PM"
    console.log("Time before Format is :", timeString);
    date.setHours(parseInt(timeString.substring(0, 2)));
    date.setMinutes(parseInt(timeString.substring(3, 5)));
    date.setSeconds(parseInt(timeString.substring(6)));

    // Format the time using toLocaleTimeString
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    console.log("Formatted Time is :", formattedTime);


    return `${formattedDate}, ${formattedTime}`;
  };
  const entry = formatDateTime(data.checkinDate, data.checkinTime)
  console.log("Entry is :", data.checkinTime);

  return (
    <div className="my-3 p-3 d-flex justify-content-between" style={{ border: '1px solid #000000', borderRadius: '15px' }}>
      <div className="name poppins-regular" style={{ fontSize: '16px' }}>
        {data.Athlete.name}
      </div>
      <div className="time poppins-regular" style={{ fontSize: '16px' }}>
        {entry}
      </div>
    </div>
  )
}

export default RecentLabel