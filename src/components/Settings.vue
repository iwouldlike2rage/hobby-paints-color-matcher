<template>
    <div>
        <h3>Paint family selection</h3>
        <p class="pad-h">Enable / disable color families. Disabled color families will not appear in the list of
            matches and purchase recommendations below.</p>
        <div class="form color-families">
            <label v-for="cf in colorFamilies" :key="cf.family" :class="{ checked: cf.isEnabled }">
                <input type="checkbox" :checked="cf.isEnabled" @click="toggleFamily(cf)">
                <img :src="cf.logo" alt="">
                <span>{{ cf.shortName }}</span>
            </label>
        </div>
        <h3>Import / export</h3>
        <form>
            <p>This tools stores the list of paints you own and the paint family settings in the browser's local
                storage.<br/>
                Use the buttons below to transfer these settings between computers / browsers.</p>
            <div class="actions">
                <p>
                    <button @click="exportCollection">Export my collection</button>
                    <label for="import_file" class="file-upload-label">
                        <input id="import_file"
                               type="file"
                               class="btn"
                               @change="importCollection">Import a collection
                    </label>
                </p>
            </div>
        </form>
    </div>
</template>

<script>
  export default {
    props: {
      colorFamilies: Array,
    },
    components: {
    },
    data() {
      return {
      };
    },
    methods: {
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
        const file = new Blob([data], { type: type });
        if (window.navigator.msSaveOrOpenBlob) // IE10+
        {
          window.navigator.msSaveOrOpenBlob(file, filename);
        } else { // Others
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
      },
    },
    mounted() {
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import '../vars.scss';
    .color-families {
        display: flex;
        flex-wrap: wrap;
        /*justify-content: center;*/
    }

    .color-families label {
        border: solid 1px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        padding: 8px 8px 8px 0;
        display: flex;
        align-items: center;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        margin-bottom: 6px;
        width: 140px;
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
        height: 28px;
        margin-right: 8px;
        margin-left: 8px;
    }

    .color-families label.checked img {
    }

</style>
