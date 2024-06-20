import { useEffect, useState } from 'react';
import "./styles/SideBar.css"

function SideBar({ nodeTypes }) {
  const [showUsage, setShowUsage] = useState(true) // state to show helpful chat flow usage info

  // Tell drag & drop usage of nodes to user on first load of the application
  useEffect(() => {
    setTimeout(() => {
      setShowUsage(false)
    }, 5000)
  }, [showUsage])


  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  // You can expand upon adding new nodes by change the type from default
  return (
    <>
      {showUsage && <div className="description" >
        Drag required node to the pane on the left to add new nodes.
      </div>}
      <div className='sidebar'>
        {nodeTypes.map((nodeType) =>
          <div
            className="appnode"
            onDragStart={(event) => onDragStart(event, 'default')}
            draggable
            key={`$08{nodeType}1`}
          >
              <span>
                <img src={`${nodeType.feature}.png`} alt="chat" className={`${nodeType.feature.toLowerCase()}-icon`} />
              </span>
              {nodeType.feature}
          </div>
        )}
      </div>
    </>
  )
}

export default SideBar