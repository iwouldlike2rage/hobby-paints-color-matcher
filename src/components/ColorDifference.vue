<template>
    <div>
        <div class="form">
            <input type="text" v-model="textFilter" placeholder="Search colors">
        </div>
        <hr>
        <div>
            <table>
                <thead>
                <tr>
                    <th>Base color</th>
                    <th colspan="5">Matches</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="c in filteredColors" :key="c.id">
                    <td>
                        <div class="color">
                            <div class="swatch" :style="`background-color: ${c.rgb}`"></div>
                            <div><span class="name">{{ c.name }}</span><br><span
                                    class="family">{{c.family}}</span><br><span
                                    class="code">{{c.code}}</span></div>
                        </div>
                    </td>
                    <td v-for="s in c.scores.slice(0, 5)" :key="`${c.code}-${s.c.code}`">
                        <div class="color">
                            <div class="swatch" :style="`background-color: ${s.c.rgb}`">
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
            };
        },
        computed: {
            all() {
                return [...this.vmc, ...this.vgc];
            },
            filteredColors() {
                return this.textFilter.trim() !== ''
                    ? this.all.filter(x => x.name.toLowerCase().indexOf(this.textFilter) > -1 || x.code.toLowerCase().indexOf(this.textFilter) > -1)
                    : this.all;
            },
        },
        mounted() {
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
                    lab: {L: lab[0], A: lab[1], B: lab[2]}
                };
            }).sort((a, b) => a.name.localeCompare(b.name));
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
                    lab: {L: lab[0], A: lab[1], B: lab[2]}
                };
            }).sort((a, b) => a.name.localeCompare(b.name));

            this.all.forEach((c1) => {
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
        border: solid 1px rgba(0, 0, 0, 0.1);
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
        margin: 10px 0 0 6px;
    }

    .form {
        margin-bottom: 16px;
    }

    input {
        border: solid 1px #ccc;
        border-radius: 4px;
        padding: 6px 12px;
        -webkit-box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
        -moz-box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
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
        border: solid 1px rgba(255, 255, 255, .25);
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
        font-weight: 800;
        font-size: 10px;
    }

    .badge.success {
        background: green;
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
