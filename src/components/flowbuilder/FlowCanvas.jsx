import { useState, useRef, useCallback, useEffect } from 'react'
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  getConnectedEdges,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css'
import SideBar from './SideBar'
import UpdateNode from './UpdateNode'
import Notification from './Notification'
import './styles/FlowCanvas.css'
import { nodeTypes } from './store/Constants';


let id = JSON.parse(sessionStorage.getItem("nodes"))?.length+1 || 1;
function FlowCanvas() {
  // Get the locally saved data
 
  const reactFlowWrapper = useRef(null)

  // State variables for nodes, edges, and flow instance
  const [nodes, setNodes, onNodesChange ] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [nodeSelected, setNodeSelected] = useState(false)
  const [changeNode, setChangeNode] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null) // custom error message notification
  const [messageColor, setMessageColor] = useState(null) // custom color for error & success notification
  const [targetHandles, setTargetHandles] = useState([]) // keep track of target handles when new edges are created between nodes

  
  //Chatbot flow Builder Features
  const nodeFeatures= [{feature:"Message"}]
  
  // Functions for node selection and update
  const update = useCallback((event, node) => {
    setChangeNode(node)
    setNodeSelected(true)
  }, []);

  // Functions for edge creation and limitations
  const handleConnect = useCallback((params) => {
    let sourceHandles = [];
    let targetHandles = [];

    // Check if source handle is already connected
    if (sourceHandles.includes(params.source)) return;
    sourceHandles = sourceHandles.concat(params.source);

    // Add edge with arrowhead marker
    setEdges((prevEdges) => addEdge({ ...params, markerEnd: { type: 'arrowclosed' } }, prevEdges));

    // Track connected target handles
    if (targetHandles.includes(params.target)) return;
    targetHandles = targetHandles.concat(params.target);
    setTargetHandles(targetHandles);
  }, [setEdges]);

  // Node deletion function feature tom be added
  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId))
    const connectedEdges = getConnectedEdges(edges, nodeId)
    setEdges((eds) => eds.filter((edge) => !connectedEdges.includes(edge)))
    setTargetHandles([]) // Reset target handle tracking on deletion
  }, [edges, setEdges, setNodes])

  // Function to handle edge click for deletion
  // Function to handle edge deletion on double click
  const handleEdgeDoubleClick = useCallback((event, edge) => {
    deleteEdge(edge);
  }, []);

  // Function to confirm and delete selected edge
  const deleteEdge = useCallback((edge) => {
    if (edge) {
      //console.log(edge)
      //console.log(targetHandles.includes(edge.target))
      setTargetHandles(prevState=>prevState.filter(target=> target !== edge.target));
      setEdges((prevState) => prevState.filter((ed) => ed.id !== edge.id), () => {
        // Callback executed after filter operation
       // setSelectedEdgeId(null); // Reset selected edge after deletion
       });
    }
  }, [setEdges])


   // adjusting the canvas 
   
  const handleDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])


  const hanldeDrop = useCallback(
    (event) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData('application/reactflow')

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })
      
      //const updatedId = id + 1;
     // console.log(updatedId)
      //setId(updatedId);
      // creating a new node
      const newerNode = {
        id: `node_${id}`,
        type: 'node',
        position,
        data: { heading: 'Send Message', label: `Test message ${id}` },
      }
      id++;
      // the main state which makes the nodes
      setNodes((nds) => nds.concat(newerNode))
    },
    [reactFlowInstance, setNodes]
  )

  // to hide the react flow attribution for personal/hobby projects
  let proOptions = { hideAttribution: true }

  // save node flow on click of save changes button using below function & validating for not more than one node target handles are unconnected
  const saveFlow = () => {
    const currentNodes = reactFlowInstance.getNodes();
    const currentEdges = reactFlowInstance.getEdges();

   // Validate flow before saving
   // Save button press will show an error if there are more than one Nodes have no edges 
  //and more than one Node has empty target handles
   const unconnectedNodes = currentNodes.filter((node) => !currentEdges.some((edge) => edge.source === node.id));
   if (unconnectedNodes.length > 1 || targetHandles.length > 1) {
    setErrorMessage('Cannot save Flow')
    setMessageColor('red-message')
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
   }
   else{
    sessionStorage.setItem("nodes", JSON.stringify(currentNodes));
      sessionStorage.setItem("edges", JSON.stringify(currentEdges));
      sessionStorage.setItem("targets", JSON.stringify(targetHandles));
      setErrorMessage('Saved Flow')
      setMessageColor('green-message')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

   }
  }

   // Effect to fetch initial state from sessionStorage on component mount
   useEffect(() => {
    const initialNodesData = JSON.parse(sessionStorage.getItem("nodes")) || [];
    const initialEdgesData = JSON.parse(sessionStorage.getItem("edges")) || [];
    const initialTargetsData = JSON.parse(sessionStorage.getItem("targets")) || [];

    setNodes(initialNodesData);
    setEdges(initialEdgesData);
    setTargetHandles(initialTargetsData);
  }, [setNodes, setEdges, setReactFlowInstance]);

  return (
    <div className="appflow">
      {/* Top bar */}
       <div className="topbar">
           <h3 className='appflow-logo'>Ë-ChatFlow Ƀuilder</h3>
            {/* Error message notification */}
           {errorMessage  &&  <Notification
              errorMessage={errorMessage}
              messageColor={messageColor}
            />}
             <div className='save-changes'>
              <button onClick={saveFlow}>Save Changes</button>
            </div>
          </div>
      {/* React Flow canvas area */}
      <ReactFlowProvider>
      <div className='flow-body'>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}           
            onConnect={handleConnect}
            onDrop={hanldeDrop}
            onDragOver={handleDragOver}
            fitView
            proOptions={proOptions}
            //nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={update}
            onEdgeDoubleClick={handleEdgeDoubleClick}
            nodeTypes={nodeTypes}
          >
            <Controls />
          </ReactFlow>
        </div>
          {/* Sidebar */}
       <aside>
       {nodeSelected ? (
          <div className="rightbar">
            <UpdateNode
              selectedNode={changeNode}
              setNodeSelected={setNodeSelected}
              setNodes={setNodes}
            />
          </div>
        ) : (
          <div className="rightbar">
            <SideBar nodeTypes={nodeFeatures} />
          </div>
        )}
       </aside>
       </div>
        {/* Instruction for deleting edges */}
       <div className='delete-edge'>Double click on edge to delete it</div>
      </ReactFlowProvider>
    </div>
  )
}
export default FlowCanvas;