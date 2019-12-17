export default class PaintColor {
  constructor({
                id,
                family,
                logo,
                code,
                name,
                rgb,
                r,
                g,
                b,
                lab,
                isOwned
              }) {
    this.id = id;
    this.family = family;
    this.logo = logo;
    this.code = code;
    this.name = name;
    this.rgb = rgb;
    this.r = r;
    this.g = g;
    this.b = b;
    this.lab = lab;
    this.isOwned = isOwned;
    this.scores = [];
  }

  get displayName() {
    return this.code != null
      ? `${this.name} (${this.code}})`
      : this.name;
  }

  toApi() {
    return {
      id: this.id,
      family: this.family,
      logo: this.logo,
      code: this.code,
      name: this.name,
      rgb: this.rgb,
      r: this.r,
      g: this.g,
      b: this.b,
      la: this.lab,
      isOwner: this.isOwned,
    };
  }

  static fromApi(apiModel) {
    return new PaintColor(apiModel);
  }
}