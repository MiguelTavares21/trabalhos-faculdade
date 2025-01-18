import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InitialPageComponent } from './components/initial-page/initial-page.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { logoutGuard } from './guards/logout.guard';
import { RegisterComponent } from './components/register/register.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { selectedGroupGuard } from './guards/selected-group.guard';
import { CreateGroupComponent } from './components/create-group/create-group.component';
import { ProductsTypeComponent } from './components/products-type/products-type.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductInventoryComponent } from './components/product-inventory/product-inventory.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { GroupComponent } from './components/group/group.component';
import { EditGroupComponent } from './components/edit-group/edit-group.component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { adminGuard } from './guards/admin.guard';
import { RegisterPurchaseComponent } from './components/register-purchase/register-purchase.component';
import { ShoppingHistoryComponent } from './components/shopping-history/shopping-history.component';
import { StatisticsComponent } from './components/statistics/statistics.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [logoutGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [logoutGuard],
  },
  {
    path: 'initialPage',
    component: InitialPageComponent,
    canActivate: [AuthGuard],
  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: '',
    component: SideBarComponent,
    children: [
        {
          path: 'shopping-list', 
          component: ShoppingListComponent, 
          canActivate: [AuthGuard, selectedGroupGuard]},
        {
          path: 'product-types', 
          component: ProductsTypeComponent,
          canActivate: [AuthGuard, selectedGroupGuard]},
        {
          path: 'products/:type', 
          component: ProductsComponent,
          canActivate: [AuthGuard, selectedGroupGuard]},
        {
          path: 'inventory',
          component: ProductInventoryComponent,
          canActivate: [AuthGuard, selectedGroupGuard]
        },
        {path: 'shopping-list', component: ShoppingListComponent, canActivate: [AuthGuard, selectedGroupGuard]},
        {path: 'my-account', component: MyAccountComponent, canActivate:[AuthGuard, selectedGroupGuard]},
        {path: 'my-groups', component: HomeComponent, canActivate:[AuthGuard]},
        {path: 'group', component: GroupComponent, canActivate:[AuthGuard]},
        {path: "edit-group", component:EditGroupComponent, canActivate:[AuthGuard, adminGuard]},
        {path: "register-purchase", component: RegisterPurchaseComponent, canActivate:[AuthGuard, selectedGroupGuard]},
        {path: "shopping-history", component: ShoppingHistoryComponent, canActivate:[AuthGuard, selectedGroupGuard]},
        {
          path: 'recipeList',
          component: RecipeListComponent,
          canActivate: [AuthGuard, selectedGroupGuard],
        },
        {
          path: 'statistics',
          component: StatisticsComponent,
          canActivate: [AuthGuard, selectedGroupGuard],
        },
    ]
  },
  {
    path: 'createGroup',
    component: CreateGroupComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/home' },
];
