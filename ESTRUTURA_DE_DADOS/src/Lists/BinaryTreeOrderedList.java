package Lists;

import java.util.Iterator;

import Interfaces.*;
import Trees.LinkedBinarySearchTree;

/**
 * The BinaryTreeOrderedList class represents an ordered list implemented using a binary search tree.
 * Elements can be added to the list, and operations like removing the first, last, or a specified element
 * are supported. The list maintains its order based on the natural ordering of elements.
 *
 * @param <T> the type of elements stored in the list, must be comparable
 */
public class BinaryTreeOrderedList<T> extends LinkedBinarySearchTree<T> implements OrderedListADT<T>
{

   /**
    * Creates an empty BinaryTreeOrderedList.
    */
   public BinaryTreeOrderedList() 
   {
      super();
   }  // constructor BinarSearchTreeList


   /**
    * Adds the specified element to the ordered list.
    *
    * @param element the element to be added to the list
    */
public void add (T element)
   {
      addElement(element);
   }  // method add

   /**
    * Removes and returns the first element from this ordered list.
    *
    * @return the first element in the ordered list
    */
   public T removeFirst ()
   {
      return removeMin();
   }

   /**
    * Removes and returns the last element from this ordered list.
    *
    * @return the last element in the ordered list
    */
   public T removeLast ()
   {
      return removeMax();
   }

   /**
    * Removes and returns the specified element from this ordered list.
    *
    * @param element the element to be removed from the list
    * @return the removed element
    */
   public T remove (T element)
   {
      return removeElement(element);
   }

   /**
    * Returns a reference to the first element on this ordered list.
    *
    * @return the first element in the ordered list
    */
   public T first ()
   {
      return findMin();
   }

   /**
    * Returns a reference to the last element on this ordered list.
    *
    * @return the last element in the ordered list
    */
   public T last ()
   {
      return findMax();
   }

   /**
    * Returns an iterator for the ordered list, providing an in-order traversal.
    *
    * @return an iterator for the ordered list
    */
   public Iterator<T> iterator()
   {
      return iteratorInOrder();
   }
}
