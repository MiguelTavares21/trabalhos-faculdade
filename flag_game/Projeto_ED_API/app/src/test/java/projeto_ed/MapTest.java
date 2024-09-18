package projeto_ed;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import projeto_ed.Game.Map;
import projeto_ed.Game.Vertex;

import java.util.Iterator;

import static org.junit.jupiter.api.Assertions.*;

public class MapTest {

    private Map map;

    @BeforeEach
    public void setUp() {
        map = new Map(5);
        map.generateVertexes(5);
    }

    @Test
    void test_GetVertice_WithValidPosition() {
        int position = 3; // Adjust the position as needed
        Vertex vertex = map.getVertice(position);
        assertEquals(position, vertex.getindex(), "Vertex should have the correct index");
    }

    @Test
    void test_GetVertice_WithInvalidPosition() {
        int invalidPosition = 10; // Adjust the invalid position as needed
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> map.getVertice(invalidPosition), "Getting a vertex with an invalid position should throw an IllegalArgumentException");
    }


    @Test
    void test_GenerateRandomCompleteDirectionalGraph() {
        int taxaCobertura = 50;
        map.generateRandomCompleteDirectionalGraph(taxaCobertura);
        assertTrue(map.isConnected(), "The generated directional graph should be connected");
    }

    @Test
    void test_GenerateRandomCompleteNonDirectionalGraph() {
        int taxaCobertura = 50;
        map.generateRandomCompleteNonDirectionalGraph(taxaCobertura);

        assertTrue(map.isConnected(), "The generated non-directional graph should be connected");
    }


    @Test
    void test_WeightedShortestPathIterator() {
        Vertex vertex1 = map.getVertice(1);
        Vertex vertex2 = map.getVertice(2);
        Vertex vertex3 = map.getVertice(3);
        Vertex vertex4 = map.getVertice(4);
        Vertex vertex5 = map.getVertice(5);

        map.addEdge(vertex1, vertex2, 2);
        map.addEdge(vertex2, vertex3, 3);
        map.addEdge(vertex3, vertex4, 1);
        map.addEdge(vertex4, vertex5, 4);

        Iterator<Vertex> iterator = map.weightedShortestPathIterator(vertex1, vertex5);
        assertTrue(iterator.hasNext(), "Iterator should have at least one element");
    }

    @Test
    void test_GenerateEdges() {
        int mapSize = 5;
        Map mapa = new Map(mapSize);
        mapa.generateVertexes(mapSize);
 assertEquals(mapSize, map.size(), "The number of vertices in the map should be equal to the specified map size");
    }

    @Test
    void test_TreeIterator() {
        Vertex vertex1 = map.getVertice(1);
        Vertex vertex2 = map.getVertice(2);
        Vertex vertex3 = map.getVertice(3);
        Vertex vertex4 = map.getVertice(4);
        Vertex vertex5 = map.getVertice(5);

        map.addEdge(vertex1, vertex2, 2);
        map.addEdge(vertex2, vertex3, 3);
        map.addEdge(vertex3, vertex4, 1);
        map.addEdge(vertex4, vertex5, 4);

        Iterator<Vertex> iterator = map.treeIterator(vertex1, vertex5);

        assertTrue(iterator.hasNext(), "Iterator should have at least one element");
    }

}

