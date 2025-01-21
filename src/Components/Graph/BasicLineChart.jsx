import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function HorizontalBars({ rawData }) {
  console.log("Raw Data is:", rawData);

  const RoundedRectangle = (props) => {
    const { x, y, width, height } = props;
  
    return (
      <g>
        <defs>
          <linearGradient id="violetGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6582f0" /> {/* Light violet */}
            <stop offset="50%" stopColor="#334aa3" /> {/* Darker violet */}
            <stop offset="100%" stopColor="#0a1e68" /> {/* Back to light violet */}
          </linearGradient>
        </defs>
  
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          
          fill="url(#violetGradient)" // Applying the gradient from left to right
        />
      </g>
    );
  };
  

  return (
    <ResponsiveContainer width="100%" height={400}> {/* Adjust height for better visibility */}
      <BarChart
        layout="vertical" // Horizontal bars
        width={800} 
        data={rawData}
        margin={{ top: 20, right: 10, left: 50, bottom: 5 }} // Increased left margin for Y-axis labels
      >
        <XAxis 
          type="number" 
          axisLine={true} 
          tickLine={true} 

          padding={{ left: 20, right: 20 }} 
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          width={150} // Increased width for longer labels
          tickLine={false}
          angle={-0} // Rotate Y-axis labels to fit them
          textAnchor="end" // Align text properly
        />

        <Tooltip /> {/* Tooltip for interactivity */}
        <Bar
          label={{ position: 'center', fill: '#d1dede' }}
          dataKey="value" 
          fill="#0a1e68" 
          
          barSize={20} 
          shape={<RoundedRectangle />} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
