import React from 'react';
import './BookingsChart.css';
import { Bar as BarChart } from 'react-chartjs';

const BOOKINGS_BUCKETS = {
  Cheap: {
    min: 0,
    max: 500,
  },
  Normal: {
    min: 500,
    max: 1500,
  },
  Expensive: {
    min: 1500,
    max: 10000000,
  },
};

const BookingsChart = (props) => {
  const chartData = { labels: [], datasets: [] };
  let values = [];

  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (
        current.event.price > BOOKINGS_BUCKETS[bucket].min &&
        current.event.price <= BOOKINGS_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    values.push(filteredBookingsCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      // label: "My First dataset",
      fillColor: '#01d1d1',
      strokeColor: 'rgba(220,220,220,0.8)',
      highlightFill: '#01d1d1',
      highlightStroke: 'rgba(220,220,220,1)',
      data: values,
    });
    values = [...values];
    values[values.length - 1] = 0;
  }

  const chart = chartData.datasets.some((dataset) => dataset.data.length > 0);

  return (
    <div className="bookings-chart">
      {chart ? (
        <div style={{ textAlign: 'center' }}>
          <BarChart data={chartData} />
        </div>
      ) : (
        <p className="no-bookings-message">NO BOOKINGS BY YOU</p>
      )}
    </div>
  );
};

export default BookingsChart;
