<template>
    <div class="color" :class="{ 'full-width': useFullWidth }">
        <div class="swatch-container">
            <div class="swatch"
                 :class="{ 'is-owned': color.isOwned, 'base-color': isBaseColor }"
                 :style="`background-color: ${color.rgb}`"
                 @click="() => toggleOwnership()">
                <div class="state" v-if="isBaseColor">
                    <div class="owned-tag" v-show="color.isOwned">
                        <svg width="100pt" height="100pt" version="1.1" viewBox="0 0 100 100"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="m50 3.75c-25.504 0-46.25 20.746-46.25 46.25s20.746 46.25 46.25 46.25 46.25-20.746 46.25-46.25-20.746-46.25-46.25-46.25zm25.637 36.828-29.539 29.535c-0.89844 0.89844-2.1445 1.4141-3.4141 1.4141v2l-0.042969-2c-1.2891-0.011719-2.5391-0.55078-3.4336-1.4766l-14.902-15.441c-1.8516-1.918-1.7969-4.9805 0.12109-6.8281 0.90625-0.875 2.0977-1.3555 3.3516-1.3555 1.3242 0 2.5586 0.52344 3.4766 1.4766l11.488 11.906 26.062-26.062c0.91016-0.91016 2.125-1.4141 3.4141-1.4141s2.5039 0.50391 3.4141 1.4141c1.8867 1.8828 1.8867 4.9492 0.003907 6.832z"/>
                        </svg>
                    </div>
                </div>
                <div class="action" v-if="isBaseColor">
                    <div class="owned-tag" v-show="color.isOwned">
                        <svg width="100pt" height="100pt" version="1.1" viewBox="0 0 100 100"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="m50 5c-24.801 0-45 20.199-45 45s20.199 45 45 45 45-20.199 45-45-20.199-45-45-45zm22.301 60.898l-6.3984 6.3984-15.902-15.898-15.898 15.902-6.3984-6.3984 15.898-15.902-15.902-15.898 6.3984-6.3984 15.902 15.898 15.898-15.898 6.3984 6.3984-15.898 15.898z"/>
                        </svg>
                    </div>
                    <div class="owned-tag" v-show="!color.isOwned">
                        <svg width="100pt" height="100pt" version="1.1" viewBox="0 0 100 100"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="m50 3.75c-25.504 0-46.25 20.746-46.25 46.25s20.746 46.25 46.25 46.25 46.25-20.746 46.25-46.25-20.746-46.25-46.25-46.25zm25.637 36.828-29.539 29.535c-0.89844 0.89844-2.1445 1.4141-3.4141 1.4141v2l-0.042969-2c-1.2891-0.011719-2.5391-0.55078-3.4336-1.4766l-14.902-15.441c-1.8516-1.918-1.7969-4.9805 0.12109-6.8281 0.90625-0.875 2.0977-1.3555 3.3516-1.3555 1.3242 0 2.5586 0.52344 3.4766 1.4766l11.488 11.906 26.062-26.062c0.91016-0.91016 2.125-1.4141 3.4141-1.4141s2.5039 0.50391 3.4141 1.4141c1.8867 1.8828 1.8867 4.9492 0.003907 6.832z"/>
                        </svg>
                    </div>
                </div>
                <div class="score" v-if="!isBaseColor && score != null">
                <span class="badge"
                      :class="{ success: score < 2, warning: score >=2 && score < 10, danger: score >=10 }"
                      v-tooltip.top-center="'This is the Delta-E, the difference between this color and the base color. The lower, the better.'">
                    {{numeral(score).format('0.00')}}
                </span>
                </div>
            </div>
        </div>
        <div class="info">
            <div class="family"><img :src="color.logo" :alt="color.family"></div>
            <div class="name-and-code">
                <span class="name">{{ color.name }}</span>
                <span class="code">{{ color.code }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import numeral from 'numeral';
    export default {
        props: {
            color: {
                type: Object,
            },
            score: {
                type: Number,
                default: null,
            },
            isBaseColor: {
                type: Boolean,
                default: false,
            },
            useFullWidth: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                numeral,
            };
        },
        methods: {
            toggleOwnership() {
                this.$emit('toggleOwnership', this.color);
            },
        },
    }
</script>

<style scoped>
    .color {
        display: flex;
        align-items: center;
        text-align: left;
        font-size: 12px;
    }

    .swatch-container {
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.25);
        margin-right: 8px;
    }

    .swatch {
        width: 40px;
        min-width: 40px;
        height: 40px;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
        border: solid 3px transparent;
        padding: 6px;
    }

    .swatch.base-color {
        cursor: pointer;
    }

    .swatch.base-color:hover .state {
        display: none;
    }

    .swatch.base-color .action {
        display: none;
    }

    .swatch.base-color:hover .action {
        display: block;
    }

    .swatch.is-owned {
        border-color: #00ff4f;
        box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.5);
    }

    .swatch .owned-tag {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
    }

    .swatch .owned-tag svg {
        width: 16px;
        height: 16px;
        fill: rgba(255, 255, 255, 0.9);
    }

    .name {
        font-weight: 600;
        font-size: 1.2em;
        max-width: 100px;
        word-wrap: break-word;
        white-space: pre-wrap;
    }

    .color.full-width .name {
        max-width: 100%;
    }

    .info{
        display: flex;
    }

    .name-and-code {
        display: flex;
        flex-direction: column;
    }

    .family {
        display: flex;
        align-items: center;
    }

    .family img{
        margin-right: 8px;
        margin-top: 3px;
        max-height: 32px;
        box-shadow: 0 2px 3px rgba(0,0,0,0.5);
    }

    .code {
        font-weight: 600;
        color: rgba(0,0,0,0.5)
    }

    .score {
    }


    .badge {
        padding: 2px 5px;
        border-radius: 4px;
        /* border: solid 1px rgba(255, 255, 255, .25);*/
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
        font-weight: 600;
        font-size: 10px;
    }

    .badge.success {
        background: #00cb3f;
        color: #fff;
    }

    .badge.info {
        background: #004cff;
        color: #fff;
    }

    .badge.warning {
        background: #ccc;
        color: rgba(0, 0, 0, 0.75);
    }

    .badge.danger {
        background: #ff0042;
        color: #fff;
    }

    @media screen and (max-width: 1024px){
        .swatch {
            width: 28px;
            height: 28px;
            min-height: 28px;
            min-width: 28px;
        }

        .color{
            font-size: 10px;
            max-width: 150px;
        }

        .family img {
            max-height: 20px;
        }
    }

</style>
