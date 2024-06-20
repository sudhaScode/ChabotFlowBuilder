import TextNode from "../TextNode";

// use Custom new node types so that we can add a header to the nodes along with a label
export const nodeTypes =
{
    node: TextNode,
}

export const initialNodes = sessionStorage.getItem("nodes");
export const initialEdges = sessionStorage.getItem("edges");
export const initialTagets = sessionStorage.getItem("targets")
