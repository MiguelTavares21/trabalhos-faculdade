package projeto_ed;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import projeto_ed.Game.BotShortestEdge;
import projeto_ed.Game.Map;
import projeto_ed.Game.Team;
import projeto_ed.Game.Vertex;
import static org.junit.jupiter.api.Assertions.*;

public class BotShortestEdgeTest {

    private Map map;

    @BeforeEach
    void setUp() {
        map = new Map(5);
        map.generateVertexes(5);

        map.addEdge(map.getVertice(1), map.getVertice(2), 2);
        map.addEdge(map.getVertice(1), map.getVertice(3), 3);
        map.addEdge(map.getVertice(1), map.getVertice(4), 1);
        map.addEdge(map.getVertice(2), map.getVertice(3), 1);
        map.addEdge(map.getVertice(3), map.getVertice(4), 2);
        map.addEdge(map.getVertice(3), map.getVertice(5), 3);
        map.addEdge(map.getVertice(4), map.getVertice(5), 3);
        map.addEdge(map.getVertice(5), map.getVertice(2), 1);
    }

    @Test
    void testCreateRout() {

        Vertex startVertex = map.getVertice(1);
        Vertex flagVertex = map.getVertice(5);

        BotShortestEdge bot = new BotShortestEdge("Bot1", Team.EQUIPA1);

        bot.createRout(map, startVertex, flagVertex);

        assertFalse(bot.getRota().isEmpty());
    }

    @Test
    void testCreateRout2() {
        Vertex startVertex = map.getVertice(1);
        Vertex flagVertex = map.getVertice(5);

        BotShortestEdge bot = new BotShortestEdge("Bot1", Team.EQUIPA1);


        bot.createRout(map, startVertex, flagVertex);


        assertEquals(map.getVertice(3), bot.getRota().first());
    }


    @Test
    void testPlay() {

        Vertex startVertex = map.getVertice(1);
        Vertex flagVertex = map.getVertice(5);

        BotShortestEdge bot = new BotShortestEdge("Bot1", Team.EQUIPA2);
        bot.createRout(map, startVertex, flagVertex);

        bot.play(map);

        assertEquals(3, bot.getVerticeIndex());

        bot.play(map);

        assertEquals(5, bot.getVerticeIndex());
    }

    @Test
    void testPlay2() {

        Vertex startVertex = map.getVertice(1);
        Vertex flagVertex = map.getVertice(5);

        BotShortestEdge bot = new BotShortestEdge("Bot1", Team.EQUIPA2);
        BotShortestEdge bot1 = new BotShortestEdge("Bot2", Team.EQUIPA1);
        bot.createRout(map, startVertex, flagVertex);
        map.getVertice(3).setBot(bot1);

        bot.play(map);

        assertEquals(2, bot.getVerticeIndex());
    }

    @Test
    void testPlay3() {

        Vertex startVertex = map.getVertice(1);
        Vertex flagVertex = map.getVertice(5);

        BotShortestEdge bot = new BotShortestEdge("Bot1", Team.EQUIPA2);
        BotShortestEdge bot1 = new BotShortestEdge("Bot2", Team.EQUIPA1);
        bot.createRout(map, startVertex, flagVertex);
        map.getVertice(3).setBot(bot1);
        map.getVertice(2).setBot(bot1);

        bot.play(map);

        assertEquals(4, bot.getVerticeIndex());
    }

    @Test
    void testPlay4() {

        Vertex startVertex = map.getVertice(1);
        Vertex flagVertex = map.getVertice(5);

        BotShortestEdge bot = new BotShortestEdge("Bot1", Team.EQUIPA2);
        bot.setVerticeIndex(1);
        bot.setFlagIndex(5);

        bot.play(map);

        assertEquals(3, bot.getVerticeIndex());
    }

}
