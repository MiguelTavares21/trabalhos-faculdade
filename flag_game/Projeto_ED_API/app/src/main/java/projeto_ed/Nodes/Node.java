package projeto_ed.Nodes;

/**
 * Node represents a node in a linked list with generic data.
 *
 * @param <T> the type of data stored in the node
 */
public class Node<T>{
    private Node<T> next;
    private T data;

    /**
     * Constructs an empty Node with null data and next references.
     */
    public Node(){
    }

    /**
     * Constructs a Node with the specified element and null next reference.
     *
     * @param element the data for the node
     */
    public Node(T element){
        data = element;
        next = null;
    }

    /**
     * Constructs a Node with null data and the specified next reference.
     *
     * @param node the next node reference
     */
    public Node(Node<T> node){
        data = null;
        next = node;
    }

    /**
     * Constructs a Node with the specified element and next reference.
     *
     * @param element the data for the node
     * @param node    the next node reference
     */
    public Node(T element, Node<T> node){
        data = element;
        next = node;
    }

    /**
     * Sets the data of the node.
     *
     * @param data the data to be set
     */
    public void setData(T data) {
        this.data = data;
    }

    /**
     * Sets the next node reference.
     *
     * @param next the next node reference
     */
    public void setNext(Node<T> next) {
        this.next = next;
    }

    /**
     * Returns the data stored in the node.
     *
     * @return the data of the node
     */
    public T getData() {
        return data;
    }

    /**
     * Returns the next node reference.
     *
     * @return the next node reference
     */
    public Node<T> getNext() {
        return next;
    }


}