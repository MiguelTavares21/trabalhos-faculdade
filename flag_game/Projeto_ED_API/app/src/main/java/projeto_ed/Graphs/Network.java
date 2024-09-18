package projeto_ed.Graphs;

import java.util.Iterator;


import projeto_ed.Lists.DoublyUnorderedLinkedList;
import projeto_ed.Queues.LinkedQueue;

/**
 * Network represents an adjacency matrix implementation of a weighted graph.
 *
 * @param <T> the type of elements stored in the vertices of the network
 */
public class Network<T> extends Graph<T> implements NetworkADT<T> {
    public Network(int size) {
        super(size);
    }

    public Network() {
        super();
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
            adjMatrix[index1][index2] = weight;
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
    public double shortestPathWeight(T vertex1, T vertex2) throws IllegalArgumentException {
        double weight = 0;

        if (!contains(vertex1) || !contains(vertex2)) {
            throw new IllegalArgumentException();
        }

        int currentVertex = getIndex(vertex1);

        for (Iterator<T> it = super.iteratorShortestPath(vertex1, vertex2); it.hasNext(); ) {
            T element = it.next();
            int index = getIndex(element);

            if (adjMatrix[currentVertex][index] != Integer.MAX_VALUE) {
                weight += adjMatrix[currentVertex][index];
                currentVertex = index;
            }
        }
        return weight;
    }
}
