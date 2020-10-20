import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeResolverRecipes } from './recipe-resolver.service';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipesComponent } from './recipes.component';

const routes: Routes = [
  { 
    path: 'recettes', 
    component: RecipesComponent, 
    canActivate: [AuthGuard],
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule { }