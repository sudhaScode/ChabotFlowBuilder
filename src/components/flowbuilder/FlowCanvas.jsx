import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
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
//import { useSnackbar } from 'notistack';
import { nodeTypes } from './store/Constants';
import { initialNodes, initialEdges, initialTagets } from './store/Constants'


let id = JSON.parse(sessionStorage.getItem("nodes"))?.length+1 || 1;
function FlowCanvas() {
  // Get the locally saved data
 
  const reactFlowWrapper = useRef(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialEdges?JSON.parse(initialNodes):[])
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges?JSON.parse(initialEdges):[])
  const [reactFlowInstance, setReactFlowInstance] = useState(initialTagets?JSON.parse(initialTagets):[])
  const [nodeSelected, setNodeSelected] = useState(false)
  const [changeNode, setChangeNode] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null) // custom error message notification
  const [messageColor, setMessageColor] = useState(null) // custom color for error & success notification
  const [targetHandles, setTargetHandles] = useState([]) // keep track of target handles when new edges are created between nodes
  //const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  //const [id, setId] = useState(JSON.parse(initialNodes)?.length || 0);
  
  //Chatbot flow Builder Features
  const nodeFeatures= [{feature:"Message"}]
  
  // Functions for node selection and update
  const update = useCallback((event, node) => {
    setChangeNode(node)
    setNodeSelected(true)
  }, []);

  //unused - ignore
  const reset = useCallback((event,node)=>{
    //setChangeNode(node)
    //setNodeSelected((state)=>!state)
  })

  // Functions for edge creation and limitations
  let sourceHandles = []
  let targetHandle = []
  const onConnect = useCallback(
    (params) => {
      // check if sourcehandle is already connected to node via a edge if it exists then allow another connection
      if (sourceHandles.includes(params.source)) return
      sourceHandles = sourceHandles.concat(params.source)
    
      setEdges(
        (eds) => addEdge({ ...params, markerEnd: { type: 'arrowclosed' } }, eds) // to add arrowhead at the end of the edge connection pass additional params
      )

      // keep track of which target handles are connected
      if (targetHandle.includes(params.target)) return
      targetHandle = targetHandle.concat(params.target)
      setTargetHandles(targetHandle)
      
  
    },
    [setEdges]
  )

  // Node deletion function feature tom be added
  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId))
    const connectedEdges = getConnectedEdges(edges, nodeId)
    setEdges((eds) => eds.filter((edge) => !connectedEdges.includes(edge)))
    setTargetHandles([]) // Reset target handle tracking on deletion
  }, [edges, setEdges, setNodes])

  // Function to handle edge click for deletion
  const handleEdgeClick = useCallback((event, edge) => {
   // setSelectedEdgeId(edge); // Track the clicked edge for deletion
    deleteEdge(edge)
  }, [])

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
  }, [])


   // adjusting the canvas 
   
  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])


  const onDrop = useCallback(
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
    // console.log(currentEdges)
    // console.log(currentNodes)
    // console.log(targetHandles)
    const map = new Map()
    let value =1;
    currentNodes.forEach(node=>{
         map.set(node.id, value++)
    })
    //console.log(map)
   // iterate though the edges 
   //pop all target nodes
   // if stack size is more than one - false

   currentEdges.forEach(edge=>{
      if(map.has(edge.target)){
        map.delete(edge.target)
      }
   })
   //console.log(map)

// Save button press will show an error if there are more than one Nodes have no edges 
//and more than one Node has empty target handles
    if (currentEdges.length === currentNodes.length - 1 || currentEdges.length === currentNodes.length && map.size<=1) {
      sessionStorage.setItem("nodes", JSON.stringify(currentNodes));
      sessionStorage.setItem("edges", JSON.stringify(currentEdges));
      sessionStorage.setItem("targets", JSON.stringify(targetHandles));
      setErrorMessage('Saved Flow')
      setMessageColor('green-message')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } else {
     
      setErrorMessage('Cannot save Flow')
      setMessageColor('red-message')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div className="appflow">
       <div className="topbar">
           
           <h3 className='appflow-logo'>Ë-ChatFlow Ƀuilder</h3>
           {errorMessage  &&  <Notification
              errorMessage={errorMessage}
              messageColor={messageColor}
            />}
             <div className='save-changes'>
              <button onClick={saveFlow}>Save Changes</button>
            </div>
          </div>
      
      <ReactFlowProvider>
      <div className='flow-body'>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            proOptions={proOptions}
            nodeTypes={nodeTypes}
            onNodeClick={update}
            onEdgeDoubleClick={handleEdgeClick}
            //onClick={reset}
            
            onEdgeContextMenu={({ edge }) => ( // Pass a function that returns the context menu content
              <div>
                <button onClick={() => deleteEdge(edge.id)}>
                  Delete Edge
                </button>
              </div>
            )}
          >
            <Controls />
          </ReactFlow>
        </div>
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
       <div className='delete-edge'>Double click on edge to  delete</div>
      </ReactFlowProvider>
    </div>
  )
}
export default FlowCanvas;