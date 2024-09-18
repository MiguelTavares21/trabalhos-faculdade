package projeto_ed.MapsManagement;

import projeto_ed.Game.Map;

/**
 * Interface for exporting maps to text files.
 */
public interface Exporter {

    /**
     * Saves a Map object to a text file and throws an IllegalArgumentException in case the map is empty.
     *
     * @param map The Map object representing the map to be saved.
     * @param fileName A path specifying the name and location of the file.
     */
    public void saveMapToFile(Map map, String fileName);
}
