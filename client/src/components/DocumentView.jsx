import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiService } from '../services/apiService'
import { useApp } from '../contexts/AppContext'
import { Edit, Trash2, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { renderMermaidDiagrams } from '../utils/mermaidUtils'
import './DocumentView.css'

export default function DocumentView() {
  console.log('[DocumentView] Component is starting to execute...')
  
  const params = useParams()
  console.log('[DocumentView] Got params:', params)
  
  const type = params.type
  const path = params['*']
  console.log('[DocumentView] Extracted type:', type, 'path:', path)
  
  const navigate = useNavigate()
  console.log('[DocumentView] Got navigate function')
  
  const { addToHistory, navigationHistory, refreshData, setSelectedDocument } = useApp()
  console.log('[DocumentView] Got app context')
  
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [enhancedHtml, setEnhancedHtml] = useState('')

  console.log('[DocumentView] Component mounted/updated with params:', { type, path })

  // Function to calculate relative path by finding common prefix
  const calculateRelativePath = useCallback((currentPath, allPaths) => {
    if (!currentPath || !allPaths || allPaths.length === 0) return currentPath

    // Filter out null/undefined paths
    const validPaths = allPaths.filter(p => p && typeof p === 'string')
    if (validPaths.length === 0) return currentPath

    // Find the longest common prefix among all paths
    const findCommonPrefix = (paths) => {
      if (paths.length === 0) return ''
      if (paths.length === 1) return paths[0]

      // Normalize paths and split by separator
      const normalizedPaths = paths.map(p => p.replace(/\\/g, '/').split('/'))
      const minLength = Math.min(...normalizedPaths.map(p => p.length))

      let commonPrefix = []
      for (let i = 0; i < minLength; i++) {
        const segment = normalizedPaths[0][i]
        if (normalizedPaths.every(path => path[i] === segment)) {
          commonPrefix.push(segment)
        } else {
          break
        }
      }

      return commonPrefix.join('/')
    }

    const commonPrefix = findCommonPrefix(validPaths)

    if (!commonPrefix) return currentPath

    // Remove common prefix and show relative path with ../ prefix
    const normalizedCurrent = currentPath.replace(/\\/g, '/')
    const normalizedPrefix = commonPrefix + '/'

    if (normalizedCurrent.startsWith(normalizedPrefix)) {
      const relativePath = normalizedCurrent.substring(normalizedPrefix.length)
      return '../' + relativePath
    }

    return currentPath
  }, [])

  // Function to enhance HTML with file path information
  const enhanceHtmlWithFilePath = useCallback((html, filePath, allFilePaths) => {
    if (!html || !filePath) return html

    const displayPath = calculateRelativePath(filePath, allFilePaths)

    // Create a DOM parser to modify HTML
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    // Find elements that contain "Analysis Review" text
    const walker = doc.createTreeWalker(
      doc.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    )

    let node
    while (node = walker.nextNode()) {
      if (node.textContent.includes('Analysis Review')) {
        // Find the parent element (likely a paragraph or table cell)
        let parentElement = node.parentElement

        // Navigate up to find a suitable container (p, td, div)
        while (parentElement && !['P', 'TD', 'DIV', 'LI'].includes(parentElement.tagName)) {
          parentElement = parentElement.parentElement
        }

        if (parentElement) {
          // Create the file path element
          const filePathElement = doc.createElement('li')
          filePathElement.innerHTML = `<strong>Specification Path:</strong> ${displayPath}`

          // Insert after the parent element
          if (parentElement.nextSibling) {
            parentElement.parentNode.insertBefore(filePathElement, parentElement.nextSibling)
          } else {
            parentElement.parentNode.appendChild(filePathElement)
          }

          break // Only add once
        }
      }
    }

    return doc.body.innerHTML
  }, [])

  const loadDocument = useCallback(async () => {
    console.log('[DocumentView] loadDocument called with path:', path, 'type:', type)
    try {
      setLoading(true)
      setError(null)
      console.log('[DocumentView] Making API call to:', path)
      const data = await apiService.getFile(path)
      console.log('[DocumentView] API response received:', data ? 'Success' : 'No data')

      // Enhance HTML with file path information
      const enhanced = enhanceHtmlWithFilePath(data?.html, data?.filePath, data?.allFilePaths)
      setEnhancedHtml(enhanced)
      setDocument(data)

      // Set the selected document for highlighting in sidebar
      setSelectedDocument({
        type: type,
        path: path,
        id: data?.title || path // Use title or path as identifier
      })
      console.log('[DocumentView] Document loaded successfully')
    } catch (err) {
      console.error('[DocumentView] Error loading document:', err)
      setError(err.message)
      toast.error(`Failed to load document: ${err.message}`)
    } finally {
      setLoading(false)
      console.log('[DocumentView] Loading finished, setting loading to false')
    }
  }, [path, type, setSelectedDocument])

  useEffect(() => {
    loadDocument()
  }, [loadDocument])

  useEffect(() => {
    if (document?.html) {
      renderMermaidDiagrams()
    }
  }, [document?.html])

  const handleEdit = () => {
    navigate(`/edit/${type}/${path}`)
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this document? A backup will be created.')) {
      return
    }

    try {
      await apiService.deleteFile(path)
      // Success - no toast message needed
      refreshData()
      navigate('/')
    } catch (err) {
      toast.error(`Failed to delete document: ${err.message}`)
    }
  }

  const handleBack = () => {
    if (navigationHistory.length > 0) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  if (loading) {
    return (
      <div className="document-loading">
        <div className="spinner"></div>
        <p>Loading document...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="document-error">
        <p>Error loading document: {error}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="document-view">
      <div className="document-header">
        <div className="document-title-section">
          {document?.title && type !== 'template' && (
            <h1 className="document-display-title">
              {document.title} | {type === 'capability' ? 'Capability' : type === 'enabler' ? 'Enabler' : ''}
            </h1>
          )}
        </div>
        <div className="document-actions">
          <button onClick={handleBack} className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} />
            Back
          </button>
          {type === 'template' ? (
            <button onClick={handleEdit} className="btn btn-primary btn-sm">
              <Edit size={16} />
              Edit
            </button>
          ) : (
            <>
              <button onClick={handleEdit} className="btn btn-primary btn-sm">
                <Edit size={16} />
                Edit
              </button>
              <button onClick={handleDelete} className="btn btn-danger btn-sm">
                <Trash2 size={16} />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className="document-content markdown-content"
        dangerouslySetInnerHTML={{ __html: enhancedHtml || document?.html }}
      />
    </div>
  )
}