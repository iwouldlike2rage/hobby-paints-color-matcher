<template>
    <div>
        <div class="tab-list">
            <button @click="selectedTab = 'color_list'" :class="{ selected: selectedTab == 'color_list' }">Paint list</button>
            <button @click="selectedTab = 'stats'" :class="{ selected: selectedTab == 'stats' }">Purchase recommendations</button>
        </div>
        <div class="tab" id="stats" v-show="selectedTab == 'stats'">
            <div class="form">
                <p>The following list is a recommendation of paints to purchase based on the colors you already own.<br>
                    It looks at the biggest existing gaps (e-delta) between all your colors and suggests colors close to the halfway point for each of these gaps.</p>
            </div>
            <div v-if="colorPairsWithBiggestDistance != null">
                <table>
                    <thead>
                    <tr>
                        <th>Recommended buy</th>
                        <th>First owned color</th>
                        <th>Distance (e-delta)</th>
                        <th>Second owned color</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="pair in colorPairsWithBiggestDistance.slice(0,20)" :key="pair.id">
                        <td>
                            <color-swatch v-if="pair.suggestedBuy != null"
                                          :color="pair.suggestedBuy.c"
                                          :score="pair.suggestedBuy.d"
                                          :is-base-color="true"></color-swatch>

                        </td>
                        <td>
                            <color-swatch :color="pair.color1"
                                          :is-base-color="false"></color-swatch>
                        </td>
                        <td style="text-align: center;">
                            <b>{{ numeral(pair.distance).format('0.00') }}</b>
                        </td>
                        <td>
                            <color-swatch :color="pair.color2"
                                          :is-base-color="false"></color-swatch>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="tab" id="color_list" v-show="selectedTab == 'color_list'">
            <div class="form">
                <input type="text" v-model="textFilter" placeholder="Search colors">
                <div class="filler"></div>
                <label for="only_show_owned_colors">
                    <input type="checkbox" id="only_show_owned_colors" v-model="onlyShowOwnedColors"> Only show colors I own
                </label>
                <button class="btn" :disabled="numberOfMatchesToDisplay >= 10" @click="numberOfMatchesToDisplay += 1">
                    + More
                    matches
                </button>
                <button class="btn" :disabled="numberOfMatchesToDisplay <= 1" @click="numberOfMatchesToDisplay -= 1">
                    - Less
                    matches
                </button>
            </div>
            <div>
                <table>
                    <thead>
                    <tr>
                        <th>Base color ({{filteredColors.length}})</th>
                        <th :colspan="numberOfMatchesToDisplay">Matches</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="c in filteredColors" :key="c.id">
                        <td>
                            <div class="color">
                                <color-swatch :color="c"
                                              :is-base-color="true"
                                              @toggleOwnership="toggleOwnership(c)"></color-swatch>
                            </div>
                        </td>
                        <td v-for="s in c.scores.filter(x => onlyShowOwnedColors === false || x.c.isOwned).slice(0, numberOfMatchesToDisplay)"
                            :key="s.id">
                            <color-swatch :color="s.c"
                                          :score="s.d"
                                          :is-base-color="false"></color-swatch>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import space from 'color-space';
    import deltaE from 'delta-e';
    import numeral from 'numeral';

    import VallejoModelColors from '../vmc.json';
    import VallejoGameColors from '../vgc.json';
    import VallejoPanzerAces from '../vpa.json';
    import CitadelBase from '../cib.json';
    import CitadelLayer from '../cil.json';
    import ColorSwatch from './ColorSwatch';
    import ModelColorLogo from '../assets/model-color.jpg';
    import GameColorLogo from '../assets/game-color.jpg';
    import PanzerAcesLogo from '../assets/panzer-aces.jpg';
    import CitadelBaseLogo from '../assets/citadel-base.jpg';
    import CitadelLayerLogo from '../assets/citadel-layer.jpg';

    export default {
        components: {ColorSwatch},
        data() {
            return {
                all: [],
                textFilter: '',
                numeral,
                numberOfMatchesToDisplay: 4,
                onlyShowOwnedColors: false,
                selectedTab: 'color_list',
            };
        },
        computed: {
            filteredColors() {
                const filtered = this.textFilter.trim() !== ''
                    ? this.all.filter(x => x.name.toLowerCase().indexOf(this.textFilter) > -1 || x.code.toLowerCase().indexOf(this.textFilter) > -1)
                    : this.all;
                return this.onlyShowOwnedColors
                    ? filtered.filter(x => x.isOwned)
                    : filtered;
            },
            ownedColors() {
                return this.all.filter(x => x.isOwned);
            },
            colorPairsWithBiggestDistance() {
                if (this.ownedColors.length < 2) {
                    return null;
                }
                let id = 0;
                const colors = [...this.ownedColors].sort((a, b) => a.scores.filter(x => x.c.isOwned)[0].d > b.scores.filter(x => x.c.isOwned)[0].d ? -1 : 1);
                const pairs = colors.map((color) => {
                    id += 1;
                    const color2 = color.scores.filter(x => x.c.isOwned)[0].c;
                    const distance = color.scores.filter(x => x.c.isOwned)[0].d;
                    const suggestedBuys = color.scores
                        .filter(x => !x.c.isOwned && x.d < distance)
                        .sort((a, b) => Math.abs(a.d - (distance / 2)) - Math.abs(b.d - (distance / 2)));

                    return {
                        id,
                        color1: color,
                        color2,
                        distance,
                        suggestedBuy: suggestedBuys.length > 0 ? suggestedBuys[0] : null,
                    };
                }).filter(x => x.suggestedBuy != null);
                return pairs;
            },
        },
        methods: {
            toggleOwnership(c) {
                c.isOwned = !c.isOwned;
                window.localStorage.setItem('owned-colors', JSON.stringify(this.ownedColors.map((x) => {
                    return {name: x.name, family: x.family};
                })));
            }
        },
        mounted() {
            let ownedColors = [];
            if (window.localStorage.getItem('owned-colors') != null) {
                ownedColors = JSON.parse(window.localStorage.getItem('owned-colors'));
            }
            let id = 0;
            
            const colorFamilies = [
                {
                    list: VallejoModelColors,
                    family: 'Vallejo Model Color',
                    logo: ModelColorLogo,
                },
                {
                    list: VallejoGameColors,
                    family: 'Vallejo Model Color',
                    logo: GameColorLogo,
                },
                {
                    list: VallejoPanzerAces,
                    family: 'Vallejo Model Color',
                    logo: PanzerAcesLogo,
                },
                {
                    list: CitadelBase,
                    family: 'Citadel Base',
                    logo: CitadelBaseLogo,
                },
                {
                    list: CitadelLayer,
                    family: 'Citadel Layer',
                    logo: CitadelLayerLogo,
                },
            ];

            this.all = colorFamilies.map((cf) => {
                return cf.list.map((c) => {
                    id += 1;
                    const r = parseInt(c.rgb.slice(1, 3), 16);
                    const g = parseInt(c.rgb.slice(3, 5), 16);
                    const b = parseInt(c.rgb.slice(5, 7), 16);
                    const lab = space.rgb.lab([r, g, b]);
                    return {
                        id,
                        family: cf.family,
                        logo: cf.logo,
                        code: c.code,
                        name: c.name,
                        rgb: c.rgb,
                        r,
                        g,
                        b,
                        lab: {L: lab[0], A: lab[1], B: lab[2]},
                        isOwned: false,
                    };
                }).sort((a, b) => `${a.code} - ${a.name}`.localeCompare(`${b.code} - ${b.name}`));
            }).reduce((mem, f) => [...mem, ...f], []);

            this.all.forEach((c1) => {
                c1.isOwned = (ownedColors.find(x => x.name === c1.name && x.family === c1.family) != null)
                const scores = this.all.filter(c => c.id !== c1.id).map((c2) => {
                    id += 1;
                    return {
                        id,
                        c: c2,
                        d: deltaE.getDeltaE00(c1.lab, c2.lab)
                    };
                });
                c1.scores = scores.sort((a, b) => a.d - b.d);
            });
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .form {
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        padding: 0 16px
    }

    .form button {
        margin-left: 16px;
    }

    .form label {
        margin-right: 16px;
    }

    .filler {
        flex-grow: 1;
    }

    table {
        border-spacing: 0;
    }

    table thead th {
        padding: 8px 16px;
        background: #eee;
        font-size: 13px;
        font-weight: 600;
        border-bottom: solid 1px rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.05);
    }

    table tbody tr:nth-of-type(2n) {
        background: #fff;
    }

    table tbody tr:nth-of-type(2n+1) {
        background: #f3f3f3;
    }

    table tbody tr td {
        padding: 8px 8px;
    }

    table tbody tr td:first-of-type {
        border-right: solid 1px #ccc;
    }

    table tbody tr td:nth-of-type(2) {
        padding-left: 16px;
    }

    .tab-list {
        display: flex;
        border-bottom: solid 1px #ccc;
        margin-bottom: 16px;
    }

    .tab-list button {
        background: #eee;
        border: solid 1px #ccc;
        border-radius: 0;
        border-bottom-width: 0;
        box-shadow: none;
        margin: 0;
        padding-left: 24px;
        padding-right: 24px;
    }

    .tab-list button:first-of-type {
        margin-left: 8px;
    }

    .tab-list button.selected {
        background: #fff;
    }

</style>
