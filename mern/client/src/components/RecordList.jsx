// RecordList Component - Displays all agents in a table
// Allows users to view, edit, and delete agent records
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
        <Link className="btn btn-outline btn-sm" to={`/admin/edit/${props.agent._id}`}>
          Edit
        </Link>
        <button
          className="btn btn-danger btn-sm"
          type="button"
          onClick={() => {
            props.deleteAgent(props.agent._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function RecordList() {
  // State to store list of agents fetched from database
  const [agents, setAgents] = useState([]);

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

  // Deletes an agent from database and updates the UI
  async function deleteAgent(id) {
    await fetch(`/agent/${id}`, {
      method: 'DELETE', // Send DELETE request to backend
    });
    // Remove deleted agent from UI
    const newAgents = agents.filter((el) => el._id !== id);
    setAgents(newAgents);
  }

  // Maps agents array to Agent row components
  function agentList() {
    return agents.map((agent) => {
      return (
        <Agent
          agent={agent}
          deleteAgent={() => deleteAgent(agent._id)}
          key={agent._id}
        />
      );
    });
  }

  // This following section will display the table with the agents.
  return (
    <section className="page-card">
      <header className="page-header">
        <div>
          <p className="page-kicker">Agent Directory</p>
          <h3 className="page-title">Agents</h3>
        </div>
      </header>
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
  );
}
