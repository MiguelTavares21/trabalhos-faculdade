package projeto_ed.Stacks;

import projeto_ed.Nodes.Node;

/**
 * LinkedStack represents a stack implemented using a linked structure.
 *
 * @param <T> the type of elements stored in the stack
 */
public class LinkedStack<T> implements StackADT<T> {
    private final String EMPTY_ERROR = "This stack is empty";
    private Node<T> top;
    private int size;

    /**
     * Creates an empty linked stack.
     */
    public LinkedStack() {
        top = null;
        size = 0;
    }


    /**
     * Adds the specified element to the top of the stack.
     *
     * @param element the element to be pushed onto the stack
     */
    @Override
    public void push(T element) {
        Node<T> newNode = new Node<>(element);
        if (isEmpty()) {
            top = newNode;
        } else {
            newNode.setNext(top);
            top = newNode;
        }
        size++;
    }

    /**
     * Removes and returns the element at the top of the stack.
     *
     * @return the element at the top of the stack
     * @throws IllegalStateException if the stack is empty
     */
    @Override
    public T pop() {
        if (isEmpty()) {
            throw new IllegalStateException(EMPTY_ERROR);
        }
        T removed = top.getData();
        top = top.getNext();
        size--;
        return removed;
    }

    /**
     * Returns the element at the top of the stack without removing it.
     *
     * @return the element at the top of the stack
     * @throws IllegalStateException if the stack is empty
     */
    @Override
    public T peek() {
        if (isEmpty()) {
            throw new IllegalStateException(EMPTY_ERROR);
        }
        return top.getData();
    }

    /**
     * Checks if the stack is empty.
     *
     * @return true if the stack is empty, false otherwise
     */
    @Override
    public boolean isEmpty() {
        return size == 0;
    }

    /**
     * Returns the number of elements in the stack.
     *
     * @return the number of elements in the stack
     */
    @Override
    public int size() {
        return size;
    }

    /**
     * Returns a string representation of the stack.
     *
     * @return a string representation of the stack
     * @throws IllegalStateException if the stack is empty
     */
    @Override
    public String toString() {
        if (isEmpty()) {
            throw new IllegalStateException(EMPTY_ERROR);
        }
        StringBuilder sb = new StringBuilder();
        Node<T> current = top;
        sb.append("Stack:\n");
        while (current != null) {
            sb.append(current.getData());
            if(current.getNext() != null){
                sb.append("\n");
            }
            current = current.getNext();
        }
        return sb.toString();
    }
}