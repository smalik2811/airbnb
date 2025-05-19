const randomString = (length) => {
    const characters = "abcdefghijklmnopqrstuvwxyz"
    let result = [];
    for (let i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * characters.length)))
    }
    return result.join("");
}

module.exports = randomString