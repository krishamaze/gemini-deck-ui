# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Enhanced `.gitignore` with comprehensive security patterns
- Created `.env.example` template for environment variables
- Created `docs/API_CONTRACT.md` - API specification
- Created `docs/SHARED_CONTEXT.md` - Inter-agent shared memory
- Created `docs/AGENT_WORKFLOW.md` - Collaboration guide

### Changed
- None

### Fixed
- None

### Security
- Added patterns to prevent commit of `.env` files
- Added patterns to prevent commit of secret/key files

---

## [1.0.0] - 2026-02-03

### Added
- Initial frontend implementation
- `ChatConsole` - WebSocket chat interface with markdown support
- `VirtualDisplay` - noVNC remote display viewer
- `MemoryStream` - Memory/thoughts monitor with polling
- `AgentPlanner` - Autonomous agent planner UI
- 53 reusable UI components (shadcn-style design system)
- Cyberpunk dark theme with glow effects
- Responsive sidebar navigation

### Technical
- Next.js 15.5.7 with App Router
- React 19
- Tailwind CSS 4
- Zustand for state management
- TypeScript 5

---

## How to Update This File

### For Frontend Agent (Orchids):
1. Add changes under `[Unreleased]`
2. Categorize: Added, Changed, Fixed, Deprecated, Removed, Security
3. Commit and push to GitHub

### For Backend Agent:
1. Pull latest from GitHub
2. Add backend changes under `[Unreleased]`
3. If backend change affects frontend, note it clearly
4. Commit and push

### For Releases:
1. Move `[Unreleased]` items to new version section
2. Add release date
3. Tag the commit: `git tag v1.0.0`
