package projeto_ed.Game;

import java.util.Iterator;

/**
 * The Map interface represents a map with vertices and an adjacency matrix.
 * It allows creating a map with a specified number of vertices and performing various operations on the map.
 */
public interface IMap {

    /**
     * Generates a random directed complete graph with a specified coverage rate.
     * The method populates the adjacency matrix with random distances between vertices,
     * ensuring that the graph remains directed and complete until it is connected.
     *
     * @param taxaCobertura The coverage rate indicating the likelihood of creating an edge between vertices (0 to 100).
     */
    void generateRandomCompleteDirectionalGraph(int taxaCobertura);

    /**
     * Generates a random undirected complete graph with a specified coverage rate.
     * The method populates the adjacency matrix with random distances between vertices,
     * ensuring that the graph remains undirected and complete until it is connected.
     *
     * @param taxaCobertura The coverage rate indicating the likelihood of creating an edge between vertices (0 to 100).
     */
    void generateRandomCompleteNonDirectionalGraph(int taxaCobertura);

    /**
     * Prints the current state of the map, including occupied vertices and flags.
     */
    void printMap();

    /**
     * Prints the edges of the map along with their weights.
     */
    void printEdges();

    /**
     * Returns an iterator over the vertices of the weighted shortest path from the startVertex to the targetVertex.
     *
     * @param startVertex   The starting vertex of the path.
     * @param targetVertex  The target vertex of the path.
     * @return An iterator over the vertices of the weighted shortest path.
     * @throws IllegalArgumentException if the start or target vertex is invalid.
     */
    Iterator<Vertex> weightedShortestPathIterator(Vertex startVertex, Vertex targetVertex);

    /**
     * Generates edges and adds them to the map.
     *
     * @param mapSize The number of edges to generate.
     */
    void generateVertexes(int mapSize);

    /**
     * Returns an iterator over the vertices of the minimum spanning tree using Prim's algorithm.
     *
     * @param startVertex   The starting vertex of the tree.
     * @param targetVertex  The target vertex of the tree.
     * @return An iterator over the vertices of the minimum spanning tree.
     * @throws IllegalArgumentException if the start or target vertex is invalid.
     */
    Iterator<Vertex> treeIterator(Vertex startVertex, Vertex targetVertex);

    /**
     * Prints the neighbors of the specified bot, along with the associated costs.
     *
     * @param bot The bot for which neighbors are to be printed.
     */
    void printNeighbors(Bot bot);
}
