import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Eye, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../services/apiService';
import './Plan.css';

export default function Plan() {
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      setLoading(true);
      // Try to load SOFTWARE_DEVELOPMENT_PLAN.md from the root
      const response = await apiService.getFile('SOFTWARE_DEVELOPMENT_PLAN.md');
      if (response.content) {
        setContent(response.content);
        setOriginalContent(response.content);
      }
    } catch (error) {
      console.error('Error loading plan:', error);
      toast.error('Failed to load Software Development Plan');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiService.saveFile('SOFTWARE_DEVELOPMENT_PLAN.md', content);
      setOriginalContent(content);
      toast.success('Software Development Plan saved successfully');
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Failed to save Software Development Plan');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setContent(originalContent);
    toast.info('Changes reverted');
  };

  const hasChanges = content !== originalContent;

  if (loading) {
    return (
      <div className="plan-container">
        <div className="plan-loading">
          <div className="loading-spinner"></div>
          <p>Loading Software Development Plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="plan-container">
      <div className="plan-header">
        <div className="plan-title">
          <h1>Software Development Plan</h1>
          <p>Comprehensive guide for discovering, analyzing, designing, implementing, testing, refactoring, and retiring software applications</p>
        </div>
        <div className="plan-actions">
          <button
            className={`plan-mode-button ${!isEditing ? 'active' : ''}`}
            onClick={() => setIsEditing(false)}
            title="Preview Mode"
          >
            <Eye size={16} />
            Preview
          </button>
          <button
            className={`plan-mode-button ${isEditing ? 'active' : ''}`}
            onClick={() => setIsEditing(true)}
            title="Edit Mode"
          >
            <Edit3 size={16} />
            Edit
          </button>
          {isEditing && (
            <>
              <button
                className="plan-reset-button"
                onClick={handleReset}
                disabled={!hasChanges}
                title="Reset Changes"
              >
                <RotateCcw size={16} />
                Reset
              </button>
              <button
                className="plan-save-button"
                onClick={handleSave}
                disabled={!hasChanges || saving}
                title="Save Changes"
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="plan-content">
        {isEditing ? (
          <div className="plan-editor">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="plan-textarea"
              placeholder="Enter your Software Development Plan content..."
              spellCheck={false}
            />
          </div>
        ) : (
          <div className="plan-preview">
            <div
              className="markdown-content"
              dangerouslySetInnerHTML={{
                __html: content ? formatMarkdownForDisplay(content) : '<p>No content available</p>'
              }}
            />
          </div>
        )}
      </div>

      {hasChanges && (
        <div className="plan-changes-indicator">
          <p>You have unsaved changes</p>
        </div>
      )}
    </div>
  );
}

// Simple markdown formatter for display (basic implementation)
function formatMarkdownForDisplay(markdown) {
  return markdown
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[uh]|<li|<pre)(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '');
}