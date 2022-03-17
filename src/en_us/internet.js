module.exports = {
    userName : {
        pattern: '^(?<username>[A-Za-z][A-Za-z0-9_-]+)$'
    },
    protocol : {
        pattern: '^(?<protocol>([Hh][Tt][Tt][Pp][Ss]?))$'
    },
    port : {
        pattern: '^(?<port>([1-9][0-9]{0,4}))$'
    },
    password : {
        pattern: '^(?<password>(.{4,100}))$'
    },
    mac : {
        pattern: '^(?<mac>[0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$'
    },
    color : {
        pattern: '^(?<color>#([0-9A-Fa-f]{3}|#[0-9A-Fa-f]{6}))$'
    },
    ip : {
        pattern: '^(?<ip>([0-2][0-9]{2}\.[0-2][0-9]{2}\.[0-2][0-9]{2}\.[0-2][0-9]{2}))$'
    },
    email : {
        pattern: '^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$'
    }
}
