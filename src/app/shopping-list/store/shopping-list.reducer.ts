import { Action } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';
import { ADD_INGREDIENT } from './shopping-list.action';

const initialState = {
  ingredients: [
    new Ingredient('Carottes', 1),
    new Ingredient('Tomates', 2),
  ]
};

export function shoppingListReducer(state = initialState, action: Action) {
  switch (action.type) {
    case ADD_INGREDIENT: 
      return {
        ...state,
        ingredients: [...state.ingredients, action]
      };
  }
}