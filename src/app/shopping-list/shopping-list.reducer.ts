import { Ingredient } from '../shared/ingredient.model';

const initialState = {
  ingredients: [
    new Ingredient('Carottes', 1),
    new Ingredient('Tomates', 2),
  ]
};

export function shoppingListReducer(state = initialState, action) {

}