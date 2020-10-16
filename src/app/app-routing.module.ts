import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipeResolverRecipes } from './recipes/recipe-resolver.service';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';


const appRoutes: Routes = [
  { path: '', redirectTo: '/recettes', pathMatch: 'full' },
  { 
    path: 'recettes', 
    component: RecipesComponent, 
    children: [
      { path: '', component: RecipeStartComponent },
      { path: 'ajouter', component: RecipeEditComponent },
      { 
        path: ':id', 
        component: RecipeDetailComponent, 
        resolve: [RecipeResolverRecipes] 
      },
      { 
        path: ':id/modifier', 
        component: RecipeEditComponent,
        resolve: [RecipeResolverRecipes] 
      },
    ] 
  },
  { path: 'liste-de-courses', component: ShoppingListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}