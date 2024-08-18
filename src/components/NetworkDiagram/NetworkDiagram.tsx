import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as d3 from "d3";

import { RADIUS, drawNetwork } from "../../drawNetwork";

import { Link, Node } from "../../types/graph.dto";
import {
  selectInputValue,
  selectTransactionViewType,
  toggleTooltip,
  updateInputValue,
} from "../../store/graphReducer/graphReducer";
import { useGetGraphByAddressQuery } from "../../api/api";

type NetworkDiagramProps = {
  width: number;
  height: number;
};

export const NetworkDiagram = ({ width, height }: NetworkDiagramProps) => {
  const dispatch = useDispatch();

  const inputValue = useSelector(selectInputValue);
  const transactionViewType = useSelector(selectTransactionViewType);

  const { data } = useGetGraphByAddressQuery(inputValue);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // The force simulation mutates links and nodes, so create a copy first
  // Node positions are initialized by d3
  const links: Link[] = (data || { links: [] }).links.map((d) => ({ ...d }));
  const nodes: Node[] = (data || { nodes: [] }).nodes.map((d) => ({ ...d }));

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const handleCanvasNodeAction = (
      callback: (node: Node | null, coords?: { x: number; y: number }) => void
    ) => {
      return (event: HTMLElementEventMap["click"]) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width; // relationship bitmap vs. element for X
        const scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

        const mouseX = (event.clientX - rect.left) * scaleX; // scale mouse coordinates after they have  been adjusted to be relative to element
        const mouseY = (event.clientY - rect.top) * scaleY;

        let result = false;

        nodes.forEach((node) => {
          if (!node.x || !node.y) {
            return;
          }

          const distance = Math.sqrt(
            Math.pow(node.x - mouseX, 2) + Math.pow(node.y - mouseY, 2)
          );
          if (distance < RADIUS) {
            callback(node, { x: mouseX, y: mouseY });
            result = true;
          }
        });

        if (!result) {
          callback(null);
        }
      };
    };

    const handleNodeClick = handleCanvasNodeAction((node) => {
      if (node) {
        dispatch(updateInputValue(node!.id));
      }
    });

    const handleNodeHover = handleCanvasNodeAction((node, coords) => {
      if (node && coords) {
        dispatch(
          toggleTooltip({
            show: true,
            left: coords.x - RADIUS,
            top: coords.y - RADIUS,
            value: `${node.id}\n${node.name || "empty name"}\n${
              node.tokens.length
                ? node.tokens
                    .map(
                      (token) =>
                        `${token.amount} ${token.name} / ${token.usdt_amount} usdt`
                    )
                    .join("\n")
                : "no tokens"
            }`,
          })
        );
      } else {
        dispatch(
          toggleTooltip({
            show: false,
            left: 0,
            top: 0,
            value: "",
          })
        );
      }
    });

    canvas.addEventListener("dblclick", handleNodeClick);
    canvas.addEventListener("mousemove", handleNodeHover);

    return () => {
      canvas.removeEventListener("dblclick", handleNodeClick);
      canvas.removeEventListener("mousemove", handleNodeHover);
    };
  }, [nodes]);

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
          .distance((link) => window.innerWidth / 4)
        // .distance((link) => +link.usdt_amount / 5)
        // .strength(1)
      )
      .force("collide", d3.forceCollide().radius(RADIUS + 10))
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "x",
        d3.forceX((n) =>
          n.isSender ? 100 : n.isMain ? width / 2 : width - 100
        )
      )
      .force(
        "y",
        d3.forceY((n) => height / 2)
      )

      // at each iteration of the simulation, draw the network diagram with the new node positions
      .on("tick", () => {
        drawNetwork(context, width, height, nodes, links, transactionViewType);
      });
  }, [width, height, nodes, links]);

  if (!data) {
    return null;
  }

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
