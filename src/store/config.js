const config = {
    homeText: 'Home',
    loginText: 'Login',
    registerText: 'Register',
    aboutText: 'About',
    readmeText: 'Read-Me',
    dateText: 'dateText',
    amountText: 'amountText',
    descriptionText: 'descriptionText',
    typeText: 'typeText',
    categoryText: 'categoryText',
    notesText: 'notesText',
    reconciledText: 'reconciledText',
    dateFormat: 'mmmm dS, yyyy - h:MM:ss TT',
    dollarAmountRegex: '(?=.)^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(.[0-9]{1,2})?$',
    pagination: 10
};

    // Linter complained about the \ (near the end)
    // dollarAmountRegex : '(?=.)^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$',

export default config;
