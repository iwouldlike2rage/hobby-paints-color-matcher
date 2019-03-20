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
                <a href="mailto:iwouldlike2rage@gmail.com?subject=Miniature Paints Color Matcher Feedback">Send feedback</a>
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
    body{
        padding: 0;
        margin: 0;
    }
    #app {
        font-family: 'Montserrat', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        font-size: 14px;
    }

    input, button, select {
        font-family: 'Montserrat', Helvetica, Arial, sans-serif;
    }

    input, button, .file-upload-label {
        border: solid 1px #ccc;
        border-radius: 2px;
        padding: 6px 12px;
        -webkit-box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
        -moz-box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
        font-size: 14px;
        background: #f7f7f7;
    }
    .file-upload-label{
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
        border-bottom: solid 1px rgba(0,0,0,0.05);
        box-shadow: 0 3px 6px rgba(0,0,0,0.15);
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
    }
</style>
