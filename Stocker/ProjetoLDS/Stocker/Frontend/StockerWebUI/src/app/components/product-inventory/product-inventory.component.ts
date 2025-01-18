import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { ProductModalEditComponent } from '../product-modal-edit/product-modal-edit.component';
import { Product } from '../../models/product';
import { ProductModalConsumeComponent } from '../product-modal-consume/product-modal-consume.component';
import { Types } from '../../enums/types.enum';
import { AlertComponent } from '../alert/alert.component';

/**
 * Componente responsável pela disponibilização de produtos em stock.
 */
@Component({
  selector: 'app-product-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProductModalComponent,
    ProductModalEditComponent,
    ProductModalConsumeComponent,
    AlertComponent,
  ],
  templateUrl: './product-inventory.component.html',
  styleUrls: [
    './product-inventory.component.css',
    '../products/products.component.css',
    '../products-type/products-type.component.css',
  ],
})
export class ProductInventoryComponent {
  productType: Types = Types.Frutas_Verduras; // Tipo de produto a ser exibido

  products: Product[] = []; // Lista de produtos a serem exibidos

  searchQuery: string = ''; // Variável para armazenar a pesquisa de filtro de produtos

  alerts: string[] = []; // Lista de mensagens de alerta

  // Controlo de abertura do modal
  isModalOpen: boolean = false;
  isEditModalOpen: boolean = false;

  selectedProduct: Product | null = null; // Produto selecionado para edição

  currentGroupId: number = localStorage.getItem('selectedGroupId')
    ? parseInt(localStorage.getItem('selectedGroupId')!)
    : 0; // ID do grupo selecionado

  // Controlo de abertura do modal de consumo
  isConsumeModalOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.currentGroupId = this.getCurrentGroupId();
    this.loadProducts();
  }

  /**
   * Recupera o ID do grupo do localStorage.
   * @returns ID do grupo armazenado.
   */
  private getCurrentGroupId(): number {
    const groupId = localStorage.getItem('selectedGroupId');
    return groupId ? parseInt(groupId, 10) : 0;
  }

  /**
   * Carrega os produtos do grupo selecionado através do serviço ProductService.
   */
  loadProducts(): void {
    const groupId = this.getCurrentGroupId();

    // Verifica se o groupId é válido
    if (!groupId) {
      this.addAlert('Nenhum grupo selecionado. Por favor, selecione um grupo.');
      return;
    }

    this.productService.getInventory(groupId).subscribe({
      next: (data) => {
        // Verifique se os dados são uma lista vazia
        if (data.length === 0) {
          this.products = []; // Deixa a lista de produtos vazia
        } else {
          this.products = data; // Preenche a lista com os produtos
        }
      },
      error: (err) => {
        this.addAlert('Erro ao carregar produtos. Tente novamente.');
      },
    });
  }

  /**
   * Filtra os produtos com base no tipo selecionado e na pesquisa do utilizador.
   * @returns Lista de produtos filtrados.
   */
  getFilteredProducts() {
    return this.products
      .filter((product) => product.quantity > 0)
      .filter((product) => {
        return (
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.unity.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Abre o modal de criação de produto.
   * @param product Produto a ser editado (opcional).
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
   * Cria um novo produto através do serviço.
   * @param product Dados do produto a ser criado.
   */
  handleCreateProduct(product: Product): void {
    this.productService.createProduct(product, product.group_Id).subscribe(
      (newProduct) => {
        this.products.push(newProduct);
        this.addAlert('Produto criado com sucesso.');
      },
      (error) => console.error('Erro ao criar produto:', error)
    );
  }

  /**
   * Abre o modal de edição de produto.
   * @param product Produto a ser editado.
   */
  openEditModal(product: Product): void {
    this.selectedProduct = product;
    this.isEditModalOpen = true;
  }

  /**
   * Fecha o modal de edição de produto.
   */
  closeEditModal() {
    this.isEditModalOpen = false;
  }

  /**
   * Atualiza um produto existente no sistema.
   * @param product Produto a ser atualizado.
   */
  handleEditProduct(product: Product): void {
    this.productService
      .updateProduct(this.currentGroupId, product.id, product)
      .subscribe(
        (next) => {
          const index = this.products.findIndex((p) => p.id === product.id);
          if (index !== -1) {
            this.products[index] = product;
          }
          this.addAlert('Produto atualizado com sucesso.');
        },
        (error) => console.error('Erro ao atualizar produto:', error)
      );
  }

  /**
   * Decrementa a quantidade de um produto.
   * @param event Evento de clique no botão de decrementar quantidade.
   * @param product Produto cuja quantidade será decrementada.
   */
  decrementQuantity(event: MouseEvent, product: Product): void {
    event.stopPropagation();

    if (!product) {
      this.addAlert('Produto não encontrado.');
      return;
    }

    if (product.quantity > 0) {
      const newQuantity = product.quantity - 1;

      // Atualizar a quantidade local imediatamente
      product.quantity = newQuantity;

      // Se a quantidade for 0, remover o produto da lista
      if (product.quantity === 0) {
        const index = this.products.findIndex((p) => p.id === product.id);
        if (index !== -1) {
          this.products.splice(index, 1); // Remove localmente
        }
      }

      // Fazer a chamada para consumir o produto
      this.productService
        .consumeProduct(product.id, product.group_Id, 1)
        .subscribe({
          next: () => {
            this.addAlert('Quantidade atualizada com sucesso.');
          },
          error: (error) => {
            // Se houver erro, reverter a alteração local
            product.quantity = newQuantity + 1; // Reverter decremento
            if (!this.products.find((p) => p.id === product.id)) {
              this.products.push(product); // Reverter remoção
            }
            this.addAlert('Erro ao atualizar a quantidade do produto.');
          },
        });
    } else {
      this.addAlert('Quantidade já é 0, impossível decrementar.');
    }
  }

  /**
   * Abre o modal de consumo de produto para alterar a quantidade.
   * @param event Evento de clique no botão de abrir o modal.
   * @param product Produto a ser consumido.
   */
  openQuantityModal(event: MouseEvent, product: Product): void {
    event.stopPropagation();

  if (!product || !product.id) {
    this.addAlert('Erro ao abrir o modal. Produto inválido.');
    return;
  }

  this.selectedProduct = product;
  this.isConsumeModalOpen = true;
  }

  /**
   * Finaliza o consumo de um produto e atualiza a quantidade no servidor.
   * @param newQuantity Nova quantidade após o consumo.
   */
  handleConsumeProduct(newQuantity: number): void {
    if (!this.selectedProduct) {
      return;
    }

    if (this.selectedProduct) {
      const quantityToConsume = this.selectedProduct.quantity - newQuantity;

      if (quantityToConsume < 0) {
        this.addAlert('Quantidade inválida.');
        return;
      }

      // Atualizar localmente a quantidade
      this.selectedProduct.quantity = newQuantity;

      // Remover da lista se quantidade for 0
      if (newQuantity === 0) {
        const index = this.products.findIndex(
          (p) => p.id === this.selectedProduct?.id
        );
        if (index !== -1) {
          this.products.splice(index, 1); // Remove localmente
        }
      }

      // Fazer chamada à API
      this.productService
        .consumeProduct(
          this.selectedProduct.id,
          this.currentGroupId,
          quantityToConsume
        )
        .subscribe({
          next: (updatedProduct) => {
            if (!updatedProduct || !updatedProduct.id) {
              console.error('Produto atualizado inválido:', updatedProduct);
              this.addAlert('Erro ao consumir o produto.');
              return;
            }
            const index = this.products.findIndex(
              (p) => p.id === updatedProduct.id
            );
            if (index !== -1) {
              this.products[index] = updatedProduct;
            }
            this.addAlert('Produto consumido com sucesso.');
          },
          error: (error) => {
            // Reverter mudanças locais em caso de erro
            this.selectedProduct!.quantity += quantityToConsume;
            if (!this.products.find((p) => p.id === this.selectedProduct!.id)) {
              this.products.push(this.selectedProduct!);
            }
            this.addAlert('Erro ao consumir o produto.');
          },
        });
    }
    this.closeConsumeModal();
  }

  /**
   * Fecha o modal de consumo de produto.
   */
  closeConsumeModal() {
    this.isConsumeModalOpen = false;
    this.selectedProduct = null;
  }

  /**
   * Elimina um produto da lista.
   * @param productId ID do produto a ser eliminado.
   */
  handleDeleteProduct(productId: number): void {
    const index = this.products.findIndex((p) => p.id === productId);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
    this.addAlert('Produto eliminado com sucesso.');
  }

  /**
   * Adiciona um alerta para o usuário.
   * @param message Mensagem do alerta a ser exibida.
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
   * Remove um alerta da lista.
   * @param alert Alerta a ser removido.
   */
  removeAlert(alert: string) {
    this.alerts = this.alerts.filter((a) => a !== alert);
  }
}
