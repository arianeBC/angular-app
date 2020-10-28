import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from './store/recipe.actions';
import { Actions, ofType } from '@ngrx/effects';
import { take } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class RecipeResolverRecipes implements Resolve<Recipe[]>{
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      this.store.dispatch(new RecipeActions.FetchRecipes());
      return this.actions$.pipe(
          ofType(RecipeActions.SET_RECIPES), 
          take(1)
      );
    // const recipes = this.recipeService.getRecipes();

    // if(recipes.length === 0) {
      // return this.dataStorageService.fetchRecipes();
    // } else {
    //   return recipes;
    // }
  }
}