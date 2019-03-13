<template>
    <div>
        <div class="form">
            <input type="text" v-model="textFilter" placeholder="Search colors">
            <div class="filler"></div>
            <label for="only_show_owned_colors">
                <input type="checkbox" id="only_show_owned_colors" v-model="onlyShowOwnedColors">
            </label>
            <button class="btn" :disabled="numberOfMatchesToDisplay >= 10" @click="numberOfMatchesToDisplay += 1">More
                matches
            </button>
            <button class="btn" :disabled="numberOfMatchesToDisplay <= 1" @click="numberOfMatchesToDisplay -= 1">Less
                matches
            </button>
        </div>
        <hr>
        <div>
            <table>
                <thead>
                <tr>
                    <th>Base color</th>
                    <th :colspan="numberOfMatchesToDisplay">Matches</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="c in filteredColors" :key="c.id">
                    <td>
                        <div class="color">
                            <div class="swatch base-color"
                                 :class="{ 'is-owned': c.isOwned }"
                                 :style="`background-color: ${c.rgb}`"
                                 @click="() => toggleOwnership(c)">
                                <div class="state">
                                    <div class="owned-tag" v-show="c.isOwned">
                                        <svg width="100pt" height="100pt" version="1.1" viewBox="0 0 100 100"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="m50 3.75c-25.504 0-46.25 20.746-46.25 46.25s20.746 46.25 46.25 46.25 46.25-20.746 46.25-46.25-20.746-46.25-46.25-46.25zm25.637 36.828-29.539 29.535c-0.89844 0.89844-2.1445 1.4141-3.4141 1.4141v2l-0.042969-2c-1.2891-0.011719-2.5391-0.55078-3.4336-1.4766l-14.902-15.441c-1.8516-1.918-1.7969-4.9805 0.12109-6.8281 0.90625-0.875 2.0977-1.3555 3.3516-1.3555 1.3242 0 2.5586 0.52344 3.4766 1.4766l11.488 11.906 26.062-26.062c0.91016-0.91016 2.125-1.4141 3.4141-1.4141s2.5039 0.50391 3.4141 1.4141c1.8867 1.8828 1.8867 4.9492 0.003907 6.832z"/>
                                        </svg>
                                    </div>
                                </div>
                                <div class="action">
                                    <div class="owned-tag" v-show="c.isOwned">
                                        <svg width="100pt" height="100pt" version="1.1" viewBox="0 0 100 100"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="m50 5c-24.801 0-45 20.199-45 45s20.199 45 45 45 45-20.199 45-45-20.199-45-45-45zm22.301 60.898l-6.3984 6.3984-15.902-15.898-15.898 15.902-6.3984-6.3984 15.898-15.902-15.902-15.898 6.3984-6.3984 15.902 15.898 15.898-15.898 6.3984 6.3984-15.898 15.898z"/>
                                        </svg>
                                    </div>
                                    <div class="owned-tag" v-show="!c.isOwned">
                                        <svg width="100pt" height="100pt" version="1.1" viewBox="0 0 100 100"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="m50 3.75c-25.504 0-46.25 20.746-46.25 46.25s20.746 46.25 46.25 46.25 46.25-20.746 46.25-46.25-20.746-46.25-46.25-46.25zm25.637 36.828-29.539 29.535c-0.89844 0.89844-2.1445 1.4141-3.4141 1.4141v2l-0.042969-2c-1.2891-0.011719-2.5391-0.55078-3.4336-1.4766l-14.902-15.441c-1.8516-1.918-1.7969-4.9805 0.12109-6.8281 0.90625-0.875 2.0977-1.3555 3.3516-1.3555 1.3242 0 2.5586 0.52344 3.4766 1.4766l11.488 11.906 26.062-26.062c0.91016-0.91016 2.125-1.4141 3.4141-1.4141s2.5039 0.50391 3.4141 1.4141c1.8867 1.8828 1.8867 4.9492 0.003907 6.832z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div><span class="name">{{ c.name }}</span><br><span
                                    class="family">{{c.family}}</span><br><span
                                    class="code">{{c.code}}</span></div>
                        </div>
                    </td>
                    <td v-for="s in c.scores.filter(x => onlyShowOwnedColors === false || x.c.isOwned).slice(0, numberOfMatchesToDisplay)"
                        :key="`${c.code}-${s.c.code}`">
                        <div class="color">
                            <div class="swatch"
                                 :class="{ 'is-owned': s.c.isOwned }"
                                 :style="`background-color: ${s.c.rgb}`">
                                <div class="score">
                                    <span class="badge"
                                          :class="{ success: s.d < 2, warning: s.d >=2 && s.d < 10, danger: s.d >=10 }">
                                        {{numeral(s.d).format('0.00')}}
                                    </span></div>
                            </div>
                            <div><span class="name">{{ s.c.name }}</span><br><span
                                    class="family">{{s.c.family}}</span><br><span
                                    class="code">{{s.c.code}}</span><br>
                            </div>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import space from 'color-space';
    import deltaE from 'delta-e';
    import numeral from 'numeral';

    import VallejoModelColors from '../vmc.json';
    import VallejoGameColors from '../vgc.json';

    export default {
        data() {
            return {
                textFilter: '',
                vmc: [],
                vgc: [],
                numeral,
                numberOfMatchesToDisplay: 4,
                onlyShowOwnedColors: false,
            };
        },
        computed: {
            all() {
                return [...this.vmc, ...this.vgc];
            },
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
            this.vmc = VallejoModelColors.map((c) => {
                id += 1;
                const r = parseInt(c.rgb.slice(1, 3), 16);
                const g = parseInt(c.rgb.slice(3, 5), 16);
                const b = parseInt(c.rgb.slice(5, 7), 16);
                const lab = space.rgb.lab([r, g, b]);
                return {
                    id,
                    family: 'Vallejo Model Color',
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
            this.vgc = VallejoGameColors.map((c) => {
                id += 1;
                const r = parseInt(c.rgb.slice(1, 3), 16);
                const g = parseInt(c.rgb.slice(3, 5), 16);
                const b = parseInt(c.rgb.slice(5, 7), 16);
                const lab = space.rgb.lab([r, g, b]);
                return {
                    id,
                    family: 'Vallejo Game Color',
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

            this.all.forEach((c1) => {
                c1.isOwned = (ownedColors.find(x => x.name === c1.name && x.family === c1.family) != null)
                id += 1;
                const scores = this.all.filter(c => c.id !== c1.id).map((c2) => {
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
    .color {
        display: flex;
        align-items: center;
        text-align: left;
        font-size: 12px;
    }

    .swatch {
        width: 64px;
        min-width: 64px;
        height: 64px;
        margin-right: 8px;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
        border: solid 2px rgba(0, 0, 0, 0.1);
        padding: 8px;
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
    }

    .family {
        font-size: 0.9em;
    }

    .code {
        font-family: monospace;
    }

    .score {
    }

    .form {
        margin-bottom: 16px;
        display: flex;
        align-items: center;
    }

    input, button {
        border: solid 1px #ccc;
        border-radius: 4px;
        padding: 6px 12px;
        -webkit-box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
        -moz-box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
        font-size: 16px;
    }

    button {
        font-weight: 600;
        margin-left: 8px;
    }

    .filler {
        flex-grow: 1;
    }

    table {
        border-spacing: 0;
    }

    table thead th {
        padding: 8px 16px;
        background: #ccc;
        font-size: 13px;
        font-weight: 600;
        border-bottom: solid 1px rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.05);
    }

    table tbody tr:nth-of-type(2n) {
        background: #fff;
    }

    table tbody tr:nth-of-type(2n+1) {
        background: #eee;
    }

    table tbody tr td {
        padding: 8px 8px;
    }

    table tbody tr td:first-of-type {
        border-right: solid 1px #ccc;
        background: rgba(0, 0, 0, 0.05);
    }

    table tbody tr td:nth-of-type(2) {
        padding-left: 16px;
    }

    .badge {
        padding: 3px 6px;
        border-radius: 6px;
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
        color: rgba(0, 0, 0, 0.65);
    }

    .badge.danger {
        background: #ff0042;
        color: #fff;
    }

</style>
