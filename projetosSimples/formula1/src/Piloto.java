public class Piloto implements Comparable<Piloto>{
private String nome;
private int pontos;
private Equipas equipa;


public Piloto(String nome, Equipas equipa) {
    this.nome = nome;
    this.equipa = equipa;
    this.pontos = 0;
}

public String getNome() {
    return nome;
}
public void setNome(String nome) {
    this.nome = nome;
}
public int getPontos() {
    return pontos;
}
public void setPontos(int pontos) {
    this.pontos = pontos;
}
public Equipas getEquipa() {
    return equipa;
}
public void setEquipa(Equipas equipa) {
    this.equipa = equipa;
}

@Override
public int compareTo(Piloto outroPiloto) {
    return Integer.compare(outroPiloto.pontos, this.pontos);
}

@Override
public String toString() {
    return "Piloto--> Nome:" + nome + ", equipa:" + equipa;
}
    
}
