package projeto_ed.Lists;

/**
 * UnorderedListADT represents the interface for an unordered list.
 *
 * @param <T> the type of elements stored in the list
 */
public interface UnorderedListADT<T> extends ListADT<T> {
    /**
     * Adds the specified element to the front of this list.
     *
     * @param element the element to be added to the front of this list
     */
    void addToFront(T element);

    /**
     * Adds the specified element to the rear of this list.
     *
     * @param element the element to be added to the rear of this list
     */
    void addToRear(T element);

    /**
     * Adds the specified element after the target element in this list.
     *
     * @param element the element to be added
     * @param target  the target element after which the new element will be added
     */
    void addAfter(T element, T target);
}