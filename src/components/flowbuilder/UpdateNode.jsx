import { useState, useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import "./styles/UpdatedNode.css"

// eslint-disable-next-line react/prop-types
function UpdateNode  ({
  selectedNode,
  setNodeSelected,
  setNodes,
  setNewNodeLabel,
}) {
  const [nodeName, setNodeName] = useState(selectedNode.data['label']);
 
  let id = selectedNode.id;

  useEffect(() => {

    setNodeName(selectedNode.data['label']);
  }, [id]);

  // update the node on click of the save changes button
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.data = {
            ...node.data,
            label: nodeName,
          };
        }

        return node;
      })
    );
  }, [selectedNode, nodeName, setNodes]);

  // onclick of the save changes button change from update sidebar to main node content sidebar
  const mainSidebar = () => {
    setNodeSelected(false);
  };

  return (

    <>
       <div className='modal'>
          <div className='modal-head'>
            <span
                className="material-symbols-outlined"
                onClick={mainSidebar}
              >
                arrow_back
              </span>
              <h2 className='modal-title'>Message</h2>
          </div>
          <div className='line-break'></div>
          <div className='modal-body'>
            <label htmlFor='nodetext'>Text</label>
            <textarea id= "nodetext"className='modal-textfiled' value={nodeName} rows="4" cols="30" onChange={(evt) => {
            setNodeName(evt.target.value)}}></textarea>
          </div>
          <div className='line-break'></div>
        </div>
    </>
  );
};

export default UpdateNode;