package projeto_ed.Game;

/**
 * Represents a vertex in the game graph.
 */
public class Vertex {

    private int index;
    private Bot bot;

    private boolean hasFlag1;

    private boolean hasFlag2;

    /**
     * Constructs a new Vertex with no associated bot.
     */
    public Vertex() {
        bot = null;
    }

    /**
     * Checks if the vertex is occupied by a bot.
     *
     * @return true if the vertex is occupied, false otherwise.
     */
    public boolean isOccupied() {
        return !(bot == null);
    }

    /**
     * Gets the bot associated with the vertex.
     *
     * @return The bot associated with the vertex, or null if the vertex is not occupied.
     */
    public Bot getBot() {
        return bot;
    }

    /**
     * Sets the bot associated with the vertex.
     *
     * @param bot The bot to be associated with the vertex.
     */
    public void setBot(Bot bot) {
        this.bot = bot;
    }

    /**
     * Gets the index of the vertex.
     *
     * @return The index of the vertex.
     */
    public int getindex() {
        return index;
    }

    /**
     * Sets the index of the vertex.
     *
     * @param index The index to be set for the vertex.
     */
    public void setIndex(int index) {
        this.index = index;
    }

    /**
     * Checks if the vertex has Flag 1.
     *
     * @return true if the vertex has Flag 1, false otherwise.
     */
    public boolean isHasFlag1() {
        return hasFlag1;
    }

    /**
     * Sets whether the vertex has Flag 1.
     *
     * @param hasFlag1 true if the vertex has Flag 1, false otherwise.
     */
    public void setHasFlag1(boolean hasFlag1) {
        this.hasFlag1 = hasFlag1;
    }

    /**
     * Checks if the vertex has Flag 2.
     *
     * @return true if the vertex has Flag 2, false otherwise.
     */
    public boolean isHasFlag2() {
        return hasFlag2;
    }

    /**
     * Sets whether the vertex has Flag 2.
     *
     * @param hasFlag2 true if the vertex has Flag 2, false otherwise.
     */
    public void setHasFlag2(boolean hasFlag2) {
        this.hasFlag2 = hasFlag2;
    }
}
