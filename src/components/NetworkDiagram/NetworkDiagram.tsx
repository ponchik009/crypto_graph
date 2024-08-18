import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { RADIUS, drawNetwork } from "../../drawNetwork";

import { GraphDto, Link, Node } from "../../types/graph.dto";

type NetworkDiagramProps = {
  width: number;
  height: number;
  data: GraphDto;
};

function getNodesMap(nodes: Node[]) {
  const map = new Map();

  nodes.forEach((node) => {
    map.set(node.id, node);
  });

  return map;
}

export const NetworkDiagram = ({
  width,
  height,
  data,
}: NetworkDiagramProps) => {
  // The force simulation mutates links and nodes, so create a copy first
  // Node positions are initialized by d3
  const links: Link[] = data.links.map((d) => ({ ...d }));
  const nodes: Node[] = data.nodes.map((d) => ({ ...d }));

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const handleClick = (event: HTMLElementEventMap["click"]) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width; // relationship bitmap vs. element for X
      const scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

      const mouseX = (event.clientX - rect.left) * scaleX; // scale mouse coordinates after they have  been adjusted to be relative to element
      const mouseY = (event.clientY - rect.top) * scaleY;

      nodes.forEach((node) => {
        if (!node.x || !node.y) {
          return;
        }

        const distance = Math.sqrt(
          Math.pow(node.x - mouseX, 2) + Math.pow(node.y - mouseY, 2)
        );
        if (distance < RADIUS) {
          alert("Clicked on node: " + node.id + " group: " + node.group);
        }
      });
    };
    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    // set dimension of the canvas element
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!context || !canvas) {
      return;
    }

    // run d3-force to find the position of nodes on the canvas
    d3.forceSimulation(nodes)

      // list of forces we apply to get node positions
      .force(
        "link",
        d3
          .forceLink<Node, Link>(links)
          .id((d) => d.id)
          .distance((link) => 400)
        // .distance((link) => +link.usdt_amount / 5)
        // .strength(1)
      )
      .force("collide", d3.forceCollide().radius(RADIUS + 10))
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "x",
        d3.forceX((n) => (n.isSender ? 0 : n.isMain ? width / 2 : width))
      )
      .force(
        "y",
        d3.forceY((n) => height / 2)
      )

      // at each iteration of the simulation, draw the network diagram with the new node positions
      .on("tick", () => {
        drawNetwork(context, width, height, nodes, links);
      });
  }, [width, height, nodes, links]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          width,
          height,
        }}
        width={width}
        height={height}
      />
    </div>
  );
};
