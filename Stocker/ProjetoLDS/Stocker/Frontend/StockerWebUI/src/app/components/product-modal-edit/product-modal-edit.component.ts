import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

/**
 * Componente responsável pela edição de um produto.
 */
@Component({
  selector: 'app-product-modal-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-modal-edit.component.html',
  styleUrls: [
    '../product-modal/product-modal.component.css',
    './product-modal-edit.component.css' 
  ]
})
export class ProductModalEditComponent {
  @Input() product: Product | null = null;  // Recebe o produto a ser editado
  @Output() onSave = new EventEmitter<Product>();  // Evento de salvar o produto
  @Output() onClose = new EventEmitter<void>();  // Evento de fechar o modal
  @Output() onDelete = new EventEmitter<number>();  // Evento de excluir o produto

  currentGroupId: number = localStorage.getItem('selectedGroupId') ? parseInt(localStorage.getItem('selectedGroupId')!) : 0;
  editProductForm: FormGroup;  // Formulário reativo utilizado para editar os detalhes do produto.

  selectedProductId: number = this.product ? this.product.id : 0; // ID do produto selecionado
  selectedUserId: number = localStorage.getItem('selectedUserId') ? parseInt(localStorage.getItem('selectedUserId')!) : 0;

  /**
   * Controle da visibilidade do modal de confirmação de exclusão.
   */
  showConfirmationModal = false;
  showEditModal = false;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    // Inicializa o formulário com os campos padrão
    this.editProductForm = this.fb.group({
      name: ['', Validators.required],
      unity: [null, Validators.required],
      quantity: [null, [Validators.min(0)]],  
      order_Point: [null, [Validators.min(0.01)]],
      ideal_Point: [null, [Validators.min(0.01)]],
    });
  }

  /**
   * Método chamado ao inicializar o componente (ngOnInit).
   * Preenche o formulário com os dados do produto para edição.
   */
  ngOnInit(): void {
    if (this.product) {
      // Preenche o formulário com os dados do produto para edição
      this.editProductForm.patchValue({
        name: this.product.name,
        unity: this.product.unity,
        quantity: this.product.quantity,
        order_Point: this.product.order_Point,
        ideal_Point: this.product.ideal_Point,
      });
    }
  }

  /**
   * Método chamado ao submeter o formulário.
   * Se o formulário for válido, emite o produto atualizado para o componente pai.
   * Caso contrário, exibe um erro no console.
   */
  onSubmit(): void {
    if (this.editProductForm.valid) {
      let product: Product;
      if (this.product) {
        product = {
          ...this.product,  // Mantém os dados existentes
          ...this.editProductForm.value,  // Atualiza com os novos valores do formulário
          // Não alteramos a quantidade, já que ela é somente leitura
          group_Id: this.currentGroupId,  // Certificando-se de adicionar o group_Id
        };
      } else {
        return;
      }
      // Emite o produto atualizado para o componente pai
      this.onSave.emit(product);
      // Fecha o modal após salvar
      this.onClose.emit();
    } else {
      console.error('Formulário inválido!');
    }
  }

  /**
   * Método que abre o modal de edição para o produto selecionado.
   * @param productId ID do produto que será editado.
   */
  openEditModal(productId: number) {
    this.selectedProductId = productId;
    this.showConfirmationModal = false;
    this.showEditModal = true;
  }

  /**
   * Método que fecha o modal de edição.
   */
  closeEditModal() {
    this.showEditModal = false;
  }
  
  /**
   * Método para fechar o modal sem guardar as alterações.
   */
  closeModal() {
    this.onClose.emit();  // Emite o evento para fechar o modal
  }

  /**
   * Método chamado quando um produto é selecionado.
   * Atualiza o ID do produto selecionado.
   * @param productId ID do produto selecionado.
   */
  onSelectProduct(productId: number): void {
    this.selectedProductId = productId; // Atribui o ID do produto selecionado
  }

  /**
   * Método para eliminar o produto selecionado.
   * Elimina o produto e emite o ID para o componente pai.
   * Se houver algum erro, exibe uma mensagem de erro no console.
   */
  deleteProduct(): void {
    if (!this.product) {
      return; 
    }
    if (this.product.id === null) {
      alert('Produto não selecionado para exclusão.');
      return; // Retorna se não houver um produto selecionado
    }

    // Chama o serviço para excluir o produto
    this.productService.deleteProduct(this.currentGroupId, this.product.id).subscribe({
      next: () => {
        if (!this.product) {
          return; 
        }
        alert('Produto eliminado com sucesso!');
        this.closeModal(); // Fecha o modal
        this.onDelete.emit(this.product.id);
      },
      error: (err) => {
        alert('Erro ao eliminar o produto. Por favor, tente novamente.');
      },
    });
  }
  
}
