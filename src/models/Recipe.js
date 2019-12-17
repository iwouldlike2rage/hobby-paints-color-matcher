import RecipeItem from "./RecipeItem";

export default class Recipe {
  constructor({ name, recipeItems }) {
    this.name = name;
    this.recipeItems = recipeItems;
  }

  toApi() {
    return {
      name: this.name,
      recipeItems: this.recipeItems.map(x => x.toApi()),
    };
  }

  static fromApi(apiModel) {
    return new Recipe({ name: apiModel.name, recipeItems: apiModel.recipeItems.map(x => RecipeItem.fromApi(x)) });
  }
}