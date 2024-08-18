import { Link, Node } from "./types/graph.dto";

export const RADIUS = 30;

export const drawNetwork = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  nodes: Node[],
  links: Link[]
) => {
  context.clearRect(0, 0, width, height);

  links.forEach((link: Link) => {
    context.beginPath();

    link.source = link.source as Node;
    link.target = link.target as Node;

    context.moveTo(link.source.x!, link.source.y!);
    context.lineTo(link.target.x!, link.target.y!);
    context.stroke();

    // Label
    const midX = (link.source.x! + link.target.x!) / 2;
    const midY = (link.source.y! + link.target.y!) / 2;
    const text = Math.round(link.value);
    context.fillStyle = "black";
    context.font = "14px Arial"; // Set label font size
    context.fillText(String(text), midX, midY);
  });

  nodes.forEach((node: Node) => {
    if (!node.x || !node.y) {
      return;
    }

    context.beginPath();
    context.moveTo(node.x, node.y);
    context.arc(node.x, node.y, RADIUS, 0, 2 * Math.PI);
    context.fillStyle =
      node.type === "cex" ? "black" : node.type === "user" ? "red" : "yellow";
    context.fill();

    // Label
    const text = node.id;
    context.fillStyle = "white";
    context.font = "14px Arial"; // Set label font size
    context.fillText(String(text), node.x - 25, node.y);
  });
};
