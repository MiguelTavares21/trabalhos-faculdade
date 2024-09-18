package projeto_ed.Game;

import projeto_ed.Queues.LinkedQueue;

/**
 * Abstract class representing a Bot in the game.
 */
public abstract class Bot {
    Team team;
    private String nome;
    private LinkedQueue<Vertex> rota;

    private int flagIndex;

    private int verticeIndex;

    private int lastVerticeIndex;
    private static int counter;

    /**
     * Constructor method for the class Bot
     * @param botName The name of the bot
     * @param team The team the bot will be playing for
     */
    public Bot( String botName, Team team){
        this.nome = botName;
        this.team = team;
        rota = null;
    }

    /**
     * @return The number of times the bots haven't moved in a match
     */
    public static int getCounter() {
        return counter;
    }

    /**
     * Changes the number of times the bots haven't moved in a match
     * @param counter The number of times the bots haven't moved in a match
     */
    public static void setCounter(int counter) {
        Bot.counter = counter;
    }


    /**
     * @return The bot´s name
     */
    public String getNome() {
        return nome;
    }

    /**
     * Changes the bot´s name
     * @param nome New name to set
     */
    public void setNome(String nome) {
        this.nome = nome;
    }

    /**
     * @return The bot´s team
     */
    public Team getEquipa(){
        return this.team;
    }

    /**
     * Changes the bot´s team
     * @param team New team to set
     */
    public void setEquipa(Team team){
        this.team = team;
    }

    /**
     * @return The position of a flag
     */
    public int getFlagIndex() {
        return flagIndex;
    }

    /**
     * Sets the flags position
     * @param flagIndex New position to set
     */
    public void setFlagIndex(int flagIndex) {
        this.flagIndex = flagIndex;
    }

    /**
     * @return The vertex index
     */
    public int getVerticeIndex() {
        return verticeIndex;
    }

    /**
     * Sets the vertex position
     * @param verticeIndex New position to set
     */
    public void setVerticeIndex(int verticeIndex) {
        this.verticeIndex = verticeIndex;
    }

    /**
     * @return The bot route
     */
    public LinkedQueue<Vertex> getRota() {
        return rota;
    }

    /**
     * Sets the route
     * @param rota New route to set
     */
    public void setRota(LinkedQueue<Vertex> rota) {
        this.rota = rota;
    }

    /**
     * @return The last position of the bot
     */
    public int getLastVerticeIndex() {
        return lastVerticeIndex;
    }

    /**
     * Sets the last vertex position
     * @param lastVerticeIndex New position to set
     */
    public void setLastVerticeIndex(int lastVerticeIndex) {
        this.lastVerticeIndex = lastVerticeIndex;
    }
}
