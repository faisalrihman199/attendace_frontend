import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { dataset } from './weather';

const chartSetting = {
  height: 500, 
};

export default function HorizontalBars({rawData}) {
  console.log("Data set is :", dataset);
  console.log("Raw Data set is :", rawData);
  
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <BarChart
        dataset={rawData}
        yAxis={[{ scaleType: 'band', dataKey: 'value' }]}
        series={[
          {
            dataKey: 'name',
            label: 'Attendance Graph',
            color: '#5290ed', // Set color to blue
          },
        ]}
        layout="horizontal"
        width={undefined} // Allow automatic resizing
        {...chartSetting}
      />
    </div>
  );
}
