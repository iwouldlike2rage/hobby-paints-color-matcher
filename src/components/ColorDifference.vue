<template>
    <div class="color-diff">
        <v-tour name="myTour"
                :steps="steps"
                :callbacks="tourCallbacks"></v-tour>

        <div v-if="isLoading" class="loading">
            Please wait, processing all paints...
        </div>
        <div v-if="!isLoading && !isLocalStorageSupported">
            Sorry, this tool need an up to date browser supporting "localStorage" in order to properly work.
        </div>
        <div v-if="!isLoading && isLocalStorageSupported" class="loaded">
            <p class="pad-h">Enable / disable color families. Disabled color families will not appear in the list of
                matches and purchase recommendations below.</p>
            <div class="form color-families">
                <label v-for="cf in colorFamilies" :key="cf.family" :class="{ checked: cf.isEnabled }">
                    <input type="checkbox" :checked="cf.isEnabled" @click="toggleFamily(cf)">
                    <img :src="cf.logo" alt="">
                    <span>{{ cf.shortName }}</span>
                </label>
            </div>
            <div class="tab-list">
                <button @click="selectedTab = 'color_list'"
                        :class="{ selected: selectedTab == 'color_list' }">Paint
                    list
                </button>
                <button @click="selectedTab = 'stats'" :class="{ selected: selectedTab == 'stats' }">Purchase
                    recommendations
                </button>
                <button @click="selectedTab = 'import_export'" :class="{ selected: selectedTab == 'import_export' }">
                    Import / Export
                </button>
            </div>
            <div class="tab" id="color_list" v-show="selectedTab == 'color_list'">
                <div class="form">
                    <input id="text_search" type="text" v-model="textFilter" placeholder="Search colors">
                    <div class="filler"></div>
                    <label for="only_show_owned_colors">
                        <input type="checkbox" id="only_show_owned_colors" v-model="onlyShowOwnedColors"> Only show
                        paints I
                        own
                    </label>
                    <button id="display_more_matches"
                            class="btn" :disabled="numberOfMatchesToDisplay >= 10"
                            @click="numberOfMatchesToDisplay += 1">
                        + More
                        matches
                    </button>
                    <button id="display_less_matches"
                            class="btn" :disabled="numberOfMatchesToDisplay <= 1"
                            @click="numberOfMatchesToDisplay -= 1">
                        - Less
                        matches
                    </button>
                </div>
                <div>
                    <table id="color_matches_table">
                        <thead>
                        <tr>
                            <th id="col_base">Color ({{filteredColors.length}})</th>
                            <th id="col_matches" :colspan="numberOfMatchesToDisplay">Matches</th>
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
                            <td v-for="s in c.scores
                        .filter(x => (onlyShowOwnedColors === false || x.c.isOwned) && enabledFamilies.indexOf(x.c.family) > -1)
                        .slice(0, numberOfMatchesToDisplay)"
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
            <div class="tab" id="stats" v-show="selectedTab == 'stats'">
                <div class="form">
                    <p>The following list is a recommendation of paints to purchase based on the colors you already own.<br>
                        It looks at the biggest existing gaps (e-delta) between all your colors and suggests the colors
                        close to
                        the halfway point for each of these gaps.<br>
                        Disabled paint families will not appear in the recommendations.
                    </p>
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
                        <tr v-for="pair in colorPairsWithBiggestDistance.slice(0,100)" :key="pair.id">
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
            <div class="tab" id="import_export" v-show="selectedTab == 'import_export'">
                <form>
                    <p>This tools stores the list of paints you own and the paint family settings in the browser's local
                        storage.<br/>
                        Use the buttons below to transfer these settings between computers / browsers.</p>
                    <div class="actions">
                        <button @click="exportCollection">Export my collection</button>
                        <label for="import_file" class="file-upload-label">
                            <input id="import_file"
                                   type="file"
                                   class="btn"
                                   @change="importCollection">Import a collection
                        </label>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import space from 'color-space';
    import deltaE from 'delta-e';
    import numeral from 'numeral';
    import Cookies from 'js-cookie';

    import VallejoModelColors from '../vmc.json';
    import VallejoGameColors from '../vgc.json';
    import VallejoPanzerAces from '../vpa.json';
    import CitadelBase from '../cib.json';
    import CitadelLayer from '../cil.json';
    import ArmyPainter from '../ap.json';
    import P3 from '../p3.json';
    import ColorSwatch from './ColorSwatch';
    import ModelColorLogo from '../assets/model-color.jpg';
    import GameColorLogo from '../assets/game-color.jpg';
    import PanzerAcesLogo from '../assets/panzer-aces.jpg';
    import CitadelBaseLogo from '../assets/citadel-base.jpg';
    import CitadelLayerLogo from '../assets/citadel-layer.jpg';
    import ArmyPainterLogo from '../assets/army-painter.jpg';
    import P3Logo from '../assets/p3.jpg';

    export default {
        components: {ColorSwatch},
        data() {
            return {
                all: [],
                colorFamilies: [],
                isLoading: true,
                isLocalStorageSupported: false,
                numberOfMatchesToDisplay: 4,
                numeral,
                onlyShowOwnedColors: false,
                selectedTab: 'color_list',
                textFilter: '',
                steps: [
                    {
                        target: '.color-families label:nth-of-type(3)',  // We're using document.querySelector() under the hood
                        content: 'Select the paint families you\'d like to enable or disable.'
                    },
                    {
                        target: '.tab-list>:nth-of-type(1)',
                        content: 'This tab shows a list of all paints with their close matches.'
                    },
                    {
                        target: '#col_base',
                        content: 'This column displays all the paints from the selected paint families.',
                        params: {
                            placement: 'top'
                        }
                    },
                    {
                        target: '#col_matches',
                        content: 'This column displays the top matches for the paint in the left column (only showing paints from the selected families).',
                        params: {
                            placement: 'top'
                        }
                    },
                    {
                        target: '#color_matches_table .swatch-container:first-of-type',
                        content: 'Click on the color swatches to toggle ownership.',
                        params: {
                            placement: 'right'
                        }
                    },
                    {
                        target: '#text_search',
                        content: 'Filter paints by name by typing in this box.',
                        params: {
                            placement: 'right'
                        }
                    },
                    {
                        target: '#only_show_owned_colors',
                        content: 'Check this box to only see the colors you own.',
                        params: {
                            placement: 'left'
                        }
                    },
                    {
                        target: '#display_more_matches',
                        content: 'Use these buttons to change the number of matches being displayed.',
                        params: {
                            placement: 'left'
                        }
                    },
                    {
                        target: '.tab-list>:nth-of-type(2)',
                        content: 'This tab shows purchase recommendations based on the gaps between the colors you already own. You\'ll have to mark some colors as being owned first.',
                    },
                    {
                        target: '.tab-list>:nth-of-type(3)',
                        content: 'This tab provides import / export functionality to transfer your settings between browsers / computers.',
                    }
                ],
                tourCallbacks: {
                    onPreviousStep: this.tourPreviousStepCallback,
                    onNextStep: this.tourNextStepCallback,
                    onStop: this.tourStoppedCallback,
                },
            };
        },
        computed: {
            enabledFamilies() {
                return this.colorFamilies.filter(x => x.isEnabled).map(x => x.family);
            },
            colorsFromEnabledFamilies() {
                return this.all.filter(x => this.enabledFamilies.indexOf(x.family) > -1);
            },
            filteredColors() {
                const filtered = this.textFilter.trim() !== ''
                    ? this.colorsFromEnabledFamilies.filter(x => x.name.toLowerCase().indexOf(this.textFilter) > -1 || x.code.toLowerCase().indexOf(this.textFilter) > -1)
                    : this.colorsFromEnabledFamilies;
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
                        .filter(x => this.enabledFamilies.indexOf(x.c.family) > -1)
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
            tourPreviousStepCallback(step) {
                console.log(step); // eslint-disable-line
                // if(step === 6) {
                //     this.selectedTab = 'color_list';
                // }
            },
            tourNextStepCallback(step) {
                console.log(step); // eslint-disable-line
                // if(step === 7) {
                //     this.selectedTab = 'stats';
                // }
            },
            tourStoppedCallback() {
                Cookies.set('tour', 'done');
            },
            toggleOwnership(c) {
                c.isOwned = !c.isOwned;
                window.localStorage.setItem('owned-colors', JSON.stringify(this.ownedColors.map((x) => {
                    return {name: x.name, family: x.family};
                })));
            },
            toggleFamily(f) {
                f.isEnabled = !f.isEnabled;
                window.localStorage.setItem('enabled-families', this.enabledFamilies);
            },
            exportCollection() {
                if (window.localStorage.getItem('owned-colors') != null
                    && window.localStorage.getItem('enabled-families') != null) {
                    const ownedColors = window.localStorage.getItem('owned-colors');
                    const enabledFamilies = window.localStorage.getItem('enabled-families');
                    this.download(JSON.stringify({
                        ownedColors,
                        enabledFamilies,
                    }), 'color-matcher.json', 'application/json');
                }
            },
            importCollection(e) {
                const reader = new window.FileReader();
                reader.onload = (event) => {
                    const data = JSON.parse(event.target.result);
                    window.localStorage.setItem('owned-colors', data.ownedColors);
                    window.localStorage.setItem('enabled-families', data.enabledFamilies);
                    window.location.reload();
                };
                reader.readAsText(e.target.files[0]);
            },
            download(data, filename, type) {
                const file = new Blob([data], {type: type});
                if (window.navigator.msSaveOrOpenBlob) // IE10+
                    window.navigator.msSaveOrOpenBlob(file, filename);
                else { // Others
                    const a = document.createElement("a");
                    const url = URL.createObjectURL(file);
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(function () {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 0);
                }
            }
        },
        mounted() {
            this.$ga.page('/')
            const test = 'modernizr';
            try {
                window.localStorage.setItem(test, test);
                window.localStorage.removeItem(test);
                this.isLocalStorageSupported = true;
            } catch(e) {
                return;
            }

            setTimeout(() => {
                let ownedColors = [];
                if (window.localStorage.getItem('owned-colors') != null) {
                    ownedColors = JSON.parse(window.localStorage.getItem('owned-colors'));
                }
                let id = 0;
                const enabledFamily = window.localStorage.getItem('enabled-families');
                this.colorFamilies = [
                    {
                        list: VallejoModelColors,
                        family: 'Vallejo Model Color',
                        shortName: 'Model Color',
                        logo: ModelColorLogo,
                        isEnabled: enabledFamily == null || (enabledFamily != null && enabledFamily.indexOf('Vallejo Model Color') > -1)
                    },
                    {
                        list: VallejoGameColors,
                        family: 'Vallejo Game Color',
                        shortName: 'Game Color',
                        logo: GameColorLogo,
                        isEnabled: enabledFamily == null || (enabledFamily != null && enabledFamily.indexOf('Vallejo Game Color') > -1)
                    },
                    {
                        list: VallejoPanzerAces,
                        family: 'Vallejo Panzer Aces',
                        shortName: 'Panzer Aces',
                        logo: PanzerAcesLogo,
                        isEnabled: enabledFamily == null || (enabledFamily != null && enabledFamily.indexOf('Vallejo Panzer Aces') > -1)
                    },
                    {
                        list: CitadelBase,
                        family: 'Citadel Base',
                        shortName: 'Citadel Base',
                        logo: CitadelBaseLogo,
                        isEnabled: enabledFamily == null || (enabledFamily != null && enabledFamily.indexOf('Citadel Base') > -1)
                    },
                    {
                        list: CitadelLayer,
                        family: 'Citadel Layer',
                        shortName: 'Citadel Layer',
                        logo: CitadelLayerLogo,
                        isEnabled: enabledFamily == null || (enabledFamily != null && enabledFamily.indexOf('Citadel Layer') > -1)
                    },
                    {
                        list: ArmyPainter,
                        family: 'Army Painter',
                        shortName: 'Army Painter',
                        logo: ArmyPainterLogo,
                        isEnabled: enabledFamily == null || (enabledFamily != null && enabledFamily.indexOf('Army Painter') > -1)
                    },
                    {
                        list: P3,
                        family: 'P3 Formula',
                        shortName: 'P3 Formula',
                        logo: P3Logo,
                        isEnabled: enabledFamily == null || (enabledFamily != null && enabledFamily.indexOf('P3 Formula') > -1)
                    },
                ];

                this.all = this.colorFamilies.map((cf) => {
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
                        const d = deltaE.getDeltaE00(c1.lab, c2.lab);
                        return {
                            id,
                            c: c2,
                            d
                        };
                    });
                    scores.sort((a, b) => a.d - b.d);
                    c1.scores = scores;
                });
                this.isLoading = false;

                if (Cookies.get('tour') !== 'done') {
                    this.$tours['myTour'].start();
                }
            }, 100);
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .color-diff {
        padding-top: 16px;
        font-size: 12px;
    }

    .pad-h {
        padding-left: 16px;
        padding-right: 16px;
    }

    .color-families {
        display: flex;
        flex-wrap: wrap;
    }

    .color-families label {
        border: solid 1px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        padding: 8px 8px 8px 0;
        display: flex;
        align-items: center;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
        font-size: 0.9em;
        cursor: pointer;
        margin-bottom: 6px;
    }

    .color-families label:hover {
        background: rgba(50, 205, 50, 0.15);
    }

    .color-families label input {
        opacity: 0;
        width: 0;
    }

    .color-families label.checked {
        font-weight: 600;
        background: rgba(50, 205, 50, 0.27);
        border-color: #38b15a;
    }

    .color-families img {
        height: 32px;
        margin-right: 8px;
    }

    .color-families label.checked img {
    }

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

    .form input[type=text] {
        flex-grow: 1;
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

    table thead tr th:first-of-type,
    table tbody tr td:first-of-type {
        border-right: solid 1px #ccc;
    }

    table tbody tr td:nth-of-type(2) {
        padding-left: 16px;
    }

    .tab p {
        padding: 0 16px;
    }

    .tab-list {
        display: flex;
        margin-bottom: 16px;
        border-bottom: solid 1px #ccc;
    }

    .tab-list button {
        background: transparent;
        border-width: 0;
        border-color: transparent;
        border-bottom-width: 4px;
        box-shadow: none;
        margin: 0;
        padding-left: 24px;
        padding-right: 24px;
        outline: none;
    }

    .tab-list button:first-of-type {
        margin-left: 8px;
    }

    .tab-list button.selected {
        border-color: #108bff;
        color: #108bff;
    }

    .tab-list button:hover {
        color: #108bffcc;
    }

    .actions {
        display: flex;
        align-items: center;
    }

    .loading {
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 16px;
    }

</style>
