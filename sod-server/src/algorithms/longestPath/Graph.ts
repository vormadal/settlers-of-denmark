import { Edge } from "./Edge";

export class Graph {
  public readonly edges: Edge[] = [];
  
  public addEdge(edge: Edge) {
    this.edges.push(edge);
  }
}
