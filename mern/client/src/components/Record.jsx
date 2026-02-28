import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Record() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    region: '',
    rating: '',
    fees: '',
    sales: '',
  });
  const [isNew, setIsNew] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      setIsNew(false);
      setError('');
      try {
        const response = await fetch(
          `/agent/${params.id.toString()}`
        );
        if (!response.ok) {
          const message = `An error has occurred: ${response.statusText}`;
          console.error(message);
          setError(message);
          return;
        }
        const agent = await response.json();
        if (!agent) {
          console.warn(`Agent with id ${id} not found`);
          setError(`Agent with id ${id} not found`);
          navigate('/admin');
          return;
        }
        // Exclude the _id field from the form state
        const { _id, ...agentData } = agent;
        setForm(agentData);
      } catch (err) {
        console.error('Error fetching agent:', err);
        setError('Failed to load agent data');
      }
    }
    fetchData();
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
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Validate required fields
      if (!form.first_name || !form.last_name || !form.region || form.rating === '' || form.fees === '' || form.sales === '') {
        throw new Error('All fields are required');
      }

      // Validate numeric ranges
      const rating = parseFloat(form.rating);
      if (isNaN(rating) || rating < 0 || rating > 100) {
        throw new Error('Rating must be between 0 and 100');
      }

      const agent = { ...form };
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
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            errorMessage = result.error || result.message || errorMessage;
          } else {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
        } catch (err) {
          console.error('Error parsing response:', err);
        }
        throw new Error(errorMessage);
      }

      // Success case - only clear form and navigate on successful response
      const successMessage = isNew ? 'Agent created successfully!' : 'Agent updated successfully!';
      setSuccess(successMessage);
      setForm({ first_name: '', last_name: '', region: '', rating: '', fees: '', sales: '' });
      
      // Navigate after a brief delay to allow user to see success message
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (error) {
      console.error('A problem occurred:', error);
      setError(error.message || 'An error occurred while saving the agent');
    } finally {
      setIsLoading(false);
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
    <section className="page-card">
      <header className="page-header">
        <div>
          <p className="page-kicker">Agent Console</p>
          <h3 className="page-title">{isNew ? 'Create' : 'Update'} Agent</h3>
          <p className="page-subtitle">
            This information will be displayed publicly so be careful what you share.
          </p>
        </div>
      </header>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={onSubmit} className="form-shell">
        <div className="form-grid">
          <label className="form-field" htmlFor="first_name">
            <span className="form-label">First Name</span>
            <input
              type="text"
              name="first_name"
              id="first_name"
              className="form-input"
              placeholder="John"
              value={form.first_name}
              onChange={(e) => updateForm({ first_name: e.target.value })}
            />
          </label>

          <label className="form-field" htmlFor="last_name">
            <span className="form-label">Last Name</span>
            <input
              type="text"
              name="last_name"
              id="last_name"
              className="form-input"
              placeholder="Doe"
              value={form.last_name}
              onChange={(e) => updateForm({ last_name: e.target.value })}
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
            <span className="form-label">Rating (0-100)</span>
            <input
              type="number"
              name="rating"
              id="rating"
              className="form-input"
              placeholder="85"
              min="0"
              max="100"
              step="1"
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
          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Agent'}
          </button>
        </div>
      </form>
    </section>
  );
}

