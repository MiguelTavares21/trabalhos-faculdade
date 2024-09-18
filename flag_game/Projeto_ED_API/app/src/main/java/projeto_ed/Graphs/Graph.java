package projeto_ed.Graphs;

import java.util.Iterator;
import java.util.NoSuchElementException;

import projeto_ed.Heaps.PriorityQueue;
import projeto_ed.Lists.DoublyUnorderedLinkedList;
import projeto_ed.Queues.LinkedQueue;
import projeto_ed.Stacks.LinkedStack;

/**
 * Graph represents an adjacency matrix implementation of a graph.
 *
 * @param <T> the type of elements stored in the vertices of the graph
 */
public class Graph<T> implements GraphADT<T> {
    protected final int DEFAULT_CAPACITY = 20;
    protected int numVertices; // number of vertices in the graph
    protected double[][] adjMatrix; // adjacency matrix
    protected T[] vertices; // values of vertices

    /**
     * Creates an empty graph.
     */
    public Graph() {
        numVertices = 0;
        this.adjMatrix = new double[DEFAULT_CAPACITY][DEFAULT_CAPACITY];
        this.vertices = (T[]) (new Object[DEFAULT_CAPACITY]);

    }

    /**
     * Creates an empty graph with a specified initial capacity.
     *
     * @param num the initial capacity of the graph
     */
    public Graph(int num) {
        numVertices = 0;
        this.adjMatrix = new double[num][num];
        this.vertices = (T[]) (new Object[num]);

    }

    /**
     * Inserts an edge between two vertices of the graph.
     *
     * @param vertex1 the first vertex
     * @param vertex2 the second vertex
     * @throws IllegalArgumentException if either vertex is invalid
     */
    @Override
    public void addEdge(T vertex1, T vertex2) {
        int index1 = getIndex(vertex1);
        int index2 = getIndex(vertex2);

        if (!indexIsValid(index1) || !indexIsValid(index2)) {
            throw new IllegalArgumentException("Invalid vertex: " + vertex1 + " or " + vertex2);
        }

        adjMatrix[index1][index2] = 1;
    }

    /**
     * Adds a vertex to the graph, expanding the capacity of the graph if necessary.
     * It also associates an object with the vertex.
     *
     * @param vertex the vertex to add to the graph
     * @throws IllegalArgumentException if the vertex already exists in the graph
     */
    @Override
    public void addVertex(T vertex) {

        if (contains(vertex)) {
            throw new IllegalArgumentException("Vertex already exists in the graph: " + vertex);
        }

        if (numVertices == vertices.length) {
            expandCapacity();
        }

        vertices[numVertices] = vertex;

        for (int i = 0; i <= numVertices; i++) {
            adjMatrix[numVertices][i] = 0;
            adjMatrix[i][numVertices] = 0;
        }

        numVertices++;
    }

    /**
     * Removes a vertex from the graph.
     *
     * @param vertex the vertex to remove
     */
    @Override
    public void removeVertex(T vertex) {
        int index = getIndex(vertex);

        if (indexIsValid(index)) {
            for (int i = index; i < numVertices - 1; i++) {
                vertices[i] = vertices[i + 1];
            }

            for (int i = index; i < numVertices - 1; i++) {
                for (int j = 0; j < numVertices; j++) {
                    adjMatrix[i][j] = adjMatrix[i + 1][j];
                }
            }

            for (int i = 0; i < numVertices; i++) {
                for (int j = index; j < numVertices - 1; j++) {
                    adjMatrix[i][j] = adjMatrix[i][j + 1];
                }
            }

            for (int i = 0; i < numVertices; i++) {
                adjMatrix[i][numVertices - 1] = 0;
                adjMatrix[numVertices - 1][i] = 0;
            }

            numVertices--;
        }
    }

    /**
     * Removes an edge between two vertices of the graph.
     *
     * @param vertex1 the first vertex
     * @param vertex2 the second vertex
     * @throws IllegalArgumentException if either vertex is invalid
     */
    @Override
    public void removeEdge(T vertex1, T vertex2) {
        int index1 = getIndex(vertex1);
        int index2 = getIndex(vertex2);

        if (!indexIsValid(index1) || !indexIsValid(index2)) {
            throw new IllegalArgumentException("Invalid vertex for edge removal");
        }

        if (indexIsValid(index1) && indexIsValid(index2)) {
            adjMatrix[index1][index2] = 0;
        }
    }

    /**
     * Returns an iterator for a breadth-first traversal starting from the specified vertex.
     *
     * @param startVertex the starting vertex for the traversal
     * @return an iterator for breadth-first traversal
     * @throws IllegalArgumentException if the start vertex is not found in the graph
     */
    @Override
    public Iterator<T> iteratorBFS(T startVertex) {
        if (!contains(startVertex)) {
            throw new IllegalArgumentException("Start vertex not found in the graph");
        }

        LinkedQueue<Integer> traversalQueue = new LinkedQueue<>();
        DoublyUnorderedLinkedList<T> resultList = new DoublyUnorderedLinkedList<>();
        boolean[] visited = new boolean[numVertices];

        int startIndex = getIndex(startVertex);
        for (int i = 0; i < numVertices; i++) {
            visited[i] = false;
        }

        traversalQueue.enqueue(startIndex);
        visited[startIndex] = true;

        while (!traversalQueue.isEmpty()) {
            int x = traversalQueue.dequeue();
            resultList.addToRear(vertices[x]);

            for (int i = 0; i < numVertices; i++) {
                if (adjMatrix[x][i] > 0 && !visited[i]) {
                    traversalQueue.enqueue(i);
                    visited[i] = true;
                }
            }
        }

        return resultList.iterator();
    }




    /**
     * Returns an iterator for a depth-first traversal starting from the specified vertex.
     *
     * @param startVertex the starting vertex for the traversal
     * @return an iterator for depth-first traversal
     * @throws IllegalArgumentException if the start vertex is not found in the graph
     */
    @Override
    public Iterator<T> iteratorDFS(T startVertex) {
        if (!contains(startVertex)) {
            throw new IllegalArgumentException("Start vertex not found in the graph");
        }

        boolean[] visited = new boolean[numVertices];
        LinkedStack<Integer> traversalStack = new LinkedStack<>();
        DoublyUnorderedLinkedList<T> resultList = new DoublyUnorderedLinkedList<>();

        int startIndex = getIndex(startVertex);
        for (int i = 0; i < numVertices; i++) {
            visited[i] = false;
        }

        traversalStack.push(startIndex);
        resultList.addToRear(vertices[startIndex]);
        visited[startIndex] = true;

        while (!traversalStack.isEmpty()) {
            int x = traversalStack.peek();
            boolean found = false;

            for (int i = 0; i < numVertices && !found; i++) {
                if (adjMatrix[x][i] > 0 && !visited[i]) {
                    traversalStack.push(i);
                    resultList.addToRear(vertices[i]);
                    visited[i] = true;
                    found = true;
                }
            }

            if (!found && !traversalStack.isEmpty()) {
                traversalStack.pop();
            }
        }

        return resultList.iterator();
    }


    /**
     * Returns an iterator for the shortest path between two vertices.
     *
     * @param startVertex  the starting vertex
     * @param targetVertex the target vertex
     * @return an iterator for the shortest path
     * @throws IllegalArgumentException if either start or target vertex is invalid
     */
    @Override
    public Iterator<T> iteratorShortestPath(T startVertex, T targetVertex) {
        DoublyUnorderedLinkedList<T> result = new DoublyUnorderedLinkedList<>();
        int startIndex = getIndex(startVertex);
        int targetIndex = getIndex(targetVertex);

        if (!indexIsValid(startIndex) || !indexIsValid(targetIndex)) {
            throw new IllegalArgumentException("Invalid start or target vertex");
        }

        int[] pred = new int[numVertices];
        double[] D = new double[numVertices];
        D[startIndex] = 0;

        for (int i = 0; i < numVertices; i++) {
            if (i != startIndex) {
                D[i] = Double.POSITIVE_INFINITY;
            }
            pred[i] = -1;
        }

        PriorityQueue<T> priorityQueue = new PriorityQueue<>();
        for (int i = 0; i < numVertices; i++) {
            priorityQueue.addElement(vertices[i], (int) D[i]);
        }

        while (!priorityQueue.isEmpty()) {
            T u = priorityQueue.removeNext();
            int uIndex = getIndex(u);

            for (int i = 0; i < numVertices; i++) {
                if (adjMatrix[uIndex][i] != 0) {
                    if (D[uIndex] + adjMatrix[uIndex][i] < D[i]) {
                        T element = vertices[i];
                        D[i] = D[uIndex] + adjMatrix[uIndex][i];
                        pred[i] = uIndex;
                        priorityQueue.changePriority(element, (int) D[i]);
                    }
                }

            }
        }

        int currentVertex = targetIndex;

        while (currentVertex != -1) {
            result.addToFront(vertices[currentVertex]);
            currentVertex = pred[currentVertex];
        }

        return result.iterator();
    }

    /**
     * Checks if the graph is empty.
     *
     * @return true if the graph is empty, false otherwise
     */
    @Override
    public boolean isEmpty() {
        return numVertices == 0;
    }

    /**
     * Checks if the graph is connected.
     *
     * @return true if the graph is connected, false otherwise
     */
    @Override
    public boolean isConnected() {
        if (numVertices <= 1) {
            return true;
        }

        for (int i = 0; i < numVertices; i++) {
            boolean[] visited = new boolean[numVertices];
            LinkedQueue<Integer> traversalQueue = new LinkedQueue<>();

            traversalQueue.enqueue(i);
            visited[i] = true;

            while (!traversalQueue.isEmpty()) {
                int currentVertex = traversalQueue.dequeue();

                for (int j = 0; j < numVertices; j++) {
                    if (adjMatrix[currentVertex][j] > 0 && !visited[j]) {
                        traversalQueue.enqueue(j);
                        visited[j] = true;
                    }
                }
            }

            for (boolean vertexVisited : visited) {
                if (!vertexVisited) {
                    return false;
                }
            }
        }

        return true;
    }


    /**
     * Returns the number of vertices in the graph.
     *
     * @return the number of vertices in the graph
     */
    @Override
    public int size() {
        return numVertices;
    }

    /**
     * Expands the capacity of the graph by doubling the size of the adjacency matrix.
     */
    private void expandCapacity() {
        double[][] newMatrix = new double[adjMatrix.length * 2][adjMatrix.length * 2];
        for (int i = 0; i < numVertices; i++) {
            System.arraycopy(adjMatrix[i], 0, newMatrix[i], 0, numVertices);
        }
        adjMatrix = newMatrix;
    }

    /**
     * Returns the index of a given vertex in the vertices array.
     *
     * @param vertex the vertex to find the index of
     * @return the index of the vertex
     * @throws NoSuchElementException if the vertex is not found
     */
    public int getIndex(T vertex) {
        for (int i = 0; i <= numVertices; i++) {
            if (vertices[i].equals(vertex)) {
                return i;
            }
        }

        throw new NoSuchElementException("Vertex not found: " + vertex);
    }

    /**
     * Checks if the given index is valid for the vertices array.
     *
     * @param index the index to check
     * @return true if the index is valid, false otherwise
     */
    protected boolean indexIsValid(int index) {
        return index >= 0 && index < numVertices;
    }

    /**
     * Checks whether the graph contains the specified vertex.
     *
     * @param vertex the vertex to check for existence in the graph
     * @return true if the graph contains the vertex, false otherwise
     */
    public boolean contains(T vertex) {
        for (int i = 0; i < numVertices; i++) {
            if (vertices[i] != null && vertices[i].equals(vertex)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @return The adjacency matrix.
     */
    public double[][] getAdjMatrix() {
        return adjMatrix;
    }
}