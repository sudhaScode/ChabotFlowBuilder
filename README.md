# ChatFlow Builder
ChatFlow Builder is a web application for visually designing chatbot flows using React Flow.

## Table of Contents
- Overview
- Features
- Installation
- Usage
- File Structure

### Overview
ChatFlow Builder allows users to create and visualize chatbot flows through a user-friendly interface. It utilizes React Flow for the graphical representation of nodes and edges, allowing drag-and-drop functionality to add nodes and connect them with edges.
<br>

`FlowCanvas:` Main component for the chatbot flow canvas.

### Features
- Drag and drop nodes from the sidebar onto the canvas.
- Connect nodes with edges to define the flow.
- Delete nodes and edges by double-clicking on them.
- Save the current flow state to sessionStorage.
- Responsive design for various screen sizes.


### Installation
To run the ChatFlow Builder locally, follow these steps:

**Clone the repository:**

```
git clone https://github.com/sudhaScode/ChabotFlowBuilder.git
cd ChabotFlowBuilder

```
**Install dependencies:**
```
npm install

```
**Start the development server:**
```
npm start or npm start

```
This will start the application on http://localhost:3000.

### Usage
**Adding Nodes** <br>
Drag nodes from the sidebar on the left (SideBar) onto the main canvas (FlowCanvas).

**Connecting Nodes**<br>
Click and drag from one node to another on the canvas to create edges between nodes.

**Deleting Edges** <br>
Double-click on an edge to delete it.

**Saving Flow** <br>
Click on the "Save Changes" button in the top bar (FlowCanvas) to save the current flow state.
The application validates if there are unconnected nodes or empty target handles before saving.

### File Structure
The project structure is organized as follows:

├── public/
├── src/
│   ├── components/flowbuilder
│   │   ├── FlowCanvas.jsx
│   │   ├── SideBar.jsx
│   │   ├── UpdateNode.jsx
│   │   ├── Notification.jsx
|   |   ├── TextNode.jsx
│   ├── store/
│   │   ├── Constants.jsx
│   ├── styles/
│   │   ├── FlowCanvas.css
│   │   ├── SideBar.css
│   │   ├── TextNode.css
│   │   ├── UpdatedNode.css
├── README.md
├── package.json
└── ...
