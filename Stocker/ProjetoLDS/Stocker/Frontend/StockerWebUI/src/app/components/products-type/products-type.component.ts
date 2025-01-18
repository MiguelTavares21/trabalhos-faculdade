import { Component, NgModule } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Types } from '../../enums/types.enum';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { TypeLabels } from '../../utils/typeLabels';

/**
 * Componente responsável pela exibição de produtos organizados por tipo.
 */
@Component({
  selector: 'app-products-type',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProductModalComponent,
    RouterLink,
  ],
  templateUrl: './products-type.component.html',
  styleUrl: './products-type.component.css',
})
export class ProductsTypeComponent {

  /**
   * Array que mapeia os tipos de produtos e os seus respectivos rótulos.
   * Usado para exibir as opções de tipos de produtos na interface.
   */
  typesArray = Object.entries(Types).map(([key, value]) => ({
    key,
    label: TypeLabels[value],
  }));

  public constructor(private productService: ProductService) {}

  /**
   * Obtém o ícone correspondente a um tipo de produto.
   * @param typeKey Chave do tipo de produto.
   * @returns Caminho para o ícone correspondente ao tipo.
   */
  getIconForType(typeKey: string): string {
    const icons: { [key: string]: string } = {
      Frutas_Verduras: 'frutas_e_verduras.png',
      Panificacao_Confeitaria: 'panificacao_e_confeitaria.png',
      Laticinios: 'laticinios.png',
      Carne_Peixe: 'carne_peixe.png',
      Ingredientes_Temperos: 'ingredientes_temperos.png',
      Congelados: 'congelados.png',
      Cereais_Graos: 'cereais_graos.png',
      Lanches_Doces: 'lanches.png',
      Bebidas: 'bebidas.png',
      Casa: 'casa.png',
      Higiene_Saude: 'higiene.png',
      Animais: 'animais.png',
      Artesanato_Jardim: 'artesanato_jardim.png',
      Outro: 'outro.png',
    };

    return icons[typeKey] || '';
  }
}
