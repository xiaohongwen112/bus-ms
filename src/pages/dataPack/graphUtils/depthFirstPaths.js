
class DepthFirstPaths {

  constructor(graph, start) {
    this.start = start;
    this.marked = {
      start: true,
    };
    this.edgeTo = {
    };
    this.dfs(graph, this.start);
  }

  dfs(G, v) {
    this.marked[v] = true;
    G.neighbors(v).forEach((w) => {
      if (!this.marked[w]) {
        this.edgeTo[w] = v;
        this.dfs(G, w);
      }
    });
  }

  hasPathTo(v) {
    return this.marked[v];
  }

  pathTo(v) {
    if (!this.hasPathTo(v)) return null;
    const path = [];
    for (let x = v; x !== this.start; x = this.edgeTo[x]) path.push(x);
    path.push(this.start);
    return path;
  }
}

export default DepthFirstPaths;
