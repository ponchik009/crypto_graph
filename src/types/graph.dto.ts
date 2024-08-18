export interface Node extends d3.SimulationNodeDatum {
  id: string;
  type: "user" | "cex" | "bridge";
  name: string;
  usdt_balance: number;
  tokens: { name: string; amount: number; usdt_amount: number }[];
  isMain?: boolean;
  isSender?: boolean;
  group?: string;
}

export interface Link extends d3.SimulationLinkDatum<Node> {
  id: string;
  sender: string;
  receiver: string;
  usdt_amount: string;
  tokens_amount: { name: string; amount: number; usdt_amount: number }[];
  value: number;
}

export type GraphDto = {
  nodes: Node[];
  links: Link[];
};
