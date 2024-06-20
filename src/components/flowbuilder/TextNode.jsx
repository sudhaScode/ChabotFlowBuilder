import { Handle, Position } from 'reactflow';
import "./styles/TextNode.css"

// custom node so that we can add nodes with header & custom node styling
function TextNode ({ data }) {
  // console.log(data)

  return (
    <div className='node'>
      <div className='node-header'>
        <div   className='left-icon'>
            <span>
                            {/* chat png icon credit -
                Bqlqn Lineal flaticon.com */}
              <img src="chat.png" alt="chat" />
            </span>
            <p>{data.heading}</p>
        </div>
        <div className='right-icon'>
                    {/* whatsapp png icon credit -
          Andrew Dynamite flaticon.com */}
          <span><img src="whatsapp.png" alt="whatsapp"/></span>
        </div>
      </div>
      <div className='node-body'>
       <p>{data.label}</p>
      </div>
      <Handle type="source" position={Position.Right} id="source" />
      <Handle type="target" position={Position.Left} id="target" />
    </div>
  )
}

export default TextNode