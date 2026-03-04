import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Report.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Report() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/report/report-data');
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok') {
          setReportData(data.data);
        } else {
          setError('Failed to fetch report data');
        }
      } else {
        setError('Error fetching report data');
      }
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Error loading report data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="report-container mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="report-container mt-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="report-container mt-5">
      <h1 className="mb-5">Report Section</h1>

      {reportData && (
        <Row className="g-4">
          {/* Bar Chart - Agent Transaction Totals */}
          <Col lg={6} className="chart-section">
            <div className="chart-card">
              <h3 className="mb-4">Total Transaction Amount by Agent</h3>
              <Bar
                data={reportData.agent_bar_data}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                    },
                    title: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function (value) {
                          return '$' + value.toLocaleString();
                        },
                      },
                    },
                  },
                }}
                height={150}
              />
            </div>
          </Col>

          {/* Line Chart - Daily Transaction Totals */}
          <Col lg={6} className="chart-section">
            <div className="chart-card">
              <h3 className="mb-4">Daily Transaction Totals (Past 2 Weeks)</h3>
              <Line
                data={reportData.transaction_line_data}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                    },
                    title: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function (value) {
                          return '$' + value.toLocaleString();
                        },
                      },
                    },
                  },
                }}
                height={150}
              />
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}
