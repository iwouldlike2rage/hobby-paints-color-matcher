import PaintColor from "./PaintColor";

export default class RecipePaintColor {
  constructor({ paintColor, percentage = 100 }) {
    this.paintColor = paintColor;
    this.percentage = percentage;
  }

  toApi() {
    return {
      percentage: this.percentage,
      paintColor: this.paintColor.toApi(),
    };
  }

  static fromApi(apiModel) {
    return new RecipePaintColor({
      percentage: apiModel.percentage,
      paintColor: PaintColor.fromApi(apiModel.paintColor),
    });
  }
}