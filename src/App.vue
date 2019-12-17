<template>
    <div id="app">
        <h1>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"
                 version="1.1" x="0px" y="0px"><title>Icon Board</title>
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

<style lang="scss" rel="stylesheet/scss">
    @import './vars.scss';

    html {
        font-size: 62.5%;
    }

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
        font-size: 1.3rem;
    }

    hr {
        width: 100%;
        display: block; height: 0.1rem;
        border: 0; border-top: 0.1rem solid #ccc;
        margin: 1em 0; padding: 0;
    }

    input, button, select {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }

    input.form-control {
        padding: 0.6rem 1.2rem;
        border-radius: 0.2rem;
        border: solid 0.1rem #ccc;
        font-size: 1.3rem;
    }

    button, .file-upload-label {
        border: solid 0.1rem #ccc;
        border-radius: 0.2rem;
        padding: 0.6rem 1.2rem;
        -webkit-box-shadow: 0 0.2rem 0.3rem rgba(0, 0, 0, 0.15);
        -moz-box-shadow: 0 0.2rem 0.3rem rgba(0, 0, 0, 0.15);
        box-shadow: 0 0.2rem 0.3rem rgba(0, 0, 0, 0.15);
        font-size: 1.3rem;
        background: #f7f7f7;
    }

    a {
        cursor: pointer;
        color: $action-color;
    }

    .file-upload-label {
    }

    .file-upload-label input {
        display: none;
    }


    .file-upload-label {
        cursor: pointer;
        font-weight: 600;
        margin-left: 0.8rem;
        background: #eee;
        color: rgba(0, 0, 0, 0.5);
        border: solid 0.1rem rgba(0, 0, 0, 0.15);
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
        border-bottom: solid 0.1rem rgba(0, 0, 0, 0.05);
        box-shadow: 0 0.3rem 0.6rem rgba(0, 0, 0, 0.15);
        margin: 0;
        padding: 0.8rem 1.6rem;
        font-size: 2rem;
    }

    h1 svg {
        width: 4.8rem;
        height: 4.8rem;
        margin-right: 1.6rem;
    }

    h1 .title {
        flex-grow: 1;
    }

    h1 .actions {
        font-size: 1.2rem;
        font-weight: 400;
    }

    .table-wrapper {
        position: relative;
        overflow: auto;
        border: 0.1rem solid black;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch; /* Lets it scroll lazy */
    }

    table {
        width: 100%;
    }
    
    table thead th:first-of-type,
    table tbody td:first-of-type{
        position: sticky;
        width: 21rem;
        min-width: 21rem;
        max-width: 21rem;
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
        font-size: 1.2rem;
    }

    .tooltip .tooltip-inner {
        background: black;
        color: white;
        border-radius: 1.6rem;
        padding: 1rem 1.5rem 0.9rem;
        max-width: 200px;
    }

    .tooltip .tooltip-arrow {
        width: 0;
        height: 0;
        border-style: solid;
        position: absolute;
        margin: 0.5rem;
        border-color: black;
    }

    .tooltip[x-placement^="top"] {
        margin-bottom: 0.5rem;
    }

    .tooltip[x-placement^="top"] .tooltip-arrow {
        border-width: 0.5rem 0.5rem 0 0.5rem;
        border-left-color: transparent !important;
        border-right-color: transparent !important;
        border-bottom-color: transparent !important;
        bottom: -0.5rem;
        left: calc(50% - 0.5rem);
        margin-top: 0;
        margin-bottom: 0;
    }


    .tooltip[x-placement^="bottom"] {
        margin-top: 0.5rem;
    }
    .tooltip[x-placement^="bottom"] .tooltip-arrow {
        border-width: 0 0.5rem 0.5rem 0.5rem;
        border-left-color: transparent !important;
        border-right-color: transparent !important;
        border-top-color: transparent !important;
        top: -0.5rem;
        left: calc(50% - 0.5rem);
        margin-top: 0;
        margin-bottom: 0;
    }


    .tooltip[x-placement^="right"] {
        margin-left: 0.5rem;
    }
    .tooltip[x-placement^="right"] .tooltip-arrow {
        border-width: 0.5rem 0.5rem 0.5rem 0;
        border-left-color: transparent !important;
        border-top-color: transparent !important;
        border-bottom-color: transparent !important;
        left: -0.5rem;
        top: calc(50% - 0.5rem);
        margin-left: 0;
        margin-right: 0;
    }


    .tooltip[x-placement^="left"] {
        margin-right: 0.5rem;
    }
    .tooltip[x-placement^="left"] .tooltip-arrow {
        border-width: 0.5rem 0 0.5rem 0.5rem;
        border-top-color: transparent !important;
        border-right-color: transparent !important;
        border-bottom-color: transparent !important;
        right: -0.5rem;
        top: calc(50% - 0.5rem);
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

    .badge {
        padding: 0.3em 0.9rem;
        font-weight: 600;
        background: lighten($border-color, 10%);
        border: solid 0.1rem $border-color;
        border-radius: 1.2rem;
        box-shadow: 0 0.1rem 0.3rem rgba(0,0,0,0.1);
        font-size: 0.9em;
    }

    .ml-1 {
        margin-left: 0.3rem;
    }
    .ml-2 {
        margin-left: 0.6rem;
    }
    .ml-3 {
        margin-left: 0.8rem;
    }
    .ml-4 {
        margin-left: 1rem;
    }
    .ml-5 {
        margin-left: 1.2rem;
    }
    .ml-6 {
        margin-left: 1.6rem;
    }

    .well {
        background: transparentize($border-color, 0.85);
        padding: 1.6rem;
        border: solid 0.1rem transparentize($border-color, 0.5);
        border-radius: 0.8rem;
        box-shadow: inset 0 0.1rem 0.3rem rgba(0,0,0,0.15);
    }
</style>
