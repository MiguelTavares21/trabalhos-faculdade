package projeto_ed;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import projeto_ed.Graphs.Graph;

import java.util.Iterator;
import static org.junit.jupiter.api.Assertions.*;

public class GraphTest {

    private Graph<String> graph;

    @BeforeEach
    public void setUp() {
        graph = new Graph<>();
    }

    @Test
    public void testAddVertex() {
        graph.addVertex("A");
        assertTrue(graph.contains("A"));
        assertEquals(1, graph.size());
    }

    @Test
    public void testAddEdge() {
        graph.addVertex("A");
        graph.addVertex("B");

        graph.addEdge("A", "B");
        graph.addEdge("B","A");

        assertTrue(graph.getAdjMatrix()[0][1] == 1);
        assertTrue(graph.getAdjMatrix()[1][0] == 1);
    }

    @Test
    public void testRemoveVertex() {
        graph.addVertex("A");
        graph.addVertex("B");
        graph.addEdge("A", "B");

        graph.removeVertex("A");

        assertFalse(graph.contains("A"));
        assertEquals(1, graph.size());
        assertTrue(graph.getAdjMatrix()[0][1] == 0);
        assertTrue(graph.getAdjMatrix()[1][0] == 0);
    }

    @Test
    public void testRemoveEdge() {
        graph.addVertex("A");
        graph.addVertex("B");
        graph.addEdge("A", "B");

        graph.removeEdge("A", "B");

        assertTrue(graph.getAdjMatrix()[0][1] == 0);
        assertTrue(graph.getAdjMatrix()[1][0] == 0);
    }

    @Test
    public void testIteratorBFS() {
        graph.addVertex("A");
        graph.addVertex("B");
        graph.addVertex("C");
        graph.addEdge("A", "B");
        graph.addEdge("B", "C");

        StringBuilder result = new StringBuilder();
        for (Iterator<String> it = graph.iteratorBFS("A"); it.hasNext(); ) {
            String vertex = it.next();
            result.append(vertex);
        }

        assertEquals("ABC", result.toString());
    }

    @Test
    public void testIteratorDFS() {
        graph.addVertex("A");
        graph.addVertex("B");
        graph.addVertex("C");
        graph.addEdge("A", "B");
        graph.addEdge("B", "C");

        StringBuilder result = new StringBuilder();
        for (Iterator<String> it = graph.iteratorDFS("A"); it.hasNext(); ) {
            String vertex = it.next();
            result.append(vertex);
        }

        assertEquals("ABC", result.toString());
    }

    @Test
    public void testIteratorShortestPath() {
        graph.addVertex("A");
        graph.addVertex("B");
        graph.addVertex("C");
        graph.addEdge("A", "B");
        graph.addEdge("B", "C");

        StringBuilder result = new StringBuilder();
        for (Iterator<String> it = graph.iteratorShortestPath("A", "C"); it.hasNext(); ) {
            String vertex = it.next();
            result.append(vertex);
        }

        assertEquals("ABC", result.toString());
    }

    @Test
    public void testIsEmpty() {
        assertTrue(graph.isEmpty());

        graph.addVertex("A");

        assertFalse(graph.isEmpty());
    }

    @Test
    public void testIsConnected() {
        assertTrue(graph.isConnected());

        graph.addVertex("A");
        graph.addVertex("B");
        graph.addVertex("C");
        graph.addEdge("A", "B");
        graph.addEdge("B", "C");
        graph.addEdge("C","A");

        assertTrue(graph.isConnected());

        graph.addVertex("D");

        assertFalse(graph.isConnected());
    }

}
