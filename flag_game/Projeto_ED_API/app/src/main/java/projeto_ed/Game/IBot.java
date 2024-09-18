package projeto_ed.Game;

/**
 * Interface representing a game bot.
 */
public interface IBot {

    /**
     * Creates a route on the given map from the specified start vertex to the flag.
     *
     * @param map          The map on which the route is created.
     * @param startVertex  The starting vertex of the route.
     * @param flag         The destination vertex (flag) of the route.
     */
    public void createRout(Map map, Vertex startVertex, Vertex flag);

    /**
     * Plays the bot on the given map, moving it along the pre-determined route.
     * If the route is empty, a new route is created from the current position to the flag.
     *
     * @param map The map on which the bot is playing.
     */
    public void play(Map map);
}
