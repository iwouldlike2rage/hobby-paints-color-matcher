import RecipePaintColor from "./RecipePaintColor";

export default class RecipeItem {
  constructor({ description, recipePaintColors }) {
    this.description = description;
    this.recipePaintColors = recipePaintColors;
  }

  get key() {
    return `${this.description} - ${this.recipePaintColors.map(x => x.paintColor.name).join(',')}`;
  }

  toApi() {
    return {
      description: this.description,
      recipePaintColors: this.recipePaintColors.map(x => x.toApi()),
    };
  }

  get validRecipePaintColors() {
    return this.recipePaintColors.filter(x => x.paintColor != null);
  }

  static fromApi(apiModel) {
    return new RecipeItem({
      description: apiModel.description,
      recipePaintColors: apiModel.recipePaintColors.map(x => RecipePaintColor.fromApi(x)),
    });
  }
}