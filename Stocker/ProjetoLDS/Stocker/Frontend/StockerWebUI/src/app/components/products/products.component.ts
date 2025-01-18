import { Component, OnInit, Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { ProductModalEditComponent } from '../product-modal-edit/product-modal-edit.component';
import { Product } from '../../models/product';
import { Types } from '../../enums/types.enum';
import { TypeLabels } from '../../utils/typeLabels';
import { AlertComponent } from '../alert/alert.component';

/**
 * Componente responsável pela exibição e gestão de produtos de um determinado tipo.
 */
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProductModalComponent,
    ProductModalEditComponent,
    AlertComponent,
  ],
  templateUrl: './products.component.html',
  styleUrls: [
    './products.component.css',
    '../products-type/products-type.component.css',
  ],
})
export class ProductsComponent implements OnInit {
  productType: Types = Types.Frutas_Verduras; // Tipo de produto a ser exibido
  products: Product[] = []; // Lista de produtos a serem exibidos
  searchQuery: string = ''; // Variável para armazenar a pesquisa de filtro de produtos

  isModalOpen: boolean = false; // Controlo de abertura do modal
  isEditModalOpen: boolean = false; // Controlo de abertura do modal de edição

  selectedProduct: Product | null = null; // Produto selecionado para edição
  currentGroupId: number = localStorage.getItem('selectedGroupId')
    ? parseInt(localStorage.getItem('selectedGroupId')!)
    : 0; // ID do grupo selecionado

  loading: boolean = true; // Flag para controlar o estado de carregamento
  alerts: string[] = []; // Lista de mensagens de alerta

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  /**
   * Método chamado ao inicializar o componente (ngOnInit).
   * Carrega o tipo de produto da URL e chama a função para carregar os produtos.
   */
  ngOnInit(): void {
    this.currentGroupId = this.getCurrentGroupId();
    this.route.paramMap.subscribe((params) => {
      const typeParam = params.get('type');
      this.productType = typeParam
        ? (typeParam as Types)
        : Types.Frutas_Verduras; // Garantir que 'type' tenha um valor válido
      this.loadProducts();
    });
  }

  /**
   * Obtém o ID do grupo de produtos do localStorage.
   * @returns O ID do grupo, ou 0 caso não encontrado.
   */
  private getCurrentGroupId(): number {
    const groupId = localStorage.getItem('selectedGroupId');
    return groupId ? parseInt(groupId, 10) : 0;
  }

  /**
   * Carrega os produtos do grupo selecionado chamando o serviço de produto.
   * Exibe uma mensagem de erro se o ID do grupo não for encontrado.
   */
  loadProducts(): void {
    const groupId = parseInt(
      localStorage.getItem('selectedGroupId') || '0',
      10
    );

    if (!groupId) {
      this.products = [];
      this.loading = false; // Quando não há grupo, também define o carregamento como concluído
      return;
    }

    this.productService.getProductsByGroup(groupId).subscribe({
      next: (data) => {
        this.products = data || [];
        this.loading = false; // Produtos carregados, finaliza o carregamento
      },
      error: (err) => {
        this.products = [];
        this.loading = false;
      },
    });
  }

  /**
   * Filtra os produtos pela categoria e pelo nome/unidade com base na consulta de pesquisa.
   * @returns Lista de produtos filtrados e ordenados.
   */
  getFilteredProducts() {
    return this.products
      .filter((product) => product.type === this.productType) // Filtra pelo tipo de produto
      .filter(
        (product) =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || // Filtro pelo nome
          product.unity.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Abre o modal de criação de produto.
   * @param product Produto a ser editado ou cria um novo caso o parâmetro seja undefined.
   */
  openModal(product?: Product): void {
    this.selectedProduct = product || null;
    this.isModalOpen = true;
  }

  /**
   * Fecha o modal de criação de produto.
   */
  closeModal(): void {
    this.isModalOpen = false;
  }

  /**
   * Cria um novo produto chamando o serviço para adicionar o produto ao backend.
   * @param product O produto a ser criado.
   */
  handleCreateProduct(product: Product): void {
    this.productService.createProduct(product, product.group_Id).subscribe(
      (newProduct) => {
        this.addAlert('Produto criado com sucesso.');
        this.products.push(newProduct);
      },
      (error) => console.error('Erro ao criar produto:', error)
    );
  }

  /**
   * Abre o modal de edição para o produto selecionado.
   * @param product Produto a ser editado.
   */
  openEditModal(product: Product): void {
    this.selectedProduct = product; // Atribui o produto selecionado para edição
    this.isEditModalOpen = true; // Abre o modal
  }

  /**
   * Fecha o modal de edição.
   */
  closeEditModal() {
    this.isEditModalOpen = false; // Fecha o modal
  }

  /**
   * Guarda as alterações feitas no produto chamando o serviço para atualizá-lo.
   * @param product Produto a ser atualizado.
   */
  handleEditProduct(product: Product): void {
    // Chama o serviço para atualizar o produto existente
    this.productService
      .updateProduct(this.currentGroupId, product.id, product)
      .subscribe(
        (next) => {
          // Encontra o índice do produto na lista e o substitui com o produto atualizado
          const index = this.products.findIndex((p) => p.id === product.id);
          if (index !== -1) {
            this.products[index] = product;
          }
          this.addAlert('Produto atualizado com sucesso.');
        },
        (error) => console.error('Erro ao atualizar produto:', error) // Log de erro caso falhe
      );
  }

  /**
   * Exclui o produto da lista e do backend.
   * @param productId ID do produto a ser excluído.
   */
  handleDeleteProduct(productId: number): void {
    const index = this.products.findIndex((p) => p.id === productId);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
    this.addAlert('Produto eliminado com sucesso.');
  }

  /**
   * Retorna o rótulo associado ao tipo de produto selecionado.
   * @returns O rótulo correspondente ao tipo de produto.
   */
  getProductTypeLabel(): string {
    return TypeLabels[this.productType];
  }

  /**
   * Adiciona um alerta na lista de mensagens de alerta.
   * A mensagem desaparece após 2 segundos.
   * @param message Mensagem a ser exibida no alerta.
   */
  addAlert(message: string) {
    if (!this.alerts.includes(message)) {
      this.alerts.push(message);
    }
    setTimeout(() => {
      this.removeAlert(message);
    }, 2000);
  }

  /**
   * Remove uma mensagem de alerta da lista.
   * @param alert Mensagem a ser removida.
   */
  removeAlert(alert: string) {
    this.alerts = this.alerts.filter((a) => a !== alert);
  }
}
