import { useState, useEffect } from 'react';
import { Container, Form, Button, Table, Toast, ToastContainer, Row, Col, Modal } from 'react-bootstrap';
import './Transaction.css';

export default function Transaction() {
  const [formData, setFormData] = useState({ amount: '', agent_id: '' });
  const [agents, setAgents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tentativeFormData, setTentativeFormData] = useState(null);

  // Fetch agents and transactions on component mount
  useEffect(() => {
    fetchAgents();
    fetchTransactions();
  }, []);

  const fetchAgents = async () => {
    try {
      setAgentsLoading(true);
      const response = await fetch('/agent');
      if (response.ok) {
        const data = await response.json();
        // Agent endpoint returns an array directly, not wrapped in {status, data}
        if (Array.isArray(data)) {
          setAgents(data);
        } else if (data.status === 'ok' && Array.isArray(data.data)) {
          setAgents(data.data);
        } else {
          setAgents([]);
          showToast('Unexpected response format from agents', 'danger');
        }
      } else {
        showToast('Error loading agents', 'danger');
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      showToast('Error loading agents', 'danger');
    } finally {
      setAgentsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/transaction/transaction-data');
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok') {
          setTransactions(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.agent_id) {
      showToast('Please fill in all fields', 'danger');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      showToast('Amount must be a positive number', 'danger');
      return;
    }

    // Show confirmation modal instead of immediately submitting
    setTentativeFormData({ amount, agent_id: formData.agent_id });
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    try {
      const response = await fetch('/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tentativeFormData),
      });

      const data = await response.json();

      if (response.ok && data.status === 'ok') {
        showToast('Transaction Created Successfully', 'success');
        setFormData({ amount: '', agent_id: '' });
        setTentativeFormData(null);
        fetchTransactions(); // Refresh transaction list
      } else {
        showToast(data.message || 'Error creating transaction', 'danger');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      showToast('Error creating transaction', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelModal = () => {
    setShowConfirmModal(false);
    setTentativeFormData(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getAgentName = (agentId) => {
    const agent = agents.find((a) => a._id === agentId);
    return agent ? `${agent.first_name} ${agent.last_name}` : 'Unknown';
  };

  return (
    <Container className="transaction-container mt-5">
      <h1 className="mb-5">Transaction Management</h1>

      <Row className="transaction-layout">
        {/* Transactions List - Left Column */}
        <Col lg={6} className="transaction-list-section mb-4 mb-lg-0">
          <h3 className="mb-4">Recent Transactions</h3>
          {transactions.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Agent Name</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>
                      {transaction.agent_id ? (
                        <>
                          {transaction.agent_id.first_name} {transaction.agent_id.last_name}
                        </>
                      ) : (
                        <span style={{ color: 'blue' }}>Inactive Agent</span>
                      )}
                    </td>
                    <td>${transaction.amount.toFixed(2)}</td>
                    <td>{formatDate(transaction.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted">No transactions yet. Create one to get started!</p>
          )}
        </Col>

        {/* Transaction Form - Right Column */}
        <Col lg={6} className="transaction-form-section">
          <h3 className="mb-4">Create New Transaction</h3>
          <Form onSubmit={handleSubmit} className="form-card">
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter transaction amount"
                step="0.01"
                min="0"
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select Agent</Form.Label>
              {agentsLoading ? (
                <div className="p-2 border rounded" style={{ backgroundColor: '#f0f0f0' }}>
                  Loading agents...
                </div>
              ) : agents.length === 0 ? (
                <div className="alert alert-warning mb-0">
                  No agents available. Please create an agent first.
                </div>
              ) : (
                <Form.Select
                  name="agent_id"
                  value={formData.agent_id}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="">-- Choose an agent --</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.first_name} {agent.last_name}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-100"
            >
              {loading ? 'Creating...' : 'Create Transaction'}
            </Button>
          </Form>
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={handleCancelModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {tentativeFormData && (
            <div>
              <p>
                <strong>Agent:</strong> {agents.find((a) => a._id === tentativeFormData.agent_id)?.first_name} {agents.find((a) => a._id === tentativeFormData.agent_id)?.last_name}
              </p>
              <p>
                <strong>Amount:</strong> ${tentativeFormData.amount.toFixed(2)}
              </p>
              <p>Are you sure you want to create this transaction?</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Creating...' : 'Confirm'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}
      <ToastContainer position="middle-center">
        <Toast
          show={toast.show}
          bg={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
          delay={3000}
          autohide
        >
          <Toast.Body className={toast.type === 'danger' ? 'text-white' : 'text-dark'}>
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}
