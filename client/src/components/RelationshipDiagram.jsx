import React, { useEffect, useRef, useState, useMemo } from 'react'
import mermaid from 'mermaid'
import { useApp } from '../contexts/AppContext'
import './RelationshipDiagram.css'

export default function RelationshipDiagram() {
  const { loadDataWithDependencies, loading } = useApp()
  const mermaidRef = useRef(null)
  const [diagramId] = useState(() => `diagram-${Date.now()}`)
  const [diagramData, setDiagramData] = useState(null)
  const [diagramLoading, setDiagramLoading] = useState(true)

  // Load diagram data with dependencies
  useEffect(() => {
    const loadDiagramData = async () => {
      try {
        setDiagramLoading(true)
        const data = await loadDataWithDependencies()
        setDiagramData(data)
      } catch (error) {
        console.error('Failed to load diagram data:', error)
        setDiagramData({ capabilities: [], enablers: [], templates: [] })
      } finally {
        setDiagramLoading(false)
      }
    }

    loadDiagramData()
  }, [loadDataWithDependencies])

  // Generate Mermaid diagram syntax
  const diagramSyntax = useMemo(() => {
    if (diagramLoading || !diagramData) return null

    const { capabilities, enablers } = diagramData

    // If no capabilities or enablers, show default template diagram
    if (capabilities.length === 0 && enablers.length === 0) {
      return `
graph TB
    %% Default template showing relationship structure
    CAP1["🎯 Capability 1<br/>High-level functionality"]
    CAP2["🎯 Capability 2<br/>Another capability"]

    ENB1["⚙️ Enabler 1A<br/>Implementation detail"]
    ENB2["⚙️ Enabler 1B<br/>Implementation detail"]
    ENB3["⚙️ Enabler 2A<br/>Implementation detail"]

    %% Capability to Enabler relationships
    CAP1 --> ENB1
    CAP1 --> ENB2
    CAP2 --> ENB3

    %% Capability dependencies
    CAP1 -.-> CAP2

    %% Styling
    classDef capability fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000
    classDef enabler fill:#f3e5f5,stroke:#4a148c,stroke-width:2px,color:#000
    classDef dependency stroke:#ff9800,stroke-width:2px,stroke-dasharray: 5 5

    class CAP1,CAP2 capability
    class ENB1,ENB2,ENB3 enabler
      `
    }

    // Build diagram with actual data
    let diagram = `
graph TB
    %% Dynamic diagram showing actual capabilities and enablers
`

    // Add capabilities
    const capabilityNodes = capabilities.map((cap) => {
      const capId = (cap.id || cap.name).replace(/[^a-zA-Z0-9_]/g, '_').replace(/^[^a-zA-Z]/, 'C_') || 'UnknownCap'
      const title = cap.title || cap.name
      const system = cap.system ? `${cap.system}` : ''
      const component = cap.component ? ` | ${cap.component}` : ''
      const label = `🎯 ${title}<br/>${system}${component}`
      return {
        id: capId,
        label: label,
        originalId: cap.id,
        path: cap.path
      }
    })

    // Add enablers grouped by capability
    const enablerNodes = enablers.map((enabler) => {
      const enId = (enabler.id || enabler.name).replace(/[^a-zA-Z0-9_]/g, '_').replace(/^[^a-zA-Z]/, 'E_') || 'UnknownEnabler'
      const title = enabler.title || enabler.name
      const label = `⚙️ ${title}<br/>Status: ${enabler.status || 'Draft'}`
      return {
        id: enId,
        label: label,
        capabilityId: enabler.capabilityId,
        originalId: enabler.id,
        path: enabler.path
      }
    })

    // Add all nodes to diagram
    capabilityNodes.forEach(cap => {
      diagram += `    ${cap.id}["${cap.label}"]\n`
    })

    enablerNodes.forEach(enabler => {
      diagram += `    ${enabler.id}["${enabler.label}"]\n`
    })

    // Add capability-to-enabler relationships
    enablerNodes.forEach(enabler => {
      if (enabler.capabilityId) {
        const parentCap = capabilityNodes.find(cap => cap.originalId === enabler.capabilityId)
        if (parentCap) {
          diagram += `    ${parentCap.id} --> ${enabler.id}\n`
        }
      }
    })

    // Add capability dependency relationships
    capabilities.forEach(capability => {
      const capId = capability.id || capability.name.replace(/[^a-zA-Z0-9]/g, '')

      // Add upstream dependencies (dependencies this capability relies on)
      if (capability.upstreamDependencies && capability.upstreamDependencies.length > 0) {
        capability.upstreamDependencies.forEach(dep => {
          if (dep.id) {
            const dependencyCap = capabilityNodes.find(cap => cap.originalId === dep.id)
            if (dependencyCap) {
              diagram += `    ${dependencyCap.id} -.-> ${capId}\n`
            }
          }
        })
      }

      // Add downstream dependencies (capabilities that depend on this one)
      if (capability.downstreamDependencies && capability.downstreamDependencies.length > 0) {
        capability.downstreamDependencies.forEach(dep => {
          if (dep.id) {
            const dependentCap = capabilityNodes.find(cap => cap.originalId === dep.id)
            if (dependentCap) {
              diagram += `    ${capId} -.-> ${dependentCap.id}\n`
            }
          }
        })
      }
    })

    // Group capabilities by system for better organization
    const systemGroups = {}
    capabilityNodes.forEach(cap => {
      const capability = capabilities.find(c => (c.id || c.name.replace(/[^a-zA-Z0-9]/g, '')) === cap.id)
      const system = capability?.system || 'Unassigned'
      if (!systemGroups[system]) systemGroups[system] = []
      systemGroups[system].push(cap)
    })

    // Add subgraphs for system grouping if there are multiple systems
    const systemNames = Object.keys(systemGroups).filter(s => s !== 'Unassigned')
    if (systemNames.length > 1) {
      systemNames.forEach((systemName, index) => {
        diagram += `
    subgraph SYS${index}["🏢 ${systemName} System"]
`
        systemGroups[systemName].forEach(cap => {
          diagram += `        ${cap.id}\n`
        })
        diagram += `    end\n`
      })
    }

    // Add modern styling
    diagram += `
    %% Modern Professional Styling
    classDef capability fill:#ffffff,stroke:#3182ce,stroke-width:3px,color:#2b6cb0,font-weight:600,font-size:16px,rx:12,ry:12
    classDef enabler fill:#ffffff,stroke:#8b5cf6,stroke-width:3px,color:#6b46c1,font-weight:500,font-size:15px,rx:8,ry:8
    classDef dependency stroke:#38b2ac,stroke-width:2px,stroke-dasharray:8 4
    classDef system fill:#f0fff4,stroke:#38a169,stroke-width:2px,color:#2f855a,font-weight:bold

    ${capabilityNodes.filter(c => c.id && c.id.trim()).length > 0 ? `class ${capabilityNodes.filter(c => c.id && c.id.trim()).map(c => c.id).join(',')} capability` : ''}
    ${enablerNodes.filter(e => e.id && e.id.trim()).length > 0 ? `class ${enablerNodes.filter(e => e.id && e.id.trim()).map(e => e.id).join(',')} enabler` : ''}
`

    return diagram
  }, [diagramData, diagramLoading])

  useEffect(() => {
    if (!diagramSyntax || !mermaidRef.current) return

    const renderDiagram = async () => {
      try {
        // Initialize mermaid with beautiful modern theme
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            // Modern color palette
            primaryColor: '#ffffff',
            primaryTextColor: '#2d3748',
            primaryBorderColor: '#4299e1',
            lineColor: '#718096',

            // Capability styling (blue theme)
            secondaryColor: '#ebf8ff',
            secondaryTextColor: '#2b6cb0',
            secondaryBorderColor: '#3182ce',

            // Enabler styling (purple theme)
            tertiaryColor: '#faf5ff',
            tertiaryTextColor: '#6b46c1',
            tertiaryBorderColor: '#8b5cf6',

            // Background and container
            background: '#f7fafc',
            mainBkg: '#ffffff',

            // Node specific colors
            cScale0: '#ebf8ff',  // Light blue for capabilities
            cScale1: '#bee3f8',  // Medium blue
            cScale2: '#90cdf4',  // Darker blue

            // Dependency lines
            edgeLabelBackground: '#ffffff',
            clusterBkg: '#f7fafc',
            clusterBorder: '#e2e8f0',

            // Text and labels
            textColor: '#2d3748',
            nodeTextColor: '#2d3748',

            // Special elements
            errorBkgColor: '#fed7d7',
            errorTextColor: '#c53030'
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'linear',
            nodeSpacing: 50,
            rankSpacing: 80,
            diagramPadding: 20
          },
          fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
          fontSize: 16
        })

        // Clear previous diagram
        mermaidRef.current.innerHTML = ''

        // Render new diagram
        const { svg } = await mermaid.render(diagramId, diagramSyntax)
        mermaidRef.current.innerHTML = svg

        // Add click handlers for navigation
        const svgElement = mermaidRef.current.querySelector('svg')
        if (svgElement) {
          svgElement.addEventListener('click', handleDiagramClick)
        }

      } catch (error) {
        console.error('Error rendering relationship diagram:', error)
        mermaidRef.current.innerHTML = `
          <div class="diagram-error">
            <p>Error rendering diagram</p>
            <small>${error.message}</small>
          </div>
        `
      }
    }

    renderDiagram()

    // Cleanup
    return () => {
      const svgElement = mermaidRef.current?.querySelector('svg')
      if (svgElement) {
        svgElement.removeEventListener('click', handleDiagramClick)
      }
    }
  }, [diagramSyntax, diagramId])

  const handleDiagramClick = (event) => {
    // Find clicked node
    const clickedElement = event.target.closest('.node')
    if (!clickedElement) return

    const nodeId = clickedElement.id
    console.log('Clicked node:', nodeId)

    // TODO: Add navigation logic here
    // Could navigate to the specific capability or enabler view
  }

  if (loading || diagramLoading) {
    return (
      <div className="relationship-diagram">
        <div className="diagram-loading">
          <div className="spinner"></div>
          <p>Loading relationship diagram...</p>
        </div>
      </div>
    )
  }

  const capabilities = diagramData?.capabilities || []
  const enablers = diagramData?.enablers || []

  return (
    <div className="relationship-diagram">
      <div className="diagram-header">
        <h3>System Architecture</h3>
        <p>
          {capabilities.length === 0 && enablers.length === 0
            ? 'Template showing capability and enabler relationships'
            : `${capabilities.length} capabilities, ${enablers.length} enablers`
          }
        </p>
      </div>
      <div className="diagram-container">
        <div ref={mermaidRef} className="mermaid-diagram" />
      </div>
    </div>
  )
}