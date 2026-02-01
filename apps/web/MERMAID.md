# Mermaid Diagrams in Courses

Your course platform now supports Mermaid.js diagrams! You can embed flowcharts, sequence diagrams, Gantt charts, and more directly in your course content.

## How to Use

Simply wrap your Mermaid diagram code in a code block with the `mermaid` language tag:

````markdown
```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
```
````

## Example Diagrams

### Flowchart
````markdown
```mermaid
graph LR
    A[Input] --> B[Process]
    B --> C{Decision}
    C -->|Yes| D[Output 1]
    C -->|No| E[Output 2]
```
````

### Sequence Diagram
````markdown
```mermaid
sequenceDiagram
    participant User
    participant API
    participant Database
    User->>API: Request Data
    API->>Database: Query
    Database-->>API: Results
    API-->>User: Response
```
````

### State Diagram
````markdown
```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Review
    Review --> Published
    Review --> Draft
    Published --> [*]
```
````

### Pie Chart
````markdown
```mermaid
pie title Learning Methods
    "Reading" : 40
    "Practice" : 35
    "Discussion" : 15
    "Teaching Others" : 10
```
````

### Gantt Chart
````markdown
```mermaid
gantt
    title Course Timeline
    dateFormat  YYYY-MM-DD
    section Module 1
    Introduction       :a1, 2024-01-01, 3d
    Core Concepts     :a2, after a1, 5d
    section Module 2
    Advanced Topics   :a3, after a2, 7d
```
````

### Class Diagram
````markdown
```mermaid
classDiagram
    class Course {
        +String title
        +String description
        +generateCourse()
        +trackProgress()
    }
    class Module {
        +String name
        +Lesson[] lessons
    }
    Course "1" --> "*" Module
```
````

## Use Cases

1. **Process Flows**: Show step-by-step procedures
2. **System Architecture**: Explain how components interact
3. **Learning Paths**: Visualize decision trees
4. **Project Timelines**: Display course schedules
5. **Relationships**: Show how concepts connect

## Tips

- Keep diagrams simple and focused
- Use clear, descriptive labels
- Choose the right diagram type for your content
- Test your diagram syntax before deploying

## Resources

- [Mermaid.js Official Docs](https://mermaid.js.org/)
- [Mermaid Live Editor](https://mermaid.live/) - Test your diagrams
- [Diagram Syntax Reference](https://mermaid.js.org/intro/)
