package projeto_ed.Heaps;

import java.util.Iterator;

/**
 * PriorityQueue demonstrates a priority queue using a Heap.
 *
 */
public class PriorityQueue<T> extends ArrayHeap<PriorityQueueNode<T>> {
    /**
     * Creates an empty priority queue.
     */
    public PriorityQueue() {
        super();
    }

    /**
     * Adds the given element to this PriorityQueue.
     *
     * @param object   the element to be added to the priority queue
     * @param priority the integer priority of the element to be added
     */
    public void addElement(T object, int priority) {
        PriorityQueueNode<T> node = new PriorityQueueNode<T>(object, priority);
        super.addElement(node);
    }

    /**
     * Removes the next highest priority element from this priority
     * queue and returns a reference to it.
     *
     * @return a reference to the next highest priority element
     *         in this queue
     */
    public T removeNext() {
        PriorityQueueNode<T> temp = (PriorityQueueNode<T>) super.removeMin();
        return temp.getElement();
    }

    /**
     * Changes the priority of a specified element in the priority queue.
     *
     * @param element      The element whose priority is to be changed.
     * @param newPriority  The new priority to be set for the specified element.
     */
    public void changePriority(T element, int newPriority) {
        for (Iterator<PriorityQueueNode<T>> it = super.iteratorInOrder(); it.hasNext(); ) {
            PriorityQueueNode<T> priorityQueueNode = it.next();
            if (priorityQueueNode.getElement().equals(element)) {
                priorityQueueNode.setPriority(newPriority);
            }
        }
    }
}