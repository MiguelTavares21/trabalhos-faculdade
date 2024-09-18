
import projeto_ed.Game.*;
import projeto_ed.Lists.DoublyUnorderedLinkedList;
import projeto_ed.MapsManagement.*;

import java.util.InputMismatchException;
import java.util.Random;
import java.util.Scanner;

public class Main {


    /**
     * Controls the limits of the input.
     * @param read Scanner that reads the input
     * @param min Minimum limit to the integer.
     * @param max Maximum limit to the integer.
     * @return The option once it's validated.
     */
    public static int readIntWithLimit(Scanner read, int min, int max) {
        boolean valid = false;
        int option = 0;
        while (!valid) {
            try {
                option = read.nextInt();
            } catch (InputMismatchException e) {
                read.nextLine();
                continue;
            }
            if (option >= min && option <= max) {
                valid = true;
            }
            read.nextLine();
        }
        return option;
    }

    public static void setAvailableBots(DoublyUnorderedLinkedList<Integer> playerBots) {
        playerBots.addToRear(1);
        playerBots.addToRear(2);
        playerBots.addToRear(3);
    }

    public static int chooseBot(Scanner scanner, DoublyUnorderedLinkedList<Integer> botList) {
        boolean valid = false;
        int chosenBot = 0;

        while (!valid) {
            try {
                chosenBot = scanner.nextInt();
            } catch (InputMismatchException e) {
                scanner.nextLine();
                continue;
            }

            if (botList.contains(chosenBot)) {
                valid = true;
            } else if (chosenBot < 0 || chosenBot > 3) {
                System.out.println("Invalid choice, the number is out of bounds");
                scanner.nextLine();
            } else {
                System.out.println("Invalid choice. You have already chosen this bot.");
                scanner.nextLine();
            }
        }

        scanner.nextLine();
        return chosenBot;
    }


    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);
        MapExporter exporter = new MapExporter();
        MapImporter importer = new MapImporter();
        int escolha;

        do {
            System.out.println("====Menu====");
            System.out.println("1 - Play a match");
            System.out.println("2 - Map Creator menu");
            System.out.println("3 - Exit");
            escolha = readIntWithLimit(scanner, 1, 3);
            Map mapToUse = null;
            Map mapToCreate;
            switch (escolha) {
                case 1:
                    System.out.println("====LetÂ´s begin====");
                    System.out.println("Do you wish to:");
                    System.out.println("1 - Import a map");
                    System.out.println("2 - Create one");
                    int mapAnswer = readIntWithLimit(scanner, 1, 2);
                    switch (mapAnswer) {
                        case 1:
                            System.out.println("Introduce the path for the map you want to import:");
                            String pathMap = scanner.nextLine();
                            mapToUse = importer.loadMapFromFile(pathMap);
                            System.out.println("This is the map you generated:");
                            mapToUse.printMap();
                            System.out.println();
                            System.out.println("These are the map edges:");
                            mapToUse.printEdges();
                            System.out.println();
                            break;
                        case 2:
                            System.out.println("How many positions do you want your map to have, minimum 10 and maximum 100:");
                            int mapSizeToUse = readIntWithLimit(scanner, 10, 100);
                            mapToUse = new Map(mapSizeToUse);
                            mapToUse.generateVertexes(mapSizeToUse);
                            System.out.println("Do you want your map to be:");
                            System.out.println("1 - Directional");
                            System.out.println("2 - Non directional");
                            int mapTypeToUse = readIntWithLimit(scanner, 1, 2);
                            int coverageToUse;
                            switch (mapTypeToUse) {
                                case 1:
                                    System.out.println("Introduce the coverage you want to have on this map, you need a minimum of 30% coverage in this case:");
                                    coverageToUse = readIntWithLimit(scanner, 30, 100);
                                    mapToUse.generateRandomCompleteDirectionalGraph(coverageToUse);
                                    break;
                                case 2:
                                    System.out.println("Introduce the coverage you want to have on this map, you need a minimum of 20% coverage in this case:");
                                    coverageToUse = readIntWithLimit(scanner, 20, 100);
                                    mapToUse.generateRandomCompleteNonDirectionalGraph(coverageToUse);
                                    break;
                            }
                            System.out.println("This is the map you generated:");
                            mapToUse.printMap();
                            System.out.println();
                            System.out.println("These are the map edges:");
                            mapToUse.printEdges();
                            System.out.println();
                            System.out.println("Do you want to save this map?");
                            System.out.println("1 - Save");
                            System.out.println("2 - Dont save");
                            int answerToUseSave = readIntWithLimit(scanner, 1, 2);
                            switch (answerToUseSave) {
                                case 1:
                                    System.out.println("What do you want to call your map?");
                                    String nameToUse = scanner.nextLine();
                                    System.out.println("Introduce the path where you wish to store the map, introduce just the folder with no \\ in front of it:");
                                    String pathToUse = scanner.nextLine();
                                    String fullPathToSave = pathToUse + "\\" + nameToUse + ".txt";
                                    exporter.saveMapToFile(mapToUse, fullPathToSave);
                                    break;
                                case 2:
                                    System.out.println("The map wasnt saved to a file but you will be able to play this match with it.");
                                    break;
                            }
                            break;
                    }

                    System.out.println("Now let's define the game settings");
                    System.out.println("Player 1: Choose the position of your flag");
                    mapToUse.printMap();
                    int choose1 = readIntWithLimit(scanner, 1, mapToUse.size());
                    System.out.println("Player 2: Choose the position of your flag");
                    mapToUse.printMap();
                    int choose2;
                    do {
                        choose2 = readIntWithLimit(scanner, 1, mapToUse.size());
                        if (choose2 == choose1) {
                            System.out.println("You cannot choose this position because flag 1 is there");
                        }
                    } while (choose1 == choose2);
                    Vertex flag1 = mapToUse.getVertice(choose1);
                    flag1.setHasFlag1(true);
                    Vertex flag2 = mapToUse.getVertice(choose2);
                    flag2.setHasFlag2(true);
                    System.out.println("It looked like this:");
                    mapToUse.printMap();
                    System.out.println("Now let's define the bots");
                    System.out.println("How many bots do you want?");
                    int maxBots;
                    if (mapToUse.size() <= 20) {
                        System.out.println("Maximum 3 bots");
                        System.out.println("Choose:");
                        maxBots = readIntWithLimit(scanner, 1, 3);
                    } else if (mapToUse.size() <= 40) {
                        System.out.println("Maximum 5 bots");
                        System.out.println("Choose:");
                        maxBots = readIntWithLimit(scanner, 1, 5);
                    } else {
                        System.out.println("Maximum 10 bots");
                        System.out.println("Choose:");
                        maxBots = readIntWithLimit(scanner, 1, 10);
                    }

                    DoublyUnorderedLinkedList<Bot> listBots = new DoublyUnorderedLinkedList<>();
                    DoublyUnorderedLinkedList<Integer> player1 = new DoublyUnorderedLinkedList<>();
                    setAvailableBots(player1);
                    DoublyUnorderedLinkedList<Integer> player2 = new DoublyUnorderedLinkedList<>();
                    setAvailableBots(player2);
                    int chooseBot;
                    int numBots = 1;
                    Team team;

                    for (int i = 0; i < maxBots * 2; i++) {
                        if (i % 2 == 0) {
                            team = Team.EQUIPA1;
                            System.out.println("Player 1, choose your bot number " + numBots);
                        } else {
                            team = Team.EQUIPA2;
                            System.out.println("Player 2, choose your bot number " + numBots);
                        }
                        System.out.println("[ 1 ] - Bot shortest path by cost");
                        System.out.println("[ 2 ] - Bot shortest path by number of edges");
                        System.out.println("[ 3 ] - Bot path through the minimum cost generating tree");
                        if (i % 2 == 0) {
                            if (player1.isEmpty()) {
                                setAvailableBots(player1);
                            }
                            chooseBot = chooseBot(scanner, player1);
                            player1.remove(chooseBot);
                        } else {
                            if (player2.isEmpty()) {
                                setAvailableBots(player2);
                            }
                            chooseBot = chooseBot(scanner, player2);
                            player2.remove(chooseBot);
                        }
                        if (i % 2 == 1) {
                            numBots++;
                        }
                        System.out.println("Name (Avoid choosing long names):");
                        String name = scanner.nextLine();

                        switch (chooseBot) {
                            case 1:
                                BotShortestPath bot1 = new BotShortestPath(name, team);
                                if (bot1.getEquipa() == Team.EQUIPA1) {
                                    bot1.createRout(mapToUse, flag1, flag2);
                                } else {
                                    bot1.createRout(mapToUse, flag2, flag1);
                                }
                                listBots.addToRear(bot1);
                                break;
                            case 2:
                                BotShortestEdge bot2 = new BotShortestEdge(name, team);
                                if (bot2.getEquipa() == Team.EQUIPA1) {
                                    bot2.createRout(mapToUse, flag1, flag2);
                                } else {
                                    bot2.createRout(mapToUse, flag2, flag1);
                                }
                                listBots.addToRear(bot2);
                                break;
                            case 3:
                                BotTree bot3 = new BotTree(name, team);
                                if (bot3.getEquipa() == Team.EQUIPA1) {
                                    bot3.createRout(mapToUse, flag1, flag2);
                                } else {
                                    bot3.createRout(mapToUse, flag2, flag1);
                                }
                                listBots.addToRear(bot3);
                                break;
                        }
                    }

                    System.out.println("The game is going to start!");
                    System.out.println("Remember that bots start at the vertex of the flag");
                    Random random = new Random();
                    int randomNumber = random.nextInt(2) + 1;
                    if (randomNumber == 1) {
                        System.out.println("Player 1 will start");
                    } else {
                        System.out.println("Player 2 will start");
                    }
                    System.out.println("START!");
                    Bot bot;
                    do {
                        if (randomNumber == 1) {
                            bot = listBots.removeFirst();
                        } else {
                            bot = listBots.removeLast();
                        }

                        System.out.println("Playing: " + bot.getNome() + " " + bot.getEquipa());
                        mapToUse.printNeighbors(bot);

                        switch (bot) {
                            case BotTree botTree -> botTree.play(mapToUse);
                            case BotShortestEdge botShortestEdge -> botShortestEdge.play(mapToUse);
                            case BotShortestPath botShortestPath -> botShortestPath.play(mapToUse);
                            case null, default -> {
                            }
                        }

                        mapToUse.printMap();

                        if (randomNumber == 1) {
                            listBots.addToRear(bot);
                        } else {
                            listBots.addToFront(bot);
                        }

                        try {
                            Thread.sleep(3000);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }


                    } while (!bot.getRota().isEmpty() && Bot.getCounter() != listBots.size());

                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }


                    System.out.println("\n====Result!====");
                    if (flag1.isOccupied() && flag1.getBot().getEquipa() == Team.EQUIPA2) {
                        System.out.println("Player 2 won the match");
                    } else if(flag2.isOccupied() && flag2.getBot().getEquipa() == Team.EQUIPA1){
                        System.out.println("Player 1 won the match");
                    }else{
                        System.out.println("This game resulted in a draw");
                    }
                    break;
                case 2:
                    System.out.println("====Map Creation Menu====");
                    System.out.println("Welcome to the map creation menu." +
                            "\nAfter you have created your map we will ask you the path where you want to store the created map." +
                            "\nKeep in mind that if you choose to not save the map you will lose it.");
                    System.out.println("LetÂ´s create the perfect map");
                    System.out.println("How many positions do you want your map to have, minimum 10 and maximum 100:");
                    int mapSize = readIntWithLimit(scanner, 10, 100);
                    mapToCreate = new Map(mapSize);
                    mapToCreate.generateVertexes(mapSize);
                    System.out.println("Do you want your map to be:");
                    System.out.println("1 - Directional");
                    System.out.println("2 - Non directional");
                    int mapType = readIntWithLimit(scanner, 1, 2);
                    int coverage;
                    switch (mapType) {
                        case 1:
                            System.out.println("Introduce the coverage you want to have on this map, you need a minimum of 30% coverage in this case:");
                            coverage = readIntWithLimit(scanner, 30, 100);
                            mapToCreate.generateRandomCompleteDirectionalGraph(coverage);
                            break;
                        case 2:
                            System.out.println("Introduce the coverage you want to have on this map, you need a minimum of 20% coverage in this case:");
                            coverage = readIntWithLimit(scanner, 20, 100);
                            mapToCreate.generateRandomCompleteNonDirectionalGraph(coverage);
                            break;
                    }
                    System.out.println("This is the map you generated:");
                    mapToCreate.printMap();
                    System.out.println();
                    System.out.println("These are the map edges:");
                    mapToCreate.printEdges();
                    System.out.println();
                    System.out.println("Do you wish to store this map?");
                    System.out.println("1 - Yes");
                    System.out.println("2 - No");
                    int saveOption = readIntWithLimit(scanner, 1, 2);
                    switch (saveOption) {
                        case 1:
                            System.out.println("What do you want to call your map?");
                            String name = scanner.nextLine();
                            System.out.println("Introduce the path where you wish to store the map, introduce just the folder with no \\ in front of it:");
                            String pathToSave = scanner.nextLine();
                            String fullPathToSave = pathToSave + "\\" + name + ".txt";
                            exporter.saveMapToFile(mapToCreate, fullPathToSave);
                            break;
                        case 2:
                            System.out.println("Are you sure you dont want to store it? This map will be lost");
                            System.out.println("1 - Save");
                            System.out.println("2 - Dont save");
                            int exitWithoutSavingOption = readIntWithLimit(scanner, 1, 2);
                            switch (exitWithoutSavingOption) {
                                case 1:
                                    System.out.println("What do you want to call your map?");
                                    String nameWithoutSaving = scanner.nextLine();
                                    System.out.println("Introduce the path where you wish to store the map, introduce just the folder with no \\ in front of it:");
                                    String pathToSaveWithoutSaving = scanner.nextLine();
                                    String fullPathToSaveWithoutSaving = pathToSaveWithoutSaving + "\\" + nameWithoutSaving + ".txt";
                                    exporter.saveMapToFile(mapToCreate, fullPathToSaveWithoutSaving);
                                    break;
                                case 2:
                                    System.out.println("Your map was not stored");
                                    break;
                            }
                            break;
                    }
                    break;
                case 3:
                    System.out.println("Thank you for playing!");
                    break;
            }
        } while (escolha != 3);
    }
}