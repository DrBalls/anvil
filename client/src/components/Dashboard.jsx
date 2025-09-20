import React from 'react'
import { useApp } from '../contexts/AppContext'
import { FileText, Plus, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import RelationshipDiagram from './RelationshipDiagram'
import './Dashboard.css'

export default function Dashboard() {
  const { capabilities, enablers, loading, error } = useApp()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading documents...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>Error loading documents: {error}</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Document Dashboard</h2>
        <p>Manage your capabilities and enablers</p>
      </div>

      <RelationshipDiagram />

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{capabilities.length}</div>
            <div className="stat-label">Capabilities</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{enablers.length}</div>
            <div className="stat-label">Enablers</div>
          </div>
        </div>

      </div>

      <div className="dashboard-actions">
        <h3>Quick Actions</h3>
        <div className="action-cards">
          <div
            className="action-card"
            onClick={() => navigate('/create/capability')}
          >
            <Plus size={32} />
            <h4>Create Capability</h4>
            <p>Define a new high-level technical capability</p>
          </div>

          <div
            className="action-card"
            onClick={() => navigate('/create/enabler')}
          >
            <Plus size={32} />
            <h4>Create Enabler</h4>
            <p>Add implementation details for a capability</p>
          </div>

        </div>
      </div>

      <div className="dashboard-recent">
        <h3>Recent Documents</h3>
        <div className="recent-list">
          {[...capabilities, ...enablers].slice(0, 5).map((doc) => (
            <div 
              key={doc.path}
              className="recent-item"
              onClick={() => navigate(`/view/${doc.type}/${doc.path}`)}
            >
              <FileText size={16} />
              <div className="recent-content">
                <div className="recent-title">{doc.title || doc.name}</div>
                <div className="recent-type">{doc.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}