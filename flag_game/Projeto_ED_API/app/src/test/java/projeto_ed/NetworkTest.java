package projeto_ed;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import projeto_ed.Graphs.Network;

import static org.junit.jupiter.api.Assertions.*;

public class NetworkTest {

    private Network<String> network;

    @BeforeEach
    public void setUp() {
        network = new Network<>();
    }

    @Test
    public void testAddEdge() {
        network.addVertex("A");
        network.addVertex("B");
        network.addEdge("A", "B", 5.0);

        assertTrue(network.getAdjMatrix()[0][1] == 5.0);
        assertTrue(network.getAdjMatrix()[1][0] == 0.0);
    }

    @Test
    public void testShortestPathWeight() {
        network.addVertex("A");
        network.addVertex("B");
        network.addVertex("C");
        network.addEdge("A", "B", 3.0);
        network.addEdge("B", "C", 2.0);
        network.addEdge("A", "C", 6.0);

        double weight = network.shortestPathWeight("A", "C");

        assertEquals(5.0, weight, 0.001);
    }


}
