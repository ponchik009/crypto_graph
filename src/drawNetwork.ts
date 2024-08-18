import { Link, Node, TransactionViewType } from "./types/graph.dto";

export const RADIUS = 30;

export const drawNetwork = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  nodes: Node[],
  links: Link[],
  viewType: TransactionViewType = "usdt"
) => {
  context.clearRect(0, 0, width, height);

  const linksMap = new Map<string, number>();

  links.forEach((link: Link) => {
    link.source = link.source as Node;
    link.target = link.target as Node;

    const key = `${link.source.id}_${link.target.id}`;
    const reversedKey = `${link.target.id}_${link.source.id}`;

    const offset =
      ((linksMap.get(key) || 0) + (linksMap.get(reversedKey) || 0)) * RADIUS;

    context.beginPath();

    let sourceX = link.source.x!;
    let sourceY = link.source.y!;
    let targetX = link.target.x!;
    let targetY = link.target.y!;

    if (!link.source.isMain) {
      sourceY = link.source.y! - RADIUS + offset + 5;
      context.moveTo(sourceX, sourceY);
    } else {
      context.moveTo(sourceX, sourceY);
    }
    if (!link.target.isMain) {
      targetY = link.target.y! - RADIUS + offset + 5;
      context.lineTo(targetX, targetY);
    } else {
      context.lineTo(targetX, targetY);
    }
    context.stroke();

    if (!linksMap.has(key)) {
      linksMap.set(key, 0);
    }

    linksMap.set(key, linksMap.get(key)! + 1);

    // Label
    let midX = (sourceX + targetX) / 2;
    let midY = (sourceY + targetY) / 2;

    const text =
      viewType === "usdt"
        ? `${Math.round(link.value).toFixed(2)} USDT`
        : `${link.tokens_amount
            .map((t) => `${t.amount.toFixed(2)} ${t.name}`)
            .join(" | ")}`;
    context.fillStyle = "black";
    context.font = "14px Arial"; // Set label font size
    context.fillText(text, midX, midY);
  });

  nodes.forEach((node: Node) => {
    if (!node.x || !node.y) {
      return;
    }

    context.beginPath();
    context.moveTo(node.x, node.y);
    context.arc(node.x, node.y, RADIUS, 0, 2 * Math.PI);
    context.fillStyle =
      node.type === "cex" ? "black" : node.type === "user" ? "red" : "aqua";
    context.fill();

    // Label
    const text = node.id;
    context.fillStyle = "white";
    context.font = "14px Arial"; // Set label font size
    context.fillText(String(text), node.x - 25, node.y);
  });
};
