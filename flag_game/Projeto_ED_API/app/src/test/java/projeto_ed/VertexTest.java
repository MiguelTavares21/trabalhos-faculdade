package projeto_ed;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import projeto_ed.Game.*;

    /**
     * Unit tests for the Vertex class.
     */
    public class VertexTest {

        private Vertex vertex;

        @BeforeEach
        public void setUp() {
            vertex = new Vertex();
        }

        @Test
        public void testIsOccupiedWhenBotIsNull() {
            assertFalse(vertex.isOccupied());
        }

        @Test
        public void testIsOccupiedWhenBotIsNotNull() {
            Bot bot = new BotTree("a",Team.EQUIPA1);
            vertex.setBot(bot);
            assertTrue(vertex.isOccupied());
        }

        @Test
        public void testGetBot() {
            Bot bot = new BotTree("b",Team.EQUIPA1);
            vertex.setBot(bot);
            assertEquals(bot, vertex.getBot());
        }

        @Test
        public void testSetBot() {
            Bot bot = new BotTree("c",Team.EQUIPA1);
            vertex.setBot(bot);
            assertEquals(bot, vertex.getBot());
        }

        @Test
        public void testGetIndex() {
            int index = 42;
            vertex.setIndex(index);
            assertEquals(index, vertex.getindex());
        }

        @Test
        public void testSetIndex() {
            int index = 42;
            vertex.setIndex(index);
            assertEquals(index, vertex.getindex());
        }

        @Test
        public void testIsHasFlag1() {
            assertFalse(vertex.isHasFlag1());
            vertex.setHasFlag1(true);
            assertTrue(vertex.isHasFlag1());
        }

        @Test
        public void testSetHasFlag1() {
            assertFalse(vertex.isHasFlag1());
            vertex.setHasFlag1(true);
            assertTrue(vertex.isHasFlag1());
        }

        @Test
        public void testIsHasFlag2() {
            assertFalse(vertex.isHasFlag2());
            vertex.setHasFlag2(true);
            assertTrue(vertex.isHasFlag2());
        }

        @Test
        public void testSetHasFlag2() {
            assertFalse(vertex.isHasFlag2());
            vertex.setHasFlag2(true);
            assertTrue(vertex.isHasFlag2());
        }
    }
