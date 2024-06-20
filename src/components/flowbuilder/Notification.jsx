// show different error/success notification based on the props recieved by the Component
import "./styles/FlowCanvas.css"

const Notification = ({ errorMessage, messageColor }) => {
    if (errorMessage) {
      return <div className={messageColor}>{errorMessage}</div>
    }
    return <div className={messageColor} style={{ padding: 19 }}></div>
  }
  
  export default Notification