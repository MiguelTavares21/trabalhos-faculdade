import java.util.*;

public class GrandPix {
    private OrderedList<Piloto> corredores;

    public OrderedList<Piloto> getCorredores() {
        return corredores;
    }

    public GrandPix(OrderedList<Piloto> corredores) {
        this.corredores = corredores;
    }

    public void corrida() {
        int[] classificacoes = new int[corredores.size()];
        for (int i = 0; i < corredores.size(); i++) {
            classificacoes[i] = i + 1;
        }

        Random random = new Random();
        for (int i = 0; i < classificacoes.length - 1; i++) {
            int indiceAleatorio = i + random.nextInt(classificacoes.length - i);

            // Trocar os elementos
            int temp = classificacoes[i];
            classificacoes[i] = classificacoes[indiceAleatorio];
            classificacoes[indiceAleatorio] = temp;
        }

        for (int i = 0; i < corredores.size(); i++) {
            Piloto piloto = corredores.removeLast();
            int classificacao = classificacoes[i];
            int pontos = calcularPontos(classificacao);
            piloto.setPontos(pontos);
            corredores.add(piloto);
        }
    }

    private int calcularPontos(int classificacao) {
        if (classificacao == 1) {
            return 25;
        } else if (classificacao == 2) {
            return 18;
        } else if (classificacao == 3) {
            return 15;
        } else if (classificacao == 4) {
            return 12;
        } else if (classificacao == 5) {
            return 10;
        } else if (classificacao == 6) {
            return 8;
        } else if (classificacao == 7) {
            return 6;
        } else if (classificacao == 8) {
            return 4;
        } else if (classificacao == 9) {
            return 2;
        } else if (classificacao == 10) {
            return 1;
        } else {
            return 0;
        }
    }

    public void printclassificacao() {
        Iterator<Piloto> iterator = corredores.iterator();
        System.out.println("------------------------------------");
        System.out.println("Classificacao final:");
        int i = 1;
        while (iterator.hasNext()) {
            Piloto piloto = iterator.next();
            System.out.println(i + ":" + piloto.getNome() + " -> Pts:" + piloto.getPontos());
            i++;
        }
        System.out.println("------------------------------------");
    }

    public Piloto vencedor(){
        return corredores.first();
    }
}
