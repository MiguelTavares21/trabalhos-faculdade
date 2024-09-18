package TreesAVL;

import Exceptions.ElementNotFoundException;
import Exceptions.EmptyCollectionException;
import Interfaces.BinarySearchTreeADT;

public class LinkedBinarySearchTreeAVL<T> extends LinkedBinaryTreeAVL<T> implements BinarySearchTreeADT<T> {

    /**
     * Creates an empty binary search tree.
     */
    public LinkedBinarySearchTreeAVL() {
        super();
    }

    /**
     * Creates a binary search with the specified element as its root.
     *
     * @param element the element that will be the root of the new
     *                binary search tree
     */
    public LinkedBinarySearchTreeAVL(T element) {
        super(element);
    }

    /**
     * Adds the specified object to the AVL binary search tree in the
     * appropriate position according to its key value.
     * Note that equal elements are added to the right.
     *
     * @param element the element to be added to the AVL binary search tree
     */
    public void addElement(T element) {
        AVLTreeNode<T> temp = new AVLTreeNode<T>(element);

        if (isEmpty()) {
            root = temp;
        } else {
            root = addElement(root, temp);
        }

        count++;
    }

    /**
     * Adds a new AVL tree node with the specified element to the AVL tree rooted at
     * the given current node. This method is a recursive helper method used in the
     * process of adding elements to the AVL tree while maintaining the AVL property.
     *
     * @param currentNode the current AVL tree node being considered
     * @param newNode     the new AVL tree node to be added
     * @return the updated root of the subtree after adding the new node
     */
    private AVLTreeNode<T> addElement(AVLTreeNode<T> currentNode, AVLTreeNode<T> newNode) {
        Comparable<T> element = (Comparable<T>) newNode.element;

        if (element.compareTo(currentNode.element) < 0) {
            if (currentNode.left == null) {
                currentNode.left = newNode;
            } else {
                currentNode.left = addElement(currentNode.left, newNode);
            }
        } else {
            if (currentNode.right == null) {
                currentNode.right = newNode;
            } else {
                currentNode.right = addElement(currentNode.right, newNode);
            }
        }

        updateHeight(currentNode);
        return rebalance(currentNode);
    }

    /**
     * Removes the first occurrence of the specified target
     * element from the AVL binary search tree and returns a reference to it.
     * Throws an ElementNotFoundException if the specified target
     * element is not found in the AVL binary search tree.
     *
     * @param targetElement the element being sought in the AVL binary search tree
     * @return a reference to the specified target
     * @throws ElementNotFoundException if an element not found exception occurs
     */
    public T removeElement(T targetElement)
            throws ElementNotFoundException {
        T result = null;
        if (!isEmpty()) {
            if (((Comparable) targetElement).equals(root.element)) {
                result = root.element;
                root = replacement(root);
                count--;
                root = rebalance(root);
                updateHeight(root);
            }

            else {
                AVLTreeNode<T> current, parent = root;
                boolean found = false;
                if (((Comparable) targetElement).compareTo(root.element) < 0)
                    current = root.left;
                else
                    current = root.right;
                while (current != null && !found) {
                    if (targetElement.equals(current.element)) {
                        found = true;
                        count--;
                        result = current.element;
                        if (current == parent.left) {
                            parent.left = replacement(current);
                        }

                        else {
                            parent.right = replacement(current);
                        }
                        root = rebalance(root);
                        updateHeight(root);
                    } else {
                        parent = current;
                        if (((Comparable) targetElement).compareTo(current.element) < 0)
                            current = current.left;
                        else
                            current = current.right;
                    }
                } // while
                if (!found)
                    throw new ElementNotFoundException("binary search tree");
            }
        } // end outer if
        return result;
    }

    /**
     * Returns a reference to a node that will replace the one
     * specified for removal. In the case where the removed node has
     * two children, the inorder successor is used as its replacement.
     *
     * @param node the node to be removeed
     * @return a reference to the replacing node
     */
    protected AVLTreeNode<T> replacement(AVLTreeNode<T> node) {
        AVLTreeNode<T> result = null;
        if ((node.left == null) && (node.right == null))
            result = null;
        else if ((node.left != null) && (node.right == null))
            result = node.left;
        else if ((node.left == null) && (node.right != null))
            result = node.right;

        else {
            AVLTreeNode<T> current = node.right;
            AVLTreeNode<T> parent = node;
            while (current.left != null) {
                parent = current;
                current = current.left;
            }
            if (node.right == current)
                current.left = node.left;
            else {
                parent.left = current.right;
                current.right = node.right;
                current.left = node.left;
            }
            result = current;
            result = rebalance(result);
            updateHeight(root);
        }
        return result;
    }

    /**
     * Removes all occurrences of the specified target element from the AVL binary search tree.
     *
     * @param targetElement the element to be removed from the AVL binary search tree
     */
    @Override
    public void removeAllOccurrences(T targetElement) {
        try {
            while (contains((T) targetElement))
                removeElement(targetElement);
        } catch (Exception ElementNotFoundException) {
        }
    }

    /**
     * Removes and returns the smallest element from the AVL binary search tree.
     * Rebalances the tree after removal.
     *
     * @return the smallest element in the AVL binary search tree
     */
    @Override
    public T removeMin() {
        T result = null;

        if (isEmpty())
            throw new EmptyCollectionException("binary tree");
        else {
            if (root.left == null) {
                result = root.element;
                root = root.right;
                root = rebalance(root);
                updateHeight(root);
            } else {
                AVLTreeNode<T> parent = root;
                AVLTreeNode<T> current = root.left;
                while (current.left != null) {
                    parent = current;
                    current = current.left;
                }
                result = current.element;
                parent.left = current.right;
                root = rebalance(root);
                updateHeight(root);
            }

            count--;
        } // else

        return result;
    }

    /**
     * Removes and returns the largest element from the AVL binary search tree.
     * Rebalances the tree after removal.
     *
     * @return the largest element in the AVL binary search tree
     */
    @Override
    public T removeMax() {
        T result = null;

        if (isEmpty())
            throw new EmptyCollectionException("binary tree");
        else {
            if (root.right == null) {
                result = root.element;
                root = root.left;
                root = rebalance(root);
                updateHeight(root);
            } // if
            else {
                AVLTreeNode<T> parent = root;
                AVLTreeNode<T> current = root.right;

                while (current.right != null) {
                    parent = current;
                    current = current.right;
                } // while

                result = current.element;
                parent.right = current.left;
                root = rebalance(root);
                updateHeight(root);
            }

            count--;
        }

        return result;
    }

    /**
     * Returns the smallest element in the AVL binary search tree.
     *
     * @return the smallest element in the AVL binary search tree
     * @throws EmptyCollectionException if the binary tree is empty
     */
    @Override
    public T findMin() {
        T result = null;

        if (isEmpty())
            throw new EmptyCollectionException("binary tree");
        else {
            AVLTreeNode<T> current = root;

            while (current.left != null)
                current = current.left;

            result = current.element;
        }

        return result;

    }

    /**
     * Returns the largest element in the AVL binary search tree.
     *
     * @return the largest element in the AVL binary search tree
     * @throws EmptyCollectionException if the binary tree is empty
     */
    @Override
    public T findMax() {
        T result = null;

        if (isEmpty())
            throw new EmptyCollectionException("binary tree");
        else {
            AVLTreeNode<T> current = root;

            while (current.right != null)
                current = current.right;

            result = current.element;
        } // else

        return result;
    }

    /**
     * Returns the height of the given AVL tree node.
     * If the node is null, it returns -1, indicating an empty subtree.
     *
     * @param node the AVL tree node for which to determine the height
     * @return the height of the node or -1 if the node is null
     */
    private int height(AVLTreeNode<T> node) {
        if (node != null) {
            return node.height;
        } else {
            return -1;
        }
    }

    /**
     * Updates the height of the given AVL tree node based on the heights
     * of its left and right children.
     *
     * @param node the AVL tree node to update the height for
     */
    private void updateHeight(AVLTreeNode<T> node) {
        int leftChildHeight = height(node.left);
        int rightChildHeight = height(node.right);
        node.height = Math.max(leftChildHeight, rightChildHeight) + 1;
    }

    /**
     * Calculates the balance factor of the given AVL tree node,
     * which is the difference between the height of the right subtree
     * and the height of the left subtree.
     *
     * @param node the AVL tree node for which to calculate the balance factor
     * @return the balance factor of the node
     */
    private int balanceFactor(AVLTreeNode<T> node) {
        return height(node.right) - height(node.left);
    }

    /**
     * Performs a right rotation on the given AVL tree node.
     * This operation assumes a left-heavy subtree.
     *
     * @param node the AVL tree node to perform the rotation on
     * @return the new root of the subtree after the rotation
     */
    private AVLTreeNode<T> rotateRight(AVLTreeNode<T> node) {
        AVLTreeNode<T> leftChild = node.left;

        node.left = leftChild.right;
        leftChild.right = node;

        updateHeight(node);
        updateHeight(leftChild);

        return leftChild;
    }

    /**
     * Performs a left rotation on the given AVL tree node.
     * This operation assumes a right-heavy subtree.
     *
     * @param node the AVL tree node to perform the rotation on
     * @return the new root of the subtree after the rotation
     */
    private AVLTreeNode<T> rotateLeft(AVLTreeNode<T> node) {
        AVLTreeNode<T> rightChild = node.right;

        node.right = rightChild.left;
        rightChild.left = node;

        updateHeight(node);
        updateHeight(rightChild);

        return rightChild;
    }

    /**
     * Rebalances the given AVL tree node if it is unbalanced.
     * Performs rotations based on the balance factor to ensure
     * the AVL property is maintained.
     *
     * @param node the AVL tree node to rebalance
     * @return the new root of the subtree after rebalancing
     */
    private AVLTreeNode<T> rebalance(AVLTreeNode<T> node) {
        int balanceFactor = balanceFactor(node);

        if (balanceFactor < -1) {
            if (height(node.left.right) > height(node.left.left)) {
                node.left = rotateLeft(node.left);
            }

            node = rotateRight(node);
        }

        else if (balanceFactor > 1) {
            if (height(node.right.left) > height(node.right.right)) {

                node.right = rotateRight(node.right);
            }

            node = rotateLeft(node);
        }

        return node;
    }

}
