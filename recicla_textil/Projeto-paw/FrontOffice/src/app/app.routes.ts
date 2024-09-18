import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { CreateUserComponent } from './componentes/create-user/create-user.component';
import { CreateEntityComponent } from './componentes/create-entity/create-entity.component';
import { UserIntialPageComponent } from './componentes/user-intial-page/user-intial-page.component';
import { authGuard } from './guards/auth.guard';
import { EntidadeIntialPageComponent } from './componentes/entidade-intial-page/entidade-intial-page.component';
import { PageNotFoundComponent } from './componentes/page-not-found/page-not-found.component';
import { AboutUsComponent } from './componentes/about-us/about-us.component';
import { CriarDoacaoComponent } from './componentes/criar-doacao/criar-doacao.component';
import { CheckEntitysComponent } from './componentes/check-entitys/check-entitys.component';
import { EditarUserComponent } from './componentes/editar-user/editar-user.component';
import { EditarEntidadeComponent } from './componentes/editar-entidade/editar-entidade.component';
import { ValesComponent } from './componentes/vales/vales.component';
import { CheckDonationsComponent } from './componentes/check-donations/check-donations.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'createUser', component: CreateUserComponent },
  { path: 'createEntity', component: CreateEntityComponent },
  {
    path: 'user',
    component: UserIntialPageComponent,
    canActivate: [authGuard],
    data: { roles: ['doador'] },
  },
  {
    path: 'entidade',
    component: EntidadeIntialPageComponent,
    canActivate: [authGuard],
    data: { roles: ['entidade'] },
  },
  {
    path: 'user/realizar_doacao',
    component: CriarDoacaoComponent,
    canActivate: [authGuard],
    data: { roles: ['doador'] },
  },
  {
    path: 'user/ver_entidades',
    component: CheckEntitysComponent,
    canActivate: [authGuard],
    data: { roles: ['doador'] },
  },
  {
    path: 'user/vales',
    component: ValesComponent,
    canActivate: [authGuard],
    data: { roles: ['doador'] },
  },
  {
    path: 'ver_doacoes',
    component: CheckDonationsComponent,
    canActivate: [authGuard],
    data: { roles: ['doador','entidade'] },
  },
  {
    path: 'user/myCount',
    component: EditarUserComponent,
    canActivate: [authGuard],
    data: { roles: ['doador'] },
  },
  {
    path: 'entidade/myCount',
    component: EditarEntidadeComponent,
    canActivate: [authGuard],
    data: { roles: ['entidade'] },
  },
  { path: '**', component: PageNotFoundComponent },
];


