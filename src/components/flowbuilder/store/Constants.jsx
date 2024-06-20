import TextNode from "../TextNode";

// use Custom new node types so that we can add a header to the nodes along with a label
export const nodeTypes =
{
    node: TextNode,
}

export const initialNodes = sessionStorage.getItem("nodes");
export const initialEdges = sessionStorage.getItem("edges");
export const initialTagets = sessionStorage.getItem("targets")



/*
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
    if ((currentEdges.length === currentNodes.length - 1 || currentEdges.length === currentNodes.length) && map.size<=1) {
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
    }*/