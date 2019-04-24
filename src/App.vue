<template>
    <div id="app">
        <h1>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"
                 version="1.1" x="0px" y="0px"><title>Icon Board</title>
                <desc>Created with Sketch.</desc>
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g stroke="#000000">
                        <circle stroke-width="20" cx="185.5" cy="256.5" r="175.5"></circle>
                        <circle stroke-width="20" cx="326.5" cy="256.5" r="175.5"></circle>
                        <g transform="translate(155.000000, 120.000000)" stroke-width="10" stroke-linecap="square">
                            <path d="M63,1.5 L143,1.5"></path>
                            <path d="M63,273.5 L143,273.5"></path>
                            <path d="M44,246.5 L160,246.5"></path>
                            <path d="M23,219.5 L179,219.5"></path>
                            <path d="M9,192.5 L190,192.5"></path>
                            <path d="M1,165.5 L200,165.5"></path>
                            <path d="M0,138.5 L201,138.5"></path>
                            <path d="M1,111.5 L198,111.5"></path>
                            <path d="M7,84.5 L195,84.5"></path>
                            <path d="M23,57.5 L184,57.5"></path>
                            <path d="M34,30.5 L168,30.5"></path>
                        </g>
                    </g>
                </g>
            </svg>
            <span class="title">
            Miniature Paints Color Matcher
            </span>
            <div class="actions">
                <a href="mailto:iwouldlike2rage@gmail.com?subject=Miniature Paints Color Matcher Feedback">Send
                    feedback</a>
                &nbsp;
                <a href="https://disclaimergenerator.net/live.php?token=Uaa3gumwnKPLkgm81GhGZsvwXPhsTHXp">Disclaimer</a>
            </div>
        </h1>
        <color-difference></color-difference>
    </div>
</template>

<script>
    import ColorDifference from './components/ColorDifference.vue'

    export default {
        name: 'app',
        components: {
            ColorDifference
        },
        mounted() {
        }
    }
</script>

<style>
    html,
    body {
        padding: 0;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    #app {
        color: #2c3e50;
        font-size: 13px;
    }

    input, button, select {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }

    input, button, .file-upload-label {
        border: solid 1px #ccc;
        border-radius: 2px;
        padding: 6px 12px;
        -webkit-box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
        -moz-box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
        font-size: 13px;
        background: #f7f7f7;
    }

    .file-upload-label {
    }

    .file-upload-label input {
        display: none;
    }


    button,
    .file-upload-label {
        cursor: pointer;
        font-weight: 600;
        margin-left: 8px;
        background: #eee;
        color: rgba(0, 0, 0, 0.5);
        border: solid 1px rgba(0, 0, 0, 0.15);
    }

    button:hover,
    .file-upload-label:hover {
        background: #fff;
    }

    button:disabled,
    .file-upload-label:disabled {
        background: #ccc;
    }

    table {
        width: 100%;
    }

    h1 {
        display: flex;
        align-items: center;
        background: #fcfcfc;
        border-bottom: solid 1px rgba(0, 0, 0, 0.05);
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
        margin: 0;
        padding: 8px 16px;
        font-size: 20px;
    }

    h1 svg {
        width: 48px;
        height: 48px;
        margin-right: 16px;
    }

    h1 .title {
        flex-grow: 1;
    }

    h1 .actions {
        font-size: 12px;
        font-weight: 400;
    }

    .table-wrapper {
        position: relative;
        overflow: auto;
        border: 1px solid black;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch; /* Lets it scroll lazy */
    }

    table {
        width: 100%;
    }
    
    table thead th:first-of-type,
    table tbody td:first-of-type{
        position: sticky;
        width: 210px;
        min-width: 210px;
        max-width: 210px;
        left: 0;
    }

    @media screen and (max-width: 1024px) {
        table thead th:first-of-type,
        table tbody td:first-of-type{
            position: sticky;
            width: 150px;
            min-width: 150px;
            max-width: 150px;
            left: 0;
        }
    }

    table tr:nth-of-type(2n+1) td{
        background: #fff;
    }

    table tr:nth-of-type(2n) td{
        background: #eee;
    }

    .v-step {
        z-index: 1;
    }

    .tooltip {
        display: block !important;
        z-index: 10000;
        font-size: 12px;
    }

    .tooltip .tooltip-inner {
        background: black;
        color: white;
        border-radius: 16px;
        padding: 10px 15px 9px;
        max-width: 200px;
    }

    .tooltip .tooltip-arrow {
        width: 0;
        height: 0;
        border-style: solid;
        position: absolute;
        margin: 5px;
        border-color: black;
    }

    .tooltip[x-placement^="top"] {
        margin-bottom: 5px;
    }

    .tooltip[x-placement^="top"] .tooltip-arrow {
        border-width: 5px 5px 0 5px;
        border-left-color: transparent !important;
        border-right-color: transparent !important;
        border-bottom-color: transparent !important;
        bottom: -5px;
        left: calc(50% - 5px);
        margin-top: 0;
        margin-bottom: 0;
    }


    .tooltip[x-placement^="bottom"] {
        margin-top: 5px;
    }
    .tooltip[x-placement^="bottom"] .tooltip-arrow {
        border-width: 0 5px 5px 5px;
        border-left-color: transparent !important;
        border-right-color: transparent !important;
        border-top-color: transparent !important;
        top: -5px;
        left: calc(50% - 5px);
        margin-top: 0;
        margin-bottom: 0;
    }


    .tooltip[x-placement^="right"] {
        margin-left: 5px;
    }
    .tooltip[x-placement^="right"] .tooltip-arrow {
        border-width: 5px 5px 5px 0;
        border-left-color: transparent !important;
        border-top-color: transparent !important;
        border-bottom-color: transparent !important;
        left: -5px;
        top: calc(50% - 5px);
        margin-left: 0;
        margin-right: 0;
    }


    .tooltip[x-placement^="left"] {
        margin-right: 5px;
    }
    .tooltip[x-placement^="left"] .tooltip-arrow {
        border-width: 5px 0 5px 5px;
        border-top-color: transparent !important;
        border-right-color: transparent !important;
        border-bottom-color: transparent !important;
        right: -5px;
        top: calc(50% - 5px);
        margin-left: 0;
        margin-right: 0;
    }


    .tooltip[aria-hidden='true'] {
        visibility: hidden;
        opacity: 0;
        transition: opacity .15s, visibility .15s;
    }

    .tooltip[aria-hidden='false'] {
        visibility: visible;
        opacity: 1;
        transition: opacity .15s;
    }

</style>
