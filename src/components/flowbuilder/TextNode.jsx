import { Handle, Position } from 'reactflow';
import "./styles/TextNode.css"

// custom node so that we can add nodes with header & custom node styling
function TextNode ({ data }) {
  // console.log(data)

  return (
    <div>
      <div className='node-style'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>
            {/* whatsapp svg icon credit -
Bqlqn Lineal flaticon.com */}
             <img src="chat.png" alt="whatsapp icon" height={15} />
          </span>
          {data.heading}
        </div>
        <div style={{ paddingRight: 15 }}>
          {/* whatsapp png icon credit -
Andrew Dynamite flaticon.com */}
          <span><img src="social.png" alt="whatsapp icon" height={15} /></span>
        </div>
      </div>
      <div
        style={{
          padding: 15,
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
          backgroundColor: 'white',
        }}
      >
        <div
          style={{
            color: 'black',
          }}
        >
          {data.label}
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="source" />
      <Handle type="target" position={Position.Left} id="target" />
    </div>
  )
}

export default TextNode