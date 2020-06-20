interface Language {
    ERR_AUTH_NO_TOKEN: string,
    ERR_AUTH_INVALLID_TOKEN: string,
    ERR_AUTH_EXPIRED_TOKEN: string,

    ERR_UNAUTHORIZED: string,

    ERR_NOT_IMPLEMENTED: string,
    ERR_MISSING_VALUE: string,

    ERR_NAME_SPACES: string,
    ERR_NAME_UNIQUE: string,

    // ERR_EMAIL_UNIQUE: string,
    ERR_EMAIL_VALID: string,

    ERR_PASSWORD_SHORT: string,

    ERR_ROLE_UNDEFINED: string,
    ERR_ROLE_DELETE_USERS: string,

    ERR_VALUE_UNIQUE: string,
    ERR_VALUE_NO_SPACE: string,
}

export const DIE: Language = {
    ERR_AUTH_NO_TOKEN: 'Did you forget something?',
    ERR_AUTH_INVALLID_TOKEN: 'Ha nice try mate!',
    ERR_AUTH_EXPIRED_TOKEN: 'Yep, that one is way too old',

    ERR_UNAUTHORIZED: 'No no no no no, ain\'t happening',

    ERR_NOT_IMPLEMENTED: 'Ow I completely forgot about this',
    ERR_MISSING_VALUE: 'Don\'t forget to fill this actually in ;)',

    ERR_NAME_SPACES: 'Wow, no space bars in the name, dude',
    ERR_NAME_UNIQUE: 'You already did this',

    // ERR_EMAIL_UNIQUE: "I need more email's so I can brute force Netflix accounts",
    ERR_EMAIL_VALID: 'Email is invalid',

    ERR_PASSWORD_SHORT: 'This is properly too easy to hack',

    ERR_ROLE_UNDEFINED: 'Uhm what do you want to be able todo?',
    ERR_ROLE_DELETE_USERS: 'There are still animals assigned to this role',

    ERR_VALUE_UNIQUE: 'I think I already saw "{VALUE}" somewhere at "{PATH}"',
    ERR_VALUE_NO_SPACE: '"{PATH}" cant contain a space, that\'s way too much space',
}

export const EN: Language = {
    ERR_AUTH_NO_TOKEN: 'No token was provided',
    ERR_AUTH_INVALLID_TOKEN: 'Invalid token was provided',
    ERR_AUTH_EXPIRED_TOKEN: 'The provided token is expired',

    ERR_UNAUTHORIZED: 'Unauthorized request',

    ERR_NOT_IMPLEMENTED: 'I have not yet implemented this yet :S',
    ERR_MISSING_VALUE: 'One or more inputs were not send',

    ERR_NAME_SPACES: 'The name can\'t have spaces in it',
    ERR_NAME_UNIQUE: 'Name must be unique',

    // ERR_EMAIL_UNIQUE: "The email must be unique",
    ERR_EMAIL_VALID: 'Email is invalid',

    ERR_PASSWORD_SHORT: 'The password is too short',

    ERR_ROLE_UNDEFINED: 'Role does not exist',
    ERR_ROLE_DELETE_USERS: 'There are still users assigned to this role',

    ERR_VALUE_UNIQUE: 'Expected {PATH} to be unique',
    ERR_VALUE_NO_SPACE: '"{PATH}" cant contain a space',
}

export const NL: Language = {
    ERR_AUTH_NO_TOKEN: 'Geen token mee gegeven',
    ERR_AUTH_INVALLID_TOKEN: 'Ongeldige token meegegeven',
    ERR_AUTH_EXPIRED_TOKEN: 'De token is te oud',

    ERR_UNAUTHORIZED: 'Unauthorized request',

    ERR_NOT_IMPLEMENTED: 'Dit is nog niet gebouwd',
    ERR_MISSING_VALUE: '1 of meer inputs waren niet ingevuld',

    ERR_NAME_SPACES: 'Er mag geen spatie in de naam zitten',
    ERR_NAME_UNIQUE: 'De naam is al in gebruik',

    // ERR_EMAIL_UNIQUE: "Deze email is al in gebruik",
    ERR_EMAIL_VALID: 'Email is ongeldig',

    ERR_PASSWORD_SHORT: 'Het gekozen wachtwoord is te kort',

    ERR_ROLE_UNDEFINED: 'Deze functie bestaat niet',
    ERR_ROLE_DELETE_USERS: 'Er zijn nog steeds gebruikers met deze rol',

    ERR_VALUE_UNIQUE: '{PATH} moet uniek zijn',
    ERR_VALUE_NO_SPACE: 'Er mag geen spatie in {PATH} zitten',
}

export default DIE;
