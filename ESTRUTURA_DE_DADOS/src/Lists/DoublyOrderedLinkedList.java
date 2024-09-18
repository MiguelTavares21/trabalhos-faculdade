package Lists;

import Interfaces.OrderedListADT;
import Nodes.DoubleNode;

/**
 * DoublyOrderedLinkedList represents a doubly linked list that maintains order
 * based on the natural ordering of elements (implements Comparable).
 *
 * @param <T> the type of elements stored in the list, must implement Comparable
 */
public class DoublyOrderedLinkedList<T> extends DoublyLinkedList<T> implements OrderedListADT<T> {

    /**
     * Constructs an empty DoublyOrderedLinkedList.
     */
    public DoublyOrderedLinkedList(){
        super();
    }

    /**
     * Adds the specified element to the doubly ordered linked list in a sorted manner.
     * The list maintains order based on the natural ordering of elements (implements Comparable).
     *
     * @param element the element to be added to the list
     * @throws IllegalArgumentException if the element does not implement Comparable
     */
    @Override
    public void add(T element) {
        if (!(element instanceof Comparable)) {
            throw new IllegalArgumentException("Element must implement Comparable");
        }
    
        DoubleNode<T> newNode = new DoubleNode<>(element);
        if (isEmpty()) {
            setFront(newNode);
            setRear(newNode);
        } else if (((Comparable<T>) element).compareTo(super.getFront().getData()) <= 0) {
            newNode.setNext(super.getFront());
            getFront().setPrevious(newNode);
            setFront(newNode);
        } else if (((Comparable<T>) element).compareTo(getRear().getData()) >= 0) {
            newNode.setPrevious(super.getRear());
            newNode.setNext(null);  // Remova esta linha
            super.getRear().setNext(newNode);
            super.setRear(newNode);
        } else {
            DoubleNode<T> current = getFront();
            while (current != null && ((Comparable<T>) element).compareTo(current.getData()) > 0) {
                current = current.getNext();
            }
            newNode.setPrevious(current.getPrevious());
            newNode.setNext(current);
            current.getPrevious().setNext(newNode);
            current.setPrevious(newNode);
        }
        setSize(getSize() + 1);
        setModCount(getModCount() + 1);
    }
    

}
