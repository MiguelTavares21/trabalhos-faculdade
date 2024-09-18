package projeto_ed.Game;

import projeto_ed.Queues.LinkedQueue;

import java.util.Iterator;

/**
 * Represents a Bot using the shortestPath route in the game.
 */
public class BotShortestPath extends Bot implements IBot {
    private double routeWeight;

    /**
     * Constructor method for the BotShortestPath class
     * @param botName The bot name
     * @param team The bot team
     */
    public BotShortestPath(String botName, Team team) {
        super(botName, team);
        routeWeight = 0;
        this.setRota(new LinkedQueue<>());
    }

    @Override
    public void createRout(Map map, Vertex startVertex, Vertex flag) {
        LinkedQueue<Vertex> rota = new LinkedQueue<>();
        this.setFlagIndex(flag.getindex());
        this.setVerticeIndex(startVertex.getindex());
        for (Iterator<Vertex> it = map.iteratorShortestPath(startVertex, flag); it.hasNext(); ) {
            Vertex vertex = it.next();
            rota.enqueue(vertex);
        }
        routeWeight = map.shortestPathWeight(startVertex, flag);
        rota.dequeue();
        this.setRota(rota);
    }

    @Override
    public void play(Map map) {
        if (getRota().isEmpty()) {
            createRout(map, map.getVertice(this.getVerticeIndex()), map.getVertice(this.getFlagIndex()));
        }
        Vertex vertex = getRota().first();
        if(vertex != null) {
            if (!vertex.isOccupied()) {
                this.setLastVerticeIndex(this.getVerticeIndex());
                map.getVertice(this.getVerticeIndex()).setBot(null);
                vertex.setBot(this);
                getRota().dequeue();
                this.setVerticeIndex(vertex.getindex());
                setCounter(0);
            } else {
                Vertex currentVertex = map.getVertice(this.getVerticeIndex());
                Vertex nextVertex = findNextAvailableVertex(map, currentVertex);

                if (nextVertex != null) {
                    this.setLastVerticeIndex(this.getVerticeIndex());
                    map.getVertice(this.getVerticeIndex()).setBot(null);
                    createRout(map, nextVertex, map.getVertice(this.getFlagIndex()));
                    nextVertex.setBot(this);
                    this.setVerticeIndex(nextVertex.getindex());
                    setCounter(0);
                }else {
                    setCounter(getCounter() + 1);
                }
            }
        }else{
            createRout(map, map.getVertice(this.getVerticeIndex()), map.getVertice(this.getFlagIndex()));
        }
    }


    /**
     * Finds the next available vertex for the bot to move to, considering the adjacency matrix.
     *
     * @param map            The map on which the bot is playing.
     * @param currentVertex  The current vertex of the bot.
     * @return The next available vertex, or null if no such vertex is found.
     */
    private Vertex findNextAvailableVertex(Map map, Vertex currentVertex) {
        int index = -1;
        double custo;
        double menorCusto = Double.POSITIVE_INFINITY;
        double[][] matriz = map.getAdjMatrix();
        for (int i = 0; i < map.size(); i++) {
            if (matriz[currentVertex.getindex() - 1][i] > 0 && (i != this.getLastVerticeIndex()-1) && !map.getVertice(i+1).isOccupied()) {
                custo = map.shortestPathWeight(map.getVertice(i + 1), map.getVertice(this.getFlagIndex()));
                if(custo < menorCusto){
                    menorCusto = custo;
                    index = i;
                }
            }
        }
        if(index != -1){
            return map.getVertice(index + 1);
        }else{
            return null;
        }
    }


}

