// RecordList Component - Displays all agents in a table
// Allows users to view, edit, and delete agent records
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Toast, ToastContainer } from 'react-bootstrap';

// Agent Row Component - Renders a single agent as a table row
const Agent = (props) => (
  <tr className="table-row">
    <td className="table-cell">{props.agent.first_name} {props.agent.last_name}</td>
    <td className="table-cell">{props.agent.region}</td>
    <td className="table-cell">{props.agent.rating}</td>
    <td className="table-cell">
      ${typeof props.agent.fees === 'number' ? props.agent.fees.toFixed(2) : props.agent.fees}
    </td>
    <td className="table-cell">
      ${typeof props.agent.sales === 'number' ? props.agent.sales.toFixed(2) : props.agent.sales}
    </td>
    <td className="table-cell">
      <div className="table-actions">
        <button
          className="btn btn-outline btn-sm"
          type="button"
          onClick={() => props.onEditClick(props.agent)}
        >
          Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          type="button"
          onClick={() => props.onDeleteClick(props.agent)}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function RecordList() {
  const navigate = useNavigate();
  // State to store list of agents fetched from database
  const [agents, setAgents] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch agents from database when component loads
  useEffect(() => {
    async function getAgents() {
      try {
        const response = await fetch(`/agent/`); // Fetch all agents from backend
        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          console.error(message);
          return;
        }
        const agents = await response.json();
        setAgents(agents); // Update state with fetched agents
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      }
    }
    getAgents();
  }, []); // Empty dependency array means fetch only once on mount

  // Handle edit button click - show modal
  function handleEditClick(agent) {
    setSelectedAgent(agent);
    setShowEditModal(true);
  }

  // Handle delete button click - show modal
  function handleDeleteClick(agent) {
    setSelectedAgent(agent);
    setShowDeleteModal(true);
  }

  // Confirm edit - navigate to edit page
  function handleConfirmEdit() {
    setShowEditModal(false);
    navigate(`/admin/edit/${selectedAgent._id}`);
  }

  // Confirm delete - delete agent from database
  async function handleConfirmDelete() {
    setShowDeleteModal(false);
    try {
      const response = await fetch(`/agent/${selectedAgent._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete agent');
      }

      // Remove deleted agent from UI
      const newAgents = agents.filter((el) => el._id !== selectedAgent._id);
      setAgents(newAgents);
      setToastMessage('Agent deleted successfully.');
      setShowSuccessToast(true);
    } catch (error) {
      console.error('Delete error:', error);
      setToastMessage('Agent Not Deleted Successfully.');
      setShowErrorToast(true);
    }
  }

  // Cancel edit
  function handleCancelEdit() {
    setShowEditModal(false);
    setSelectedAgent(null);
  }

  // Cancel delete
  function handleCancelDelete() {
    setShowDeleteModal(false);
    setSelectedAgent(null);
  }

  // Maps agents array to Agent row components
  function agentList() {
    return agents.map((agent) => {
      return (
        <Agent
          agent={agent}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          key={agent._id}
        />
      );
    });
  }

  // This following section will display the table with the agents.
  return (
    <>
      <ToastContainer position="middle-center" className="p-3">
        <Toast 
          onClose={() => setShowSuccessToast(false)} 
          show={showSuccessToast} 
          delay={3000} 
          autohide
          bg="success"
        >
          <Toast.Body className="text-white fw-bold">
            {toastMessage}
          </Toast.Body>
        </Toast>

        <Toast 
          onClose={() => setShowErrorToast(false)} 
          show={showErrorToast} 
          delay={3000} 
          autohide
          bg="danger"
        >
          <Toast.Body className="text-white fw-bold">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Modal show={showEditModal} onHide={handleCancelEdit} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to edit {selectedAgent?.first_name} {selectedAgent?.last_name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelEdit}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmEdit}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {selectedAgent?.first_name} {selectedAgent?.last_name}? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <section className="page-card">
      <header className="page-header">
        <div>
          <p className="page-kicker">Agent Directory</p>
          <h3 className="page-title">Agents</h3>
        </div>
      </header>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '1.5rem' }}>
        <Link className="btn btn-primary" to="/admin/create">
          Create Agent
        </Link>
      </div>
      <div className="table-shell">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th className="table-head">Name</th>
                <th className="table-head">Region</th>
                <th className="table-head">Rating</th>
                <th className="table-head">Fees</th>
                <th className="table-head">Sales</th>
                <th className="table-head">Action</th>
              </tr>
            </thead>
            <tbody>{agentList()}</tbody>
          </table>
        </div>
      </div>
    </section>
    </>
  );
}
