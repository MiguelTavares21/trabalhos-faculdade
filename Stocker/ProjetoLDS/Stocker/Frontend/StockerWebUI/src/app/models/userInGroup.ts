import { User } from "./user";

/**
 * Enumeração para definir os papéis (roles) dos utilizadores.
 * O papel do utilizador pode ser:
 * - User (0): Representa um user comum.
 * - Admin (1): Representa um utilizador com privilégio de administrador.
 */
export enum Role {
  User = 0,    // Representa um utilizador comum
  Admin = 1,   // Representa um administrador
}

/**
 * Interface `UserInGroup` que estende a interface `User` e adiciona a propriedade `role`,
 * representando o papel do utilizador dentro de um grupo específico.
 * 
 * - `role`: O papel do utilizador dentro do grupo (utiliza a enumeração `Role`).
 * 
 * A interface `UserInGroup` é usada para representar a relação de um utilizador com um grupo,
 * incluindo informações sobre seu papel no grupo.
 */
export interface UserInGroup extends User {
  role: Role;  // Define o papel do utilizador dentro do grupo, pode ser 'User' ou 'Admin'
}
