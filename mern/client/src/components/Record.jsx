import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Record() {
  const [form, setForm] = useState({
    name: '',
    region: '',
    rating: '',
    fees: '',
    sales: '',
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      setIsNew(false);
      const response = await fetch(
        `/agent/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const agent = await response.json();
      if (!agent) {
        console.warn(`Agent with id ${id} not found`);
        navigate('/admin');
        return;
      }
      setForm(agent);
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    const agent = { ...form };
    try {
      let response;
      if (isNew) {
        // if we are adding a new agent we will POST to /agent.
        response = await fetch('/agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(agent),
        });
      } else {
        // if we are updating an agent we will PATCH to /agent/:id.
        response = await fetch(`/agent/${params.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(agent),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    } finally {
      setForm({ name: '', region: '', rating: '', fees: '', sales: '' });
      navigate('/admin');
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
    <section className="page-card">
      <header className="page-header">
        <div>
          <p className="page-kicker">Agent Console</p>
          <h3 className="page-title">Create / Update Agent</h3>
          <p className="page-subtitle">
            This information will be displayed publicly so be careful what you share.
          </p>
        </div>
      </header>
      <form onSubmit={onSubmit} className="form-shell">
        <div className="form-grid">
          <label className="form-field" htmlFor="name">
            <span className="form-label">Name</span>
            <input
              type="text"
              name="name"
              id="name"
              className="form-input"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
            />
          </label>

          <label className="form-field" htmlFor="region">
            <span className="form-label">Region</span>
            <select
              name="region"
              id="region"
              className="form-select"
              value={form.region}
              onChange={(e) => updateForm({ region: e.target.value })}
            >
              <option value="">Select a region</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </select>
          </label>

          <label className="form-field" htmlFor="rating">
            <span className="form-label">Rating (0-5)</span>
            <input
              type="number"
              name="rating"
              id="rating"
              className="form-input"
              placeholder="4.5"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={(e) => updateForm({ rating: parseFloat(e.target.value) || '' })}
            />
          </label>

          <label className="form-field" htmlFor="fees">
            <span className="form-label">Fees ($)</span>
            <input
              type="number"
              name="fees"
              id="fees"
              className="form-input"
              placeholder="5000.00"
              step="0.01"
              value={form.fees}
              onChange={(e) =>
                updateForm({ fees: Math.round(parseFloat(e.target.value) * 100) / 100 || '' })
              }
            />
          </label>

          <label className="form-field" htmlFor="sales">
            <span className="form-label">Sales ($)</span>
            <input
              type="number"
              name="sales"
              id="sales"
              className="form-input"
              placeholder="50000.00"
              step="0.01"
              value={form.sales}
              onChange={(e) =>
                updateForm({ sales: Math.round(parseFloat(e.target.value) * 100) / 100 || '' })
              }
            />
          </label>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">
            Save Agent
          </button>
        </div>
      </form>
    </section>
  );
}

