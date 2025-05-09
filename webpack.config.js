import path from "path"

export default {
    mode:"development",
    entry: {
        sidebar: './src/js/sidebar.js',
        select: './src/js/select.js',
        apiPrestamos: './src/js/apiPrestamos.js',
        flotante: './src/js/flotante.js'
    },
    output: {
        filename:'[name].js',
        path: path.resolve('public/js')
    }
}