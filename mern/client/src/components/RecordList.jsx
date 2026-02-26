import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Agent = (props) => (
  <tr className="table-row">
    <td className="table-cell">{props.agent.name}</td>
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
  const [agents, setAgents] = useState([]);

  // This method fetches the agents from the database.
  useEffect(() => {
    async function getAgents() {
      const response = await fetch(`/agent/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const agents = await response.json();
      setAgents(agents);
    }
    getAgents();
  }, []);

  // This method will delete an agent
  async function deleteAgent(id) {
    await fetch(`/agent/${id}`, {
      method: 'DELETE',
    });
    const newAgents = agents.filter((el) => el._id !== id);
    setAgents(newAgents);
  }

  // This method will map out the agents on the table
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
