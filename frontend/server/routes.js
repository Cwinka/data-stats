const { Home } = require( '../src/pages/home' );
const { Analytics } = require( '../src/pages/analitics' );
const { Me } = require( '../src/pages/myaccount' );
const { Login } = require( '../src/pages/login' );

module.exports = [
    {
        path: '/',
        exact: true,
        component: Home,
    },
    {
        path: '/analitics',
        exact: true,
        component: Analytics,
    },
    {
        path: '/login',
        exact: true,
        component: Login,
    },
    {
        path: '/me',
        exact: true,
        component: Me,
    }
];