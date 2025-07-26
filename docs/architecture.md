# Architecture Notes

```mermaid
flowchart TD
    A[Astro Site] --> B[Layout]
    B --> C[Hero Component]
    B --> D[ComplianceReport]
    B --> E[OverallRating]
    B --> F[SummaryTable]
    B --> G[ComplianceAnalysis]
    B --> H[EdDiscussion]
    B --> I[QASection]
    subgraph Audio
        J[soundEffects.js] --> K[Pizzicato.js]
    end
    C --> J
    D --> J
    E --> J
    F --> J
    G --> J
    H --> J
    I --> J
```

This diagram shows how the main layout orchestrates each section of the page. The `soundEffects` module provides audio feedback to most components and relies on `Pizzicato.js` for Web Audio API primitives.
