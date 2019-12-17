<template>
    <div class="recipe-list-and-details">
        <div class="recipe-list">
            <div class="header">
                <h3>Recipe List</h3>
                <button class="btn btn-default" @click="newRecipe">+ New</button>
            </div>
            <hr>
            <ul>
                <li v-for="recipe in recipes"
                    v-bind:key="recipe.name"
                    :class="{ active: recipe === activeRecipe }"
                    @click="activeRecipe = recipe;">{{ recipe.name }}
                </li>
            </ul>
        </div>
        <div v-if="activeRecipe" class="recipe-details">
            <div class="recipe-name">
                <div class="label" v-if="!isEditingActiveRecipeName">{{ activeRecipe.name }}
                    <small>
                        <a @click="isEditingActiveRecipeName=true">edit</a>
                        |
                        <a @click="deleteActiveRecipe">delete</a>
                    </small>
                </div>
                <input v-else=""
                       ref="inputRecipeName"
                       class="form-control"
                       type="text"
                       v-model="activeRecipe.name"
                       @keyup="onRecipeNameKeyUp"
                       @blur="() => { isEditingActiveRecipeName = false; saveRecipes(); }">
            </div>
            <!--<hr>-->
            <!--<h3>Color List</h3>-->
            <ul class="recipe-colors">
                <li v-for="rc in activeRecipe.recipeItems"
                    v-bind:key="rc.description"
                    @click="editRecipeItem(rc)">
                    <div class="recipe-color">
                        <div class="flex-v">
                            <h4>{{rc.description}}</h4>
                            <div class="flex-v">
                                <div v-for="rpc in rc.validRecipePaintColors"
                                     v-bind:key="rpc.paintColor.name"
                                     class="recipe-item-paint-colors">
                                    <div class="color-thumb" :style="`background-color: ${rpc.paintColor.rgb}`"></div>
                                    <div class="text">
                                        <span>{{ rpc.paintColor.name }}<span v-if="rpc.paintColor.code"> ({{rpc.paintColor.code}})</span></span>
                                        <span v-if="rc.validRecipePaintColors.length > 1" class="badge ml-5">{{ rpc.percentage }}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="actions">
                            <a @click="() => deleteRecipeItem(rc)">delete</a>
                        </div>
                    </div>
                </li>
            </ul>
            <hr>
            <div v-if="!showEditForm">
                <button class="btn btn-default" @click="showEditForm = true">+ Add items to recipe</button>
            </div>
            <div v-else="" class="add-color form">
                <button class="btn-close" @click="showEditForm = false">&times;</button>
                <h2>
                    <span v-if="isActiveRecipeItemNew">Add new item</span>
                    <span v-else="">Edit item</span>
                </h2>
                <hr>
                <label for="new-color-name">Description</label>
                <input id="new-color-name"
                       class="form-control"
                       type="text"
                       placeholder="e.g.: Helmet, boots, etc..."
                       v-model="activeRecipeItem.description">
                <label>Paints</label>
                <div v-for="recipePaintColor in activeRecipeItem.recipePaintColors"
                     v-bind:key="recipePaintColor.key"
                     class="flex-h">
                    <multiselect :options="colorFamilies"
                                 group-label="family"
                                 group-values="list"
                                 v-model="recipePaintColor.paintColor"
                                 label="displayName"
                                 track-by="id">
                        <template slot="singleLabel" slot-scope="props">
                            <div class="multiselect-color">
                                <div class="color-thumb" :style="`background-color: ${props.option.rgb};`"></div>
                                <span class="option__desc"><span
                                        class="option__title">{{ props.option.displayName }}</span></span>
                            </div>
                        </template>v-for="recipePaintColor in activeRecipeItem.
                        <template slot="option" slot-scope="props">
                            <div v-if="props.option.rgb != null" class="multiselect-color">
                                <div class="color-thumb" :style="`background-color: ${props.option.rgb};`"></div>
                                <div class="option__desc"><span
                                        class="option__title">{{ props.option.displayName }}</span>
                                </div>
                            </div>
                            <div v-else="">
                                <div class="option__desc"><span
                                        class="option__title">{{ props.option.$groupLabel }}</span>
                                </div>
                            </div>
                        </template>
                    </multiselect>

                    <template v-if="activeRecipeItem.recipePaintColors.length > 1">
                        <input class="form-control"
                               type="number"
                               min="0"
                               max="100"
                               v-model="recipePaintColor.percentage">
                        <span>%</span>
                    </template>
                </div>

                <div class="flex-right">
                    <div>
                        <a v-if="activeRecipeItem.recipePaintColors.length < 3"
                           @click="addPaintColorToRecipeItem">+ Add another paint
                        </a>
                        <template v-if="activeRecipeItem.recipePaintColors.length > 1">
                            <span v-if="activeRecipeItem.recipePaintColors.length < 3"
                                  style="margin: 0 0.8rem;">|</span>
                            <a @click="removeLastPaintFromRecipeItem">- Remove last paint
                            </a>
                        </template>
                    </div>
                </div>
                <div>
                    <button v-if="isActiveRecipeItemNew"
                            class="btn btn-default"
                            :disabled="activeRecipeItem.recipePaintColors.some(x => x.paintColor == null) || activeRecipeItem.description.trim() == ''"
                            @click="addColorToActiveRecipe">OK
                    </button>
                    <button v-else=""
                            class="btn btn-default"
                            :disabled="activeRecipeItem.recipePaintColors.some(x => x.paintColor == null) || activeRecipeItem.description.trim() == ''"
                            @click="updateActiveRecipeItem">OK
                    </button>
                </div>
            </div>
        </div>
        <div v-else="" class="recipe-details">
            <div class="well">
                Select an existing recipe or <a @click="newRecipe">add</a> a new one.
            </div>
        </div>
        <div class="modal" v-if="isDeleteModalVisible" @click="isDeleteModalVisible = false">
            <div class="modal-dialog">
                <div class="header">Delete Recipe</div>
                <div class="body">Are you sure you want to delete this recipe?</div>
                <div class="footer">
                    <button @click="confirmDeleteRecipe">Yes</button>
                    <button @click="isDeleteModalVisible = false">No</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Multiselect from 'vue-multiselect';
  import 'vue-multiselect/dist/vue-multiselect.min.css';
  import Recipe from '../models/Recipe';
  import RecipeItem from '../models/RecipeItem';
  import RecipePaintColor from "../models/RecipePaintColor";

  export default {
    props: {
      colorFamilies: Array,
    },
    components: {
      Multiselect,
    },
    data() {
      return {
        activeRecipe: null,
        isDeleteModalVisible: false,
        isEditingActiveRecipeName: false,
        activeRecipeItem: null,
        recipes: [],
        showEditForm: false,
      };
    },
    computed: {
      isActiveRecipeItemNew() {
        return this.activeRecipe.recipeItems.indexOf(this.activeRecipeItem) === -1;
      },
    },
    methods: {
      newRecipe() {
        const r = new Recipe({ name: `Recipe #${this.recipes.length + 1}`, recipeItems: [] });
        this.recipes.push(r);
        this.activeRecipe = r;
        this.isEditingActiveRecipeName = true;
        setTimeout(() => {
          this.$refs.inputRecipeName.focus();
        }, 100);
      },
      addColorToActiveRecipe() {
        this.activeRecipe.recipeItems.push(this.activeRecipeItem);
        this.createNewPaintRecipe();
        this.saveRecipes();
      },
      editRecipeItem(ri) {
        this.activeRecipeItem = ri;
        this.showEditForm = true;
      },
      updateActiveRecipeItem() {
        this.createNewPaintRecipe();
        this.saveRecipes();
      },
      saveRecipes() {
        window.localStorage.recipes = JSON.stringify(this.recipes.map(x => x.toApi()));
      },
      onRecipeNameKeyUp(e) {
        if (e.key === 'Enter') {
          this.isEditingActiveRecipeName = false;
        }
      },
      deleteRecipeItem(rc) {
        this.activeRecipe.recipeItems.splice(this.activeRecipe.recipeItems.indexOf(rc), 1);
        this.saveRecipes();
      },
      createNewPaintRecipe() {
        this.activeRecipeItem = new RecipeItem({
          description: '',
          recipePaintColors: [new RecipePaintColor({ paintColor: null, percentage: 100 })]
        });
      },
      addPaintColorToRecipeItem() {
        const percentage = Math.round(100 / (this.activeRecipeItem.recipePaintColors.length + 1));
        this.activeRecipeItem.recipePaintColors.forEach(rpc => rpc.percentage = percentage);
        this.activeRecipeItem.recipePaintColors.push(new RecipePaintColor({ paintColor: null, percentage }))
      },
      removeLastPaintFromRecipeItem() {
        this.activeRecipeItem.recipePaintColors = this.activeRecipeItem.recipePaintColors.slice(0, this.activeRecipeItem.recipePaintColors.length - 1);
        const percentage = Math.round(100 / (this.activeRecipeItem.recipePaintColors.length));
        this.activeRecipeItem.recipePaintColors.forEach(rpc => rpc.percentage = percentage);
      },
      deleteActiveRecipe() {
        this.isDeleteModalVisible = true;
      },
      confirmDeleteRecipe() {
        this.recipes.splice(this.recipes.indexOf(this.activeRecipe), 1);
        this.saveRecipes();
        this.isDeleteModalVisible = false;
        this.activeRecipe = null;
      },
    },
    mounted() {
      this.createNewPaintRecipe();
      if (window.localStorage.recipes != null) {
        this.recipes = JSON.parse(window.localStorage.recipes).map(x => Recipe.fromApi(x));
        console.log(this.recipes);
      }
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import '../vars.scss';

    .flex-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        width: 100%;
    }

    .flex-h {
        width: 100%;
        display: flex;
        align-items: center;

        .multiselect {
            flex-grow: 1;
        }

        > input {
            margin: 0 0.8rem 0 1.6rem;
        }
    }

    .flex-v {
        width: 100%;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
    }

    .recipe-list-and-details {
        font-size: 1.3rem;
        display: flex;
        width: 100%;

        .recipe-list {
            flex-basis: 25%;
            padding: 0.8rem 1.6rem 0.8rem 0;
            border-right: solid 0.1rem $border-color;
            min-height: 30rem;

            .header {
                display: flex;
                align-items: center;
                h3 {
                    flex-grow: 1;
                }
                button {
                    flex-shrink: 0;
                }
            }
            ul {
                padding: 0;
                margin: 0;
                list-style: none;
            }
            li {
                cursor: pointer;
                padding: 1.2rem 1.6rem;
                background: #eee;
                &:hover {
                    background: $main-color;
                    color: $main-color-reverse;
                }
                &:nth-of-type(2n+1) {
                    background: #f7f7f7;
                }
                &.active {
                    background: $action-color;
                    color: $action-color-reverse;
                }
            }
        }

        .recipe-details {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            padding: 1.6rem 1.6rem 1.6rem 3.2rem;

            .add-color {
                display: flex;
                position: relative;

                .btn-close {
                    background: none;
                    border: none;
                    position: absolute;
                    right: 1.6rem;
                    float: right;
                    box-shadow: none;
                    font-size: 2rem;
                    color: $action-color;
                    top: 0.8rem;
                }

                input[type=text] {
                    width: calc(100% - 2.6rem);
                    display: block;
                }
            }

            .recipe-name {
                font-size: 1.6rem;
                input {
                    width: calc(100% - 2.4rem);
                }
                .label {
                    margin-bottom: 1.6rem;
                    font-size: 1.8em;
                }

                a {
                    margin-left: 0.8rem;
                }
            }
            .recipe-colors {
                padding: 0;
                margin: 0;
                list-style: none;
                margin-top: 0.8rem;

                li {
                    border-top: solid 0.1rem transparentize($border-color, 0.5);
                    margin: 0;
                    padding: 0 1.6rem 1.6rem;
                    cursor: pointer;
                    &:hover {
                        background: rgba(0, 0, 0, 0.05);
                    }

                    h4 {
                        margin: 0.8rem 0 0.6rem 0;
                    }
                    .recipe-color {
                        display: flex;

                        .color-thumb {
                            width: 3.2rem;
                            height: 3.2rem;
                        }
                        .text {
                            flex-grow: 1;
                        }
                    }
                }
            }

            .recipe-item-paint-colors {
                display: flex;
                flex-grow: 1;
                flex-basis: 33%;
                align-items: center;
                margin-top: 0.8rem;

                &:first-of-type {
                    margin-top: 0;
                }
            }
        }

        .color-thumb {
            width: 2.4rem;
            height: 2.4rem;
            margin-right: 0.8rem;
        }

        .multiselect,
        .multiselect__input,
        .multiselect__single {
            font-size: 1.3rem !important;
        }

        .multiselect-color {
            display: flex;
            align-items: center;
            font-size: 1.3rem;
        }

        .form {
            padding: 1.6rem;
            border: solid 0.1rem $border-color;
            border-radius: 0.8rem;
            box-shadow: 0 0.2rem 0.8rem rgba(0, 0, 0, 0.15);
            align-items: flex-start;
        }

        .add-color {
            display: flex;
            flex-direction: column;
            padding: 1.6rem;

            > * {
                margin-bottom: 0.8rem;
            }

            label {
                margin-top: 0.8rem;

                &:first-of-type {
                    margin-top: 0;
                }
            }

            button {
                margin-top: 0.8rem;
            }
        }
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background: rgba(0,0,0,0.1);

        .modal-dialog {
            min-width: 40rem;
            background: #fff;
            border: solid 0.1rem $border-color;
            box-shadow: 0 0.3rem 0.6rem rgba(0,0,0,0.15);
            .header {
                padding: 1.6rem;
                font-size: 1.2em;
                font-weight: 600;
                border-bottom: solid 0.1rem $border-color;
            }
            .body {
                padding: 1.6rem;
            }
            .footer {
                padding: 1.6rem;
                display: flex;
                align-items: flex-end;

                button {
                    margin-left: 0.8rem;
                    &:first-of-type{
                        margin-left: 0;
                    }
                }
            }
        }
    }
</style>
