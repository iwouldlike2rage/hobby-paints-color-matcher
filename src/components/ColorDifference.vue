<template>
    <div>
        <table>
            <tbody>
            <tr v-for="c in vmc" :key="c.id">
                <td>
                    <div class="color">
                        <div class="swatch" :style="`background-color: ${c.rgb}`"></div>
                        <div><span class="name">{{ c.name }}</span><br><span class="family">{{c.family}}</span><br><span class="code">{{c.code}}</span><br><span>&nbsp;</span></div>
                    </div>
                </td>
                <td v-for="s in c.scores.slice(0, 5)" :key="s.d">
                    <div class="color">
                        <div class="swatch" :style="`background-color: ${s.c.rgb}`"></div>
                        <div><span class="name">{{ s.c.name }}</span><br><span class="family">{{s.c.family}}</span><br><span class="code">{{s.c.code}}</span><br><span class="score">{{numeral(s.d).format('0.00')}}</span></div>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
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
                vmc: [],
                vgc: [],
                numeral,
            };
        },
        computed: {
            all() {
                return [...this.vmc, ...this.vgc];
            }
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
            }).sort((a,b) => a.name.localeCompare(b.name));
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
            }).sort((a,b) => a.name.localeCompare(b.name));

            this.vmc.forEach((c1) => {
                const scores = this.all.filter(c => c.id !== c1.id).map((c2) => {
                    return {
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
        height: 64px;cypress\fixtures\example.json
        margin-right: 8px;
    }

    .name {
        font-weight: 600;
    }

    .family{
        font-size: 0.9em;
    }
    .code{
        font-family: monospace;
    }

    .score {
        font-family: monospace;
        font-weight: 600;
    }

</style>
