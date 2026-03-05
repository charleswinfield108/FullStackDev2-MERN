import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import '../styles/Home.css';

export default function Home() {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Agent Management',
      description: 'List of All Agents',
      buttonText: 'Agent Management',
      path: '/admin/list',
    },
    {
      title: 'Transaction Management',
      description: 'List of Transactions/ Transaction Form',
      buttonText: 'Transaction Management',
      path: '/admin/transaction',
    },
    {
      title: 'Report Section',
      description: 'Graphical Report of Transaction',
      buttonText: 'Report Section',
      path: '/admin/report',
    },
  ];

  return (
    <Container className="home-container">
      <Row className="justify-content-center mt-5 mb-5">
        <Col lg={12}>
          <h1 className="admin-title text-center mb-5">Admin Dashboard</h1>
        </Col>
      </Row>

      <Row className="g-4">
        {cards.map((card, index) => (
          <Col key={index} xs={12} md={6} lg={4} className="d-flex">
            <Card className="home-card w-100">
              <Card.Body className="d-flex flex-column">
                <Card.Title className="card-title">{card.title}</Card.Title>
                <Card.Text className="card-description flex-grow-1">
                  {card.description}
                </Card.Text>
                <Button
                  variant="primary"
                  className="card-button mt-auto"
                  onClick={() => navigate(card.path)}
                >
                  {card.buttonText}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
