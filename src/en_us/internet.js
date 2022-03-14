module.exports = {
    userName : {
        pattern: '^(?<username>[A-Za-z][A-Za-z0-9_-]+)$'
    },
    email : {
        pattern: '^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$'
    }
}
