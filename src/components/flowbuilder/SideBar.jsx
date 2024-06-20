import { useEffect, useState } from 'react';
import "./styles/SideBar.css";

function SideBar({ nodeTypes }) {
  const [showUsage, setShowUsage] = useState(true); // State to show helpful chat flow usage info

  // Effect to hide usage info after 5 seconds
  useEffect(() => {
    setTimeout(() => {
      setShowUsage(false);
    }, 5000);
  }, [showUsage]);

  // Function to handle drag start for nodes
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType); // Set data for drag event
    event.dataTransfer.effectAllowed = 'move'; // Set drag effect
  };

  return (
    <>
      {/* Display usage info for dragging nodes */}
      {showUsage && (
        <div className="description">
          Drag required node to the pane on the left to add new nodes.
        </div>
      )}
      {/* Sidebar section */}
      <div className='sidebar'>
        {/* Map through nodeTypes to display each node */}
        {nodeTypes.map((nodeType) => (
          <div
            className="appnode"
            onDragStart={(event) => onDragStart(event, 'default')} // Call onDragStart with node type
            draggable // Make node draggable
            key={`${nodeType.feature}1`} // Unique key for each nodeType
          >
            <span>
              {/* Display node icon */}
              <img src={`${nodeType.feature}.png`} alt="chat" className={`${nodeType.feature.toLowerCase()}-icon`} />
            </span>
            {/* Display node feature name */}
            {nodeType.feature}
          </div>
        ))}
      </div>
    </>
  );
}

export default SideBar;
