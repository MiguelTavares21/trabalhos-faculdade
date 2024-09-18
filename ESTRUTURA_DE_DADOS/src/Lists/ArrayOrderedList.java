package Lists;

import Interfaces.OrderedListADT;

/**
 * The ArrayOrderedList class represents an ordered list implemented using an array.
 * Elements are added in their natural order based on their comparable values.
 *
 * @param <T> the type of elements stored in the list, must extend Comparable
 */
public class ArrayOrderedList<T extends Comparable<T>> extends ArrayList<T> implements OrderedListADT<T> {

    /**
     * Creates an empty ordered list with the default capacity.
     */
    public ArrayOrderedList() {
        super();
    }

    /**
     * Expands the capacity of the underlying array when needed.
     */
    private void expandCapacity() {
        T[] newArray = (T[]) new Comparable[super.getArray().length * 2];
        System.arraycopy(super.getArray(), 0, newArray, 0, super.getTop());
        super.setArray(newArray);
    }


    /**
     * Adds the specified element to the ordered list in its proper location
     * based on the natural order of elements.
     *
     * @param element the element to be added to the list
     */
    @Override
    public void add(T element) {
        if (super.getTop() == super.getArray().length) {
            expandCapacity();
        }

        int index = 0;


        while (index < super.getTop() && element.compareTo(super.getArray()[index]) > 0) {
            index++;
        }

        for (int i = super.getTop(); i > index; i--) {
            super.getArray()[i] = super.getArray()[i - 1];
        }

        super.getArray()[index] = element;
        super.setTop(super.getTop() + 1);
        super.setModCount(super.getModCount() + 1);
    }

    /**
     * Returns a string representation of the ordered list.
     *
     * @return a string representation of the ordered list
     */
    @Override
    public String toString(){
        return super.toString();
    }
}