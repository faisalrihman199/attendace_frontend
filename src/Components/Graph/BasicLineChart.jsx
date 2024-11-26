import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const BasicLineChart = ({ rawData }) => {
  if (!rawData || typeof rawData !== 'object' || Object.keys(rawData).length === 0) {
    return <p>No data available</p>;
  }

  const dataSets = Object.keys(rawData).map((key, index) => {
    const colors = ["#FF0000", "#00FF00", "#0000FF"];
    return {
      name: key,
      data: Array.isArray(rawData[key]) ? rawData[key] : [],
      color: colors[index % colors.length],
    };
  });

  if (dataSets.every(dataSet => dataSet.data.length === 0)) {
    return <p>No data available for all datasets</p>;
  }

  const allNames = [...new Set(dataSets.flatMap(dataSet => dataSet.data.map(item => item.name)))];

  const combinedData = allNames.map(name => {
    const combinedEntry = { name };
    dataSets.forEach(dataSet => {
      const foundItem = dataSet.data.find(item => item.name === name);
      combinedEntry[dataSet.name] = foundItem && typeof foundItem.value === 'number' ? foundItem.value : 0;
    });
    return combinedEntry;
  });

  const generateTicks = () => {
    const allValues = dataSets.flatMap(dataSet => dataSet.data.map(item => item.value)).filter(value => typeof value === 'number' && !isNaN(value));
    
    if (allValues.length === 0) {
      return [0];
    }

    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    if (minValue === maxValue) {
      return [minValue];
    }

    const tickCount = 5;
    const step = Math.ceil((maxValue - minValue) / tickCount);

    const ticks = [];
    for (let i = minValue; i <= maxValue; i += step) {
      ticks.push(i);
    }

    return ticks;
  };

  const yTicks = generateTicks();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={combinedData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          padding={{ left: 20, right: 20 }} 
        />
        <YAxis
          domain={[Math.min(...yTicks), Math.max(...yTicks) || 1]}
          axisLine={false}
          tickLine={false}
          ticks={yTicks}
          padding={{ top: 10, bottom: 10 }}
        />
        <Tooltip />
        {dataSets.map((dataSet) => (
          <Line
            key={dataSet.name}
            type="monotone"
            dataKey={dataSet.name}
            stroke={dataSet.color}
            strokeWidth={3}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BasicLineChart;
