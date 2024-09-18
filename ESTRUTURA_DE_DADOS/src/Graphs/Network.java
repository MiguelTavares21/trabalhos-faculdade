package Graphs;

import java.util.Iterator;

import Interfaces.NetworkADT;
import Lists.DoublyUnorderedLinkedList;
import Queues.LinkedQueue;

/**
 * Network represents an adjacency matrix implementation of a weighted graph.
 *
 * @param <T> the type of elements stored in the vertices of the network
 */
public class Network<T> extends Graph<T> implements NetworkADT<T> {
    private double[][] weightMatrix; // matriz de pesos

    /**
     * Creates an empty network.
     */
    public Network() {
        super();
        this.weightMatrix = new double[DEFAULT_CAPACITY][DEFAULT_CAPACITY];
    }

    /**
     * Creates an empty network with a specified initial capacity.
     *
     * @param num the initial capacity of the network
     */
    public Network(int num) {
        super(num);
        this.adjMatrix = new boolean[num][num];
        this.weightMatrix = new double[num][num];
    }

    /**
     * Inserts an edge with weight between two vertices of the network.
     *
     * @param vertex1 the first vertex
     * @param vertex2 the second vertex
     * @param weight  the weight of the edge
     */
    @Override
    public void addEdge(T vertex1, T vertex2, double weight) {
        int index1 = getIndex(vertex1);
        int index2 = getIndex(vertex2);

        if (indexIsValid(index1) && indexIsValid(index2)) {
            adjMatrix[index1][index2] = true;
            weightMatrix[index1][index2] = weight;
        }
    }

    /**
     * Returns the weight of the shortest path in this network.
     *
     * @param vertex1 the first vertex
     * @param vertex2 the second vertex
     * @return the weight of the shortest path in this network
     */

    @Override
    public double shortestPathWeight(T vertex1, T vertex2) {
        int startIndex = getIndex(vertex1);
        int targetIndex = getIndex(vertex2);

        if (!indexIsValid(startIndex) || !indexIsValid(targetIndex)) {
            throw new IllegalArgumentException("Invalid start or target vertex");
        }

        double[] distances = new double[numVertices];
        boolean[] tight = new boolean[numVertices];
        int[] previousVertices = new int[numVertices];
        boolean[] visited = new boolean[numVertices];

        for (int i = 0; i < numVertices; i++) {
            distances[i] = Double.POSITIVE_INFINITY;
            tight[i] = false;
            previousVertices[i] = -1;
            visited[i] = false;
        }

        distances[startIndex] = 0;

        while (true) {
            int u = -1;
            double minDistance = Double.POSITIVE_INFINITY;

            for (int i = 0; i < numVertices; i++) {
                if (!tight[i] && distances[i] < minDistance) {
                    u = i;
                    minDistance = distances[i];
                }
            }

            if (u == -1) {
                break;
            }

            tight[u] = true;

            for (int z = 0; z < numVertices; z++) {
                if (adjMatrix[u][z] && !visited[z]) {
                    double newDistance = distances[u] + weightMatrix[u][z];

                    if (newDistance < distances[z]) {
                        distances[z] = newDistance;
                        previousVertices[z] = u;
                    }
                }
            }
        }

        return distances[targetIndex];
    }

    /**
     * Returns an iterator over the vertices in the shortest path from startVertex to targetVertex.
     *
     * @param startVertex  the starting vertex
     * @param targetVertex the target vertex
     * @return an iterator over the vertices in the shortest path
     */
    @Override
    public Iterator<T> iteratorShortestPath(T startVertex, T targetVertex) {
        int startIndex = getIndex(startVertex);
        int targetIndex = getIndex(targetVertex);
    
        if (!indexIsValid(startIndex) || !indexIsValid(targetIndex)) {
            throw new IllegalArgumentException("Invalid start or target vertex");
        }
    
        double[] distances = new double[numVertices];
        boolean[] tight = new boolean[numVertices];
        int[] previousVertices = new int[numVertices];
        boolean[] visited = new boolean[numVertices];

        for (int i = 0; i < numVertices; i++) {
            distances[i] = Double.POSITIVE_INFINITY;
            tight[i] = false;
            previousVertices[i] = -1;
            visited[i] = false;
        }

        distances[startIndex] = 0;
    
        while (true) {
            int u = -1;
            double minDistance = Double.POSITIVE_INFINITY;
    
            for (int i = 0; i < numVertices; i++) {
                if (!tight[i] && distances[i] < minDistance) {
                    u = i;
                    minDistance = distances[i];
                }
            }
    
            if (u == -1) {
                break;
            }
    
            tight[u] = true;
    

            for (int z = 0; z < numVertices; z++) {
                if (adjMatrix[u][z] && !visited[z]) {
                    double newDistance = distances[u] + weightMatrix[u][z];
    
                    if (newDistance < distances[z]) {
                        distances[z] = newDistance;
                        previousVertices[z] = u;
                    }
                }
            }
        }
    

        DoublyUnorderedLinkedList<T> resultList = new DoublyUnorderedLinkedList<>();
        int currentVertex = targetIndex;
    
        while (currentVertex != -1) {
            resultList.addToFront(vertices[currentVertex]);
            currentVertex = previousVertices[currentVertex];
        }
    
        return resultList.iterator();
    }
}
