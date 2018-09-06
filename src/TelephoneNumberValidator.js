export default function telephoneCheck(str) {
    let regex = [
        /^\d{3}-\d{3}-\d{4}/,
        /^\(\d{3}\)\d{3}-\d{4}$/,
        /^\(\d{3}\)\s\d{3}-\d{4}/,
        /^\d{3}\s\d{3}\s\d{4}/,
        /^\d{10}$/,
        /^1\s?\d{3}[\s,-]\d{3}[\s,-]\d{4}/,
        /^1\s?\(\d{3}\)\s\d{3}[\s,-]\d{4}/
    ];
    for (let i = 0; i < regex.length; i++) {
        if (regex[i].test(str)) {
            return true;
        }
    }
    return false;
}