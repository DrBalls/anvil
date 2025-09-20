# Project Discovery Guide for Anvil

## Overview
This guide provides instructions for analyzing existing projects and creating structured Capabilities and Enablers within the Anvil framework. Use this when examining codebases, applications, or systems to reverse-engineer their architecture into Anvil's capability-driven format.

## Discovery Process

### Phase 1: Project Analysis
1. **Examine Project Structure**
   - Review directory structure and file organization
   - Identify main application components, modules, and services
   - Look for configuration files, documentation, and build scripts
   - Note frameworks, libraries, and technologies used

2. **Identify Core Functionality**
   - Analyze entry points (main files, startup scripts)
   - Review API endpoints, routes, or service interfaces
   - Examine data models, schemas, and database structures
   - Identify user-facing features and business logic

3. **Map Dependencies**
   - Internal component relationships
   - External service integrations
   - Database dependencies
   - Third-party library usage

### Phase 2: Capability Identification

#### What is a Capability?
A Capability represents a high-level business function or feature that delivers value to users. It's composed of multiple Enablers that work together to implement the capability.

#### Capability Discovery Rules:
- **Business Value Focus**: Each capability should represent a distinct business function
- **User-Centric**: Capabilities should be meaningful to end users or business stakeholders
- **Independence**: Capabilities should be largely self-contained with clear boundaries
- **Granularity**: Not too broad (entire application) or too narrow (single function)

#### Common Capability Patterns:
- **User Management**: Authentication, authorization, user profiles
- **Data Management**: CRUD operations for core business entities
- **Integration**: External service connections, API management
- **Reporting**: Analytics, dashboards, data visualization
- **Communication**: Notifications, messaging, alerts
- **Security**: Access control, encryption, audit logging
- **Configuration**: Settings, preferences, system configuration

### Phase 3: Enabler Identification

#### What is an Enabler?
An Enabler is a specific technical implementation that contributes to a Capability. It represents concrete functionality, components, or services.

#### Enabler Discovery Rules:
- **Technical Focus**: Enablers represent actual code components, services, or implementations
- **Capability Alignment**: Each enabler must belong to exactly one capability
- **Implementation Specific**: Maps to actual files, classes, modules, or services
- **Testable**: Should have clear inputs, outputs, and testable behavior

#### Common Enabler Patterns:
- **API Endpoints**: REST endpoints, GraphQL resolvers
- **Database Operations**: Data access layers, repositories
- **User Interface Components**: Pages, forms, components
- **Business Logic**: Services, validators, processors
- **Infrastructure**: Configuration, deployment, monitoring
- **Security Components**: Authentication handlers, authorization middleware

### Phase 4: Documentation Generation

#### For Each Capability:
1. **Identify the capability name** (business-focused, user-meaningful)
2. **Write a clear purpose statement** explaining the business value
3. **List all enablers** that implement this capability
4. **Map dependencies** to other capabilities
5. **Assess current status** based on implementation completeness

#### For Each Enabler:
1. **Identify the enabler name** (technical, implementation-focused)
2. **Link to parent capability**
3. **Define functional requirements** (what it does)
4. **Define non-functional requirements** (performance, security, etc.)
5. **Map to actual code components** (files, classes, services)

## Implementation Guidelines

### Capability Creation:
```
Name: [Business Function Name]
Purpose: [Clear business value statement]
Status: [Current implementation state]
Priority: [Business importance]
Dependencies: [Other capabilities this depends on]
```

### Enabler Creation:
```
Name: [Technical Component Name]
Capability: [Parent capability ID]
Purpose: [Technical function description]
Implementation: [Code location/component reference]
Requirements: [Functional and non-functional needs]
```

### Status Assessment:
- **In Draft**: Concept identified but not implemented
- **Ready for Analysis**: Requirements clear, ready for detailed planning
- **Ready for Design**: Analysis complete, ready for technical design
- **Ready for Implementation**: Design complete, ready for development
- **Implemented**: Fully functional and deployed

### Priority Assessment:
- **High**: Critical business function, system cannot operate without it
- **Medium**: Important feature that enhances value but system can function without it
- **Low**: Nice-to-have feature or optimization

## Discovery Templates

### Capability Discovery Template:
```markdown
# [Capability Name]

## Business Value
[What business problem does this solve? What value does it provide?]

## Current Implementation
[How is this currently implemented in the project?]

## Components Involved
[List the main code components, files, or services]

## User Impact
[How do users interact with this capability?]

## Dependencies
[What other capabilities or external services does this depend on?]
```

### Enabler Discovery Template:
```markdown
# [Enabler Name]

## Technical Purpose
[What specific technical function does this provide?]

## Code Location
[Files, classes, modules, or services that implement this]

## API/Interface
[How other components interact with this enabler]

## Data Requirements
[What data does it need? What data does it produce?]

## External Dependencies
[Libraries, services, or systems it depends on]
```

## Common Patterns and Examples

### Web Application Discovery:
1. **User Authentication Capability**
   - Login/Logout Enabler (login endpoints, session management)
   - Password Management Enabler (reset, change password)
   - User Registration Enabler (signup process, validation)

2. **Content Management Capability**
   - Content Creation Enabler (forms, editors, file upload)
   - Content Storage Enabler (database operations, file storage)
   - Content Display Enabler (rendering, formatting, search)

### API Service Discovery:
1. **Data Processing Capability**
   - Data Ingestion Enabler (input validation, parsing)
   - Data Transformation Enabler (business logic, calculations)
   - Data Output Enabler (formatting, serialization)

2. **System Integration Capability**
   - External API Client Enabler (HTTP clients, API wrappers)
   - Data Synchronization Enabler (sync logic, conflict resolution)
   - Event Processing Enabler (webhooks, message queues)

### Database Application Discovery:
1. **Data Management Capability**
   - Schema Management Enabler (migrations, structure)
   - Query Interface Enabler (ORM, query builders)
   - Data Validation Enabler (constraints, business rules)

## Quality Checklist

### Capability Quality:
- [ ] Has clear business value
- [ ] Is meaningful to stakeholders
- [ ] Has defined scope and boundaries
- [ ] Maps to user-facing functionality
- [ ] Has measurable success criteria

### Enabler Quality:
- [ ] Has specific technical purpose
- [ ] Maps to actual code components
- [ ] Has clear inputs and outputs
- [ ] Belongs to exactly one capability
- [ ] Can be independently tested

### Documentation Quality:
- [ ] Uses consistent naming conventions
- [ ] Includes all required metadata
- [ ] Has clear dependency relationships
- [ ] Status accurately reflects implementation
- [ ] Priority aligns with business importance

## Integration with Anvil

### File Naming and ID Generation Schema

#### Unique ID Format:
- **Capabilities**: `CAP-XXXXXX` (e.g., `CAP-123456`)
- **Enablers**: `ENB-XXXXXX` (e.g., `ENB-654321`)
- **Functional Requirements**: `FR-XXXXXX` (e.g., `FR-789012`)
- **Non-Functional Requirements**: `NFR-XXXXXX` (e.g., `NFR-345678`)

#### ID Generation Algorithm (Standalone):
**For projects without running Anvil server**, use this algorithm:

1. **Generate Base Number**:
   ```javascript
   function generateSemiUniqueNumber() {
     const now = Date.now();
     const timeComponent = parseInt(now.toString().slice(-4));
     const randomComponent = Math.floor(Math.random() * 100);
     const combined = timeComponent * 100 + randomComponent;
     return combined.toString().padStart(6, '0').slice(-6);
   }
   ```

2. **Check for Collisions**:
   - Scan all `.md` files in the project for existing IDs
   - Look for patterns like `**ID**: CAP-123456` or `**ID**: ENB-654321`
   - If collision found, increment by 1 and check again

3. **Collision Detection Pattern**:
   ```javascript
   function findExistingIds(prefix) {
     // Search all markdown files for: **ID**: {prefix}-XXXXXX
     // Return array of found numeric IDs
   }

   function generateUniqueId(prefix) {
     const existingIds = findExistingIds(prefix);
     let attempts = 0;

     while (attempts < 100) {
       const newNumber = generateSemiUniqueNumber();
       const newId = `${prefix}-${newNumber}`;

       if (!existingIds.includes(newId)) {
         return newId;
       }
       attempts++;
       // Add small delay for different timestamp
     }

     // Fallback: sequential numbering from 100000
     let sequentialNum = 100000;
     while (existingIds.includes(`${prefix}-${sequentialNum}`)) {
       sequentialNum++;
     }
     return `${prefix}-${sequentialNum}`;
   }
   ```

4. **Usage Examples**:
   - `generateUniqueId('CAP')` → `CAP-123456`
   - `generateUniqueId('ENB')` → `ENB-654321`

#### File Naming Convention:
- **Capabilities**: `{numeric-id}-capability.md` (e.g., `123456-capability.md`)
- **Enablers**: `{numeric-id}-enabler.md` (e.g., `654321-enabler.md`)

**Important**: Do NOT use prefixes like `cap-` or `enb-` in filenames. The numeric ID extracted from the full ID (removing `CAP-` or `ENB-` prefix) is used directly.

#### File Placement Strategy for Claude Code:

**Standalone Project Discovery (No Anvil Server):**

1. **Create specifications/ Directory**:
   - Always create a `specifications/` folder relative to Discovery.md location
   - If Discovery.md is at project root: `./specifications/`
   - If Discovery.md is in subfolder: `./specifications/` relative to Discovery.md

2. **For Capabilities**:
   - Place in the `specifications/` folder
   - Filename format: `{numeric-id}-capability.md`
   - Example: `./specifications/123456-capability.md`

3. **For Enablers**:
   - **Primary Rule**: Always place enablers in same directory as parent capability
   - **Discovery Method**: Scan specifications/ folder for capability file with matching ID
   - **Fallback**: If parent capability not found, place in specifications/ folder
   - Filename format: `{numeric-id}-enabler.md`

4. **Directory Structure Example**:
   ```
   project-root/
   ├── Discovery.md
   ├── specifications/
   │   ├── 123456-capability.md        # User Management Capability
   │   ├── 654321-enabler.md          # Login System Enabler (child of 123456)
   │   ├── 789012-enabler.md          # Password Reset Enabler (child of 123456)
   │   ├── 345678-capability.md       # Data Processing Capability
   │   └── 901234-enabler.md          # Data Validation Enabler (child of 345678)
   ```

5. **File Location Algorithm**:
   ```javascript
   function getCapabilityFilePath(capabilityId, discoveryMdPath) {
     const discoveryDir = path.dirname(discoveryMdPath);
     const specificationsDir = path.join(discoveryDir, 'specifications');
     const numericId = capabilityId.replace('CAP-', '');
     return path.join(specificationsDir, `${numericId}-capability.md`);
   }

   function getEnablerFilePath(enablerId, capabilityId, discoveryMdPath) {
     const capabilityPath = getCapabilityFilePath(capabilityId, discoveryMdPath);
     const capabilityDir = path.dirname(capabilityPath);
     const numericId = enablerId.replace('ENB-', '');
     return path.join(capabilityDir, `${numericId}-enabler.md`);
   }
   ```

### Using Templates:
1. Start with capability-template.md for each identified capability
2. Use enabler-template.md for each identified enabler
3. Fill in discovered information following template structure
4. Ensure all metadata fields are completed accurately
5. **Critical**: Use proper ID generation and filename conventions

### Workflow Integration:
1. Create capabilities first to establish high-level structure
2. Create enablers and link them to parent capabilities using proper IDs
3. Place enablers in same directory as their parent capability
4. Update capability enabler tables with discovered enabler IDs
5. Review and validate all relationships and dependencies
6. Assess implementation status and set development priorities

### API Integration for Claude Code:
When creating documents programmatically through Anvil's API:

```javascript
// For creating a capability
POST /api/discovery/create
{
  "type": "capability",
  "documentData": {
    "id": "CAP-123456",  // Auto-generated unique ID
    "name": "User Management",
    // ... other fields
  }
}

// For creating an enabler with capability context
POST /api/discovery/create
{
  "type": "enabler",
  "documentData": {
    "id": "ENB-654321",  // Auto-generated unique ID
    "name": "Login System",
    "capabilityId": "CAP-123456"  // Link to parent capability
  },
  "context": {
    "parentCapabilityPath": "/path/to/123456-capability.md"  // Optional: explicit path
  }
}
```

### Standalone Discovery Workflow (No Anvil Server):

**Step 1: Project Analysis and ID Generation**
1. Read and analyze the project structure following the Discovery Guide
2. For each capability identified:
   - Generate unique ID using `generateUniqueId('CAP')`
   - Check for collisions by scanning existing markdown files
   - Create capability document using numeric filename format

3. For each enabler identified:
   - Generate unique ID using `generateUniqueId('ENB')`
   - Link to parent capability via `capabilityId` metadata
   - Place in same directory as parent capability

**Step 2: File Creation Process**
1. Create `specifications/` directory relative to Discovery.md
2. Create capability files first: `{numeric-id}-capability.md`
3. Create enabler files in same directory: `{numeric-id}-enabler.md`
4. Ensure proper metadata relationships between capabilities and enablers

**Step 3: Document Templates**
Use the Anvil template structure for consistency:

**Capability Template Structure:**
```markdown
# [Capability Name]

## Metadata
- **Type**: Capability
- **ID**: CAP-123456
- **Name**: [Business Function Name]
- **Status**: [Current State]
- **Approval**: Not Approved
- **Priority**: [High/Medium/Low]
- **Owner**: [Team/Person]

## Purpose
[Clear business value statement]

## Enablers
| ID | Name | Status | Priority |
|----|----|-----|---------|
| ENB-654321 | [Enabler Name] | [Status] | [Priority] |

[Rest of capability template...]
```

**Enabler Template Structure:**
```markdown
# [Enabler Name]

## Metadata
- **Type**: Enabler
- **ID**: ENB-654321
- **Name**: [Technical Component Name]
- **Capability ID**: CAP-123456
- **Status**: [Current State]
- **Approval**: Not Approved
- **Priority**: [High/Medium/Low]

## Purpose
[Technical function description]

## Requirements
### Functional Requirements
| ID | Requirement | Status | Priority |
|----|------------|--------|----------|
| FR-789012 | [Requirement Description] | [Status] | [Priority] |

[Rest of enabler template...]
```

### Critical Rules for Claude Code:

**For Standalone Discovery (No Server):**
1. **Scan for existing IDs** - Always check all markdown files for ID collisions before creating new ones
2. **Use numeric filename format** - Extract numeric part from full ID (remove CAP- or ENB- prefix)
3. **Create specifications/ directory** - Always relative to Discovery.md location
4. **Group enablers with capabilities** - Place enablers in same directory as parent capability
5. **Maintain relationships** - Always specify capabilityId in enabler metadata
6. **Follow collision detection** - Use provided algorithm to ensure unique IDs
7. **Create directory structure** - Ensure specifications/ folder exists before creating files

**For Anvil Server Integration:**
1. **Never hardcode IDs** - Always use the server's ID generation system
2. **Always use numeric filename format** - Extract numeric part from full ID (remove CAP- or ENB- prefix)
3. **Group enablers with capabilities** - Place enablers in same directory as parent capability
4. **Check for collisions** - Server automatically prevents duplicate IDs across project
5. **Maintain relationships** - Always specify capabilityId when creating enablers

### Continuous Discovery:
- Update documentation as project evolves
- Regular reviews to identify new capabilities/enablers
- Refactor when capabilities become too complex
- Split enablers when they become too broad
- Maintain consistent ID and filename conventions

This discovery process ensures that existing projects can be systematically analyzed and documented within Anvil's capability-driven framework, providing clear visibility into system architecture and enabling better planning for future development.